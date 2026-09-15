# SMC 홈페이지 작업 이어가기

기록: 2026-09-15. 이 파일은 연결 상태에 관한 이전 설명보다 우선하는 최신 인수인계입니다.

## 바로 할 작업

고객 소유 Cloudflare Pages에 현재 A/B 비교 시안을 미리보기로 배포하고 실제 모바일·PC 화면을 검수합니다. 이미 있는 계정·저장소·프로젝트를 먼저 조회하고 재사용합니다. 배포는 고객 계정에만 수행합니다. 이 단계에서 main 병합, 최종 디자인 선택, 도메인/DNS 변경, 유료 서비스 신청은 하지 않습니다.

## 연결 상태: 재설정하지 말 것

- 제작자 GitHub `woowon9909`, 고객 저장소 `smcguwol-maker/smcguwol`.
- GitHub 협업자 초대 수락과 고객 ChatGPT Codex Connector 설치·저장소 권한 설정은 해결됐습니다. 실제 코드 업로드와 Draft PR 생성까지 성공했습니다.
- 고객은 Cloudflare 작업자 초대 및 Cloudflare Workers and Pages 앱에 해당 저장소 하나만 선택했다고 확인했습니다.
- 제작자는 Cloudflare 초대를 수락했습니다. 마지막 OAuth 승인 전 화면에서 고객 SMC 계정 선택과 Account Read, Account Settings Read, Pages Read, Pages Write, 필수 User Read, Background Access를 확인했습니다. 이후 사용자가 인증 완료를 보고했습니다.
- 앞선 CSRF token mismatch 이후 새 인증을 진행했습니다. 완료 보고가 최신 상태입니다. 초기 잘못 선택한 Custom Pages 권한이나 CSRF 오류를 현재 상태로 되돌리지 않습니다.
- 인증 후에도 기존 Work 대화의 사용 가능 도구 및 스킬 목록에는 Cloudflare가 나타나지 않았습니다. 기능 미반영 원인은 확정되지 않았고 실제 Cloudflare 계정 API 요청은 실행하지 못했습니다. 설치 실패나 인증 실패라고 단정하지 않습니다.
- OpenAI 공식 안내는 플러그인 설치 후 새 대화에서 사용하도록 안내합니다: https://learn.chatgpt.com/docs/plugins
- 새 세션에서는 Cloudflare 플러그인을 불러와 실제 읽기 기능부터 확인합니다. 기능이 제공되지 않으면 정확한 제한을 보고하고 이미 완료한 설치/초대/인증을 반복 요구하지 않습니다. 비밀 토큰이나 인증 코드를 요청하거나 추출하지 않습니다. 연결된 플러그인의 실제 기능과 허용된 접근 경로를 따릅니다.

## 현재 코드와 검토본

- 저장소: https://github.com/smcguwol-maker/smcguwol
- 검토 브랜치: `codex/smc-design-review`
- Draft PR: https://github.com/smcguwol-maker/smcguwol/pull/1
- 실제 A/B 코드 최초 커밋: `d38ca1519ccf58a2ca1d7c38dcc2b060f75698c2`. 이후 커밋은 도메인·연결 준비 문서 업데이트입니다. 작업 시작 시 브랜치 최신 내용을 조회합니다.
- main은 초기 README 상태로 유지했습니다. 제작 코드는 검토 브랜치에 있습니다. main을 그대로 빌드하지 않습니다.
- 프레임워크 없는 HTML/CSS/JavaScript, Node.js 20 이상. 외부 빌드 의존성 없음.
- 빌드 명령 `node scripts/build.mjs`, 출력 `public`, 루트 빈칸, Framework None.
- `content/site.json`의 `publish`는 false로 유지합니다. 비교 시안은 검색 제외이며 접근 인증으로 비공개화된 것은 아닙니다.
- 성공한 배포 URL 뒤 `/design/`가 비교 페이지, `/design/a.html`, `/design/b.html`이 각 시안입니다. 생성되지 않은 pages.dev 주소를 추측하지 않습니다.
- Pages 프로젝트가 있으면 검토 브랜치 preview deployment를 사용합니다. 신규 프로젝트의 최초 빌드에 Production branch 지정이 필요하면 코드가 있는 검토 브랜치를 고객 확인용 초기 브랜치로 사용하고 custom domain은 연결하지 않습니다. 상세 절차는 DEPLOYMENT.md에 있습니다.

## 디자인·검수 현황

- A: 아이보리와 로고 파랑, 큰 실제 사진을 중심으로 한 스튜디오 소개.
- B: 흰색과 파랑, 연습 목적·공간 정보를 중심으로 한 안내.
- A/B는 첫 화면·공간 소개·방문 정보의 부분 시안이며 완성된 두 개의 전체 사이트가 아닙니다. 기존 전체 원페이지는 public/index.html에 있습니다.
- 실제 SMC 로고와 C6 홀/1번/3번방 사진을 사용했습니다. 임의 생성 공간 사진은 없습니다.
- 기존 정적 검사 22개, A/B 링크·구조 검사, 공개 전환 및 고객 수정 통합 검사 8개를 통과했습니다. 실제 브라우저 렌더링/모바일 화면 검수는 미완료입니다.
- 이전 로컬 브라우저 미리보기는 정책상 차단됐습니다. 허용되지 않은 도구나 터널로 우회하지 않습니다. 고객 Cloudflare 배포 URL이 생기면 허용된 브라우저 절차로 실제 화면을 검수합니다.
- publish true인 빌드는 public/design 전체를 제외합니다. 과거 preview deployment 사본 삭제와는 다릅니다.

## 확정 사업 정보·계약 범위

- SMC 인천 구월점, 인천광역시 남동구 인하로489번길 16, 10층.
- 0507-1380-8122, 24시간 연중무휴. 현장 주차 불가. 인근 문화예술회관 공영주차장/뉴코아 인천점 안내.
- 트럼펫·관악기 개인 연습 가능, 드럼 불가. 네이버 예약 버튼이 핵심 전환입니다.
- 시간제 요금은 30분당, 최소 1시간. 확정 표는 content/site.json과 CONTENT_SOURCES.md를 사용합니다. 오래된 뮬의 월방·공실·할인 안내로 덮어쓰지 않습니다.
- 고객 소유 GitHub와 Cloudflare, 원본 전체 인계·수정/이전 가능. 원페이지 18만 원 DELUXE, 최대 10섹션, 약정 범위 수정 3회.
- 카카오톡 자동 예약 알림은 고객이 제외했습니다. 네이버 예약 알림을 사용하며 홈페이지에는 외부 예약 링크를 연결합니다.
- 기본 SEO 및 고객 수정 안내 포함. 검색 순위/AI 노출 보장 없음. 관리자 CMS/폼/결제/추가 유료 서비스 없음.

## 도메인: 정보 재요청 불필요

- 정확한 주소 `근처연습실co.kr` — 연습실과 co 사이에 점을 넣지 않습니다.
- IDNA `xn--co-002iq89dzga40o12n.kr`: 한글 주소와 일치 확인.
- LETO에서 구매. 고객 화면상 2026-09-14 등록, 2031-09-14 만료, 활성, 자동 갱신 OFF.
- 현재 네임서버 `selene.ns.leto.kr`, `nyx.ns.leto.kr`.
- 고객은 기존 홈페이지·이메일 연결 없이 도메인만 구매했다고 확인했습니다.
- 도메인/DNS/네임서버 변경은 아직 수행하지 않았습니다. 최종 공개 때 실제 Cloudflare 값과 DNS 레코드를 확인하여 진행합니다. 현재 Pages 권한을 DNS 수정 권한으로 간주하지 않습니다.

## 읽을 파일

README.md, docs/DEPLOYMENT.md, docs/DESIGN_DIRECTION.md, docs/QA.md, docs/EDITING.md, docs/CONTENT_SOURCES.md, content/site.json.

원격 저장소가 기준입니다. 이전 임시 작업 폴더나 20260914 ZIP이 사라졌거나 오래됐어도 제작을 처음부터 다시 시작하지 않습니다. 최신 검토 브랜치를 사용합니다. 고객에게 메시지 전송, PR 병합, 최종 공개 완료를 수행했다고 허위 보고하지 않습니다.
