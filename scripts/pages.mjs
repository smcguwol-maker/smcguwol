import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {helpConfig} from './help-config.mjs';

export const pages = [
  {key:'home',url:'/',label:'홈',file:'index.html'},
  {key:'rooms',url:'/rooms/',label:'공간과 요금',file:'pages/rooms.html',title:'공간과 요금 | SMC 인천 구월점 음악연습실',description:'SMC 인천 구월점 7개 연습실의 실제 사진과 30분·1시간 요금, 피아노와 개인 악기 연습공간을 확인하세요.'},
  {key:'booking',url:'/booking/',label:'예약 안내',file:'pages/booking.html',title:'예약 안내 | SMC 인천 구월점',description:'일반 연습실 네이버 예약, 야마하 C6 홀과 개인룸 전화 문의, 최소 1시간 예약과 방문 전 확인 사항을 안내합니다.'},
  {key:'guide',url:'/guide/',label:'이용 안내',file:'pages/guide.html',title:'이용 안내·자주 묻는 질문 | SMC 인천 구월점',description:'24시간 음악연습실 SMC의 성악·보컬·현악기·목금관악기·개인 방송을 위한 시설, 이용 시간, 주차와 예약 안내를 확인하세요.'},
  {key:'visit',url:'/visit/',label:'오시는 길',file:'pages/visit.html',title:'오시는 길·주차 안내 | SMC 인천 구월점',description:'인천광역시 남동구 인하로489번길 16, 세동네오스 10층. SMC 구월점 주소, 길찾기, 지하철과 주변 주차 안내입니다.'}
];
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=value=>JSON.stringify(value).replace(/</g,'\\u003c');
const render=(template,values)=>template.replace(/\r\n/g,'\n').replace(/\{\{([A-Z_]+)\}\}/g,(_,key)=>{
  if(!(key in values)) throw Error('정의되지 않은 페이지 항목: '+key);
  return values[key];
}).replace(/(?:src|href)="\.\//g,match=>match.replace('./','/')).replace(/[\t ]+$/gm,'');

function assistant(site) {
  const config=helpConfig(site);
  return `<button class="help-launch" type="button" aria-haspopup="dialog" hidden><span aria-hidden="true">?</span> 이용 도우미</button>
<dialog class="help-dialog" aria-labelledby="help-title"><div class="help-heading"><div><p>SMC 인천 구월점</p><h2 id="help-title">이용 도우미</h2></div><button class="help-close" type="button" aria-label="이용 도우미 닫기">×</button></div>
<div class="help-content"><p class="help-intro">요금과 이용 방법이 궁금하신가요?<br>아래 질문을 선택하거나 직접 물어보세요.</p><div class="help-topics"><button type="button" data-question="요금">요금</button><button type="button" data-question="예약 방법">예약 방법</button><button type="button" data-question="주차">주차</button><button type="button" data-question="운영 시간">운영 시간</button><button type="button" data-question="악기">연습·방송 용도</button><button type="button" data-question="입실 안내">입실 안내</button></div>
<div class="help-answer" role="status" aria-live="polite"><p>안내할 내용을 선택해 주세요.</p></div>
<form id="smc-help-form"><label for="help-question">궁금한 내용</label><div class="help-input-row"><input id="help-question" name="question" type="text" maxlength="200" placeholder="예: 1시간 예약할 수 있나요?" autocomplete="off" required><button type="submit">질문</button></div></form>
<p class="help-privacy">전화번호·예약번호·비밀번호 등 개인정보는 입력하지 마세요.${config.endpoint?' 질문은 AI 답변을 위해 Cloudflare에서 처리됩니다. AI는 질문에 맞는 안내를 찾아 보여주며, 잘못 연결될 수 있습니다.':''}</p><p class="help-limit">실시간 빈방 확인과 예약 확정은 네이버에서 진행해 주세요.</p><div class="help-contact"><a href="${escape(site.links.kakao)}" target="_blank" rel="noopener noreferrer">카카오톡 문의 ↗</a><a href="tel:${site.phone.replace(/-/g,'')}">전화 문의 ↗</a></div></div></dialog>
<script type="application/json" id="help-config">${json(config)}</script>`;
}

export async function buildPages({root,site,replacements,canonical,rooms,assetUrl}) {
  const layout=await readFile(path.join(root,'src/layout.html'),'utf8');
  const comic=site.webtoon;
  const comicImage=comic?.src ? `<img src="${assetUrl(comic.src,'/')}" alt="${escape(comic.alt)}" width="${comic.width}" height="${comic.height}" loading="lazy" decoding="async">` : '';
  const comicCard=comicImage ? `<a class="webtoon-card" href="/guide/#webtoon"><span class="webtoon-thumbnail">${comicImage}</span><span><small>SMC 이야기</small><strong>웹툰으로 만나는 SMC</strong><span class="webtoon-card-action">웹툰 전체 보기 <span aria-hidden="true">↗</span></span></span></a>` : '';
  const comicReader=comicImage ? `<section class="webtoon-section content-width" id="webtoon" aria-labelledby="webtoon-title"><div class="webtoon-heading"><p class="section-label">SMC 이야기</p><h2 id="webtoon-title">연습이 즐거워지는 공간.</h2><p>연습할 곳을 찾아 나선 세 사람의 이야기를 웹툰으로 만나보세요.</p></div><figure class="webtoon-full"><a href="${assetUrl(comic.src,'/')}" target="_blank" rel="noopener noreferrer" aria-label="SMC 소개 웹툰 원본 크게 보기">${comicImage}</a><figcaption>SMC 구월점 소개 웹툰 <span>그림을 누르면 원본을 크게 볼 수 있습니다.</span></figcaption></figure><details class="webtoon-transcript"><summary>웹툰 내용 글로 읽기</summary><ol><li>악기와 악보를 든 세 사람. “연습할 곳이 없네…”</li><li>SMC 음악연습실 간판을 발견합니다. “어? 여기다!”</li><li>여러 연습실이 있는 복도를 둘러봅니다. “방이 이렇게 많아?”</li><li>트럼펫, 보컬, 바이올린 연습에 몰입합니다. “집중력 폭발!”</li><li>세 사람이 무대에서 함께 연주합니다. “합격!”</li><li>“SMC 구월 음악연습실 — 연습이 즐거워지는 공간”</li></ol></details><a class="inline-book" href="/rooms/">실제 공간과 요금 보기 <span aria-hidden="true">↗</span></a></section>` : '';
  for(const page of pages) {
    const pageCanonical=canonical ? new URL(page.url,canonical).href : '';
    const values={...replacements,
      TITLE:escape(page.title||site.title), DESCRIPTION:escape(page.description||site.description),
      PAGE_KEY:page.key,
      WEBTOON_CARD:comicCard, WEBTOON_READER:comicReader,
      NAV:pages.map(p=>`<a href="${p.url}"${p.key===page.key?' aria-current="page"':''}>${p.label}</a>`).join(''),
      SEO:pageCanonical ? `<meta name="robots" content="index,follow"><link rel="canonical" href="${pageCanonical}"><meta property="og:url" content="${pageCanonical}">` : '<meta name="robots" content="noindex,nofollow,noarchive">',
      PREVIEW_NOTICE:site.publish?'':'<div class="review-strip"><span>SMC 프리미엄 검토본</span><span>공개 전 확인용</span></div>',
      ROOM_THUMBNAILS:rooms.map(photo=>`<a href="/rooms/#room-${photo.room.id}"><img src="${assetUrl(photo.src)}" alt="${escape(photo.alt)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async"><span><b>${photo.room.number}번방</b> ${escape(photo.room.shortTitle)}</span></a>`).join(''),
      ASSISTANT:assistant(site)
    };
    values.PAGE_CONTENT=render(await readFile(path.join(root,'src',page.file),'utf8'),values);
    const output=path.join(root,'public',page.url.slice(1));
    await mkdir(output,{recursive:true});
    await writeFile(path.join(output,'index.html'),render(layout,values));
  }
}
