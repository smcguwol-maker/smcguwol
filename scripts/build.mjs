import { readFile, writeFile, mkdir, cp, access, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const site = JSON.parse(await readFile(path.join(root, 'content/site.json'), 'utf8'));
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const https = value => { const u = new URL(value); if (u.protocol !== 'https:' || u.username || u.password) throw new Error('HTTPS 공개 주소만 사용하세요.'); return u.href; };
if (typeof site.publish !== 'boolean') throw new Error('publish는 따옴표 없는 true 또는 false로 입력하세요.');
const addressKeys = ['streetAddress', 'addressLocality', 'addressRegion', 'addressCountry'];
if (!site.address || !addressKeys.every(key => typeof site.address[key] === 'string' && site.address[key].trim())) throw new Error('address의 도로명·구·시·국가 항목을 확인하세요.');
const postalAddress = Object.fromEntries(addressKeys.map(key => [key, site.address[key].trim()]));
const addressText = `${postalAddress.addressRegion} ${postalAddress.addressLocality} ${postalAddress.streetAddress}`;
const verification = String(site.naverVerification || '').trim();
if (verification && !/^[a-zA-Z0-9_-]{1,200}$/.test(verification)) throw new Error('naverVerification에는 메타태그 전체가 아니라 content의 확인 코드만 입력하세요.');
const imageType = source => ({'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.avif':'image/avif'})[path.extname(source)];
for (const value of Object.values(site.links)) https(value);
if (!/^0[0-9-]+$/.test(site.phone)) throw new Error('연락처 형식을 확인하세요.');
const photos = [site.logo, site.hero, ...site.gallery].filter(photo => photo.src);
for (const photo of photos) {
  if (!/^assets\/[a-zA-Z0-9/_-]+\.(jpg|jpeg|png|webp|avif)$/.test(photo.src) || !photo.alt?.trim()) throw new Error('사진 파일 경로 또는 대체 설명을 확인하세요.');
  if (!Number.isInteger(photo.width) || photo.width <= 0 || !Number.isInteger(photo.height) || photo.height <= 0) throw new Error(`사진의 width·height에 실제 픽셀 크기를 입력하세요: ${photo.src}`);
  await access(path.join(root, photo.src));
}
let canonical = '';
if (site.publish) {
  if (['photos', 'rates', 'domain'].some(key => site.approvals?.[key] !== true)) throw new Error('사진·요금·도메인 확인을 완료한 뒤 공개 설정을 켜 주세요.');
  if (!site.hero.src || site.gallery.length < 1) throw new Error('실제 공간 사진을 먼저 추가해 주세요.');
  const u = new URL(https(site.url));
  if (u.search || u.hash || u.pathname !== '/' || !u.hostname.includes('.') || /localhost|example\.|\.invalid$/.test(u.hostname)) throw new Error('정확히 확인된 사이트 루트 주소가 필요합니다.');
  canonical = u.origin + '/';
}
const image = (photo, hero = false) => `<img class="${hero ? 'hero-photo' : 'gallery-photo'}" src="./${escape(photo.src)}" alt="${escape(photo.alt)}" width="${Number(photo.width) || 1200}" height="${Number(photo.height) || 900}" ${hero ? 'fetchpriority="high" loading="eager"' : 'loading="lazy" decoding="async"'}${hero && /^\d{1,3}% \d{1,3}%$/.test(photo.position || '') ? ` style="object-position:${escape(photo.position)}"` : ''}>`;
const hero = site.hero.src ? image(site.hero, true) : '<div class="photo-unavailable"><strong>SMC 인천 구월점</strong><span>실제 공간 사진 확인 후 반영 예정</span></div>';
const logo = `<img class="brand-logo" src="./${escape(site.logo.src)}" alt="${escape(site.logo.alt)}" width="${Number(site.logo.width)}" height="${Number(site.logo.height)}" decoding="async">`;
const gallery = site.gallery.length ? `<div class="gallery-grid">${site.gallery.map((photo, i) => `<figure class="gallery-item"><a class="gallery-link" href="./${escape(photo.src)}" aria-label="${escape(photo.caption)} 사진 크게 보기">${image(photo)}<span class="photo-expand" aria-hidden="true">＋</span></a><figcaption><span class="gallery-number">${String(i + 1).padStart(2, '0')}</span><div><span class="gallery-title">${escape(photo.caption)}</span>${photo.description ? `<p class="gallery-description">${escape(photo.description)}</p>` : ''}</div></figcaption></figure>`).join('')}</div>` : '<div class="gallery-empty"><div class="photo-unavailable"><strong>공간 갤러리</strong><span>실제 사진을 확보한 뒤 반영합니다. 가상 공간 이미지는 사용하지 않습니다.</span></div></div>';
// 30분 요금만 원본으로 관리합니다. 고정된 원화 금액일 때만 1시간 금액을 계산합니다.
const hourlyPrice = price => {
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)원$/.test(price)) return '';
  const won = Number(price.replace(/[,원]/g, '')) * 2;
  return Number.isSafeInteger(won) ? `${won.toLocaleString('ko-KR')}원` : '';
};
const rates = site.rates.length ? `<table class="rates-table"><caption>30분당 요금 · 아래에 기본 1시간 금액 함께 표시</caption><thead><tr><th scope="col">연습공간</th><th scope="col">30분당 요금</th></tr></thead><tbody>${site.rates.map(rate => {
  const hourly = hourlyPrice(rate.price);
  return `<tr><th scope="row">${escape(rate.name)}</th><td><strong class="rate-price">${escape(rate.price)}</strong>${hourly ? `<span class="rate-hour">1시간 ${hourly}</span>` : ''}</td></tr>`;
}).join('')}</tbody></table>` : '';
const schema = {
  '@context': 'https://schema.org', '@type': 'LocalBusiness', name:site.name,
  description:site.description, telephone:site.phone,
  address:{'@type':'PostalAddress',...postalAddress},
  openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],opens:'00:00',closes:'23:59'}],
  hasMap:site.links.map, sameAs:[site.links.booking,site.links.instagram,site.links.blog]
};
const faq = (site.faq || []).map((item, index) => `<details class="faq-item"${index === 0 ? ' open' : ''}><summary>${escape(item.question)}</summary><div class="faq-answer"><p>${escape(item.answer)}</p></div></details>`).join('\n');
const sharePhoto = site.gallery[0] || site.hero;
const personalRoom = site.gallery[1] || site.gallery[0] || site.hero;
const pianoRoom = site.gallery[2] || site.gallery[0] || site.hero;
// Room metadata lives beside its real photo; legacy comparison pages keep their photo order.
const rooms = site.gallery.filter(photo => photo.room).sort((a, b) => a.room.number - b.room.number);
const roomIds = new Set();
const roomNumbers = new Set();
for (const {room} of rooms) {
  if (!/^[a-z][a-z0-9-]*$/.test(room.id) || !Number.isInteger(room.number) || room.number < 1 || roomIds.has(room.id) || roomNumbers.has(room.number) || !room.title?.trim() || !room.shortTitle?.trim()) throw new Error('방 번호·식별자·이름은 비어 있지 않고 중복되지 않아야 합니다.');
  roomIds.add(room.id);
  roomNumbers.add(room.number);
}
const roomPrice = room => site.rates.find(rate => rate.name === room.rateName)?.price || '문의';
const roomChoices = rooms.map(({room}) => `<a class="room-choice" href="#room-${room.id}" id="choice-${room.id}"><span class="choice-number">${String(room.number).padStart(2, '0')}</span><span class="choice-copy"><strong><span class="choice-full-title">${escape(room.title)}</span><span class="choice-short-title">${escape(room.shortTitle)}</span></strong><b>${escape(roomPrice(room))} <span>/ 30분</span></b></span><span class="choice-arrow" aria-hidden="true">↗</span></a>`).join('\n          ');
const roomPanels = rooms.map(photo => {
  const {room} = photo;
  const booking = room.booking === 'phone'
    ? `<a class="inline-book" href="tel:${site.phone.replace(/-/g, '')}">C6 홀 전화 문의 <span aria-hidden="true">↗</span></a>`
    : `<a class="inline-book naver-book" href="${escape(site.links.booking)}" target="_blank" rel="noopener noreferrer"><span class="naver-mark" aria-hidden="true"></span><span class="naver-label">네이버 예약</span><span class="booking-arrow" aria-hidden="true">↗</span></a>`;
  return `<article class="room-panel" id="room-${room.id}" aria-labelledby="${room.id}-title" data-booking-room="${room.number}번방 · ${escape(room.shortTitle)}">
            <a class="room-image" href="./${escape(photo.src)}" aria-label="${room.number}번방 ${escape(room.title)} 사진 크게 보기">${image(photo)}<span>사진 크게 보기 ＋</span></a>
            <div class="room-description"><div><p class="room-caption">Room ${room.number}</p><h3 id="${room.id}-title">${escape(room.title)}</h3><p class="room-price">30분 ${escape(roomPrice(room))} · 최소 1시간 예약</p><p>${escape(photo.description)}</p></div>${booking}</div>
          </article>`;
}).join('\n          ');
const shareImage = canonical ? [
  `<meta property="og:image" content="${escape(new URL(sharePhoto.src, canonical).href)}">`,
  `<meta property="og:image:type" content="${imageType(sharePhoto.src)}">`,
  `<meta property="og:image:width" content="${sharePhoto.width}">`,
  `<meta property="og:image:height" content="${sharePhoto.height}">`,
  `<meta property="og:image:alt" content="${escape(sharePhoto.alt)}">`
].join('\n  ') : '';
if (canonical) { schema.url = canonical; schema['@id'] = canonical + '#smc-guwol'; schema.image = new URL(site.hero.src, canonical).href; schema.logo = new URL(site.logo.src, canonical).href; }
const replacements = {
  TITLE:escape(site.title), DESCRIPTION:escape(site.description), NAME:escape(site.name),
  PHONE:escape(site.phone), TEL:`tel:${site.phone.replace(/-/g,'')}`, ADDRESS:escape(addressText), HOURS:escape(site.hours),
  BOOKING:escape(site.links.booking), MAP:escape(site.links.map), KAKAO:escape(site.links.kakao), INSTAGRAM:escape(site.links.instagram), BLOG:escape(site.links.blog),
  SEO:canonical ? `<meta name="robots" content="index,follow"><link rel="canonical" href="${escape(canonical)}"><meta property="og:url" content="${escape(canonical)}">` : '<meta name="robots" content="noindex,nofollow,noarchive">',
  SCHEMA:JSON.stringify(schema).replace(/</g,'\\u003c'),
  VERIFICATION:verification ? `<meta name="naver-site-verification" content="${escape(verification)}">` : '',
  SHARE_IMAGE:shareImage,
  PREVIEW_NOTICE:site.publish ? '' : '<div class="review-strip"><span>SMC 홈페이지 통합 검토본 · 정식 공개 전</span><a href="./design/">시안 비교</a></div>',
  DESIGN_GUIDE_LINK:site.publish ? '' : '<p><a class="action" href="./public/design/index.html">A/B 디자인 비교 열기 →</a></p>',
  LOGO_IMAGE:logo, LOGO_SRC:escape(site.logo.src), LOGO_TYPE:imageType(site.logo.src), HERO_IMAGE:hero, HERO_CAPTION:escape(site.hero.caption || site.name), GALLERY:gallery, FAQ:faq, RATES:rates, RATE_NOTE:escape(site.rateNote), YEAR:new Date().getFullYear(),
  ROOM_CHOICES:roomChoices, ROOM_PANELS:roomPanels,
  HALL_IMAGE:image(site.hero), HALL_SRC:'./' + escape(site.hero.src),
  PERSONAL_IMAGE:image(personalRoom), PERSONAL_SRC:'./' + escape(personalRoom.src), PERSONAL_DESCRIPTION:escape(personalRoom.description),
  PIANO_IMAGE:image(pianoRoom), PIANO_SRC:'./' + escape(pianoRoom.src), PIANO_DESCRIPTION:escape(pianoRoom.description),
  ROOM_ONE_PRICE:escape(site.rates.find(r => r.name.startsWith('Room 1 ·'))?.price || '문의'),
  ROOM_PIANO_PRICE:escape(site.rates.find(r => r.name.startsWith('Room 3·4 ·'))?.price || '문의'),
  ROOM_HALL_PRICE:escape(site.rates.find(r => r.name.startsWith('Room 5 ·'))?.price || '문의')
};
const source = await readFile(path.join(root, 'src/index.html'), 'utf8');
const render = template => template.replace(/\r\n/g, '\n').replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
  if (!(key in replacements)) throw new Error(`정의되지 않은 템플릿 항목: ${key}`);
  return replacements[key];
}).replace(/[\t ]+$/gm, '');
const html = render(source);
const guide = render(await readFile(path.join(root, 'src/guide.html'), 'utf8'));
const output = path.join(root, 'public');
await mkdir(output, {recursive:true});
await writeFile(path.join(output,'index.html'),html);
await writeFile(path.join(root,'START_HERE.html'),guide);
await cp(path.join(root,'src/styles.css'),path.join(output,'styles.css'));
await cp(path.join(root,'src/app.js'),path.join(output,'app.js'));
// public/assets는 매번 생성합니다. 교체·삭제한 사진과 사용하지 않는 확보본을 배포하지 않습니다.
await rm(path.join(output,'assets'),{recursive:true,force:true});
for (const sourcePath of new Set(photos.map(photo => photo.src))) {
  const destination = path.join(output, sourcePath);
  await mkdir(path.dirname(destination), {recursive:true});
  await cp(path.join(root,sourcePath),destination);
}
await writeFile(path.join(output,'robots.txt'),canonical ? `User-agent: *\nAllow: /\n\nSitemap: ${canonical}sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
await writeFile(path.join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${canonical ? `\n  <url><loc>${escape(canonical)}</loc></url>\n` : '\n  <!-- 시안: 정식 공개 설정 시 공식 URL이 자동 생성됩니다. -->\n'}</urlset>\n`);
await writeFile(path.join(output,'_headers'),`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n${site.publish ? '' : '  X-Robots-Tag: noindex, nofollow, noarchive\n'}\n`);
await writeFile(path.join(output,'404.html'),`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>페이지를 찾을 수 없습니다 | SMC 인천 구월점</title><link rel="stylesheet" href="/styles.css"></head><body><main class="not-found"><p>SMC 인천 구월점</p><h1>페이지를 찾을 수 없습니다.</h1><p>주소가 변경되었거나 없는 페이지입니다.</p><a class="inline-book" href="/">SMC 첫 화면으로 <span aria-hidden="true">↗</span></a></main></body></html>`);
// 비교 페이지는 공개 전 빌드에만 포함합니다. 공개 전환 시 이전 비교 산출물도 제거합니다.
const designOutput = path.join(output, 'design');
await rm(designOutput, { recursive: true, force: true });
if (!site.publish) {
  await mkdir(designOutput, { recursive: true });
  const personal = site.gallery[1] || site.gallery[0] || site.hero;
  const piano = site.gallery[2] || site.gallery[0] || site.hero;
  const designImage = (photo, primary = false) => image(photo, primary).replace('src="./', 'src="../');
  const designValues = {
    ...replacements,
    DESIGN_LOGO: logo.replace('src="./', 'src="../'),
    DESIGN_HERO: hero.replace('src="./', 'src="../'),
    HALL_IMAGE: designImage(site.hero),
    PERSONAL_HERO: designImage(personal, true),
    ROOM_ONE_PRICE: escape(site.rates.find(r => r.name.startsWith('Room 1 ·'))?.price || '문의'),
    ROOM_PIANO_PRICE: escape(site.rates.find(r => r.name.startsWith('Room 3·4 ·'))?.price || '문의'),
    ROOM_HALL_PRICE: escape(site.rates.find(r => r.name.startsWith('Room 5 ·'))?.price || '문의'),
    PERSONAL_IMAGE: designImage(personal), PERSONAL_SRC: '../' + escape(personal.src),
    PERSONAL_CAPTION: escape(personal.caption), PERSONAL_DESCRIPTION: escape(personal.description),
    PIANO_IMAGE: designImage(piano), PIANO_SRC: '../' + escape(piano.src),
    PIANO_CAPTION: escape(piano.caption), PIANO_DESCRIPTION: escape(piano.description)
  };
  for (const [sourceName, outputName] of [['design-index.html', 'index.html'], ['design-a.html', 'a.html'], ['design-b.html', 'b.html'], ['design-c.html', 'c.html']]) {
    const template = await readFile(path.join(root, 'src', sourceName), 'utf8');
    const rendered = template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
      if (!(key in designValues)) throw new Error(`정의되지 않은 디자인 템플릿 항목: ${key}`);
      return designValues[key];
    });
    await writeFile(path.join(designOutput, outputName), rendered);
  }
  await cp(path.join(root, 'src/design.css'), path.join(designOutput, 'design.css'));
  await cp(path.join(root, 'src/design-c.css'), path.join(designOutput, 'design-c.css'));
  await cp(path.join(root, 'src/design-c.js'), path.join(designOutput, 'design-c.js'));
}
console.log(`Built public/ — ${site.publish ? 'PRODUCTION: ' + canonical : 'PREVIEW: indexing disabled; final approvals required'}`);
