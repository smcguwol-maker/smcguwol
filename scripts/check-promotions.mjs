import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import worker from '../public/_worker.js';
import {fixture,origin,testDomain} from './promo-test-harness.mjs';
import {youtubeId,promoMarkup} from '../src/promotions-shared.js';
const f=await fixture(),realFetch=globalThis.fetch;
globalThis.fetch=async(url,...args)=>String(url)==='https://'+testDomain+'/cdn-cgi/access/certs'?Response.json({keys:[f.jwk]}):realFetch(url,...args);
const req=async(path='/admin/api/board',{token,method='GET',data,headers={},...rest}={})=>new Request(origin+path,{method,headers:{'Cf-Access-Jwt-Assertion':token===undefined?await f.token():token,...(data?{origin,'content-type':'application/json'}:{}),...headers},...(data?{body:JSON.stringify(data)}:{}),...rest});
const call=async(path,options,env=f.env)=>worker.fetch(await req(path,options),env);
const board=async()=>JSON.parse(f.sqlite.prepare('SELECT posts FROM promo_board').get().posts);
test('인증 없는 관리자, 위조 이메일 헤더, 다른 배포 호스트 차단',async()=>{
 assert.equal((await call(undefined,{token:''})).status,401);
 assert.equal((await call(undefined,{token:'',headers:{'Cf-Access-Authenticated-User-Email':'smcguwol@gmail.com'}})).status,401);
 assert.equal((await worker.fetch(new Request('https://smcguwol-review.pages.dev/admin/api/board',{headers:{'Cf-Access-Jwt-Assertion':await f.token()}}),f.env)).status,403);
 assert.equal((await call(undefined,{},{})).status,503);
});
test('연결 준비 중에는 오류가 나는 로그인 링크를 제공하지 않음',async()=>{
 const pending=await call('/admin/',{token:''},{});
 assert.equal(pending.status,503);
 const html=await pending.text();
 assert.ok(html.includes('관리자 로그인 연결을 준비하고 있습니다.'));
 assert.ok(!html.includes('/cdn-cgi/access/logout'));
 const expired=await call('/admin/',{token:''});
 assert.equal(expired.status,401);
 assert.ok((await expired.text()).includes('/cdn-cgi/access/logout'));
});
test('만료·다른 이메일·audience·issuer·서명·alg·미래 토큰 차단',async()=>{
 for(const claims of [{exp:1},{email:'someone@example.com'},{aud:['wrong']},{iss:'https://evil.example'},{iat:9999999999},{nbf:9999999999},{type:'service'}])assert.equal((await call(undefined,{token:await f.token(claims)})).status,401);
 assert.equal((await call(undefined,{token:await f.token({},{alg:'none'})})).status,401);
 const token=await f.token();const parts=token.split('.');parts[1]=Buffer.from(JSON.stringify({email:'smcguwol@gmail.com'})).toString('base64url');assert.equal((await call(undefined,{token:parts.join('.')})).status,401);
});
test('서명 확인된 고객 로그인만 기존 3개 소식 읽기',async()=>{const response=await call();assert.equal(response.status,200);assert.equal((await response.json()).posts.length,3);assert.equal(response.headers.get('cache-control'),'no-store');});
test('CSRF·형식·본문 제한',async()=>{
 const data={revision:1,posts:await board()};
 assert.equal((await call(undefined,{method:'PUT',data,headers:{origin:'https://evil.example'}})).status,403);
 assert.equal((await call(undefined,{method:'PUT',data,headers:{'content-type':'text/plain'}})).status,415);
 assert.equal((await call(undefined,{method:'PUT',data:{...data,excess:'x'.repeat(1500000)}})).status,413);
});
test('유튜브 주소 정규화·악성 호스트/스킴 거절·HTML 이스케이프',()=>{
 assert.equal(youtubeId('https://youtu.be/T3b6UNOPucc?si=test'),'T3b6UNOPucc');assert.equal(youtubeId('https://www.youtube.com/shorts/12EVkuA5VI4'),'12EVkuA5VI4');
 for(const input of ['https://youtube.com.evil.example/watch?v=T3b6UNOPucc','javascript:alert(1)','https://youtu.be@evil.example/T3b6UNOPucc'])assert.equal(youtubeId(input),'');
 const html=promoMarkup([{published:true,type:'video',videoId:'T3b6UNOPucc',title:'<img onerror=x>',description:'<script>x</script>'}]);assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;img'));
});
test('저장·숨김·순서 변경·동시 수정 충돌·재배포 후 유지',async()=>{
 const posts=await board();posts.reverse();posts[0].published=false;posts[1].title='새로운 영상 제목';
 const saved=await call(undefined,{method:'PUT',data:{revision:1,posts}});assert.equal(saved.status,200);assert.equal((await saved.json()).revision,2);
 const publicData=await(await call('/api/promotions')).json();assert.equal(publicData.posts.length,2);assert.equal(publicData.posts[0].title,'새로운 영상 제목');
 assert.equal((await call(undefined,{method:'PUT',data:{revision:1,posts:[]}})).status,409);
 const rebuilt=(await import('../public/_worker.js?redeploy-test')).default;const after=await(await rebuilt.fetch(await req('/api/promotions'),f.env)).json();assert.equal(after.posts[0].title,'새로운 영상 제목');
});
test('이미지 업로드·원본 조회·숨김 시 공개 차단·관리자 미리보기',async()=>{
 const bytes=await readFile(new URL('../assets/smc-introduction-webtoon.jpg',import.meta.url));
 const id=crypto.randomUUID(),image='/media/promotions/'+id;
 const posts=[{id:'upload-test',type:'image',title:'사진 테스트',description:'',published:true,image,width:720,height:1280},...await board()];
 const response=await call(undefined,{method:'PUT',data:{revision:2,posts,upload:{id,data:bytes.toString('base64')}}});assert.equal(response.status,200,await response.clone().text());
 const actual=await call(image,{token:''});assert.equal(actual.status,200);assert.deepEqual(Buffer.from(await actual.arrayBuffer()),bytes);
 posts[0].published=false;assert.equal((await call(undefined,{method:'PUT',data:{revision:3,posts}})).status,200);
 assert.equal((await call(image,{token:''})).status,401);
 assert.equal((await call('/admin/api/image/'+id)).status,200);
});
test('깨진 이미지·없는 이미지·과도한 게시물은 저장하지 않음',async()=>{
 const posts=await board(),revision=4,id=crypto.randomUUID();posts[0]={...posts[0],image:'/media/promotions/'+id};
 assert.equal((await call(undefined,{method:'PUT',data:{revision,posts}})).status,400);
 assert.equal((await call(undefined,{method:'PUT',data:{revision,posts,upload:{id,data:Buffer.from('<svg onload=alert(1)>').toString('base64')}}})).status,400);
 assert.equal((await call(undefined,{method:'PUT',data:{revision,posts:Array.from({length:31},(_,i)=>({...posts[1],id:'many-'+i}))}})).status,400);
 assert.equal(f.sqlite.prepare('SELECT revision FROM promo_board').get().revision,4);
});
test('홈페이지는 저장된 소식으로 서버 렌더링하고 이전 내용 캐시를 재사용하지 않음',async()=>{
 const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');
 const response=await worker.fetch(new Request(origin+'/'),{...f.env,ASSETS:{fetch:async()=>new Response(html,{headers:{'content-type':'text/html',etag:'old'}})}});
 const output=await response.text();assert.ok(output.includes('새로운 영상 제목'));assert.ok(!output.includes('data-promo-title="사진 테스트"'));assert.equal(response.headers.get('cache-control'),'no-store');assert.equal(response.headers.has('etag'),false);
});
