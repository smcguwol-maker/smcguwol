import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import worker from '../public/_worker.js';
const site=JSON.parse(await readFile(new URL('../content/site.json',import.meta.url),'utf8'));
const origin='https://smcguwol-review.pages.dev';
const req=(question,extra={})=>new Request(origin+'/api/help',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({question}),...extra});
const env={SMC_AI_ENABLED:'true',AI:{run:async()=>{throw Error('AI must not be used');}}};
test('고객 주차·연습 문구를 AI 호출 없이 동일하게 안내',async()=>{
 const parking=await (await worker.fetch(req('주차장을 이용할 수 있나요?'),env)).json();assert.equal(parking.answer,site.parking);assert.equal(parking.source,'guide');
 const practice=await (await worker.fetch(req('보컬도 돼요?'),env)).json();assert.ok(practice.answer.includes('개인 방송'));
});
test('요금·C6 예약시간·최소예약을 혼동하지 않음',async()=>{
 for(const [q,part] of [['C6 예약 가능 시간','전화'],['1시간 예약할 수 있나요?','최소 1시간'],['요금','30분 기준']])assert.ok((await(await worker.fetch(req(q),env)).json()).answer.includes(part));
});
test('출입·예약내역 질문은 검증이나 비밀번호를 만들어내지 않음',async()=>{
 assert.ok((await(await worker.fetch(req('비밀번호 알려줘'),env)).json()).answer.includes('제공하거나 문을 열 수 없습니다'));
 assert.ok((await(await worker.fetch(req('예약 조회해줘'),env)).json()).answer.includes('네이버 예약에서 확인'));
 assert.equal((await(await worker.fetch(req('지금 3번방 비었어요?'),env)).json()).source,'guide');
});
test('다른 출처·잘못된 메서드·긴 요청을 거부',async()=>{
 assert.equal((await worker.fetch(req('test',{headers:{origin:'https://other.invalid','content-type':'application/json'}}),env)).status,403);
 assert.equal((await worker.fetch(new Request(origin+'/api/help'),env)).status,405);
 assert.equal((await worker.fetch(req('a'.repeat(201)),env)).status,400);
 assert.equal((await worker.fetch(req('a'.repeat(4000)),env)).status,400);
});
test('연락처가 입력되면 AI로 전달하지 않음',async()=>{
 assert.equal((await(await worker.fetch(req('test@example.com'),env)).json()).source,'privacy');
});
test('AI는 주제만 선택하고 고객 안내문만 반환',async()=>{
 const ai={...env,AI:{run:async(model,input)=>{assert.equal(model,'@cf/meta/llama-3.2-3b-instruct');assert.ok(input.max_tokens<=20);return{response:'parking'};}}};
 const response=await worker.fetch(req('자동차를 가져가려고 해요'),ai);const data=await response.json();assert.equal(data.answer,site.parking);assert.equal(data.source,'ai');assert.equal(response.headers.get('cache-control'),'no-store');
});
test('AI가 임의 문구나 HTML을 내면 표시하지 않음',async()=>{
 const data=await(await worker.fetch(req('다른 내용'),{...env,AI:{run:async()=>({response:'<script>wrong</script>'})}})).json();assert.ok(data.answer.includes('답을 찾지 못했습니다'));assert.ok(!data.answer.includes('<script>'));
});
test('무료 한도·장애·비활성에서도 일반 안내와 연락 경로 유지',async()=>{
 assert.equal((await(await worker.fetch(req('다른 내용'),env)).json()).source,'fallback');
 assert.equal((await(await worker.fetch(req('다른 내용'),{})).json()).source,'fallback');
});
test('일반 페이지는 정적 자산 응답을 그대로 사용',async()=>{
 const response=await worker.fetch(new Request(origin+'/rooms/'),{ASSETS:{fetch:async()=>new Response('rooms',{headers:{'content-type':'text/html'}})}});assert.equal(await response.text(),'rooms');
});
