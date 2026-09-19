import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {pages} from './pages.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const site=JSON.parse(await readFile(path.join(root,'content/site.json'),'utf8'));
const published=site.publish && !process.argv.includes('--preview');
const output=path.join(root,'public');
const documents=new Map(await Promise.all(pages.map(async page=>[page.url,await readFile(path.join(output,page.url.slice(1),'index.html'),'utf8')])));
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let checks=0;
const check=(name,test)=>{assert.ok(test,name);checks++;console.log('PASS '+name);};
const titles=new Set();
for(const page of pages) {
 const html=documents.get(page.url);
 check(page.url+' 한국어·viewport·H1 하나',html.includes('<html lang="ko">')&&html.includes('width=device-width')&&(html.match(/<h1\b/g)||[]).length===1);
 check(page.url+' 전체 HTML 문서 한 개',(html.match(/<html\b/g)||[]).length===1&&(html.match(/<body\b/g)||[]).length===1&&!html.includes('{{'));
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 check(page.url+' 고유 ID·현재 메뉴 표시',new Set(ids).size===ids.length&&html.includes(`href="${page.url}" aria-current="page"`));
 for(const targetPage of pages)assert.ok(html.includes(`href="${targetPage.url}"`),'메뉴 누락: '+targetPage.url);
 titles.add(html.match(/<title>(.*?)<\/title>/)[1]);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 check(page.url+' 업체 구조화 데이터',schema.name===site.name&&schema.telephone===site.phone&&!schema.aggregateRating&&!schema.review);
 for(const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  const target=match[1];if(/^(https?:|tel:|data:)/.test(target))continue;
  const url=new URL(target,'https://test.invalid'+page.url);
  const destination=url.pathname.endsWith('/')?path.join(output,url.pathname.slice(1),'index.html'):path.join(output,url.pathname.slice(1));
  await access(destination);
  if(url.hash){const targetHtml=url.pathname===page.url?html:await readFile(destination,'utf8');assert.ok(targetHtml.includes(`id="${url.hash.slice(1)}"`),'깨진 앵커: '+target);}
 }
 for(const img of html.matchAll(/<img\b[^>]*>/g))assert.ok(/alt="[^"]+"/.test(img[0])&&/width="\d+"/.test(img[0])&&/height="\d+"/.test(img[0]),'이미지 설명·치수 누락');
 for(const link of html.matchAll(/<a\b[^>]*>/g))if(link[0].includes('target="_blank"'))assert.ok(link[0].includes('rel="noopener noreferrer"'));
 check(page.url+' 내부 경로·앵커·사진·외부 링크 검사',true);
 check(page.url+' 예약·전화·카카오 링크',html.includes(`href="${escape(site.links.booking)}"`)&&html.includes(`href="tel:${site.phone.replace(/-/g,'')}"`)&&html.includes(`href="${escape(site.links.kakao)}"`));
 check(page.url+' 이용 도우미와 예약 수집 없음',(html.match(/<form\b/g)||[]).length===1&&html.includes('id="smc-help-form"')&&!/type="(?:email|tel|password)"/.test(html));
 check(page.url+' 확인되지 않은 외부 스크립트 없음',!/<script[^>]+src="https?:/.test(html));
 const canonical=new URL(page.url,site.url).href;
 check(page.url+' 검색 설정',published ? html.includes('content="index,follow"')&&html.includes(`rel="canonical" href="${canonical}"`) : html.includes('content="noindex,nofollow,noarchive"')&&!html.includes('rel="canonical"'));
}
check('5개 페이지 제목 구분',titles.size===5);
check('첫 화면 지역·업종 및 고객 문구 반영',documents.get('/').includes('구월동')&&documents.get('/').includes('음악연습실')&&documents.get('/').includes(escape(site.title)));
const rooms=documents.get('/rooms/');
for(const photo of site.gallery.filter(p=>p.room)) {
 const panel=rooms.match(new RegExp(`<article class="room-panel" id="room-${photo.room.id}"[\\s\\S]*?</article>`))?.[0];
 assert.ok(panel&&panel.includes(`src="/${photo.src}?v=`));
 assert.ok(panel.includes(photo.room.booking==='phone'?`href="tel:${site.phone.replace(/-/g,'')}"`:`href="${escape(site.links.booking)}"`));
}
check('전체 방 사진·C6 전화·일반방 네이버 연결',true);
check('전체 요금표 기본 펼침',rooms.includes('class="rates-disclosure" open'));
const sitemap=await readFile(path.join(output,'sitemap.xml'),'utf8');
const robots=await readFile(path.join(output,'robots.txt'),'utf8');
const headers=await readFile(path.join(output,'_headers'),'utf8');
check('5페이지 사이트맵·robots·헤더',published ? (sitemap.match(/<loc>/g)||[]).length===5&&robots.includes('Allow: /')&&!headers.includes('X-Robots-Tag: noindex') : !sitemap.includes('<loc>')&&robots.includes('Disallow: /')&&headers.includes('X-Robots-Tag: noindex'));
const css=await readFile(path.join(output,'styles.css'),'utf8');
check('반응형·안전영역·동작 줄이기',css.includes('max-width:700px')&&css.includes('max-width:1000px')&&css.includes('safe-area-inset-bottom')&&css.includes('prefers-reduced-motion'));
console.log(`\n${checks} static checks passed for five pages.`);
