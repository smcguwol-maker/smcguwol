import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const config = JSON.parse(await readFile(path.join(root, 'content/site.json'), 'utf8'));
if (config.publish) {
  await assert.rejects(access(path.join(root, 'public/design')));
  console.log('PASS 정식 공개 출력에는 디자인 비교 페이지가 없습니다.');
} else {
  for (const name of ['index', 'a', 'b', 'c']) {
    const file = path.join(root, 'public/design', name + '.html');
    const html = await readFile(file, 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
    assert.equal(ids.length, new Set(ids).size, name + ': 중복 ID');
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(!html.includes('{{'));
    assert.ok(html.includes('content="noindex,nofollow,noarchive"'));
    for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
      const target = match[1];
      if (/^(https:|tel:)/.test(target)) continue;
      const [relative, id] = target.split('#');
      const destination = relative ? path.resolve(path.dirname(file), relative) : file;
      await access(destination);
      if (id) {
        const content = destination === file ? html : await readFile(destination, 'utf8');
        assert.ok(content.includes(`id="${id}"`), `${name}: 없는 이동 대상 ${target}`);
      }
    }
    for (const img of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(img[0], /alt="[^"]+"/);
      assert.match(img[0], /width="\d+"/);
      assert.match(img[0], /height="\d+"/);
    }
    if (name !== 'index') {
      assert.ok(html.includes(config.links.booking));
      assert.ok(html.includes('최소 1시간 예약'));
      assert.ok(html.includes('드럼 연습은 이용할 수 없습니다'));
      assert.ok(html.includes('건물 내 주차'));
    }
    console.log(`PASS ${name}: 본문·검색 제외·사진·내부 링크·예약 조건`);
  }
}
console.log('Static checks only; browser rendering remains a separate check.');
