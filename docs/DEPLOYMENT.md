# Cloudflare Pages 배포 안내

## 최신 상태 · 2026-09-15

고객 Cloudflare Pages에 A/B 검토본을 직접 업로드하고 배포·화면 검수를 완료했습니다. GitHub 자동 배포는 연결 오류 8000011로 미완료입니다. 실제 확인 링크, 검수 결과, 남은 작업은 [NEXT_SESSION.md](NEXT_SESSION.md)의 최신 결과를 참고하세요. publish: false와 도메인 연결 보류 상태를 유지합니다.

## 기본 설정

고객 계정의 연결 준비와 도메인 구매처 확인은 `CLIENT_SETUP.md`에 모았습니다. 코드 업로드용 **ChatGPT Codex Connector**와 자동 배포용 **Cloudflare Workers and Pages**는 서로 다른 GitHub 앱이며, 둘 다 고객이 필요한 저장소만 허용합니다.

고객님의 Cloudflare 계정에서 Workers & Pages → Create application → Pages → Connect to Git(또는 Import an existing Git repository)을 선택합니다. GitHub 연결 권한은 필요한 `smcguwol` 저장소만 선택하세요. 계정 비밀번호·인증번호·API 토큰을 채팅이나 저장소에 올리지 마세요.

| 항목 | 값 |
| --- | --- |
| 저장소 | `smcguwol-maker/smcguwol` |
| 최종 Production branch | `main` (선택한 디자인을 병합한 뒤) |
| Framework preset | `None` |
| Build command | `node scripts/build.mjs` |
| Build output directory | `public` |
| Root directory | 빈칸(저장소 최상위) |

이 프로젝트에는 빌드 의존성이 없으며 Node.js 20 이상이면 됩니다. 자동 배포 연결은 고객님 계정에서 진행합니다. 다른 사람 계정의 Cloudflare Pages, GitHub Pages, Sites 등에 대신 배포하지 않습니다.

## 이번 A/B 검토본 연결

현재 제작 파일은 `codex/smc-design-review` 검토 브랜치용이며 `main`은 기존 초기 상태입니다. 새 Pages 프로젝트를 설정할 때 `main`을 그대로 빌드하면 제작본이 빌드되지 않습니다.

- Pages 프로젝트가 이미 있다면 검토 브랜치의 preview deployment를 사용합니다. Preview branch 설정에 `codex/smc-design-review`가 포함되는지 확인합니다.
- 새 프로젝트의 최초 빌드에 브랜치 지정이 필요하면 코드가 있는 `codex/smc-design-review`를 초기 브랜치로 선택해 고객 확인용 주소를 만듭니다. 이때 개인 도메인은 아직 연결하지 않고 `publish: false`를 유지합니다. 최종 디자인 병합 후 Production branch를 `main`으로 변경합니다.
- 빌드 명령은 `node scripts/build.mjs`, 출력 폴더는 `public`, 루트는 빈칸입니다.
- 배포에 성공한 실제 URL 뒤의 `/design/` 경로가 비교 안내, `/design/a.html`과 `/design/b.html`이 각 시안입니다. 배포 성공 전에 pages.dev 주소를 추측해 전달하지 않습니다.
- `publish: true`인 정식 빌드에는 비교 페이지를 포함하지 않습니다. 이전 preview deployment URL의 사본은 별도로 남을 수 있으므로 최신 배포에서 삭제되는 것과 구분합니다.

확인한 문서: https://developers.cloudflare.com/pages/configuration/preview-deployments/ 및 https://developers.cloudflare.com/pages/configuration/branch-build-controls/

`public/`에는 복사 가능한 HTML/CSS/JavaScript와 이미지가 들어갑니다. 소스 설명서와 내부 설정은 홈페이지 배포 폴더 밖에 있습니다. GitHub는 현재 공개 저장소이므로 저장소에 비밀 정보는 두지 마세요.

`public/assets/`는 빌드할 때마다 재생성하며 현재 화면에서 사용하는 사진·로고만 복사합니다. 원본 `assets/`, 참고자료, 고객용 `START_HERE.html`은 배포 폴더 밖에 유지합니다. Cloudflare 출력 폴더에는 저장소 전체가 아닌 `public`을 지정하세요.

## 현재 공개 상태

- 시안: 검색 제외(`noindex`, robots 차단). 고객이 확인한 도메인은 설정 파일에 입력했으며 정식 공개 시 canonical·sitemap에 사용됩니다.
- 고객 계정에 검토본을 배포했습니다. 도메인은 연결하지 않았습니다.
- 사진·방 번호·요금표·도메인 철자는 고객 확인을 반영했습니다. 실제 방문자용 공개 전 화면·버튼 목적지·도메인 연결을 확인해야 합니다.
- 시안 공유용 배포도 고객님 계정에서만 진행합니다. 검색 제외는 접근 차단이나 암호 보호가 아닙니다.

## 도메인

고객이 확인한 정확한 주소는 **`근처연습실co.kr`**입니다. `연습실`과 `co` 사이에 점을 추가하지 않습니다. 고객 제공 관리 화면·WHOIS 텍스트에는 등록일 2026-09-14, 만료일 2031-09-14, 상태 활성으로 표시되어 있습니다. 화면상 자동 갱신은 꺼져 있습니다. 영문 표기 `xn--co-002iq89dzga40o12n.kr`는 로컬 IDNA 변환으로 한글 주소와 정확히 일치함을 확인했습니다. 등록기관 실시간 조회로 독립 검증한 것은 아닙니다.

설정 파일의 `url`에 `https://근처연습실co.kr/`를 반영했습니다. 고객은 2026-09-15 구매처가 **LETO**, 현재 네임서버가 **`selene.ns.leto.kr`**, **`nyx.ns.leto.kr`**라고 전달했고, 제공한 관리 화면에서도 두 네임서버를 확인했습니다. 고객은 기존 홈페이지·이메일에 연결하지 않고 도메인만 구매한 상태라고 확인했습니다. 도메인 재구매는 필요하지 않습니다. 현재 네임서버를 유지하고, 배포 미리보기와 실제 DNS 레코드를 확인한 뒤 연결합니다. 자동 갱신·잠금 설정은 변경하지 않았습니다.

최상위 주소 `근처연습실co.kr`를 사용하려면 Pages 프로젝트와 같은 고객 Cloudflare 계정에 도메인(zone)을 추가하고 Cloudflare 네임서버를 사용해야 합니다. Cloudflare Pages 프로젝트의 Custom domains에서 도메인을 연결한 다음 안내되는 DNS 설정을 확인합니다. 고객은 기존 홈페이지·이메일을 사용하지 않는다고 확인했지만, 실제 DNS 레코드는 아직 조회하지 않았습니다. 기존 DNS를 검토하고 실제 Cloudflare 네임서버 값이 발급된 뒤 LETO에서 네임서버를 변경합니다. 현재 LETO 네임서버를 Cloudflare가 발급한 값으로 혼동하지 마세요. 기존 DNS 레코드는 임의로 삭제하지 마세요. 한글 도메인은 브라우저·DNS에서 영문 Punycode로 표시될 수 있으며, 이 프로젝트는 확인된 한글 주소를 URL 표준 형식으로 변환해 canonical·sitemap에 사용합니다.

연결 성공 뒤 HTTPS와 www 사용 여부를 확인하고 `content/site.json`의 `url`을 실제 대표 주소로 설정합니다. www·pages.dev 보조 주소의 대표 주소 정리(리디렉션)는 실제 계정·DNS 구성을 확인한 뒤 적용합니다.

## 검색 등록

정식 공개 설정 이후:

1. 공식 도메인에서 페이지, `/robots.txt`, `/sitemap.xml`이 열리는지 확인.
2. HTML의 `noindex`와 응답의 `X-Robots-Tag: noindex`가 제거됐는지 확인.
3. 고객님 네이버 계정으로 서치어드바이저의 웹마스터 도구에 공식 주소 등록.
4. HTML 태그 방법에서 발급받은 `naver-site-verification`의 `content` 값만 `content/site.json`의 `naverVerification`에 입력. 빌드·배포 뒤 `<head>`에 태그가 반영됐는지 확인하고 고객 계정으로 사이트 소유 확인 완료. 비밀번호는 공유하지 않음.
5. 사이트맵 제출 및 수집 상태 확인. 필요하면 Google Search Console도 고객님 계정으로 등록.
6. 사진·시설·주소 설명을 실제 정보와 일치하게 유지. 검색·AI 답변에서 순위나 노출 시점은 보장하지 않음.

## 제작 범위

네이버 예약은 외부 연결 방식입니다. 예약 저장·결제·예약 확정·예약 알림은 네이버에서 처리합니다. 카카오톡 예약 알림 자동화는 제외되어 있습니다. 홈페이지 자체 문의 폼, 결제 시스템, 관리자 CMS, 추적·광고 스크립트를 넣지 않았습니다. 방문자 개인정보를 직접 수집하는 기능을 추가할 때는 별도로 검토해야 합니다.

## 배포 전 로컬 확인

`npm run build`와 `npm run check`로 현재 시안을 검증합니다. `npm run check:release`는 임시 복사본에서 공개 전환, 주소·문구·예약 링크 수정, 네이버 확인 코드 반영, 잘못된 공개 설정 거부를 검증합니다. 실제 `content/site.json`, `public/`, GitHub, Cloudflare는 변경하지 않습니다. 이 검사는 브라우저 화면 검수·실제 검색 등록을 대신하지 않습니다.

정식 공개 시 갤러리 첫 사진의 `og:image` URL·설명·크기가 생성됩니다. 링크 공유 서비스가 보여주는 실제 미리보기는 배포 이후 확인합니다.

## 참고한 공식 문서

- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- https://developers.cloudflare.com/pages/configuration/custom-domains/
- https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/
- https://searchadvisor.naver.com/
- https://searchadvisor.naver.com/guide/faq-start-register
- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://ogp.me/

화면 명칭이나 무료 플랜 정책은 바뀔 수 있으므로 실제 연결 시 다시 확인합니다. 유료 서비스는 별도 동의 없이 신청하지 않습니다.
