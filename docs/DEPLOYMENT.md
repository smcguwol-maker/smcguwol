# Cloudflare Pages 배포 안내

## 최신: 고객 제공 웹툰 공식 배포 · 2026-09-19 13:52 KST

- Production **f63b6bca-6f86-44ba-9ce3-05e1ccd5adb0 / deploy success**, 2026-09-19 13:52:24 KST. [웹툰 바로 보기](https://xn--co-002iq89dzga40o12n.kr/guide/#webtoon). 홈 미리보기에서 연결되며 기존5페이지에 포함됩니다.
- 원본720×1280 JPEG를 자르지 않고 사용했습니다. 공개 빌드·정적51개·릴리스12개 통과 후22개 파일 ZIP을 Chrome Direct Upload로 배포했습니다. 공식 총18개 파일 HTTP200·SHA256 일치 및 기존 AI 실제 응답을 확인했습니다.
- 정식 ZIP: C:/Users/WOOWON/AppData/Local/Temp/SMC-production-webtoon-20260919.zip. AI 바인딩과 무료 플랜 유지, DNS/네임서버·Git main 변경 없음. 아래82485a5f는 이전 배포 이력입니다.

## 최신: 프리미엄 공식 배포 완료 · 2026-09-19 13:29 KST

- 사용자의 “그래 계속 진행” 승인에 따라 **Production 82485a5f-0db3-4740-bbfc-09b749cd0fbe / deploy success**로 배포했습니다. [공식 홈페이지](https://xn--co-002iq89dzga40o12n.kr/)에서 프리미엄5페이지를 제공합니다.
- Production의 Workers AI binding AI / Text SMC_AI_ENABLED=true 저장 및 실제 AI 응답 확인. Workers Free / $0 유지. Preview만 설정된 상태라는 아래 기록은 과거 이력입니다.
- 공개용 node scripts/build.mjs와51개 검사 후 public 내용물21개 ZIP을 직접 업로드했습니다. 기존 배포를 삭제하지 않았고 Git main도 변경하지 않았습니다.
- 공식5페이지·버전자산10개·robots/sitemap 총17개 HTTP200·SHA256 일치. 검색 허용·canonical·5페이지 sitemap·HTTP→HTTPS·404 정상. PC/모바일,7개 방·확대·C6전화·AI·유튜브 실제 검수 완료.
- HTML은 no-cache, 버전 정적 자산은 max-age=14400으로 확인됐습니다. 실제 응답과 _headers 선언을 구분합니다.
- 정식 ZIP: C:/Users/WOOWON/AppData/Local/Temp/SMC-premium-production-20260919.zip. 운영 변경은 검토 브랜치에서 수정·검사 후 별도 직접 배포해야 합니다. Git 커밋만으로 자동 배포되지 않습니다.
- 서치어드바이저 소유 확인·사이트맵 제출 완료는 미확인입니다. 상세 증거와 남은 항목은 NEXT_SESSION.md 상단이 기준입니다.

## 최신: 프리미엄 Preview 배포 완료 · 2026-09-19

- Preview: https://premium-review.smcguwol-review.pages.dev/ (5308e2e1-a22d-47fd-9e97-728f8fdbf334, deploy/success).
- 공식 Production은 d8c1be12 그대로입니다. 아래 단일 페이지 설명은 과거 배포 이력입니다.
- 빌드: node scripts/build.mjs → 공개용5페이지 public. 검토용: node scripts/build.mjs --preview → noindex5페이지 public. 프레임워크None, 저장소 루트.
- 검사: node scripts/check.mjs (Preview이면 --preview), node scripts/check-release.mjs, node --test scripts/check-help.mjs.
- Direct Upload ZIP에는 public의 **내용물**을 루트에 넣습니다. _worker.js와 _routes.json을 포함해야 /api/help가 작동합니다. 기존 배포를 삭제하지 않고 Create deployment로 추가합니다.
- 고객 계정733b1c8faa19799bf480b1192f473635 / smcguwol-review의 Preview 설정에 Workers AI binding **AI**, Text **SMC_AI_ENABLED=true**를 저장했습니다. Production 설정은 아직 추가하지 않았습니다. 설정 후 새 배포에 적용합니다.
- 유료 플랜을 신청하지 않았고 Workers Free를 확인했습니다. AI 한도·장애·끄는 방법은 ASSISTANT.md를 참조하세요.
- 기존 공식 도메인 Web Analytics 자동 연결과 실제 수집 확인. 별도 스크립트 중복 삽입 금지.
- 공식 반영 전 내용 검토 후 공개 빌드를 다시 만들고 검사합니다. Preview ZIP에는 noindex가 있으므로 정식용으로 사용하지 않습니다. 배포 후 Pages API 상태뿐 아니라 공식 URL의5페이지·AI·canonical·robots·sitemap도 확인하세요.

## 제공 범위 정정 · 2026-09-18

**SMC의 18만 원 개별 견적에는 네이버 서치어드바이저 등록 방법 안내가 포함되어 있습니다.** 기존 고객의 결제 전 확인 메시지와 결제 요청서 문안에서 명시한 항목입니다. 홈페이지가 기술적으로 등록 없이 작동한다는 설명과, 고객에게 약속한 지원 범위를 혼동하지 않습니다. 등록 안내를 계약 외 무료 추가 서비스로 설명한 앞선 답변은 정정했습니다.

현재 기본 SEO·robots·sitemap은 공식 배포되어 있고 고객에게 보낼 등록 절차 안내 문구도 작성했습니다. 고객 로그인·소유 확인 태그 전달, 홈페이지 태그 반영, 실제 소유 확인·사이트맵 제출은 완료 미확인입니다. 고객 계정 협조가 필요한 안내 작업으로 이어가며 검색 노출/순위를 보장하지 않습니다. 원문 대화·견적 근거와 후속 순서는 NEXT_SESSION.md의 최신 제공 범위 정정을 따릅니다.

## 캐시 수정 공식 배포 확인 완료 · 2026-09-18 18:50 KST

사용자가 캐시 수정 ZIP을 업로드했고 **d8c1be12-6a7a-41bb-bb0e-25831454c1d9 / Production / deploy success / 2026-09-18 18:42:50 KST**를 API로 확인했습니다. [공식 홈페이지](https://xn--co-002iq89dzga40o12n.kr/)와 Pages 도메인 active 정상입니다. 아래 재배포 대기 설명은 과거 이력입니다.

공식 파일14개 HTTP200·준비 public과 SHA256 일치. HTML이 버전 CSS·JS·사진을 참조하고, 새 버전 자산에는 noindex 응답 헤더가 없습니다. 실제 HTML은 no-cache, 정적 자산은 max-age=14400이므로 모든 응답에 no-cache 적용 완료라고 단정하지 않습니다. 버전 URL이 이전 자산 캐시와 분리합니다. 쿼리 없는 과거 이미지3개에 남은 noindex는 현재 페이지가 참조하는 새 URL과 구분합니다.

공식 사이트 모바일390/PC1440 검수: 7개 방 사진·선택·예약 경로, 사진 확대·닫기, 열린 요금표, 제목 크기/본문 정렬, 가로 넘침·error/warn 없음 확인. 사용자 iPhone의 ChatGPT 창을 닫고 다시 열기/Safari 비교는 별도 확인입니다. 고객에게 공식 주소 전달 가능하며, 네이버 서치어드바이저 관리 계정·소유 확인·사이트맵 제출은 후속입니다. 원본은 검토 브랜치4a814190, main 병합·DNS 변경은 없습니다. 상세 증거는 NEXT_SESSION.md 최신 기록을 보세요.

## 캐시 갱신 수정본 재배포 대기 · 2026-09-18 18:22 KST

ChatGPT 내부 브라우저/Safari의 화면 차이 제보를 확인했습니다. 현재 서버의 CSS·JS는 동일 URL에 최대4시간 캐시됩니다. 수정 빌드는 CSS·JS·사진 URL에 내용+공개모드 해시를 붙이고 Cache-Control:no-cache로 재검증합니다. CSS·사진 원본과 디자인은 유지합니다. 정적22개·공개12개 시나리오 및 로컬 PC/모바일 검수 완료.

**공식 배포에는 아직 반영되지 않았습니다.** 사용자 승인된 기존 비공개 Drive ZIP을 SMC-정식배포-캐시수정-20260918.zip(1,109,281바이트)으로 갱신했습니다. 같은 링크에서 새로 다운로드한 뒤 기존 smcguwol-review의 Production에 재업로드해야 합니다. 이후 공식 HTML에서 styles.css?v=a1409b8c3173 및 app.js?v=5e7ca46f92db 참조와 실제 자산 응답을 확인합니다. 상세 근거·검수·후속은 NEXT_SESSION.md 상단을 따릅니다.

## 현재 공식 배포 상태 · 2026-09-18 18:00 KST

**공식 홈페이지 배포 완료:** [근처연습실co.kr](https://xn--co-002iq89dzga40o12n.kr/). 사용자가 준비된 공개 ZIP을 기존 고객 Pages **smcguwol-review / Production**으로 업로드했고, API에서 **006ffa04-1c5b-48f2-8a98-ee0440b644e8 / deploy success / 17:49:55 KST**를 확인했습니다. 공식 도메인 상태와 검증은 active입니다. 아래 배포 대기·Chrome 연결 대기 설명은 과거 이력입니다.

공개 원본은 검토 브랜치 0d9640d29e1f94934c5bde0299488938c3d28d90이며 publish:true입니다. 공식 제공 파일 14개 HTTP200·SHA256 일치, HTTP→HTTPS301, 비교 페이지/없는 경로404, HTML index,follow·canonical·robots Allow·sitemap 정상입니다. 실제 공식 사이트를 앱 내 브라우저 PC1440/모바일390px에서 확인했고 7개 방 사진·확대·요금표·예약 경로·FAQ·주소 복사 및 제목/본문 정렬이 정상입니다. 실제 네이버의 SMC 인천 구월점과 7개 방 예약 목록도 확인했습니다.

**남은 사항:** 기존 이미지 4개(room-1.jpg, room-3-upright.jpg, room-5-c6.jpg, smc-guwol-logo.jpg)에 과거 noindex 응답 헤더가 캐시로 남아 있습니다. 화면 표시와 홈페이지 HTML 검색 허용에는 문제가 없습니다. 새 쿼리의 room-1.jpg는 MISS/noindex 없음입니다. zone GET은 오류9109, 해당4개 URL의 캐시 제거는 오류10000(Authentication error)로 완료되지 않았습니다. 정확한 응답 및 후속 확인은 NEXT_SESSION.md 상단을 보세요. 네이버 서치어드바이저 소유 확인·사이트맵 제출 및 실제 색인은 아직 미완료입니다.

고객 계정은 733b1c8faa19799bf480b1192f473635, zone은 56abbbdbcaec366f81c9675a261b475f입니다. 이 프로젝트는 Direct Upload/production branch main이며 Git 자동 배포는 미연결입니다. 이번 작업에서 main 수정·병합은 수행하지 않았습니다.

## 공개 배포 준비 · 2026-09-18 08:33 KST

사용자가 최신본의 공식 주소 반영과 검색 공개를 승인했습니다. 검토 브랜치의 `publish:true` 공개 빌드와 검사 33개, PC·모바일 로컬 검수를 완료했습니다. 공개 파일은 검토 안내/비교 페이지를 제외하고 공식 canonical·sitemap·robots 검색 허용을 포함합니다. **실제 Production 업로드는 아직 미완료**입니다. 아래 과거 `publish:false` 설명은 당시 상태입니다.

Cloudflare 프로젝트 읽기는 HTTP 200이나 자산 업로드 확인 API가 HTTP 403 / 8000013 Authorization failed를 반환했습니다. 기존 로그인된 Chrome 연결을 기다립니다. 앱 내 브라우저는 Cloudflare 로그인 화면입니다. 사용자가 기존 Chrome을 연결하면 고객 계정 `733b1c8faa19799bf480b1192f473635` / 기존 `smcguwol-review`의 **Production**으로 전용 폴더의 public 또는 `C:/Users/WOOWON/AppData/Local/Temp/smc-production-20260918.zip`을 업로드하세요. 재초대·토큰 추출은 필요하지 않습니다.

공식 도메인 `근처연습실co.kr`의 네임서버와 HTTPS는 07:42에 확인 완료했고 Pages 도메인/검증 상태는 모두 active입니다. 현재 실제 Production은 여전히 `0f68846e`입니다. 배포 후 성공 ID, 공식 주소의 최신 7개 방 사진 및 검색 허용 응답을 검증하고 이 기록을 갱신합니다. 네이버 서치어드바이저 등록은 별도입니다. 자세한 근거와 승인 범위는 NEXT_SESSION.md 상단을 따릅니다.

## 최신 상태 · 2026-09-18 00:08 KST

기존 고객 Pages `smcguwol-review`의 Production branch는 `main`이며 Direct Upload 방식입니다. 현재 Production은 `0f68846e`입니다. 이후의 예약 버튼·모바일 정렬·PC 오시는 길·큰 글씨 대응·예약/이용 안내 정렬·전체 7개 방 사진·요금 안내 가독성 수정은 `codex/smc-design-review` 및 PR #2에 있고, [최신 검토본](https://home-review.smcguwol-review.pages.dev/)에 배포했습니다. 7개 방 사진(1·2·3·4·5·9·10번)과 PC 16px/모바일 15px 요금 안내를 포함합니다. 최신 Preview는 `8fc2c61e-c95c-4259-a264-25434e666888`, deploy/success입니다. 검토 주소와 [기존 운영 주소](https://smcguwol-review.pages.dev/)를 구분하세요.

고객 권한 추가 후 Chrome 관리 화면에서 공식 도메인을 Free / $0, Full DNS로 추가했고, Pages custom domain 및 CNAME @ → smcguwol-review.pages.dev(Proxied, TTL Auto)를 저장했습니다. 마지막 도메인 조회인 22:44에는 pending이었으며 현재 고객의 LETO 변경 답변을 기다립니다. 실제 발급 네임서버는 `annabel.ns.cloudflare.com`, `roman.ns.cloudflare.com`입니다. 도메인 재생성·재초대·OAuth 재인증을 반복하지 마세요. 플러그인 zone 조회는 생성 후에도 빈 목록이어서 도메인 부재로 판단하면 안 됩니다.

공식 HTTPS 확인, 최신 검토 수정본의 운영 반영, 검색 공개 검증이 남습니다. `publish:false`입니다. 사용자의 이전 공개/도메인 승인과 실제 실행 상태를 구분하고, 최근 작업은 Preview에만 반영했음을 유의하세요. Git 자동 배포도 연결되지 않았습니다. 상세 승인 범위·실패 이력·고객 답변 후 순서는 [NEXT_SESSION.md](NEXT_SESSION.md)를 참고하세요.

이 기존 프로젝트는 Direct Upload 방식이며 Git integration으로 전환할 수 없습니다. Git 자동 배포에는 별도 Git 연결 프로젝트가 필요합니다([공식 문서](https://developers.cloudflare.com/pages/get-started/direct-upload/)). 이번 통합 작업에서는 새 프로젝트를 만들지 않았고 기존 오류 8000011을 재인증으로 해결했다고 주장하지 않습니다.

현재 홈페이지 원본은 `src/index.html`, `src/styles.css`, `src/app.js`이며, `src/design-*`는 비교 이력입니다. 공개 빌드에서 비교 페이지를 제거해도 통합 첫 페이지는 유지됩니다.

22:44 공개 DNS 확인: NS는 LETO 두 서버였으며 apex A/AAAA/MX/TXT/CAA 및 www A/AAAA/CNAME은 ENODATA, 공개 DNS DS 응답의 Answer는 null이었습니다. 다른 사용자 정의 하위 도메인 전체를 조사한 것은 아닙니다. 고객의 변경 완료 답변 후 공개 NS·zone active·Pages 도메인 active 및 공식 HTTPS를 다시 확인합니다.

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

초기 A/B 배포는 `codex/smc-design-review`를 사용했습니다. 2026-09-17 PR #1 병합 후에는 `main`에도 최신 통합 홈페이지가 있습니다. 지금 새 Git 연결 프로젝트를 만들면 Production branch는 `main`을 사용합니다. 아래 최초 검토 브랜치 안내는 초기 작업의 이력입니다.

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
- 고객 계정에 검토본을 배포했습니다. 도메인/Pages/DNS 설정은 저장했고 네임서버 전환과 실제 HTTPS 활성화는 확인 대기입니다.
- 사진·방 번호·요금표·도메인 철자는 고객 확인을 반영했습니다. 실제 방문자용 공개 전 화면·버튼 목적지·도메인 연결을 확인해야 합니다.
- 시안 공유용 배포도 고객님 계정에서만 진행합니다. 검색 제외는 접근 차단이나 암호 보호가 아닙니다.

## 도메인

고객이 확인한 정확한 주소는 **`근처연습실co.kr`**입니다. `연습실`과 `co` 사이에 점을 추가하지 않습니다. 고객 제공 관리 화면·WHOIS 텍스트에는 등록일 2026-09-14, 만료일 2031-09-14, 상태 활성으로 표시되어 있습니다. 화면상 자동 갱신은 꺼져 있습니다. 영문 표기 `xn--co-002iq89dzga40o12n.kr`는 로컬 IDNA 변환으로 한글 주소와 정확히 일치함을 확인했습니다. 등록기관 실시간 조회로 독립 검증한 것은 아닙니다.

설정 파일의 `url`에 `https://근처연습실co.kr/`를 반영했습니다. 고객은 2026-09-15 구매처가 **LETO**, 현재 네임서버가 **`selene.ns.leto.kr`**, **`nyx.ns.leto.kr`**라고 전달했고, 제공한 관리 화면에서도 두 네임서버를 확인했습니다. 고객은 기존 홈페이지·이메일에 연결하지 않고 도메인만 구매한 상태라고 확인했습니다. 도메인 재구매는 필요하지 않습니다. 현재 네임서버를 유지하고, 배포 미리보기와 실제 DNS 레코드를 확인한 뒤 연결합니다. 자동 갱신·잠금 설정은 변경하지 않았습니다.

최상위 주소 `근처연습실co.kr`를 사용하려면 Pages 프로젝트와 같은 고객 Cloudflare 계정에 도메인(zone)을 추가하고 Cloudflare 네임서버를 사용해야 합니다. Cloudflare Pages 프로젝트의 Custom domains에서 도메인을 연결한 다음 안내되는 DNS 설정을 확인합니다. 고객은 기존 홈페이지·이메일을 사용하지 않는다고 확인했습니다. 위 최신 상태에 기록한 apex A/AAAA/MX/CAA만 조회했으므로 네임서버 변경 전에는 TXT·DS·하위 도메인 등 필요한 나머지 레코드도 확인합니다. 기존 DNS를 검토하고 실제 Cloudflare 네임서버 값이 발급된 뒤 LETO에서 네임서버를 변경합니다. 현재 LETO 네임서버를 Cloudflare가 발급한 값으로 혼동하지 마세요. 기존 DNS 레코드는 임의로 삭제하지 마세요. 한글 도메인은 브라우저·DNS에서 영문 Punycode로 표시될 수 있으며, 이 프로젝트는 확인된 한글 주소를 URL 표준 형식으로 변환해 canonical·sitemap에 사용합니다.

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
