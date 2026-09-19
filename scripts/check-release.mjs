import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, mkdir, cp, rm, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 임시 복사본만 빌드합니다. 실제 사이트 설정·public 폴더·외부 서비스는 변경하지 않습니다.
const root = fileURLToPath(new URL('../', import.meta.url));
const sourcePath = path.join(root, 'content/site.json');
const source = await readFile(sourcePath, 'utf8');
const site = JSON.parse(source);
const fixture = await mkdtemp(path.join(tmpdir(), 'smc-release-check-'));
const configPath = path.join(fixture, 'content/site.json');
let count = 0;
const passed = label => { count++; console.log('PASS ' + label); };

async function build(config, errorText = '') {
  await writeFile(configPath, JSON.stringify(config, null, 2));
  const result = spawnSync(process.execPath, [path.join(fixture, 'scripts/build.mjs')], {
    cwd: fixture, encoding: 'utf8', timeout: 15000
  });
  if (result.error) throw result.error;
  if (errorText) {
    assert.notEqual(result.status, 0, '잘못된 설정을 빌드가 허용했습니다.');
    assert.ok(result.stderr.includes(errorText), result.stderr);
    return;
  }
  assert.equal(result.status, 0, result.stderr);
  const [html, robots, sitemap, headers] = await Promise.all(
    ['index.html', 'robots.txt', 'sitemap.xml', '_headers'].map(name => readFile(path.join(fixture, 'public', name), 'utf8'))
  );
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const otherPages=await Promise.all(['rooms','booking','guide','visit'].map(name=>readFile(path.join(fixture,'public',name,'index.html'),'utf8')));
  return { html:html+'\n'+otherPages.join('\n'), robots, sitemap, headers, schema };
}

try {
  for (const folder of ['scripts', 'src', 'assets']) await cp(path.join(root, folder), path.join(fixture, folder), { recursive: true });
  await mkdir(path.join(fixture, 'content'));

  const preview = await build({ ...site, publish: false, naverVerification: '' });
  assert.ok(preview.html.includes('content="noindex,nofollow,noarchive"'));
  assert.ok(preview.headers.includes('X-Robots-Tag: noindex'));
  assert.ok(preview.robots.includes('Disallow: /'));
  assert.ok(!preview.sitemap.includes('<loc>'));
  assert.ok(!preview.html.includes('naver-site-verification'));
  const previewCheck = spawnSync(process.execPath, [path.join(fixture, 'scripts/check-design.mjs')], { cwd: fixture, encoding: 'utf8', timeout: 15000 });
  assert.equal(previewCheck.status, 0, previewCheck.stdout + previewCheck.stderr);
  passed('시안은 검색 제외 상태이며 빈 확인 태그를 출력하지 않음');

  for (const photo of site.gallery.filter(photo => photo.room)) {
    const {room} = photo;
    assert.ok(preview.html.includes(`href="#room-${room.id}"`));
    const panel = preview.html.match(new RegExp(`<article class="room-panel" id="room-${room.id}"[\\s\\S]*?</article>`))?.[0];
    assert.ok(panel?.includes(`src="/${photo.src}?v=`), `${room.number}번방의 사진 연결 누락`);
    assert.ok(panel.includes(room.booking === 'phone' ? `href="tel:${site.phone.replace(/-/g, '')}"` : `href="${site.links.booking}"`));
  }
  passed('모든 등록 방의 사진·선택 항목·예약 경로가 공개 빌드에 연결됨');
  const duplicateRoom = structuredClone(site);
  duplicateRoom.gallery[1].room.id = duplicateRoom.gallery[0].room.id;
  await build(duplicateRoom, '방 번호·식별자·이름');
  passed('중복된 방 식별자로 사진 선택이 잘못 연결되는 설정을 거부');

  for (const variant of ['a', 'b', 'c', 'index']) {
    const design = await readFile(path.join(fixture, 'public/design', variant + '.html'), 'utf8');
    assert.ok(design.includes('content="noindex,nofollow,noarchive"'));
    assert.ok(!design.includes('{{'));
  }

  const pricing = await build({ ...site, publish: false, rates: [
    { name: '검수용 고정 요금', price: '3,750원' },
    { name: '검수용 변동 요금', price: '변동' },
    { name: '검수용 범위 요금', price: '5,000원부터' }
  ] });
  const rateRows = pricing.html.match(/<tbody>([\s\S]*?)<\/tbody>/)[1];
  assert.ok(rateRows.includes('1시간 7,500원'));
  assert.equal((rateRows.match(/class="rate-hour"/g) || []).length, 1);
  assert.ok(rateRows.includes('변동') && rateRows.includes('5,000원부터'));
  passed('고정 30분 요금 변경 시 1시간 금액만 계산하고 변동·범위 요금은 유지');

  await writeFile(path.join(fixture, 'assets', 'unused-review.jpg'), '미사용 원본 검수용');
  await writeFile(path.join(fixture, 'public', 'assets', 'removed-review.jpg'), '이전 배포 사진 검수용');
  await build({ ...site, publish: false });
  await assert.rejects(access(path.join(fixture, 'public', 'assets', 'unused-review.jpg')));
  await assert.rejects(access(path.join(fixture, 'public', 'assets', 'removed-review.jpg')));
  await access(path.join(fixture, 'assets', 'unused-review.jpg'));
  for (const photo of [site.logo, site.hero, ...site.gallery]) {
    if (!photo.src) continue;
    assert.deepEqual(await readFile(path.join(fixture, photo.src)), await readFile(path.join(fixture, 'public', photo.src)));
  }
  passed('사용 사진 원본은 보존하고 미사용·삭제 사진은 배포 출력에서 제외');

  const productionConfig = { ...site, publish: true };
  const production = await build(productionConfig);
  const canonical = new URL(site.url).origin + '/';
  assert.ok(production.html.includes(`rel="canonical" href="${canonical}"`));
  assert.equal(production.schema.url, canonical);
  assert.ok(production.sitemap.includes(`<loc>${canonical}</loc>`));
  assert.ok(production.robots.includes(`Sitemap: ${canonical}sitemap.xml`));
  assert.ok(production.html.includes('content="index,follow"'));
  assert.ok(!production.html.includes('noindex'));
  assert.ok(!production.headers.includes('X-Robots-Tag'));
  assert.ok(!production.robots.includes('Disallow: /'));
  const imageUrl = production.html.match(/property="og:image" content="([^"]+)"/)[1];
  assert.equal(new URL(imageUrl).origin, new URL(canonical).origin);
  await access(path.join(fixture, 'public', new URL(imageUrl).pathname.slice(1)));
  assert.ok(production.html.includes('property="og:image:alt"'));
  if (site.url === 'https://근처연습실co.kr/') {
    assert.notEqual(canonical, new URL('https://근처연습실.co.kr/').origin + '/');
    assert.match(new URL(canonical).hostname, /^xn--/);
  }
  passed('공개 전환 시 한글 도메인·사이트맵·공유 이미지·검색 허용이 일치');

  await assert.rejects(access(path.join(fixture, 'public/design')));
  passed('공개 전 비교 페이지를 생성하고 정식 공개 전환 시 전체 제거');

  assert.ok(!production.html.includes('{{'));
  assert.ok(!production.html.includes('./design/'));
  assert.ok(!production.html.includes('SMC 홈페이지 통합 검토본'));
  assert.ok(production.html.includes('class="booking-guide"'));
  assert.ok(production.html.includes('id="faq"'));
  assert.ok(production.html.includes('id="room-hall"'));
  for (const match of production.html.matchAll(/(?:src|href)="(\.[^"#]+)"/g)) {
    assert.ok(!match[1].startsWith('../'), '첫 페이지의 자산 경로가 상위 폴더를 참조함');
    await access(path.join(fixture, 'public', new URL(match[1], 'https://check.invalid/').pathname));
  }
  passed('비교 시안을 제거해도 프리미엄 5페이지의 공간·예약·FAQ와 모든 로컬 자산 유지');

  const assetLinks = page => new Map([...page.matchAll(/(?:src|href)="(\/(?:assets\/[^"?]+|styles\.css|app\.js)\?v=[a-f0-9]{12})"/g)]
    .map(match => [new URL(match[1], canonical).pathname.slice(1), match[1]]));
  const originalAssets = assetLinks(production.html);
  assert.equal(originalAssets.size, new Set([site.logo, site.hero, ...site.gallery].map(photo => photo.src)).size + 2);
  const repeated = await build(productionConfig);
  assert.deepEqual(assetLinks(repeated.html), originalAssets, '동일한 빌드에서 자산 주소가 바뀜');
  const previewAssets = assetLinks(preview.html);
  for (const [name, url] of originalAssets) assert.notEqual(previewAssets.get(name), url, '시안과 공개본이 캐시를 공유함');
  for (const file of ['src/styles.css', 'src/app.js', site.hero.src]) {
    const target = path.join(fixture, file);
    await writeFile(target, Buffer.concat([await readFile(target), Buffer.from('\n/* cache regression fixture */\n')]));
  }
  const changedAssets = assetLinks((await build(productionConfig)).html);
  for (const name of ['styles.css', 'app.js', site.hero.src]) assert.notEqual(changedAssets.get(name), originalAssets.get(name), '변경한 파일이 이전 캐시 주소를 재사용함');
  assert.equal(changedAssets.get(site.logo.src), originalAssets.get(site.logo.src), '변경하지 않은 사진 주소까지 바뀜');
  assert.ok(production.headers.includes('Cache-Control: no-cache'));
  const errorPage = await readFile(path.join(fixture, 'public/404.html'), 'utf8');
  assert.ok(errorPage.includes(changedAssets.get('styles.css').slice(1)));
  passed('CSS·JS·사진 변경 및 시안→공개 전환 시 캐시 주소 갱신, 동일 빌드는 주소 유지');

  // 아래 값은 임시 테스트용입니다. 실제 고객 정보 파일에는 저장하지 않습니다.
  const edited = structuredClone(productionConfig);
  edited.address.streetAddress = '검수용 주소 1, 2층';
  edited.title = 'SMC & "문구" <검수>';
  edited.description = '음악 & 공간 <검수>';
  edited.faq[0].answer = '연습 & 안내 <검수>';
  edited.links.booking = site.links.booking + (site.links.booking.includes('?') ? '&' : '?') + 'source=review&mode=check';
  edited.naverVerification = 'a'.repeat(40);
  const changed = await build(edited);
  assert.equal(changed.schema.address.streetAddress, edited.address.streetAddress);
  assert.ok(changed.html.includes(`<address>${edited.address.addressRegion} ${edited.address.addressLocality} ${edited.address.streetAddress}</address>`));
  assert.ok(changed.html.includes('<title>SMC &amp; &quot;문구&quot; &lt;검수&gt;</title>'));
  assert.ok(!changed.html.includes('<검수>'));
  assert.ok(changed.html.includes('연습 &amp; 안내 &lt;검수&gt;'));
  assert.ok(changed.html.includes('source=review&amp;mode=check'));
  const head = changed.html.match(/<head>([\s\S]*?)<\/head>/)[1];
  assert.ok(head.includes(`name="naver-site-verification" content="${edited.naverVerification}"`));
  const checks = spawnSync(process.execPath, [path.join(fixture, 'scripts/check.mjs')], { cwd: fixture, encoding: 'utf8', timeout: 15000 });
  if (checks.error) throw checks.error;
  assert.equal(checks.status, 0, checks.stdout + checks.stderr);
  passed('고객 문구·주소·예약 링크 수정과 네이버 확인 코드가 HTML에 정상 반영');

  await build({ ...site, publish: 'false' }, 'publish는');
  passed('문자열로 잘못 적은 공개 설정을 거부');

  await build({ ...productionConfig, approvals: { ...site.approvals, photos: 'false' } }, '사진·요금·도메인 확인');
  passed('실제 확인되지 않은 자료의 공개 전환을 거부');
} finally {
  await rm(fixture, { recursive: true, force: true });
  assert.equal(await readFile(sourcePath, 'utf8'), source, '원본 고객 설정이 변경되었습니다.');
}
console.log(`\n${count} release scenarios passed. No site was published.`);
