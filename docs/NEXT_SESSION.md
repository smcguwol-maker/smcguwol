# SMC 홈페이지 작업 이어가기

## 고객 인증 통과 후 홈페이지 오류 조사 / 보완 배포 · 2026-09-23 22:41 KST

- 고객은 관리자 이메일을 기존 **smcguwol@gmail.com**으로 유지하기로 확인했습니다. ultratp72@gmail.com은 추가하지 않습니다. 고객이 “로그인이 만료되었거나 관리권한이 없습니다”를 보고했습니다.
- Chrome Access 인증 로그에서 SMC 소식 관리 앱 / smcguwol@gmail.com / **Allowed 8건**(최근22:29:26)과 Blocked1건을 실제 확인했습니다. 이메일 인증 및 Access 허용은 성공하며, 고객이 전달한 오류 문구는 자체 Worker의 인증 검증 오류입니다. 계정 최초설정/역할/OAuth를 반복 요청할 문제가 아닙니다. 구체적인 실패 조건은 기존 오류가 모두401로 합쳐져 있어 아직 확정하지 못했습니다.
- 앱 Allow 정책 이메일, Production 및 실제 배포의 DOMAIN/AUD 일치를 확인했습니다. 공개 서명키 URL은 HTTP200/5116바이트/RSA RS256키2개 응답입니다. 사용자 인증쿠키·JWT·인증번호는 요청/추출하지 않았습니다.
- `Cf-Access-Jwt-Assertion`을 우선 검증하고, 헤더가 없는 브라우저 요청에서만 `CF_Authorization`의 서명된 앱 JWT를 같은 방식으로 검증하도록 보완했습니다. 기존 서명·issuer·audience·이메일·만료·type·공식호스트 검증은 유지하며, 잘못된 헤더를 정상쿠키로 우회하지 않습니다. 중복 인증쿠키도 거부합니다. **헤더 미전달이 이번 고객 오류의 확정 원인이라고 단정하지 않습니다.**
- 인증 실패 코드 A01(토큰 없음/크기), A02(형식/디코딩), A03(claims), A04(공개 검증키 요청/응답), A05(키 선택/import), A06(서명 검증)을 화면/API에 표시합니다. A04/A05는 서비스 문제503으로 구분해 무조건 재로그인으로 안내하지 않습니다. 원시 토큰/쿠키/claims/이메일/상위 오류문은 로깅하거나 노출하지 않습니다.
- **보완 배포:** Production **cb62607d-85a2-4927-865a-538f5aaefc71**, deploy/success, **2026-09-23 22:41:27 KST**. https://cb62607d.smcguwol-review.pages.dev/ . 기존 고객 계정/프로젝트 유지. ZIP **C:/Users/WOOWON/AppData/Local/Temp/SMC-admin-auth-fix-20260923.zip**, 1,560,571바이트/25파일. Access 정책/IDP/환경변수/DB 데이터는 변경하지 않았습니다.
- 검사: 정적51개·릴리스12개·도우미9개·홍보12개 통과. 헤더 없는 서명쿠키 성공, 타인/만료/다른aud/type/잘못된쿠키/헤더 우회/중복쿠키 차단, 검증키 장애503 및 민감정보 없는 코드 회귀검사 추가. 관리자 JS문법 검사도 통과했습니다.
- **고객 최종 확인 대기:** 기존 오류 화면 새로고침 또는 공식/admin/에 접속해 관리자 목록이 열리는지 확인 요청했습니다. 계속 오류면 A01~A06 코드만 받아 원인을 좁힙니다. 아직 실서비스 인증 후 편집·저장 성공을 확인하지 못했으므로 “모두 해결/완료”라고 안내하지 않습니다. 인증번호를 전달받지 않습니다.

## 소식 관리 가림 수정 및 실제 이메일 로그인 연결 완료 · 2026-09-23 21:13 KST

- 고객이 Zero Trust 연결 완료 후 소식 관리가 이용 도우미에 가려지고 로그인에서 오류가 난다고 알려 재확인했습니다. Chrome에서 고객 계정의 **Zero Trust Free / 팀 broad-hill-4127** 활성화를 확인했습니다. 아래의 초기 활성화/권한 차단 기록은 과거 상태이며, 같은 설정이나 재로그인을 다시 요청하지 않습니다.
- 하단에 도달하면 이용 도우미가 고정 위치에서 벗어나 푸터 링크 아래 별도 줄로 이동합니다. 일반 화면에서는 기존 고정 버튼을 유지합니다. PC1440×900·모바일390×844의 로컬 및 공식 홈페이지에서 소식 관리와 겹침 없음, 실제 클릭 가능, 가로 넘침 없음, 도우미 열기/닫기를 확인했습니다.
- 고객 계정 **733b1c8faa19799bf480b1192f473635**에서 Access 앱 **SMC 소식 관리**(2ea47ba2-814a-45c8-966c-10998c35e3f7)를 연결했습니다. 공식 도메인 경로 `admin`을 보호하며 하위 관리자 API까지 적용됩니다. Allow 정책 **SMC owner only**(9427a4b1-e306-4ab8-8cfa-3eb4fbf99bda)는 이메일 **smcguwol@gmail.com 하나만** 허용합니다. 로그인 제공자는 **One-time PIN**만 선택했고, 모든 제공자 자동 허용은 껐습니다. 세션24시간, Cloudflare One Client 인증은 사용하지 않습니다. 기존 Cloudflare IDP는 삭제하지 않았습니다.
- Production 변수 **SMC_ACCESS_DOMAIN=broad-hill-4127.cloudflareaccess.com**, **SMC_ACCESS_AUD=2355657d389bbb4936ad4548cd620f7fcac5323306428bfa7852c1722ae07eee** 설정을 API HTTP200과 Chrome 설정 화면으로 확인했습니다. 이 둘은 공개 식별자이며 비밀 토큰이 아닙니다. 기존 AI/SMC_AI_ENABLED 및 D1 SMC_PROMO_DB 바인딩을 보존했습니다. Preview는 변경하지 않았습니다.
- **공식 배포 완료:** smcguwol-review / Production **fddae4b1-7c15-449e-82fb-1a4526dde834**, deploy/success, **2026-09-23 21:12:59 KST**. 고정 배포 https://fddae4b1.smcguwol-review.pages.dev/ . 공식 https://xn--co-002iq89dzga40o12n.kr/ . ZIP **C:/Users/WOOWON/AppData/Local/Temp/SMC-admin-footer-fix-20260923.zip**, 1,560,048바이트, 25개 파일을 Chrome Direct Upload로 배포했습니다. 아래의 제출용 ZIP은 이 수정 전 스냅샷입니다.
- 운영 확인: 공개5페이지 HTTP200, `/api/promotions` HTTP200 및 기존3개 게시물 유지. `/admin`, `/admin/`, `/admin/api/board` 모두 실제 Access 로그인으로302 전환됩니다. 홈페이지의 소식 관리 링크를 직접 눌러 **Log in to SMC 소식 관리 / Email / Send login code** 화면을 확인했습니다. 공개 이미지 로딩 정상이며 닫혀 있는 갤러리의 lazy 이미지1개는 의도적으로 미로드 상태입니다.
- **남은 최종 확인:** 고객이 본인 이메일로 인증번호를 받아 직접 로그인한 뒤 게시물1개를 저장하고 홈페이지 반영을 확인합니다. 제작자는 인증번호 발송/조회/입력 및 고객 실서비스 쓰기를 수행하지 않았습니다. 실제 인증 후 저장까지 성공했다고 말하지 않습니다. 로컬 저장 테스트는 완료되어 있습니다.
- 빌드·정적51개·릴리스12개·도우미9개·홍보10개 검사 통과. 미설정503 화면에는 무효한 로그아웃 재로그인 링크를 표시하지 않고, 만료401에서만 재로그인을 제공합니다. 관련 회귀 검사1개를 추가했습니다.
- **연결 도구 불일치 주의:** Cloudflare MCP의 Access 조직10000/앱9999 및 이후 앱목록200/빈목록 응답은 Chrome에 실제 저장된 앱과 공식 로그인 동작과 모순됩니다. MCP 빈목록만 보고 앱을 중복 생성하거나 고객에게 재설정을 요청하지 않습니다. Pages 설정/배포 조회는 정상이며 Chrome과 교차 확인했습니다.
- 유료 신청, 결제정보/인증정보 요청·추출, main 수정/병합, DNS 변경, 고객 메시지 발송은 하지 않았습니다. 고객 이메일 인증 확인만 안내하면 됩니다.

## 공개 홈페이지 결과물 제출 준비 / 관리자 연결은 후속 · 2026-09-23

- 사용자는 현재 공개된 홈페이지를 먼저 전달하고, 고객 직접 게시물 편집 기능의 연결 협조는 이후 요청하기로 했습니다. 이를 전체 관리자 기능 완료, 기능 취소, 별도 유료 추가 개발로 해석하지 않습니다. 현재 제출 문구에 관리자 로그인 연결/실서비스 저장 검수가 남았음을 명시합니다. 고객 메시지나 작업물 실제 발송은 하지 않았습니다.
- 제출용 **C:/Users/WOOWON/AppData/Local/Temp/SMC-delivery-20260923/SMC-premium-delivery-20260923.zip**, 5,042,550바이트. 내부: 현재 배포파일ZIP(1,559,753바이트), 수정용 원본ZIP(3,484,226바이트), 고객용 먼저 읽어주세요.txt. 고객이 보관할 제작 파일이며 향후D1게시물/계정설정까지 포함한 전체서버백업은 아닙니다.
- Pages조회HTTP200에서 공식 Production581286e5 deploy/success 유지 확인. 기존배포ZIP25파일과현재public의해시전부일치. 별도전달source폴더에추적중인53파일을복사하고빌드/정적51개/릴리스12개검사통과, 재빌드결과와운영public전체해시일치확인. 소스ZIP에는.git/환경자격증명/내부대화이력문서를포함하지않았습니다.
- 안내문에는현재반영5페이지·홍보게시판·영상2개·웹툰, 관리자연결대기, 동일게시판웹툰추가방법/한도, 기본검색설정과서치어드바이저소유확인·제출완료미확인을구분했습니다.
- 기존Access차단진단/고객무료최초설정확인은아래기록참고. 사용자가후속연결을재개하면그때현재상태를확인합니다. 이번제출준비에서코드/배포/권한/도메인/main을변경하지않았습니다.

## 권한 추가 확인 / 재로그인 후 Access 초기 활성화 차단 · 2026-09-23

- **후속 재로그인 결과:** 사용자가 재로그인 완료를 알렸고, 새로 로그인한 Chrome 고객 계정 탭에서 확인했습니다. /one/overview와 /one/access-controls/apps 모두 같은 역할 접근 오류입니다. 공식 one.dash.cloudflare.com의 계정 선택에서도 SMC를 선택하면 동일합니다. 로그인 갱신만으로 해결되지 않았으며 재로그인을 반복 요청하지 않습니다. API 앱9999 not_enabled / 조직10000도 유지됩니다.
- **현재 필요한 다음 조치:** 고객 본인 계정에서 Zero Trust 최초 활성화 화면을 확인하고 Free($0)로 초기 설정을 완료하도록 안내합니다. 팀명 예시smcguwol(사용 가능 여부 미확인). 공식문서상 Free도 결제수단 등록이 요구되며, 고객이 Cloudflare에 직접 입력하고 약관/최종금액을 확인합니다. 제작자에게 카드/인증정보를 전달하지 않습니다. 실제 고객의 초기 설정 화면을 아직 본 것은 아니므로 결제정보 미등록이 이번 접근 오류의 확정 원인이라고 단정하지 않습니다. 고객 본인도 같은 오류면 해당 화면으로 Cloudflare 지원 확인이 필요합니다. Access 정책/변수/배포를 아직 변경하지 않았고 실제 관리자 저장은 미검수입니다.


- 고객이 Zero Trust 권한 추가 및 저장 완료를 알렸고, 사용자가 관리자 로그인 연결·실제 저장 검수를 이어가도록 요청했습니다.
- **고객의 권한 추가는 실제로 정상 확인했습니다.** Chrome 구성원 상세에서 기존 작업 계정 circle970908@naver.com / Entire account / Cloudflare Zero Trust; Workers Platform Admin; Administrator를 확인했습니다. User menu의 현재 로그인 이메일도 같은 계정입니다. 이전의 “Zero Trust 역할이 없다”는 진단으로 다시 권한 추가를 요청하지 않습니다.
- 그런데 같은 고객 계정의 Zero Trust → Get started → /one/overview는 새로고침 후에도 “Your current role does not allow you to view this content.”를 표시합니다. API Access 앱/IDP는9999 access.api.error.not_enabled, 조직 조회는10000 Authentication error입니다. 권한 저장은 확인됐으나 실제 관리 화면 진입/초기 활성화는 아직 되지 않았습니다. 로그인 세션 반영 문제인지 또는 서비스 초기화 문제인지 확정하지 않았습니다.
- 사용자에게 **PC Chrome에서 기존 작업 계정으로 로그아웃 후 재로그인**을 요청했습니다. 고객에게 같은 권한을 재요청하지 않고 먼저 작업 세션 갱신으로 확인합니다. 비밀번호/OTP를 채팅으로 받거나 추출하지 않습니다.
- 공식 Pages는 API HTTP200, Production581286e5-24dc-44d1-ac1e-0570247c38d8 유지, 환경변수는SMC_AI_ENABLED만 있으며 Access DOMAIN/AUD는 아직 미설정입니다. 운영 로그인/게시물 쓰기를 성공했다고 말하지 않습니다. 배포/권한/요금 변경 없음.
- 웹툰을 계속 제작해 올리는 것은 **같은 홍보 게시판의 사진·그림 게시물 추가**로 지원합니다. 소식 올리기 → 사진·그림 → 파일 선택 → 제목(예: SMC 웹툰 2화) → 홈페이지에 공개 → 저장하기. 현재 한 게시물당 이미지1장, 전체게시물30개, 원본15MB/최대변2400px 자동압축입니다. 여러 장으로 구성된 회차는 장별 게시물 또는 한 장으로 구성한 파일로 올릴 수 있으나, 매우 긴 합본은 축소로 글씨가 작아질 수 있습니다. 무제한 누적/다중이미지 회차 관리 기능으로 소개하지 않습니다.
- 다음 단계: 세션 갱신 후 같은 계정의 Zero Trust 재확인. 진입하면 무료 Access 초기화 및 공식/admin 경로, 고객 이메일1개 Allow, 실제DOMAIN/AUD 변수설정/재배포. Cloudflare 공식 현재 초기 설정 문서는 Free도 결제수단 등록 단계가 있다고 안내하므로 실제 화면이 요구할 경우 고객이 직접 입력해야 합니다(https://developers.cloudflare.com/cloudflare-one/setup/). 아직 결제 단계에 도달한 것은 아니며 이것을 현재 오류의 확정 원인으로 설명하지 않습니다.
- 원격 검토 브랜치95c56e3를 GitHub read API로 확인했습니다. shell git fetch는네트워크연결실패, MCP members읽기는자동승인검토시간초과여서 구성원UI로 확인했습니다. 시간초과를안전성거부나인증실패로단정하지않습니다.

## 첫 화면 홍보 게시판 배포 / 고객 로그인 설정 대기 · 2026-09-22

- 고객 요청: 첫 화면에서 영상 썸네일·그림을 바로 보고, 제작 후 고객이 직접 유튜브 영상/사진을 등록·교체. 사용자가 관리자 이메일 **Smcguwol@gmail.com**을 확인했습니다.
- **공식 배포 완료:** 고객 계정733b1c8faa19799bf480b1192f473635 / smcguwol-review / Production **581286e5-24dc-44d1-ac1e-0570247c38d8**, deploy/success, **2026-09-22 08:23:48 KST**. 고정 주소 https://581286e5.smcguwol-review.pages.dev/ . 공식 https://xn--co-002iq89dzga40o12n.kr/ . 25개 파일 ZIP을 Chrome Direct Upload로 업로드했습니다.
- 홈 상단에 SMC 소식 3개(영상2+웹툰)를 배치하고 실제 YouTube 썸네일 표시, 모달 재생/그림 전체보기, 블로그·인스타 링크, 4개 이상 더 보기를 구현했습니다. 기존5페이지·7개 방·요금·AI·예약 경로는 유지합니다.
- D1 **smcguwol-promotions** / **7086be90-5d6b-4ea6-97c3-c217e6ae789b** 생성, migrations/0001 및0002 실행 성공을 Chrome UI로 확인했습니다. Production 바인딩 **SMC_PROMO_DB** PATCH HTTP200 성공. 기존 AI/SMC_AI_ENABLED 유지. Preview에는DB를 연결하지 않았습니다.
- 고객 관리 화면 /admin/: 제목·설명, YouTube 공유 주소, 사진 자동 JPEG 압축(원본15MB/저장1MB/최대변2400px), 공개/숨김, 순서 변경, 최대30개. D1 저장으로 재배포 후에도 유지하며 동시수정 충돌409·본문제한·파일형식검증·출력이스케이프·CSRF·서명검증을 적용했습니다. 초기 seed는 실제저장데이터를 덮어쓰지 않습니다.
- **아직 전체 완료 아님:** Cloudflare Zero Trust UI는 9/22 재확인에서도 “Your current role does not allow you to view this content.”로 차단됩니다. /admin 및 API는 현재 **503 / 관리자 로그인 연결을 준비하고 있습니다.**로 안전하게 잠긴 상태입니다. 실제 고객 로그인/실서비스 직접 편집 성공을 주장하지 않습니다. 사용자에게 기존 작업 계정의 Zero Trust 관리 권한 추가를 요청하는 질문을 보냈고 답변 대기입니다. 필요한 단계는 **docs/PROMOTION_BOARD.md**에 한 번에 정리했습니다. 새 계정/유료 서비스/반복 OAuth를 요청하지 않았습니다.
- Cloudflare MCP의 Access조직·D1목록·KV목록 조회는 오류10000 Authentication error, Access앱/IDP는9999 not_enabled였습니다. Pages조회/설정은200이며 Chrome D1생성/SQL은성공이므로 플러그인 전체 인증 실패로 단정하지 않습니다.
- 검증: 정적51개·릴리스12개·도우미9개·홍보보안/저장9개 통과. Chrome 로컬 PC1440/모바일390 첫화면·실제썸네일480×360·두영상재생(paused=false)·닫으면iframe제거 확인. 관리자 영상주소교체/저장 후새로고침 유지, 사진원본401KB→348KB자동압축/저장/홈표시/720×1280원본확대, 네번째더보기 확인. 로컬시험만이며 고객 실제로그인검증과 구분합니다.
- 공식 HTTP:5페이지200, /api/promotions200로D1의3게시물확인, 홈홍보카드3개와no-store확인(캐시로이전게시물재사용방지), /admin 및/admin/api/board503차단확인. 공식ChromePC1440/모바일390첫화면과썸네일3개·가로넘침없음확인. 공식 첫 영상 플레이어의 재생/일시중지 버튼 상태, 두번째 영상9.66초·paused=false·readyState4, 웹툰720×1280원본 로딩과 닫기 확인.
- 배포ZIP: C:/Users/WOOWON/AppData/Local/Temp/SMC-promotion-board-20260922.zip. ZIP은 정적앱파일이며 나중에 고객이 작성한D1데이터를 포함하지 않습니다. 로컬 검수 서버 scripts/serve-promotions-test.mjs는127.0.0.1전용·메모리DB·테스트서명이며절대public에배포하지 않습니다.
- 다음 작업: 권한이 추가되면 고객 계정에서 Access 무료 초기설정→공식/admin경로보호→이메일한개Allow→실제 SMC_ACCESS_DOMAIN/SMC_ACCESS_AUD 변수설정→재배포→고객이 직접로그인/등록확인. 비밀번호·OTP를 채팅으로 받지 않습니다. main변경/병합·유료신청·고객메시지발송 없음.


## 고객 추가 영상 공식 반영 · 2026-09-19 14:51 KST

- 사용자가 전달한 https://youtu.be/12EVkuA5VI4 영상을 기존 T3b6UNOPucc와 함께 홈의 `/#videos`에 추가했습니다. PC에서는 두 개를 나란히, 모바일에서는 세로로 표시합니다. 각 제목·클릭 재생·YouTube 원본 링크를 제공하며, 웹툰과 기존5페이지를 유지합니다.
- 고객 계정733b1c8faa19799bf480b1192f473635 / smcguwol-review / Production **0d780ef7-2328-4638-9889-1c9b86d62c9e**, deploy/success, **2026-09-19 14:51:47 KST**. 공식 https://xn--co-002iq89dzga40o12n.kr/#videos . 고정 배포 https://0d780ef7.smcguwol-review.pages.dev/ .
- 공개 빌드·정적51개·릴리스12개 통과. 공개 내용22개 파일 ZIP을 Chrome Direct Upload로 배포했습니다. 공식5페이지와CSS/JS 총7개 HTTP200·로컬SHA256 일치, 두 영상ID·외부링크·클릭 전 iframe없음·웹툰 링크 유지 확인.
- 로컬 PC1440/모바일390 배치와 가로 넘침 없음, 공식 모바일390 화면 확인. 공식 Chrome 내장 플레이어에서 새 영상 재생9.37초/총48.061초, 기존 영상11.47초/총61.1초와 paused=false를 직접 확인했습니다. 인앱 브라우저의 내장 플레이어 검수에서는 빈 iframe이 보여 Chrome에서 실제 재생을 별도로 확인했으며, 두 영상 모두 원본 YouTube 링크를 제공합니다.
- AI 바인딩 AI 및 SMC_AI_ENABLED=true가 새 배포에도 유지됨을 API로 확인했습니다. 이번 변경은 영상 목록·표시이며 AI·예약 기능은 수정하지 않았습니다.
- 영상 추가/제목 수정은 content/site.json의 videos(id,title)에서 합니다. 배포 ZIP: C:/Users/WOOWON/AppData/Local/Temp/SMC-production-videos-20260919.zip. 소스 ZIP도 갱신합니다. main·DNS·유료 서비스 변경 및 고객 메시지 발송 없음. 서치어드바이저 후속은 이전 기록을 따릅니다.

## 고객 제공 웹툰 공식 반영 · 2026-09-19 13:52 KST

- 사용자가 고객 제공 웹툰의 홈페이지 추가를 요청했습니다. 홈의 영상·소식 영역에 작은 미리보기와 전체 보기 링크를 넣고, 기존 이용 안내의 `/guide/#webtoon`에 전체 그림을 원본 비율로 추가했습니다. 그림을 누르면 원본 새 탭, 글로 읽기 펼침을 지원하며 5페이지 구성을 유지합니다.
- 공식 확인 링크: https://xn--co-002iq89dzga40o12n.kr/guide/#webtoon . 고객 Pages smcguwol-review의 Production **f63b6bca-6f86-44ba-9ce3-05e1ccd5adb0**, deploy/success, **2026-09-19 13:52:24 KST**. 고정 배포: https://f63b6bca.smcguwol-review.pages.dev/ . 아래82485a5f는 이전 배포입니다.
- 고객 원본 JPEG 720×1280,401,576바이트를 편집 없이 추가했습니다. assets와 public의 이미지 및 공식 HTTP 응답의 SHA256이 일치합니다. 출처는 CONTENT_SOURCES.md, 수정 방법은 EDITING.md에 기록했습니다.
- 공개 빌드·정적51개·릴리스12개 통과. 기존 릴리스 검사의 사용 자산 집계/원본 보존 대상에 웹툰을 포함했습니다. Chrome에서 public 내용22개 ZIP을 Production에 직접 업로드했습니다.
- 공식5페이지+버전자산11개+robots/sitemap2개, 총18개 HTTP200·로컬파일 일치, 검색 허용·canonical·5페이지 sitemap·HTTPS301·없는주소404 확인. 기존 AI 바인딩 AI / SMC_AI_ENABLED=true 유지 및 실제 응답 검사 통과.
- 로컬과 공식 PC1440/모바일390에서 웹툰 원본 비율·가로 넘침 없음 확인. 홈 카드→웹툰 앵커 이동, 이미지720×1280 로딩, 원본 새 탭 열림과 글 설명 펼침을 확인했습니다.
- 정식 ZIP: C:/Users/WOOWON/AppData/Local/Temp/SMC-production-webtoon-20260919.zip. 소스 ZIP도 웹툰 포함본으로 갱신합니다. 수정은 codex/smc-design-review에 저장하고 main은 변경·병합하지 않습니다. 고객에게 메시지는 발송하지 않았습니다.
- 서치어드바이저 소유 확인·사이트맵 제출과 기존 운영 정보 후속 사항은 바로 아래 기록 그대로입니다. 이번 웹툰 추가로 별도 유료 서비스는 신청하지 않았습니다.

## 프리미엄 공식 배포 완료 · 2026-09-19 13:29 KST

사용자가 미리보기 완료 보고와 공식 반영 단계 안내에 “그래 계속 진행”이라고 승인했습니다. 아래 Preview 전용 상태와 공식 반영 대기는 과거 기록입니다.

- **공식 주소:** https://xn--co-002iq89dzga40o12n.kr/ (= 근처연습실co.kr). 고객에게 전달할 수 있는 프리미엄 5페이지입니다.
- 고객 계정733b1c8faa19799bf480b1192f473635 / smcguwol-review / Production **82485a5f-0db3-4740-bbfc-09b749cd0fbe**, deploy/success, **2026-09-19 13:29:08 KST**. canonical_deployment와 latest_deployment가 이 ID임을 API HTTP200으로 확인했습니다. 고정 배포 https://82485a5f.smcguwol-review.pages.dev/ .
- Workers plans의 **Free / $0 / Current plan**을 다시 확인했습니다. Production에 Workers AI binding **AI**, Text 변수 **SMC_AI_ENABLED=true**를 저장하고 API 조회 및 실제 배포 바인딩으로 확인했습니다. 유료 플랜 전환 없음.
- 공개용 node scripts/build.mjs로 빌드하고 정적51개 검사 통과 후 21개 파일 ZIP을 Chrome으로 직접 업로드했습니다. 공개 전 문구 검수에서 “예약 안내을”을 “예약 안내를”로 바로잡았습니다. 공통 디자인·방 요금·대표번호는 검토본과 동일합니다.
- **공식 HTTP 검수:** 페이지5개 + 버전 자산10개 + robots/sitemap2개, 총17개 파일 HTTP200 및 로컬 공개 파일 SHA256 일치. 5페이지 index,follow·각 canonical, robots Allow·5개 주소 sitemap, noindex 응답 헤더 없음. HTTP→HTTPS301 및 없는 주소404 확인.
- 실제 HTML Cache-Control은 no-cache, 버전 CSS/JS/사진은 max-age=14400입니다. 자산 버전 URL이 변경된 스타일을 이전 캐시와 분리합니다. 이미 열린 사용자 기기 화면까지 강제로 갱신했다고 주장하지 않습니다.
- **실제 브라우저 검수:** 공식 도메인 PC1440/모바일390에서5페이지 이동, 가로 넘침 없음·H1하나, 전체7개 방 사진 로딩/cover, 2·9·10번 여백 제거, C6전화/일반방네이버 경로, 사진 확대/Escape닫기, 주소 복사, 유튜브 재생 확인. 자체 페이지 검사 error/warn없음. 실제 iPhone 외부앱 전환은 사용자 확인 영역입니다.
- **실제 AI:** 자동차 질문→고객 주차 문구, 노래 질문→연습 용도(source ai); 빈방 질문→네이버 안내, 무관 질문→미확인 안내, 비밀번호 요청→미제공 안내를 HTTP200으로 확인했습니다. 모바일 화면에서도 주차 응답 표시 확인. 이 검수는 모든 질문의 정답을 보장하지 않습니다.
- 공식 브라우저 DOM의 기존 Cloudflare Web Analytics beacon 유지 확인. 추적 스크립트 중복 삽입 없음.
- 원본은 codex/smc-design-review에 저장하며 main 수정·병합, DNS/네임서버 변경, 고객 메시지 발송은 하지 않았습니다. 기존 Production d8c1be12 배포도 삭제하지 않았습니다.
- 납품용 공개 ZIP: C:/Users/WOOWON/AppData/Local/Temp/SMC-premium-production-20260919.zip. 최신 소스 ZIP과 수정 안내도 전용 작업 폴더 기준으로 갱신합니다. 실제 고객에게 파일/메시지를 발송한 것은 아닙니다.

### 남은 후속

- 네이버 서치어드바이저 등록 방법 안내는 기존 포함 범위입니다. content/site.json의 naverVerification은 비어 있고 고객 소유 확인·사이트맵 제출 완료는 아직 미확인입니다. 공개 소유 확인 태그가 전달되면 반영·재배포 후 제출을 지원합니다. 홈페이지 전달을 막는 조건이나 검색 노출 보장으로 설명하지 않습니다.
- 대표번호는 기존0507 유지, 신규070/010은 예약·공실 문의로 추가했습니다. 고객이 변경된 운영 정보를 전달하면 대표번호/2번방 악기 모델/요금만 확인해 갱신합니다. 현재 답변 대기를 이유로 공식 배포를 중단하지 않았습니다.

## 프리미엄 5페이지 + 고객 추가 요청 반영 · 2026-09-19 13:01 KST

이 항목이 아래 과거 단일 페이지/배포 대기 기록보다 우선합니다. 프리미엄 추가 12만 원 결제 완료, 알림톡 자동발송 제외에 합의했고 고객의 추가 수정 요청까지 구현했습니다.

### 실제 배포 상태

- 고객 계정 733b1c8faa19799bf480b1192f473635 / 기존 Pages smcguwol-review / **Preview premium-review**.
- 검토 주소: https://premium-review.smcguwol-review.pages.dev/
- 고정 배포: https://5308e2e1.smcguwol-review.pages.dev/ . ID **5308e2e1-a22d-47fd-9e97-728f8fdbf334**, API HTTP200, deploy/success, 2026-09-19 13:01:34 KST.
- 공식 도메인은 기존 Production **d8c1be12-6a7a-41bb-bb0e-25831454c1d9** 그대로입니다. 프리미엄은 아직 공식 반영하지 않았습니다.
- Chrome 기존 계정 로그인을 확인해 ZIP Direct Upload로 배포했습니다. MCP 파일 업로드 403/8000013을 인증 전체 실패로 판단하거나 재인증하지 않았습니다. Git 자동 배포는 미연결입니다.

### 반영 내용

- 홈 / 공간과 요금 / 예약 안내 / 이용 안내 / 오시는 길 5페이지와 공통 메뉴. 로고 PC78px, 모바일58px(매우 좁은 화면50px). 기존 녹색·아이보리/실사진/차분한 네이버 버튼 유지.
- 1·2·3·4·5·9·10번 사진 모두 선택 가능. 2·9·10번 프레임 채움, 세로 사진은 정사각 프레임과 개별 위치 조정. 원본 사진은 변경하지 않았고 확대 시 전체를 보여줍니다.
- “주차장을 이용할 수 있나요?”와 고객이 요청한 주차 안내 문구를 FAQ·오시는 길·상담에 반영했습니다.
- 성악·보컬·현악기·목금관악기·유튜브 등 개인 방송, 시설·방음 시공·Wi-Fi·환기·청소·CCTV·화장실/샤워실·교통·로데오 입지 소개.
- 블로그, 기존 인스타 프로필 및 고객 제공 게시물, 유튜브 직접 재생/외부 링크. 영상은 클릭 시 youtube-nocookie 플레이어를 불러옵니다.
- 기존 대표번호0507 유지, 예약·공실 문의에 070-7867-3442 / 010-8312-8122 추가. 대표번호 교체 여부 질문은 답변 대기이며 교체를 완료했다고 말하지 않습니다.
- 자료 충돌: 확인된 2번방 커즈와일 유지, “모든 피아노 야마하” 일괄 표현 제외. 모호한 “시간당3,500(30분가격)”은 기존 확인 요금3,500원/30분 유지. 고객에게 달라진 운영 정보가 있으면 이 두 항목만 확인하면 됩니다.

### 무료 상담과 통계

- Cloudflare Workers plans에서 **Free / $0 / Current plan**을 확인했습니다. 유료 전환하지 않았습니다.
- **Preview에만** Workers AI binding AI와 Text 변수 SMC_AI_ENABLED=true 저장. llama-3.2-3b-instruct는 질문의 주제만 분류하고 화면에는 확인된 매장 안내문만 반환합니다. 기본 질문은 AI 호출 없이 답합니다.
- 현재 무료량은 계정 전체10,000 neurons/일이며 특정 상담 건수를 보장하지 않습니다. 한도/장애에는 기본 FAQ·연락 경로를 제공합니다. 향후 Paid 전환 시 초과 비용 가능하므로 docs/ASSISTANT.md를 반드시 확인하세요.
- 출입 비밀번호, 예약자 인증/실시간 예약 조회, 카카오 자동발송 기능 없음. 질문은 애플리케이션 DB/로그에 저장하지 않으며 일부 질문은 Cloudflare AI가 처리합니다. 입력창에 개인정보 금지/AI 한계를 안내합니다.
- 기존 공식 도메인 Web Analytics의 브라우저 beacon과 관리자 통계 **최근24시간60 page views / 57 visits**를 확인했습니다. 기존 자동 연결을 유지했고 중복 추적 코드는 추가하지 않았습니다. 일반 HTTP HTML에 스크립트가 없다는 이유만으로 미작동으로 판단하지 않습니다.

### 검증 및 인수인계

- 5페이지 정적51개, 릴리스12시나리오, 도우미9개 검사. Preview 검사에는 --preview 플래그가 필요합니다.
- 로컬5페이지×320/390/768/1440 폭20개 조합, 방7개 사진·확대·예약 경로 검수. 최종 배포5페이지 HTTP200/로컬파일SHA256 일치/noindex/no-cache 확인.
- 실제 AI “자동차를 가져가려고 해요”→고객 주차 문구, “노래하는 공간인가요?”→새 연습 용도. “지금3번방 비었어요?”→네이버 안내, 무관 질문→모름, 비밀번호 요청→미제공 안내. 초기 빈방 질문 오분류와 “얼마나 걸려” 요금 오분류를 수정 후 재배포·재검증했습니다.
- 최종 브라우저: 키보드 방 선택, 기존 #room-grand-g3 링크→/rooms/ 해당방, 주소 복사, 모바일 C6 전화 경로, 유튜브 실제 재생 확인. 사용자 실제 iPhone Safari/ChatGPT 내 브라우저 검수는 별도입니다.
- 전용 작업 폴더 C:/Users/WOOWON/AppData/Local/Temp/smc-premium-20260919. 원본은 codex/smc-design-review. main·무관한 프로젝트·DNS·고객 메시지 변경 없음.
- README.md / START_HERE.html / docs/EDITING.md / docs/ASSISTANT.md / docs/PREMIUM_PLAN.md를 최신5페이지 구조로 갱신했습니다.

### 다음 단계

1. 위 Preview에서 고객 추가 내용/사진과 최종 문구를 검토합니다. 새로운 사실 확인 없이 요금·대표번호·악기 모델을 바꾸지 않습니다.
2. 공식 반영 시 Production에도 AI / SMC_AI_ENABLED=true를 설정하고 **node scripts/build.mjs**의 공개 public을 배포합니다. Preview ZIP을 Production에 올리지 않습니다. 무료 플랜 재확인 후 실제 AI·공식5페이지·검색 설정을 검수합니다.
3. 서치어드바이저 등록 안내는 기존 포함 범위입니다. 소유 확인/사이트맵 제출 완료는 미확인이고 검색 노출 보장을 하지 않습니다.

기록: 2026-09-18. 이 파일 상단의 최신 결과는 아래 과거 이력과 이전 연결 설명보다 우선합니다.

## 제공 범위 정정: 서치어드바이저 등록 안내는 기존 포함 항목 · 2026-09-18

- 사용자가 “내가 홍보·약속한 범위인가”라고 물었을 때, 판매 설명/개별 합의를 확인하지 않은 채 “추가로 제안한 작업”이라고 답한 것은 잘못입니다. 홈페이지가 등록 없이 작동하고 검색될 수 있다는 기술적 사실로 이미 약속한 제공 범위를 제외할 수 없습니다.
- 원문 근거는 기존 작업 **크몽 문의 답변 작성**(6aa10743-95f4-83e8-a3ee-3d6e8bacd250)입니다. 고객의 결제 전 확인 메시지(turn 1f42000b-8a1f-4043-b400-9d88c18aa951)는 18만 원 포함 항목에 **“네이버 서치어드바이저 등록 안내”**를 명시합니다. 같은 turn의 답변 초안도 title·description·heading·이미지 alt·sitemap.xml·robots.txt와 등록 안내가 포함된다고 확인합니다.
- 결제 요청서 문안(turn 3efa5465-95ae-4766-a082-f4895f5837e1)에도 **“title, description, heading 구조, 이미지 alt, sitemap.xml, robots.txt를 설정하고 네이버 서치어드바이저 등록 방법을 안내합니다.”**라고 명시되어 있습니다. 고객은 특정 키워드 상위 노출 보장이 아닌 지역·업종을 이해할 수 있는 기본 SEO를 요청했습니다. 이 근거는 저장된 대화 속 고객 전달 메시지와 작성된 결제 요청서이며, 이번에 크몽 주문관리의 실제 발송 내역을 별도로 조회한 것은 아닙니다.
- 현재 공개 판매글 https://kmong.com/gig/794437 에는 기본 제목/설명 메타태그·OG와 소스/수정 안내가 표시되지만, SMC의 개별 견적은 위 상세 합의를 기준으로 봅니다. 공개 판매글에 등록 안내가 생략됐다고 SMC의 합의에서 제외하지 않습니다.
- 따라서 **등록 방법 안내는 18만 원에 포함된 제공 항목**입니다. 고객 로그인/소유 확인 협조가 필요한 것과 무료 추가 서비스인 것은 다른 문제입니다. 고객 계정을 대신 소유하거나 로그인 정보 없이 등록 전체를 자동 대행한다는 약속, 검색 순위·노출 시점 보장은 원문에 없습니다.
- 진행 상태: 홈페이지 기본 검색 설정·사이트맵 배포 완료. 고객용 로그인→웹마스터 도구→공식 주소 등록→HTML 태그 전달→사이트 반영→소유 확인→사이트맵 제출의 안내 문구를 작성했습니다. 실제 고객에게 발송했는지/태그 회신은 아직 확인하지 못했고 계정 로그인·소유 확인·사이트맵 제출 완료도 미확인입니다. 안내와 등록 완료를 구분합니다.
- 다음 응답에서는 “임의로 더 해주는 일/약속 밖”이라고 설명하지 않습니다. 기존 안내 범위 안에서 계속 지원하고, 발급받은 공개 naver-site-verification 태그가 오면 홈페이지 반영·재배포 확인 후 고객의 소유 확인/사이트맵 제출을 안내합니다.
- 최초 범위 요약만 보고 작업하지 말고 이 고객 확인 원문과 개별 견적을 완료 기준으로 사용합니다. 이번 정정에서 고객 메시지, 주문 조건, main, 배포/DNS는 변경하지 않았습니다.

## 캐시 수정 공식 재배포·실제 검수 완료 · 2026-09-18 18:50 KST

- 사용자가 새 ZIP 업로드 완료를 알렸고, 고객 계정 733b1c8faa19799bf480b1192f473635 / smcguwol-review의 Pages API HTTP200에서 Production **d8c1be12-6a7a-41bb-bb0e-25831454c1d9**, **deploy/success**, 완료 **2026-09-18 18:42:50 KST**를 확인했습니다. canonical_deployment와 latest_deployment가 일치합니다. 공식 도메인의 status/validation/verification도 모두 active입니다.
- 공식 주소: https://xn--co-002iq89dzga40o12n.kr/ (= 근처연습실co.kr). 고정 배포: https://d8c1be12.smcguwol-review.pages.dev/ . 공개 원본은 검토 브랜치 4a814190ddf6afaf4d7c7df0b45acf37c43cbebd입니다. 아래 재배포 대기·006ffa04 운영 설명은 과거 이력입니다.
- 실제 공식 주소 제공 파일 14개(HTML·CSS·JS·사진/로고·robots·sitemap·404)가 모두 HTTP200 및 준비한 캐시 수정 public과 SHA256 일치합니다. HTML은 styles.css?v=a1409b8c3173 / app.js?v=5e7ca46f92db와 사진별 버전 URL을 참조합니다. HTTP→HTTPS301, 비교 페이지4개·없는 경로404, canonical·index,follow·robots Allow·sitemap 정상입니다.
- **실제 헤더와 설정을 구분:** HTML·sitemap·404는 Cache-Control:no-cache이나 CSS·JS·이미지·robots.txt 실제 응답은 max-age=14400입니다. _headers의 no-cache가 모든 정적 자산 응답에 그대로 적용됐다고 보고하지 않습니다. 변경된 CSS·JS·사진은 새 버전 URL로 제공되어 이전 URL의 브라우저 캐시와 분리됩니다.
- 이번 새 버전 URL의 모든 자산 응답에는 X-Robots-Tag noindex가 없습니다. 쿼리 없는 과거 room-1.jpg / room-5-c6.jpg / smc-guwol-logo.jpg에는 과거 noindex 헤더가 남고 room-3-upright.jpg에는 없습니다. 현재 HTML·확대·공유 이미지는 새 버전 URL을 사용하므로 이 오래된 경로를 참조하지 않습니다. 구 URL 캐시의 전 세계 제거 완료로 주장하지 않으며 캐시 갱신 API를 반복하지 않았습니다.
- 공식 사이트 앱 내 브라우저 390×844에서 작은 네이버 아이콘/짙은 하단 예약 영역, 7개 방 선택과 모든 사진 로딩, C6 전화 문의/나머지 네이버 예약 경로 전환, 2번방 사진 확대·닫기·초점 복귀, 펼친 요금표, 가로 넘침 없음 확인. 1440×1000에서 두 제목36px·행간48.6px, 예약 본문과 FAQ 시작선 x=637.9896px 일치, 가로 넘침 없음. 모바일 두 제목32px, 탭 error/warn 없음.
- 사용자 실제 iPhone의 ChatGPT 내부 브라우저와 Safari 캐시 재검수는 아직 별도입니다. 기존 창을 닫고 공식 링크를 다시 열어 두 화면을 비교하도록 안내합니다. 서버가 이미 열린 기기 화면을 강제로 갱신할 수는 없습니다.
- **고객에게 공식 주소를 전달할 수 있습니다.** 네이버 서치어드바이저는 관리 계정 답변·소유 확인·사이트맵 제출 대기이며 검색 등록/노출 완료가 아닙니다. 홈페이지 전달의 필수 선행 조건으로 안내하지 않습니다.
- 이번 작업은 읽기 전용 배포/공식 사이트 검수와 검토 브랜치 문서·PR 설명 갱신입니다. 홈페이지 코드/배포/DNS/main/고객 메시지/Drive 공유 권한은 변경하지 않았습니다.

## 앱 내부 브라우저의 이전 디자인 캐시 보완 · 2026-09-18 18:22 KST

- 사용자 iPhone 화면에서 ChatGPT 내부 브라우저는 흰색 테두리의 큰 네이버 버튼/연녹색 하단 예약 영역, Safari는 최신 작은 아이콘/짙은 하단 예약 영역을 표시했습니다. 서버의 공식 HTML과 CSS는 최신본이나 CSS·JS 응답이 동일 URL에 Cache-Control public,max-age=14400,must-revalidate(4시간)로 제공되고 있었습니다. 기기 캐시 자체를 읽은 것은 아니며, 브라우저별 이전 CSS 캐시가 가장 유력한 원인입니다. Safari만 지원하는 사이트로 판단하지 않습니다.
- scripts/build.mjs에서 CSS·JS·사진·로고 및 확대/공유 이미지 URL에 내용 기반 ?v= 식별자를 붙이도록 수정했습니다. publish 모드도 식별자 계산에 포함해 검토본과 공개본의 검색 응답 캐시를 분리합니다. _headers에는 Cache-Control:no-cache를 추가해 다음 요청에서 서버 재검증을 하게 합니다. 이미지 원본과 화면 디자인은 변경하지 않았습니다.
- 첫 공개 식별자: styles.css?v=a1409b8c3173, app.js?v=5e7ca46f92db. 기존과 같은 홈페이지 주소이며 canonical은 쿼리 없는 공식 루트를 유지합니다. 홈페이지 주소에 임의 쿼리만 붙여서는 하위 CSS 주소가 바뀌지 않으므로 이를 해결책으로 제시하지 않습니다.
- 빌드·정적22개·공개/편집12개 시나리오·비교검사·JS구문·diff 공백 검사 통과. 새 시나리오는 실제 파일 수정 시 URL 변경, 동일 빌드 URL 안정성, 공개/시안의 다른 캐시 키, 404의 CSS 버전 연결을 검증합니다.
- 앱 내 브라우저 localhost:8767에서 390×844와1440×1000 검수: 최신 네이버 버튼, 7개 사진 로딩, 모든 방 선택/하단 예약 경로, 세로 사진 확대/Escape/초점 복귀, 펼친 요금표, 가로 넘침 없음, PC 제목36px·본문 시작선637.9896px 일치, error/warn 없음. 실제 iPhone의 캐시를 재현·제거한 검수는 아니므로 재배포 후 사용자의 두 브라우저 확인이 필요합니다.
- **아직 공식 재배포 전입니다.** 기존 Production 006ffa04가 유지됩니다. 준비 ZIP은 C:/Users/WOOWON/AppData/Local/Temp/smc-production-cachefix-20260918.zip (15개 파일, 1,109,281바이트). 전용 작업 폴더는 C:/Users/WOOWON/AppData/Local/Temp/smc-cachefix-20260918입니다.
- 사용자 승인된 기존 비공개 Drive ZIP을 **SMC-정식배포-캐시수정-20260918.zip**으로 업데이트했습니다. 기존 파일 ID/다운로드 링크를 유지하고 소유자 전용 권한을 유지합니다. https://drive.google.com/file/d/17QO7tI7eL-Xi6wgT4Jls-m3qOz1vXsQ_/view?usp=drivesdk . 이미 다운로드한 이전 ZIP은 바뀌지 않으므로 새로 다운로드해야 합니다.
- 다음: 사용자가 이 ZIP을 기존 고객 smcguwol-review/Production에 업로드 → 새 배포 success 확인 → 공식 HTML의 버전 주소/Cache-Control, 각 참조 자산 HTTP200·바이트·noindex 없는지 확인 → ChatGPT 내부 브라우저 닫고 새로 열기/Safari 비교. 이미 열어 둔 페이지를 서버가 강제로 새로고침할 수는 없습니다. 기존 사진의 쿼리 없는 URL 캐시와 새 버전 URL 검수를 구분합니다.
- main 수정·병합, 고객 메시지, DNS 변경 없음. 네이버 서치어드바이저 관리 계정 답변 대기는 그대로 유지합니다.

## 검색 후속 작업 재확인 · 2026-09-18 18:09 KST

- 사용자가 고객 전달 전에 검색 후속 작업을 진행하라고 승인했습니다. 홈페이지의 HTTP200, index,follow, 공식 canonical, robots Allow, sitemap, 한국어 lang, 제목/설명, LocalBusiness(사업장명·전화·공식주소·연관 채널) 모두 정상입니다. naver-site-verification 메타태그는 아직 없습니다.
- 캐시 재확인 요청에서는 room-3-upright.jpg의 noindex가 없어졌지만 room-1.jpg, room-5-c6.jpg, smc-guwol-logo.jpg에는 남아 있었습니다. 일부 응답의 변화이므로 전 세계 캐시 해결로 단정하지 않습니다. 기존4개 URL 캐시 갱신 API를 다시 호출했으나 **10000: Authentication error**로 실패했습니다.
- 현재 브라우저 목록은 앱 내 브라우저만 제공됩니다. Cloudflare 고객 계정 관리 URL은 로그인 페이지로 이동했고 네이버 서치어드바이저도 로그아웃 상태입니다. 비밀번호·인증번호·세션·토큰은 요청하거나 추출하지 않았습니다.
- 네이버 서치어드바이저를 고객 계정/사용자 계정/기존 등록 계정 중 어느 것으로 관리할지 질문했고 답변 대기입니다. 계정을 임의 선택하거나 등록 완료로 보고하지 않습니다.
- [네이버 공식 안내](https://searchadvisor.naver.com/guide/faq-start-register)에 따르면 웹마스터도구 등록은 검색 노출의 필수 조건이 아닙니다. 현재 홈페이지를 고객에게 전달할 수 있으며, 도구 등록은 수집/색인 관리용 후속 작업입니다. 검색 등록 또는 노출 완료를 보장하지 않습니다.
- 모바일에서 기존 로그인으로 마무리할 최소 단계: Cloudflare의 **고객 도메인 근처연습실co.kr → Caching → Configuration → Purge Everything**. 캐시 사본만 갱신하는 절차이며 프로젝트/배포 파일 삭제가 아닙니다. [Cloudflare Pages 공식 안내](https://developers.cloudflare.com/pages/configuration/serving-pages/)의 Purging the cache 절차입니다. 실행 후 쿼리 없는 이미지 URL의 noindex 제거를 다시 검증해야 합니다.
- 네이버 계정 확정 후 [서치어드바이저](https://searchadvisor.naver.com/) 웹마스터 도구에 **https://xn--co-002iq89dzga40o12n.kr/** 등록 → 소유확인용 공개 HTML 태그/파일을 사이트에 반영 → 소유확인 → 요청/사이트맵 제출에 **https://xn--co-002iq89dzga40o12n.kr/sitemap.xml** 입력 → 웹페이지 수집 요청. 공개 소유확인 메타태그는 로그인 비밀번호/OTP와 구분하며 임의 값을 만들지 않습니다. 로그인과 실제 소유확인 수단 없이 완료할 수 없습니다.
- 이번 후속 확인에서는 홈페이지 코드/배포/main/DNS를 변경하지 않았으며, 위 상태만 검토 브랜치의 인수인계에 추가합니다.

## 공식 Production 배포 완료·실제 주소 검수 · 2026-09-18 18:00 KST

- 사용자가 정식 공개 ZIP을 기존 고객 Pages에 직접 업로드한 뒤 “배포했어”라고 알렸습니다. Pages API에서 Production **006ffa04-1c5b-48f2-8a98-ee0440b644e8**, **deploy/success**, 완료 시각 **2026-09-18 17:49:55 KST**를 확인했습니다. canonical_deployment와 latest_deployment가 이 배포를 가리킵니다.
- 고객 계정 **733b1c8faa19799bf480b1192f473635**, 프로젝트 **smcguwol-review**. 공식 주소 **https://xn--co-002iq89dzga40o12n.kr/** (= 근처연습실co.kr). Pages 도메인 status/validation/verification 모두 active입니다. 고정 배포는 https://006ffa04.smcguwol-review.pages.dev/ 입니다.
- 공식 HTTPS의 제공 파일 **14개 모두 HTTP 200·준비한 public과 SHA-256 일치**. HTTP→HTTPS 301. /design/, /design/a.html, /design/b.html, /design/c.html 및 없는 경로는 404입니다. 홈페이지의 HTML robots는 index,follow, 응답 noindex 없음, canonical·robots Allow·sitemap은 공식 주소와 일치합니다. 검색 허용과 실제 검색 결과 등록은 구분합니다.
- 앱 내 브라우저로 실제 공식 사이트 **1440×1000 / 390×844** 검수: 1·2·3·4·5·9·10번 사진 모두 로딩, 사진 contain·확대·닫기·Escape·초점 복귀 정상, 펼친 요금표 유지, 문서 가로 넘침 없음. PC 예약/이용 제목 36px·48.6px, 모바일 두 제목 32px로 일치. PC 예약 설명과 FAQ 본문 시작선은 모두 x=637.9896px. 요금표 아래 안내는 PC16px/모바일15px입니다.
- C6 홀은 tel:050713808122, 일반 방은 https://naver.me/FlJiVAwL 로 전환합니다. FAQ 주차 안내와 주소 복사 성공 상태, 공식 검수 탭 error/warn 없음 확인. 네이버 단축 링크가 실제 **SMC 인천 구월점**으로 연결되고 예약 탭에 7개 방이 노출되는 것도 확인했습니다. 예약 제출·통화·메시지 발송은 하지 않았습니다. 실제 iPhone/Safari 기기 검수와는 구분합니다.
- **남은 검색용 캐시 문제:** 공식 주소의 기존 이미지 room-1.jpg, room-3-upright.jpg, room-5-c6.jpg, smc-guwol-logo.jpg 응답에 과거 X-Robots-Tag noindex,nofollow,noarchive가 남아 있습니다. 파일 바이트는 새 public과 같고 화면 로딩은 정상입니다. room-1.jpg의 쿼리 없는 요청은 CF-Cache-Status REVALIDATED/과거 헤더, 새 쿼리 요청은 MISS/noindex 없음으로 캐시 차이를 확인했습니다. 이것을 HTML 검색 차단으로 보고하지 않습니다.
- zone **56abbbdbcaec366f81c9675a261b475f** GET은 `9109: Unauthorized to access requested resource`, 해당 4개 URL만 대상으로 한 POST purge_cache는 `10000: Authentication error`를 반환해 캐시 제거 성공을 확인하지 못했습니다. execute 도구가 예외 텍스트만 반환했으므로 HTTP 상태는 단정하지 않습니다. 계정 전체 인증 실패로 확대 해석하거나 토큰/재인증을 요청하지 않았습니다. 추후 정상 관리 권한의 고객 zone에서 해당 URL 캐시를 갱신하고 쿼리 없는 주소의 헤더를 재확인하세요.
- 모바일 ZIP 전달: 사용자 명시 승인 후 공개 홈페이지 파일 15개만 들어 있는 약1.1MB ZIP을 연결된 Google Drive에 **소유자 전용**으로 전달했습니다. 고객 공유 권한이나 메시지를 만들지 않았습니다. 공식 사이트 배포는 사용자가 완료했으므로 Chrome 연결/재업로드 대기 상태는 종료됐습니다.
- 배포 코드 원본은 검토 브랜치 **0d9640d29e1f94934c5bde0299488938c3d28d90**이며 이번 기록은 검토 브랜치/PR #2에 추가합니다. 이번 작업에서 main 수정·병합이나 DNS 변경은 없습니다. Direct Upload 프로젝트로 Git 자동 배포 미연결 상태입니다.
- **다음:** 공식 주소를 고객에게 전달할 수 있습니다. 사진 검색용 캐시 후속 확인 및 네이버 서치어드바이저 소유 확인·사이트맵 제출은 남아 있습니다. naverVerification은 아직 비어 있고, 검색 등록/노출 완료라고 보고하지 않습니다. 아래 “배포 전/Chrome 대기”는 과거 이력입니다.

## 최신본 공식 배포·검색 허용 승인 및 준비 · 2026-09-18 08:33 KST

- 사용자에게 최신본 공식 주소 반영과 검색 공개가 남았다고 설명한 뒤 사용자가 **“그래 진행하라”**고 승인했습니다. 이번 승인에 따라 content/site.json의 publish를 true로 변경했고 정식 공개용 파일을 빌드했습니다. 기존 publish:false 유지 지침은 이번 공식 공개 범위에서 대체됩니다. 코드 기록은 codex/smc-design-review를 사용하며 main 수정·병합은 수행하지 않았습니다.
- **아직 실제 Production 배포 전입니다.** 공개용 public에는 1·2·3·4·5·9·10번 사진, 최신 정렬/글씨 크기, 펼친 요금표가 포함됩니다. 검토 안내와 비교 페이지를 제외하고 HTML index,follow, noindex 응답 헤더 제거, 공식 Punycode canonical/OG/LocalBusiness/sitemap, robots Allow를 생성했습니다.
- 정적 22개 및 공개/편집 시나리오 11개, JS 구문 및 diff 공백 검사를 통과했습니다. npm이 현재 PATH에 없어 package.json의 동일 Node 스크립트를 직접 실행했습니다. 빌드의 줄 끝 공백/개행 정규화도 보완했습니다.
- 앱 내 브라우저 로컬 1440×1000 및 390×844에서 7개 방 목록, 세로 사진 contain 로딩, 열린 요금표, 가로 넘침 없음, 검토 안내 제거와 공식 canonical/검색 허용을 확인했습니다. 실제 배포 후의 화면 검수와 구분합니다.
- 배포 장애: Cloudflare 프로젝트 조회는 HTTP 200이나 /pages/assets/check-missing 업로드 자산 확인은 **HTTP 403, code 8000013, Authorization failed**입니다. 이를 계정 전체 인증 실패로 판단하지 않습니다. 토큰 조회·추출·재인증은 하지 않았습니다.
- 현재 브라우저 목록에는 앱 내 브라우저만 있고 이전 Chrome 연결은 없습니다. 앱 내 Cloudflare는 로그인 화면입니다. 사용자에게 기존 로그인된 Chrome의 Codex 확장을 이 대화에 연결해 달라고 요청한 상태입니다. 연결되면 기존 고객 smcguwol-review의 **Production**에 준비한 public만 업로드합니다. 이번 승인으로 Production 배포를 진행할 수 있으므로 재승인 요구는 불필요합니다.
- 전용 작업 폴더: C:/Users/WOOWON/AppData/Local/Temp/smc-launch-20260918. 업로드 ZIP: C:/Users/WOOWON/AppData/Local/Temp/smc-production-20260918.zip. Windows 업로드는 슬래시 경로를 사용합니다. 전체 저장소는 업로드하지 않습니다.
- 마지막 확인된 실제 Production은 여전히 0f68846e, 최신 검토 Preview는 8fc2c61e입니다. 공식 HTTPS/네임서버 연결은 아래 07:42 검증대로 정상입니다. 실제 공개 배포 후 이 상단 기록을 배포 ID와 검수 결과로 갱신해야 합니다.
- 남은 작업: 업로드 → API Production/deploy success 확인 → 공식 루트 및 자산 HTTP 200/파일 일치, noindex 제거, robots/sitemap/canonical, 비교 경로 404 확인 → 공식 PC·모바일 및 예약/사진 검수. 네이버 서치어드바이저 소유 확인/사이트맵 제출은 별도이며 현재 naverVerification은 비어 있습니다. 비밀번호나 비밀 인증정보를 요청하지 않습니다.

## 공식 도메인 연결 완료 확인 · 2026-09-18 07:42 KST

- 사용자가 고객의 도메인/네임서버 작업 완료 연락을 전달했습니다. 기존 승인 범위에서 읽기 전용으로 실제 상태를 확인했습니다.
- 정확한 공식 도메인: **근처연습실co.kr** (한글 뒤에 점 없이 co), ASCII: **xn--co-002iq89dzga40o12n.kr**.
- 1.1.1.1 및 8.8.8.8 공개 DNS 모두 NS를 **annabel.ns.cloudflare.com**, **roman.ns.cloudflare.com**으로 반환했습니다.
- 고객 계정 733b1c8faa19799bf480b1192f473635의 Pages smcguwol-review domains API HTTP 200: 도메인 status, validation_data.status, verification_data.status 모두 **active**. 도메인 ID 709539f1-e849-47a4-85d6-39cee1fb2da8, zone_tag 56abbbdbcaec366f81c9675a261b475f.
- https://xn--co-002iq89dzga40o12n.kr/ 실제 HTTPS 응답 **200** (인증서 검증 우회 없음). HTTP 접속은 **301**로 동일 HTTPS 주소로 이동합니다. 앱 내 브라우저에서도 홈페이지 본문과 실제 사진을 확인했습니다. 이번에는 Chrome 연결이 없어 앱 내 브라우저를 사용했습니다.
- **공식 주소의 콘텐츠는 아직 이전 Production 0f68846e**입니다. 공식 루트와 smcguwol-review.pages.dev 루트 HTML SHA256이 32f623d45a3cd5a3b6a74526da1604e8c1552cb3588901b01ebc010d7ffdb08b로 일치합니다. 실제 화면의 방 선택은 1·3·5이며 요금표는 접혀 있습니다.
- 최신 7개 방 사진/요금표 글씨 개선본은 **Preview 8fc2c61e**, https://home-review.smcguwol-review.pages.dev/ 에 있습니다. 해당 HTML SHA256은 80dab214cd2d1311cf86cca1a661e6d199ab169f15da5be43504e0b3aeeb2733으로 공식 주소와 다릅니다.
- 공식 주소와 Preview 모두 X-Robots-Tag **noindex, nofollow, noarchive**입니다. 도메인 연결 성공과 최종 공개/검색 허용 완료를 구분해야 합니다. 이번 확인에서는 Production 배포, main 수정/병합, publish true 전환, DNS 변경을 수행하지 않았습니다.
- 다음 단계: 최신 검토본의 공식 주소 반영 및 검색 공개 범위를 확정한 뒤 최종 공개 절차 진행. 기존 main 변경 금지와 publish false 제한은 별도 해제 전까지 유지합니다.
- 참고: zones 목록 API는 여전히 HTTP 200/빈 결과였습니다. Pages active 및 공개 DNS/HTTPS 성공이 확인되어 빈 목록을 도메인 미생성·인증 실패로 판단하지 않습니다.

## 모든 방 사진과 요금 안내 가독성 · 2026-09-18 00:08 KST

- 사용자 요청에 따라 네이버에 등록된 **1·2·3·4·5·9·10번, 총 7개 방**을 모두 홈페이지에서 선택·확대할 수 있도록 바꿨습니다. 2·4·9·10번의 실제 대표 사진을 네이버 예약 상세에서 확보했고 원본 표시 파일 바이트를 수정하지 않았습니다. 방당 대표 사진 1장씩이며 네이버의 모든 각도/설비 사진 전체 복제는 아닙니다. 출처·치수는 ASSETS.md에 기록했습니다.
- 기존의 1·3·5번 고정 HTML을 사진별 방 정보에서 선택 항목과 상세를 생성하는 구조로 바꿨습니다. 표시 순서는 1·2·3·4·5·9·10입니다. PC는 간결한 세로 목록, 모바일은 일곱 방이 모두 보이는 3열 선택칸입니다. 가격은 요금표와 동일한 데이터를 사용하고 선택한 방 설명에도 표시합니다. C6 홀은 전화 문의, 나머지는 기존 네이버 예약 링크입니다.
- 9번은 네이버 상세의 30분 2,500원·최소 1시간·월 계약 전 임시 운영을 명시해 사진과 요금표에 포함했습니다. 운영 지속이나 특정 시간의 공실을 보장하지 않습니다. 기존 고객 확인 주차 불가 안내는 유지했습니다.
- 전체 요금표는 처음부터 펼쳐집니다. 아래 이용 안내·임시 운영 안내·예약 경로 글씨를 PC **16px**, 모바일 **15px**로 키웠습니다. 앞서 통일한 예약/이용 제목 크기와 PC 설명 시작선을 유지합니다.
- 첫 배포 7d3c3d61 검수에서 세로 사진이 기존 CSS grid의 이미지 높이 계산으로 잘리는 문제를 발견했습니다. 이미지 박스를 사진 틀에 고정하고 contain으로 원래 비율 전체가 보이도록 수정한 뒤 재배포했습니다. 390px에서 2번 사진 요소와 틀의 높이가 모두 약 243px이며 실제 전체 사진을 확인했습니다. 로컬 PC도 두 높이 590px 일치합니다.
- 빌드·정적 22개·비교 4페이지·공개/편집 11개 시나리오·JS 구문·diff 공백 검사 통과. 새 시나리오는 모든 등록 방의 사진/예약 경로 연결과 중복 방 식별자 거부입니다. Chrome 로컬 320/390/768/1024/1440/1920px에서 넘침 없음, 제목 크기 일치, PC 설명 열 정렬을 확인했습니다. 루트 글자 200% 검수 페이지 320/390/768/1440px도 넘침이 없습니다. 실제 휴대폰·Safari·브라우저 자체 확대 검사는 별도입니다.
- 고객 Pages 목록 HTTP 200 후 기존 smcguwol-review의 **Preview/home-review**에 public 파일 22개 업로드. 최종 ID **8fc2c61e-c95c-4259-a264-25434e666888**, deploy/success, 완료 시각 00:06 KST. [최신 검토본](https://home-review.smcguwol-review.pages.dev/#rooms) · [고정 배포](https://8fc2c61e.smcguwol-review.pages.dev/).
- 배포 파일 21개 HTTP 200·로컬 SHA-256 일치, noindex 유지, 없는 경로 404. 실제 배포에서 7개 사진 로딩, 390px C6 전화/일반 방 네이버 전환, 새 세로 사진 확대/Escape, 열린 요금표, 16/15px 안내 글씨를 확인했습니다. 검수 탭 error/warn 로그 없음. 최종 CSS 수정 후 실제 배포의 세로 사진 비율도 다시 확인했습니다.
- Windows 업로드에서는 역슬래시 경로가 0바이트 항목으로 잘못 해석돼 배포 전 임시 항목을 제거하고 **C:/Users/...** 경로로 해결했습니다. 앞으로 파일 업로드 경로는 슬래시를 사용하세요. 초대·인증·비밀 토큰을 요청하지 않았습니다.
- 이번 작업은 codex/smc-design-review와 기존 PR #2에 기록합니다. main·Production 0f68846e·publish:false·도메인/DNS는 변경하지 않았습니다. 공식 도메인 상태는 이번 작업에서 다시 조회하지 않았습니다. 정식 공개 마무리의 남은 단계는 고객 답변 후 공식 HTTPS 확인, 최신 검토 수정본의 운영 반영, 검색 설정 검증입니다.

## 예약·이용 안내 정렬과 방 목록 설명 · 2026-09-17 23:36 KST

- 사용자 PC 화면 피드백에 따라 예약 방법과 이용 안내의 제목 크기, 본문 시작선을 통일했습니다. 기존 제목은 28px/42px였고 두 영역의 열 비율과 간격이 달랐습니다. 이제 두 영역이 동일한 열 정의와 간격을 사용하며, 1440px PC에서 두 제목은 36px·줄 높이 48.6px입니다. 예약 단계 번호는 본문 왼쪽 여백에 두어 예약 설명·전화 안내·FAQ 질문·답변의 시작선도 모두 같습니다.
- 1·3·5번은 예약 가능한 전체 방 목록이 아니라 확보한 세 장의 실제 사진을 보여주는 선택 항목이었습니다. 23:28 고객 네이버 플레이스의 예약 탭을 직접 열어 **1·2·3·4·5·9·10번**을 확인했습니다. 9번에는 월 계약 전 임시 운영 안내가 현재도 있으며, 5번 홀은 전화 문의 안내입니다. 특정 시간의 공실 확인이나 예약 제출은 하지 않았습니다.
- 홈페이지 갤러리를 ‘공간 사진’으로 명확히 표시하고 1·3·5번 사진 안내 및 ‘전체 방·요금 보기’ 링크를 추가했습니다. 기존 전체 요금표를 처음부터 펼쳐 1·2·3·4·5·10번과 개인룸을 바로 볼 수 있습니다. 임시 운영 공간은 네이버에서 확인하도록 링크를 추가했고, 고객 확인 요금이나 사진을 임의로 바꾸지 않았습니다. 근거는 CONTENT_SOURCES.md 상단에 기록했습니다.
- build·정적 22개·비교 4페이지·공개 시나리오 9개·JS 구문·diff 공백 검사 통과. 로컬 Chrome 320/390/768/1024/1440/1920px에서 제목 크기 일치와 가로 넘침 없음을 확인했습니다. 768px 이상에서 두 설명 열의 시작선도 동일합니다. 루트 글자 200% 검수 페이지 320/390/768/1440px에서도 넘침이 없습니다. 실제 기기 및 브라우저 자체 확대 검사와는 구분합니다.
- 기존 고객 프로젝트 목록 HTTP 200 후 `smcguwol-review` Preview/home-review에 public 파일 18개 배포. ID **`d439fe98-bceb-4448-9a77-2ccaadc4f6b5`**, **deploy/success**. [최신 검토본](https://home-review.smcguwol-review.pages.dev/#booking-guide-title) · [고정 배포](https://d439fe98.smcguwol-review.pages.dev/).
- 실제 배포 1440px에서 두 제목 36px, 네 가지 본문 시작 위치 637.99px로 일치함을 확인했습니다. 390px에서 전체 방 이동·기본 펼침 요금표·가로 넘침 없음 확인. 제공 파일 17개 HTTP 200 및 로컬 SHA-256 일치, noindex 유지, 없는 경로 404, 최종 탭 error/warn 없음.
- 코드는 `codex/smc-design-review` 및 기존 PR #2에 저장합니다. 이번에는 main·Production `0f68846e`·publish:false·도메인/DNS를 변경하지 않았습니다. 도메인 활성화 상태는 이번 작업에서 다시 진단하지 않았으며, 아래 22:44 기록은 그 당시 결과입니다.

## 전체 재점검과 큰 글씨 대응 · 2026-09-17 23:10 KST

- 고객의 LETO 변경 답변을 기다리는 동안 홈페이지를 재점검했습니다. 원격 검토 브랜치 `29ba266`에서 시작했으며, 다른 프로젝트 파일은 읽거나 수정하지 않았습니다.
- 로컬 검수 페이지에서 루트 글자 크기를 32px로 키웠을 때 모바일 예약 안내가 503px까지 넘치고, 하단 예약 바는 약 173px인데 본문 여백은 76px인 문제를 재현했습니다. 예약 안내를 공간이 부족하면 줄바꿈하도록 바꾸고, ResizeObserver로 예약 바의 실제 높이만큼 본문 여백을 확보했습니다. 한국어 단어가 불필요하게 잘리지 않도록 줄바꿈도 보완했습니다.
- 수정 후 320/390/768/1440px의 일반 화면 및 루트 글자 200% 검수 페이지에서 문서 가로 넘침이 없었습니다. 확대된 320px 화면의 푸터 끝 567.18px, 예약 바 시작 567.33px로 마지막 연락 링크가 가리지 않는 것을 화면과 DOM으로 확인했습니다. 이 검사는 Chrome 브라우저 자체 200% 배율이나 실제 휴대폰의 글자 확대 검사를 대신하지 않습니다.
- 로컬 Chrome에서 방 선택, 방향키, C6 전화/일반 방 네이버 전환, 요금표, 사진 확대/Escape/초점 복귀, FAQ 주차 안내, 주소 복사를 확인했습니다. PC 오시는 길 세 행은 제목과 본문의 시작 열이 일치합니다. 빌드·정적 22개·비교 4페이지·공개 시나리오 9개·JS 구문·diff 공백 검사 통과.
- 고객 Pages 목록 HTTP 200 확인 후 기존 `smcguwol-review`의 Preview/home-review에 public 파일 18개를 업로드했습니다. 배포 ID **`6898d2bd-9b5e-4981-ba66-f801966a388a`**, **deploy/success**. [최신 검토본](https://home-review.smcguwol-review.pages.dev/) · [고정 배포](https://6898d2bd.smcguwol-review.pages.dev/).
- 실제 배포 320/390/768/1440px의 문서 가로 넘침 없음, C6 전화/네이버 복원, 요금표 열림을 확인했습니다. 390px 예약 안내의 두 링크 시작 위치는 동일한 127.5px이며 실제 화면을 확인했습니다. 제공 파일 17개 HTTP 200·SHA-256 일치, noindex 유지, 없는 경로 404, 최종 검수 탭 error/warn 로그 없음.
- [전체 점검 기록](QUALITY_REVIEW_2026-09-17.md)에 결과와 남은 개선 사항을 정리했습니다. 1,000px 주 사진의 PC 선명도와 399,065바이트 로고는 개선 후보이며 원본을 변경하지 않았습니다. 외부 업체의 주차·전화·임시 방 안내 차이는 19:41 점검 기록을 유지하며 고객 정보는 임의로 수정하지 않습니다.
- 이번 작업은 검토 브랜치/Preview 보완입니다. Production `0f68846e`, main, publish:false, 도메인/DNS는 변경하지 않았습니다. 고객의 네임서버 변경 답변 이후 공식 도메인 HTTPS 검증 및 최신 수정본의 운영 반영이 남습니다. DEPLOYMENT.md의 오래된 연결 상태 설명도 바로잡았습니다.

## 공식 도메인 연결 준비 · 2026-09-17 22:44 KST

- 사용자가 “처음의 도메인·DNS·네임서버 변경 금지를 해제하고, 고객 계정에서 근처연습실co.kr의 무료 도메인 연결과 필요한 DNS·네임서버 설정을 승인한다”고 명시했습니다. 이전 도메인 변경 금지는 해제됐습니다.
- 고객 계정 구성원 조회 HTTP 200에서 기존 Workers Platform Admin 외 Administrator 추가를 확인했습니다. 플러그인의 zone 생성은 여전히 `Requires permission "com.cloudflare.api.account.zone.create" to create zones for the selected account`를 반환했습니다. 그러나 동일 고객 계정의 Chrome 관리 화면에서는 도메인 추가가 성공했습니다. 플러그인의 zone 목록은 추가 뒤에도 HTTP 200 빈 목록이어서 실제 도메인 부재로 해석하면 안 됩니다. 재초대·재인증은 요청하지 않았습니다.
- 고객 계정에 `근처연습실co.kr`(`xn--co-002iq89dzga40o12n.kr`)를 **Free / $0, Full DNS**로 추가했습니다. 기존 robots.txt를 Cloudflare 설정으로 덧붙이지 않도록 신규 설정의 Bot Preference Sync는 껐습니다. DNS 자동 스캔은 0개였고 기존 레코드를 삭제하지 않았습니다.
- 실제 발급된 네임서버는 **`annabel.ns.cloudflare.com`**, **`roman.ns.cloudflare.com`**입니다. 관리 화면의 네임서버 안내에서 직접 확인했습니다. 현재 공개 NS는 여전히 `selene.ns.leto.kr`, `nyx.ns.leto.kr`입니다.
- Pages `smcguwol-review`에 위 Punycode 도메인을 추가했습니다(HTTP 200). 도메인 ID `709539f1-e849-47a4-85d6-39cee1fb2da8`. 이어 고객 zone에 **CNAME @ → smcguwol-review.pages.dev, Proxied, TTL Auto**를 저장하고 실제 DNS 목록의 1개 레코드를 확인했습니다.
- 최종 Pages 도메인 조회는 HTTP 200, domain / verification / validation 모두 **pending**입니다. zone 관리 화면도 pending입니다. 공식 HTTPS 완료·네임서버 전환·검색 공개로 보고하지 않습니다.
- 공개 DNS 점검: apex A/AAAA/MX/TXT/CAA 및 www A/AAAA/CNAME은 ENODATA, Google DNS의 DS 응답은 Status 0 / Answer null. 공개 조회와 스캔은 사용자 정의 하위 도메인 전체 검사를 대신하지 않습니다. 고객은 기존 홈페이지·이메일 미사용을 앞서 확인했습니다.

### 다음 단계

1. 고객의 LETO 도메인 관리 화면에서 기존 두 네임서버를 위 Cloudflare 두 값으로 교체하고 저장합니다. 현재 연결된 Chrome에 LETO 관리 탭이 없어 이 단계는 실행하지 않았습니다. 고객에게는 비밀번호나 인증코드를 요청하지 않고 실제 네임서버 값과 변경 안내만 전달할 문안을 제공합니다. 고객 메시지를 직접 보내지 않았습니다.
2. 변경 완료 답변 후 공개 NS 전파, Cloudflare zone 활성화, Pages custom domain active 및 공식 주소의 HTTPS를 확인합니다. 아직 사용하지 않는 www는 추가하지 않았습니다.
3. 최근 N 버튼·모바일 예약 안내·PC 오시는 길 수정은 여전히 검토 브랜치/Preview의 `9e368593`에 있습니다. 기존 Production은 `0f68846e`이며 이번에는 배포·main·publish:false를 변경하지 않았습니다. 공식 오픈 마무리 시 최근 수정본의 운영 반영과 검색 설정 검증이 남습니다. Git 자동 배포도 별도 미완료입니다.

## PC 오시는 길 안내 정렬 · 2026-09-17 22:22 KST

- 사용자가 PC에서 지하철·운영 시간·주차 안내가 삐뚤어 보인다고 피드백했습니다. 기존의 좁은 2열과 강제 줄바꿈 때문에 주차 문장의 ‘또는’이 따로 떨어지고 정보의 높이가 불균형했습니다.
- 안내를 지하철·운영 시간·주차의 세 행으로 정리하고 PC에서는 제목과 본문의 시작 열을 통일했습니다. 연속 문장의 강제 줄바꿈을 없애고 각 행의 여백·구분선 및 전화번호/화살표 수직 정렬을 맞췄습니다. 모바일에서는 제목 위·본문 아래 구조와 20px 왼쪽 여백을 유지합니다. 내용과 전화·지도 링크는 그대로입니다.
- `node scripts/build.mjs`, 정적 검사 22개, `git diff --check` 통과. 로컬 Chrome 320/390/768/1024/1440px에서 가로 넘침 없음과 정렬을 확인했으며, 320/1440px는 화면도 직접 확인했습니다.
- 고객 계정 Pages 목록 HTTP 200 확인 후 기존 `smcguwol-review`의 **Preview/home-review**에 public 파일 18개를 업로드했습니다. 배포 ID `9e368593-3a8c-4bef-84f4-7ff260284247`, deploy/success. [최신 검토본의 오시는 길](https://home-review.smcguwol-review.pages.dev/#visit) · [고정 배포](https://9e368593.smcguwol-review.pages.dev/#visit).
- 실제 배포 Chrome 2560px와 390px에서 세 행의 제목·본문 정렬, 자연스러운 줄바꿈 및 가로 넘침 없음을 확인했습니다. 제공 파일 17개 HTTP 200·로컬 SHA-256 일치, noindex 및 없는 경로 404 확인. 실제 iPhone/Safari 검수로 확대하지 않습니다.
- 코드는 `codex/smc-design-review` 및 PR #2에 기록합니다. main·Production·publish:false·도메인/DNS·자동 배포 설정은 변경하지 않았습니다. 고객에게 Cloudflare 권한 변경을 요청했다는 사용자 답변은 받았으나 실제 권한 변경 완료는 아직 확인하지 않았습니다.

## 모바일 예약 안내 정렬 · 2026-09-17 19:56 KST

- 사용자가 iPhone 화면에서 네이버 관련 요소의 중심이 맞지 않는다고 피드백했습니다. 첨부 주소는 기존 Production 루트이며 흰/연녹색 박스가 있는 이전 버전입니다. 최신 검토본에도 남아 있던 요금표 아래 문장/inline-flex 아이콘의 기준선 차이와 전화 링크의 어색한 줄바꿈을 수정했습니다.
- 일반 연습실과 C6 홀·개인룸의 예약 경로를 두 묶음으로 나눴습니다. 모바일에서는 방 유형과 링크를 두 줄의 동일 열에 맞추고 아이콘·글자를 수직 중앙 정렬했습니다. PC에서는 두 묶음을 한 줄로 유지하며, 링크의 터치 높이는 44px입니다. 기존 예약 URL·전화번호·N 원본 이미지는 유지했습니다.
- Chrome 로컬 320/390/1440px에서 잘림·가로 넘침 없음, 모바일 아이콘/링크 글자 중심 차이 0px, 안내 왼쪽 여백 20px, 하단 N/두 줄 글자 묶음 중심 일치를 확인했습니다. 빌드·정적 22개·공백 검사 통과. 실제 iPhone/Safari에서 재확인한 결과로 확대하지 않습니다.
- 기존 고객 Pages 목록 HTTP 200 확인 후 같은 프로젝트에 Preview/home-review로 배포했습니다. 배포 ID `d1fd5dc0-5992-4b42-8031-18e8e83e9e65`, deploy/success. [최신 검토 주소](https://home-review.smcguwol-review.pages.dev/) · [고정 배포](https://d1fd5dc0.smcguwol-review.pages.dev/).
- 실제 배포 390px 화면에서 두 줄 정렬과 N/글자 중심 차이 0px를 확인했습니다. 제공 파일 17개 HTTP 200·로컬 SHA-256 일치, noindex 및 없는 경로 404 확인. 운영 루트는 `0f68846e` 그대로이며 이번에는 Production 업로드를 시도하지 않았습니다. main·publish:false·도메인/DNS·자동 배포 설정은 변경하지 않았습니다.

## 전체 완성도 점검 · 2026-09-17 19:41 KST

- [전체 점검 기록](QUALITY_REVIEW_2026-09-17.md)을 추가했습니다. 대상은 `5e63ac2` 코드와 기존 `90394b2e` / home-review 배포입니다. 화면 코드·운영 배포는 변경하지 않았습니다.
- 빌드·정적 22개·비교 4페이지·공개/편집 시나리오 9개·JS 구문 검사 통과. Chrome 320/390/768/1440px, 방 선택·방향키·사진 확대/Escape/초점 복귀·요금표·FAQ·주소 복사를 확인했습니다. 배포 17개 파일 HTTP 200 및 SHA-256 일치, noindex와 404 확인. 본 홈페이지 탭의 조회 시점 error/warn 로그 없음.
- 로컬 동일 public에 스크립트 차단 CSP를 적용해 3개 방 안내 유지, 요금표 열림과 사진 원본 링크를 확인했습니다. 실제 기기/Safari, 화면 읽기 프로그램, 200% 확대는 아직 완료로 보지 않습니다.
- 네이버 예약·카카오맵·카카오톡·블로그 목적지 확인. 인스타그램은 해당 업체 계정 제목 확인 후 로그인/가입 화면으로 게시물 전체 열람은 미검증.
- 공개 전 운영 확인: 네이버 ROOM 4의 주차/쿠폰 문구와 홈페이지 주차 불가 안내 차이, 카카오맵 전화번호 차이, 네이버 임시 Room 9가 홈페이지 요금표에 없는 점. 고객 확정 정보를 임의로 바꾸지 않았습니다.
- 이미지 개선: 1,000px 주 사진의 PC 선명도 한계와 399KB 로고의 과도한 전송 크기. 고해상도 실사진과 원본 보존형 로고 배포본 최적화를 권장합니다. 공식 도메인·검색 공개·Git 자동 배포는 기존 미완료 상태이며 이번에 재조회하거나 변경하지 않았습니다.

## 최신 변경 · 2026-09-17 19:13 KST · 네이버 버튼의 시각적 강조 완화

- 사용자가 N 아이콘은 알아보이지만 버튼이 주변에서 너무 튄다고 피드백했습니다. CSS에서 흰 박스·밝은 녹색 테두리·연녹색 큰 배경을 제거하고 기존 사이트의 사진·크림색·짙은 녹색에 맞췄습니다. 공식 N 원본 색상/형태는 유지하고 표시 크기만 줄였습니다.
- 상단은 투명 배경과 기존 흰 글자, 모바일 아이콘 24px. 본문 예약 링크는 26px N과 얇은 밑줄. 모바일 하단은 기존 forest 배경과 28px N, 기존 수준의 글자 굵기로 구성했습니다. 링크·예약 동작·나머지 레이아웃은 변경하지 않았습니다.
- 빌드·정적 검사 22개·diff 공백 검사 통과. Chrome 로컬 320px·390px·1440px에서 가로 넘침/버튼 잘림 없음, C6 전화 선택 시 N 숨김과 일반 방 복원 확인. 배포된 390px 화면에서 투명 상단 및 짙은 녹색 하단, 실제 아이콘 크기를 확인했습니다.
- **현재 개선안은 [검토용 홈페이지](https://home-review.smcguwol-review.pages.dev/)에 반영했습니다.** [고정 배포](https://90394b2e.smcguwol-review.pages.dev/), 배포 ID `90394b2e-298b-4eb6-8923-173c07da350d`, preview/home-review, deploy/success. 제공 파일 17개 HTTP 200 및 로컬 SHA-256 일치, 없는 주소 HTTP 404 확인.
- Production 업로드는 자동 승인 검토가 기존 Preview 배포 범위를 근거로 차단했습니다. Preview로 전환해 배포했으며 운영 루트 `smcguwol-review.pages.dev`는 이전 `0f68846e` 버전 그대로입니다. 개선된 화면 링크와 이전 운영 링크를 혼동하지 마세요. 코드는 기존 `codex/smc-design-review` 및 PR #2에 기록하며 main에는 병합하지 않습니다.
- publish:false 및 도메인/Git 자동 배포 미완료 상태 유지. 무관한 프로젝트 파일은 변경하지 않았습니다.

## 최신 변경 · 2026-09-17 18:59 KST · 네이버 예약 N 아이콘

- 사용자 요청으로 통합 홈페이지의 상단·일반 방 소개·예약 안내·모바일 하단 예약 버튼에 네이버 공식 N 단독 아이콘을 적용했습니다. 버튼은 녹색 테두리·연녹색 배경과 어두운 글자로 구성했습니다. 기존 네이버 예약 주소는 유지합니다.
- 아이콘은 네이버 개발자센터 제공 PNG 원본을 수정 없이 CSS data URI에 포함했습니다. 출처는 ASSETS.md에 기록했습니다. 로고를 글자 N으로 대신 그리거나 새 로그인 기능을 추가하지 않았습니다.
- 모바일에서 C6 홀을 선택하면 N 로고와 네이버 스타일이 사라지고 기존 전화 문의로 전환됩니다. 일반 방으로 돌아오면 아이콘과 네이버 링크가 복원됩니다.
- 빌드·정적 검사 22개·공개/편집 시나리오 9개·JavaScript 구문·diff 공백 검사를 통과했습니다. Chrome 로컬 320px·1440px에서 버튼 잘림/가로 넘침 없음과 전화/네이버 전환을 확인했습니다. 로컬 콘솔에는 비동기 메시지 채널 오류 3건이 기록됐으며 버튼 동작은 정상 확인했습니다. 이를 오류 로그 없음으로 표현하지 않습니다.
- 고객 기존 Pages의 Production 직접 업로드 성공: `0f68846e-0ffa-4ee3-8e48-59746a10bb98`. [현재 홈페이지](https://smcguwol-review.pages.dev/) · [이번 고정 배포](https://0f68846e.smcguwol-review.pages.dev/). 제공 파일 17개 HTTP 200 및 로컬 빌드 SHA-256 일치, 없는 주소 HTTP 404를 확인했습니다. 실제 운영 주소의 390px 모바일 화면에서 N 아이콘 표시와 기존 예약 링크를 확인했습니다.
- publish:false 유지. 아래 도메인 권한과 Git 자동 배포 연결의 미완료 상태는 그대로이며 이번 변경은 예약 버튼 표현만 대상입니다. 과거 A/B/C 비교 페이지는 수정하지 않았습니다.
- 코드 기록은 `codex/smc-design-review` 브랜치를 사용합니다. main 기준 tree 생성은 자동 승인 검토가 이전 main 직접 수정 제한과 충돌한다며 차단하여, 기존 검토 브랜치의 실제 head/tree를 기준으로 저장했습니다. 이번 변경은 main에 병합하지 않았습니다. 현재 직접 업로드한 Pages 배포에는 N 버튼이 반영됐으며 향후 Git 자동 배포 전 검토 브랜치 변경 반영이 필요합니다.

## 최신 결과 · 2026-09-17 17:28 KST · 승인 후 main 병합 및 운영 배포

- 사용자가 GitHub 연결 권한 화면 확인과 정식 공개(main 병합·고객 도메인/DNS/네임서버 연결·검색 공개)를 승인했습니다. 아래 과거 이력의 승인 대기 및 해당 금지 항목은 이번 승인으로 대체됩니다. 유료 서비스·다른 계정/호스팅·고객 메시지·비밀 자격증명 취급은 계속 제외합니다.
- [PR #1](https://github.com/smcguwol-maker/smcguwol/pull/1)을 검토 완료 상태로 전환한 뒤 병합했습니다. main 병합 커밋은 `d29f425cc779fcdc19c9fc54939226ebf05fe2ff`입니다.
- 고객의 기존 `smcguwol-review` 프로젝트 Production branch를 `main`으로 변경했습니다. 병합된 main을 SMC 전용 새 임시 폴더에 내려받아 빌드와 정적 검사 22개·디자인 4페이지·공개/편집 시나리오 9개를 통과했습니다.
- main의 public 파일 18개를 기존 고객 프로젝트 **Production** 환경에 직접 업로드했습니다. API에서 `production`, `deploy/success`, 배포 ID `2cc9c938-cc82-45d3-9c8f-eaa76c0fd13b`를 확인했습니다. Git 자동 배포는 아닙니다.
- **[현재 운영 배포 주소](https://smcguwol-review.pages.dev/)** · [이번 배포 고정 주소](https://2cc9c938.smcguwol-review.pages.dev/). 공식 도메인 오픈 완료와 구분합니다.
- 운영 주소의 제공 파일 17개는 HTTP 200 및 로컬 빌드와 SHA-256 일치, noindex 헤더 유지. 없는 주소는 HTTP 404입니다. 실제 Chrome 390px·1440px의 배치, 가로 넘침 없음, 이미지 로딩과 C6 선택 시 모바일 전화 링크 전환을 확인했고 브라우저 오류/경고는 없었습니다. 실기기/Safari·발신/예약 제출 검수로 확대하지 않습니다.

### 실제 차단 지점과 다음 작업

1. **공식 도메인 zone 생성 권한 없음.** API와 동일 고객 계정의 관리 화면 모두 `Requires permission "com.cloudflare.api.account.zone.create" to create zones for the selected account`를 반환했습니다. 재조회 zone 목록은 HTTP 200, 빈 목록입니다. 소유자 계정에서 이 저장소에 기록된 고객 도메인을 같은 고객 Cloudflare 계정에 무료 플랜으로 추가해야 합니다. 플러그인 인증 실패로 단정하지 않으며 재초대/재인증을 반복 요청하지 않습니다.
2. **Git 자동 배포는 고객 GitHub 계정 연결 필요.** Chrome에는 고객 저장소 소유자가 아닌 계정으로 로그인되어 있었습니다. 연결 화면의 기본값은 All repositories이고 administration/checks/code/deployments/pull requests 읽기·쓰기 권한을 요청했습니다. Install & Authorize를 누르지 않았습니다. 고객 저장소 소유자 계정에서 Only select repositories로 이 저장소만 선택한 실제 권한 범위를 확인한 뒤 연결합니다. 기존 Direct Upload 프로젝트는 Git 방식으로 전환할 수 없으므로 필요 시 별도 고객 Git 프로젝트를 만들고 현재 main을 빌드합니다.
3. 도메인 zone이 만들어지면 실제 발급된 Cloudflare 네임서버와 DNS를 확인하고 LETO에 반영합니다. Pages custom domain 연결·DNS 전파·공식 HTTPS 확인 후 `publish:true`로 빌드/검사/배포하고 robots·sitemap·canonical을 검증합니다. 현재는 도메인/네임서버 변경 및 검색 공개를 완료하지 않았으며 `publish:false`입니다. 승인 자체를 다시 요청할 필요는 없습니다.
4. 실제 iPhone/Android·Safari·외부 앱 전환 및 기존 외부 업체 주차/전화 표기 차이는 운영 검수 항목으로 남습니다. 네이버 검색 소유 확인·사이트맵 제출은 공식 HTTPS 이후 진행합니다.

무관한 ChatGPT 프로젝트 파일은 읽거나 수정하지 않았습니다. 이후 과거 이력은 당시 상태 기록입니다.

## 이전 오픈 준비 기록


## 추가 진행 · 2026-09-17 · 모바일 확인과 오픈 준비

- 사용자가 현재 홈페이지를 모바일로 확인하고 “나쁘지 않았다”고 평가했으며 계속 진행을 요청했습니다. 기기·브라우저나 전화/앱 전환까지 확인된 것으로 확대하지 않습니다.
- 현재 PR은 병합 충돌이 없는 상태입니다. 코드·main·공개 설정은 변경하지 않았습니다.
- Git 가져오기 화면에는 저장소 목록 없이 Connect GitHub 버튼만 표시됩니다. 버튼 클릭은 자동 승인 검토가 OAuth/접근 범위 확인이 필요하다는 이유로 차단해 권한 화면 확인 승인을 요청했습니다. 실제 새로운 연결·권한 부여는 수행하지 않았습니다.
- 기존 금지 범위를 변경하는 정식 공개 승인이 필요합니다. 구체적인 실행 순서는 로컬에서 준비했으며 신규 연락처·도메인 정보를 이 추가 기록에 넣지 않았습니다.

## 바로 할 작업

사용자가 개선안 03을 선호했고 첫 페이지 통합·최종 검수를 승인하여 아래 작업을 완료했습니다. 다음은 실기기/Safari 확인, 외부 업체 정보 차이 정리, 정식 공개 절차입니다. 기존 main 병합·publish:true·도메인/DNS/네임서버 변경 금지 지시를 유지합니다. 이번 “진행해”를 이 금지 항목의 일괄 해제로 확대 해석하지 않습니다.

## 최신 결과 · 2026-09-17 16:38 KST · 첫 페이지 통합 배포

- **[통합 홈페이지 확인](https://home-review.smcguwol-review.pages.dev/)** — 이제 개선안 03을 첫 페이지 `/`에서 확인합니다.
- [시안 비교](https://home-review.smcguwol-review.pages.dev/design/) · [A](https://home-review.smcguwol-review.pages.dev/design/a.html) · [B](https://home-review.smcguwol-review.pages.dev/design/b.html) · [03 원본](https://home-review.smcguwol-review.pages.dev/design/c.html)
- [이번 배포 고정 주소](https://45c042fe.smcguwol-review.pages.dev/)
- 구현 커밋: `543b4e4d34a727e39446d71845b8eb845ac1872b`, `codex/smc-design-review`. 이후 결과 문서 커밋이 있으므로 원격 최신 인수인계를 다시 읽습니다.

### 통합 내용

- 03의 실제 사진·레이아웃·색상·모바일 방 선택과 예약 버튼을 `src/index.html`, `styles.css`, `app.js`에 통합했습니다.
- 예약 3단계, 시설 정보, 지하철 출구, 카카오톡 문의 및 업체 연락처·SNS 푸터를 보강했습니다. 기존 확인된 고객 정보만 사용했습니다.
- 기존 첫 페이지의 SEO/LocalBusiness 생성 기능을 유지했습니다. 임시 복사본의 정식 빌드에서 비교 페이지를 제거해도 첫 페이지와 자산이 유지되는 회귀 검사를 추가했습니다. 실제 content/site.json은 `publish:false` 그대로입니다.
- 새 디자인에 맞춰 404 화면·관리 안내·README를 갱신했습니다. 비교 시안 A/B/C는 이력으로 유지했습니다.

### 실제 검증

- 빌드, 정적 검사 22개, 비교 4페이지 검사, 공개/편집 시나리오 9개, JS 구문 및 diff 공백 검사를 통과했습니다.
- Chrome 로컬 320·390·768·1440px를 확인했습니다. 예약 안내·교통·푸터의 겹침과 가로 넘침이 없었고 방 선택, 사진 확대/닫기와 초점 복귀, 모바일 좌우 방향키, 요금표 열기, 주소 복사를 확인했습니다.
- 기존 고객 Pages 목록 HTTP 200 확인 후 `smcguwol-review`를 재사용해 public 파일 18개를 직접 업로드했습니다. API에서 preview, home-review, deploy/success와 위 URL을 확인했습니다. **Git 자동 배포가 아닙니다.**
- 실제 배포 제공 파일 17개는 모두 HTTP 200 및 로컬 빌드와 SHA-256 일치, noindex 헤더 확인. `_headers`는 서버 설정 파일입니다. 없는 주소는 HTTP 404와 첫 화면 복귀 링크를 반환했습니다.
- 실제 배포 390px·1440px Chrome에서 이미지 로딩·가로 넘침, C6 선택 시 전화 CTA, 사진 확대/Escape 및 초점 복귀, 요금표 6행, HTTPS 주소 복사 성공을 확인했습니다. 브라우저 오류/경고 없음. 전화 발신·예약 제출·메시지 발송은 하지 않았습니다.

### 외부 정보·연결 점검

- [네이버 업체 페이지](https://naver.me/FlJiVAwL)는 SMC 인천 구월점으로 열리고 예약 탭의 실제 방 목록·표시 요금·최소 1시간 조건을 확인했습니다. C6 상품 설명도 전화/문자 문의를 안내합니다.
- 네이버 Room 4 설명에는 여전히 일부 차량 주차·2시간 쿠폰 문구가 있습니다. 홈페이지는 고객이 확인한 **건물 주차 불가**를 유지합니다. 외부 업체 설명 수정 여부는 남은 운영 확인 사항입니다.
- [카카오맵](https://kko.to/rYoHNy6WWV)은 같은 주소의 SMC 인천구월점으로 열립니다. 지도 전화 `010-8312-8122`는 홈페이지·네이버의 `0507-1380-8122`와 다릅니다. 홈페이지 연락처를 임의로 바꾸지 않았습니다.
- 고객 Cloudflare 계정의 해당 도메인 zone 목록과 Pages custom domains는 HTTP 200, 빈 목록입니다. 공개 DNS 조회에서 NS는 `nyx.ns.leto.kr`, `selene.ns.leto.kr`, apex A/AAAA/MX/CAA는 ENODATA였습니다. TXT·DS·www·다른 하위 도메인을 조사한 것은 아니므로 “전체 레코드 없음”으로 표현하지 않습니다.
- 기존 프로젝트는 Direct Upload 방식입니다. [공식 문서](https://developers.cloudflare.com/pages/get-started/direct-upload/)상 기존 Direct Upload 프로젝트를 Git integration으로 전환할 수 없습니다. 기본 Git 자동 배포를 사용하려면 별도 Git 연결 프로젝트와 저장소 접근 확인이 필요합니다. 기존 오류 8000011의 해소를 주장하지 않으며 새 프로젝트·재인증을 실행하지 않았습니다.

### 남은 완료 조건

1. 실제 iPhone/Android·Safari와 전화/외부 앱 전환, 화면 읽기 프로그램, 200% 글자 확대, JS 비활성 검수. Chrome 화면 크기 검수와 구분합니다.
2. 외부 업체 주차·전화 표기의 운영상 정리. 고객에게 메시지는 보내지 않았습니다.
3. 명시적인 정식 공개 승인 후 main 병합, 고객 도메인/네임서버 연결 및 HTTPS, publish 전환, 검색 등록. Git 자동 배포 방식을 함께 확정합니다.

현재 무관한 ChatGPT 프로젝트 파일은 수정하지 않았습니다. 원본 수정·검사는 SMC 전용 작업 폴더에서 수행했고 다른 계정·호스팅·유료 서비스를 사용하지 않았습니다.

## 최신 배포·검수 결과 · 2026-09-17 · 개선안 03 완성도 개선

- [최신 개선안 03](https://design-round-03.smcguwol-review.pages.dev/design/c.html) — 기존 확인 주소를 갱신했습니다.
- [시안 비교](https://design-round-03.smcguwol-review.pages.dev/design/)
- [이번 배포 고정 주소](https://d7fd8236.smcguwol-review.pages.dev/design/c.html)
- [다듬기 전 03](https://2c4def08.smcguwol-review.pages.dev/design/c.html)
- 구현 커밋: `27dd6acb9b8ee1b436cf8fb0129407ca40e4760f`, 브랜치 `codex/smc-design-review`. 이후 문서 커밋이 있으므로 시작 시 원격 최신 상태를 읽습니다.

### 변경 내용

1. 실제 공간 사진을 중심으로 한 03의 배치·색상·첫인상을 유지했습니다. 본문과 요금 단위·링크 글자를 키우고, 주요 링크에 최소 44px 터치 높이를 적용했습니다. 모바일 설명은 주로 14–15px이며 제목·여백을 화면 폭에 맞춰 조정했습니다.
2. 모바일에 공간·사진 / 요금표 / 오시는 길 바로 이동을 추가했습니다. 하단 버튼에는 선택한 방을 표시하고, C6 홀 선택 시 전화 문의로 전환합니다. 일반 방으로 돌아오면 네이버 예약으로 복원합니다. 네이버 링크는 기존 업체 예약 페이지이며 특정 방의 자동 선택·예약 확정을 의미하지 않습니다.
3. 방 사진의 원본 비율을 유지해 잘림을 줄이고 페이지 안에서 확대·닫기를 추가했습니다. Escape와 닫기 버튼, 이전 사진 링크로 초점 복귀를 확인했습니다. 사진 자체를 생성·보정하거나 고해상도라고 주장하지 않습니다. 현재 주 사진은 가로 1,000px 원본이므로 대형 화면 선명도를 더 높이려면 고해상도 실사진이 필요합니다.
4. 기존 content/site.json의 확정 FAQ 5개를 같은 디자인의 이용 안내로 반영했습니다. 주소 복사 버튼과 성공/실패 안내를 추가했습니다. 새로운 영업 정보·요금·후기를 만들지 않았습니다.
5. 비교 안내에 이번 개선 내용을 기록했습니다. A/B와 기존 전체 안내 페이지의 내용은 유지했습니다.

### 실제 확인 결과

- 기존 고객 Pages 목록 HTTP 200 조회 후 같은 프로젝트에 public 파일 18개를 직접 업로드했습니다. API에서 2026-09-17 15:19 KST, 환경 preview, 배포 단계 deploy/success와 발급 주소·별칭을 확인했습니다.
- 제공 파일 17개 모두 HTTP 200, 로컬 빌드와 SHA-256 일치, noindex 응답 헤더를 확인했습니다. _headers 1개는 응답 설정 파일입니다. 미리보기 이름 design-round-03은 Git 작업 브랜치명과 다르며 이번도 Git 자동 배포가 아닙니다.
- 빌드, 기존 정적 검사 22개, 디자인 4페이지 검사, 공개/편집 8개 시나리오, JavaScript 구문 검사와 diff 공백 검사를 통과했습니다.
- Chrome 로컬 화면 320·390·768·1440px에서 배치를 확인했습니다. 태블릿 사진 하단과 제목 상단이 분리됐고 가로 넘침은 없었습니다. 방 선택의 PC 위아래/모바일 좌우 방향키와 선택 상태·예약 링크 일치를 확인했습니다.
- 실제 배포의 390px 모바일·1440px PC에서 사진 로딩과 가로 넘침을 확인했습니다. C6 하단 전화 경로, 사진 확대·닫기, 요금표 6행, HTTPS 주소 복사 성공과 브라우저 오류/경고 없음도 확인했습니다. 전화 발신·예약 제출·결제는 하지 않았습니다.
- content/site.json의 publish:false, main, 도메인·DNS·네임서버는 변경하지 않았습니다. 고객에게 메시지를 보내지 않았고 다른 계정·호스팅·유료 서비스를 사용하지 않았습니다.

### 남은 검수

- 실제 iPhone/Android·Safari, 전화·외부 앱 전환, 화면 읽기 프로그램, 글자 200% 확대와 JavaScript 비활성 상태는 미검수입니다. 이번 Chrome 화면 크기 검수를 실기기 검수로 표현하지 않습니다.
- 외부 네이버/지도 정보의 주차·대표전화 불일치는 기존 공개 전 확인 항목입니다. 이번에는 링크를 변경하지 않았으며 외부 예약 목록을 새로 검수했다고 주장하지 않습니다.
- Git 자동 배포 오류 8000011은 미해결입니다. 기존 초대·인증을 반복 요청하지 않습니다. 이전 Figma 호출 한도 제한은 이번 작업에서 재시도하지 않았습니다.
- 디자인 원본과 검수 자료는 저장소 및 작업 기록에 있습니다. 모바일 사용자에게 작업 PC의 로컬 파일 경로를 이미지 공유 링크로 전달하지 말고 실제 배포 주소를 우선 사용합니다.

## 이전 배포·검수 이력 · 2026-09-16 · 디자인 검토 03

- [개선안 03](https://design-round-03.smcguwol-review.pages.dev/design/c.html)
- [개선 전후 비교 안내](https://design-round-03.smcguwol-review.pages.dev/design/)
- [이전 A](https://design-round-03.smcguwol-review.pages.dev/design/a.html) · [이전 B](https://design-round-03.smcguwol-review.pages.dev/design/b.html)
- [이번 최종 검토 배포의 고정 주소](https://2c4def08.smcguwol-review.pages.dev/design/c.html)
- [디자인 기준과 구현 설명](DESIGN_ROUND_03.md)

### 무엇을 바꿨는가

대표 장면을 전체 폭의 실제 C6 홀 사진으로 바꿨습니다. PC에서는 피아노를 피한 우측에 제목을 배치하고, 모바일·태블릿에서는 사진 아래에 제목을 둡니다. 공간 안내는 실제 방 번호를 선택하면 큰 사진·설명·예약 경로가 함께 바뀌는 구성입니다. 전체 요금표는 펼쳐서 확인합니다. 장식용 영문과 추상적인 슬로건을 줄였습니다. 기존 A/B는 비교용으로 보존했습니다.

### 배포와 확인 범위

- 기존 고객 Pages 프로젝트를 실제 목록 조회(HTTP 200) 후 재사용했습니다. public의 18개 파일을 직접 업로드했습니다. 새 프로젝트나 다른 호스팅을 만들지 않았습니다.
- 최종 배포: 2026-09-16 23:43 KST, API의 환경 `preview`와 배포 단계 `success` 확인. Preview 이름은 `design-round-03`이며 Git 브랜치명과 다릅니다.
- 구현 커밋 `76fc74a413686df18f89c162b14ce11b7c07f177`, 태블릿 수정 포함 코드 커밋 `b8b275136f14c67252f1c3aadad2cd6cbc3e6758`. 검토 브랜치는 `codex/smc-design-review`입니다.
- 최초 3차 배포를 검수하면서 768px에서 제목이 피아노와 겹치는 부분을 발견했습니다. 태블릿 구간을 사진·제목의 세로 배치로 바꾸고 재배포했습니다. 최종 768px 화면에서 사진 하단 462px, 제목 상단 492px로 분리된 것을 실제 확인했습니다.
- 최종 배포의 제공 파일 17개는 모두 HTTP 200, 검색 제외 헤더, 로컬 빌드와 SHA-256 일치를 확인했습니다. 나머지 1개인 _headers는 Cloudflare 응답 설정 파일입니다.
- 기존 정적 검사 22개, 디자인 비교 4개 페이지, 공개/편집 검사 8개 시나리오와 JavaScript 구문 검사를 통과했습니다.
- Chrome에서 1440×960 PC, 390×844 모바일, 320px 소형 화면과 768px 태블릿의 배치를 확인했습니다. 가로 넘침이 없었고, 표시되는 실제 사진이 로드됐습니다. Chrome 화면 크기 검수이며 실기기 검수는 아닙니다.
- 방 선택, PC·모바일 방향키 조작, 선택 상태와 표시 패널 일치, C6 전화 링크, 펼치는 요금표와 메뉴의 요금표 열기, 6개 확정 가격 행을 확인했습니다. 전화 발신·예약·결제는 하지 않았습니다. 외부 업체 정보는 기존 검수 기록을 유지합니다.
- content/site.json과 기존 전체 원페이지의 내용은 바꾸지 않았습니다. publish는 false이며 main·도메인·DNS·네임서버는 변경하지 않았습니다.

### 남은 검토와 도구 제한

1. 사용자가 새 첫인상과 공간 선택 방식을 평가해야 합니다. 만족 여부를 확인한 뒤 전체 원페이지의 최종 디자인 통합 범위를 정합니다.
2. 실제 iPhone/Android·Safari·전화 앱 전환, 운영체제별 글꼴과 확대·보조기술 검수는 남았습니다. JavaScript 비활성 상태는 HTML의 기본 구조를 유지했으며 실제 브라우저 비활성 검수는 별도입니다.
3. 네이버 일부 주차 안내와 지도 전화번호가 기존 확정 정보와 다른 항목은 공개 전에 확인합니다. 고객에게 메시지를 보내지 않았습니다.
4. GitHub 자동 배포는 이전 Cloudflare Git 연결 오류 8000011 이후 미완료 상태입니다. 이번도 직접 업로드이며 완료된 인증·초대를 반복 요청하지 않습니다.
5. Figma에는 코드 작성 전 편집 가능한 첫 화면 초안을 추가했으나 이어진 스크린샷 호출에서 Starter 플랜 MCP 도구 호출 한도 오류가 반환됐습니다. 유료 전환을 하지 않았고, Figma 초안의 검수 완료를 주장하지 않습니다. 최종 웹 검수는 Chrome에서 수행했습니다.

## 2차 배포·검수 이력 · 2026-09-16 · 디자인 검토 02

- [최신 A/B 비교](https://design-round-02.smcguwol-review.pages.dev/design/)
- [A · 공간의 온도](https://design-round-02.smcguwol-review.pages.dev/design/a.html)
- [B · 오늘의 연습](https://design-round-02.smcguwol-review.pages.dev/design/b.html)
- [이번 배포의 고정 주소](https://53a3d1fc.smcguwol-review.pages.dev/design/)
- [Figma 레퍼런스·PC·모바일 비교 보드](https://www.figma.com/design/l0G0UcqdkSir7HdoW2zcC3)
- [디자인 기준과 적용 근거](DESIGN_ROUND_02.md)

### 구현과 배포

- AIR Studios, Stayfolio, RYSE의 실제 화면을 관찰해 사진·공간 선택·가격·예약의 연결 방식을 정리했습니다. PIRATE도 실제 화면을 확인했으나 이용 목적 차이 때문에 주된 시각 참고에서는 제외했습니다.
- A는 크림·올리브와 명조 제목, B는 선명한 파랑과 굵은 고딕 제목으로 구성했습니다. 두 안 모두 같은 SMC 실제 사진·확정 요금·예약 경로를 사용합니다. 다른 업체의 사진을 홈페이지에 사용하거나 임의의 공간·후기를 생성하지 않았습니다.
- 첫 화면, 공간 선택, 전체 요금표와 예약 안내를 개선했습니다. Room 1·3·5 소개 가격은 content/site.json에서 생성해 요금표와 같은 원본을 사용합니다.
- 구현 커밋: `95f2a670bf721c1fcd5d693446c4734069dc8abe`, 검토 브랜치 `codex/smc-design-review`.
- 배포 직전 고객 계정의 Pages 목록을 다시 조회해 기존 검토 프로젝트를 재사용했습니다. 2026-09-16 09:43 KST에 Cloudflare API의 환경 `preview`, 배포 단계 `success`와 실제 URL을 확인했습니다.
- 로컬 빌드 public의 15개 파일을 ZIP으로 직접 업로드했습니다. `design-round-02`는 Pages Preview 이름이며 Git 작업 브랜치 이름이 아닙니다. GitHub 자동 배포 연결은 이전 오류 `8000011` 이후 아직 해결되지 않았습니다. 배포 메타데이터의 Git 커밋 필드는 비어 있으므로 자동 연동이나 커밋 추적이 된 것으로 보고하지 않습니다.
- publish: false와 검색 제외 응답 헤더를 유지했습니다. 검색 제외는 접근 인증이 아니므로 링크를 아는 사람은 시안을 열 수 있습니다. main과 도메인·DNS·네임서버는 변경하지 않았습니다.
- Figma에는 실제 레퍼런스 화면과 A/B의 PC·모바일·공간·요금 화면을 비교 보드로 정리하고 렌더링을 확인했습니다. 화면 캡처는 이미지이며, 수정 가능한 웹 구현 원본은 저장소의 HTML/CSS입니다.

### 확인한 범위

- `node scripts/build.mjs`, `node scripts/check.mjs` 22개, `node scripts/check-design.mjs` 3개 페이지, `node scripts/check-release.mjs` 8개 시나리오, `node --check public/app.js` 통과.
- 새 배포의 비교 페이지·A·B·디자인 CSS 4개는 HTTP 200, 검색 제외 헤더, 로컬 빌드와 SHA-256 일치를 확인했습니다. `.html` 주소는 확장자 없는 정상 페이지로 이동합니다.
- 실제 Chrome에서 비교 페이지와 A/B의 PC 1440×960·모바일 390×844 화면을 확인했습니다. A/B는 320px·768px에서도 가로 넘침이 없었고 사진이 정상 로드됐습니다.
- A/B 전환, 요금 이동, B의 C6 공간 이동, 모바일 하단 버튼, C6 전화 링크의 번호를 확인했습니다. 실제 전화 발신은 하지 않았습니다.
- 네이버 링크에서 SMC 인천 구월점과 실제 예약 목록을 확인했습니다. Room 1·3·G3·C6 가격과 C6 전화 예약 안내를 대조했습니다. 카카오맵에서도 SMC와 동일 주소를 확인했습니다. 예약·결제·메시지 전송은 하지 않았습니다.

### 다음 검수·결정

1. 사용자가 A/B의 첫인상, 공간 선택, 가격·예약 이해도를 비교해 방향을 선택합니다. 선택 후 기존 전체 원페이지를 해당 방향으로 정리합니다. 이번 A/B는 전체 사이트 완성본이 아닙니다.
2. 실제 iPhone/Android의 터치·전화·외부 앱 전환, Safari와 운영체제별 한글 글꼴, 기존 전체 원페이지의 메뉴·사진 확대·주소 복사·키보드·200% 글자 확대·JS 비활성 상태를 검수합니다. Chrome의 화면 크기 검수를 실기기 검수로 간주하지 않습니다.
3. 기존 확정 정보는 유지했습니다. 네이버 일부 방 상세의 차량 주차권 안내와 카카오맵 전화번호가 확정 주차·대표전화와 다른 부분은 공개 전 확인합니다. 외부 목록의 추가 공간을 임의로 홈페이지에 반영하지 않았습니다.
4. GitHub 자동 배포 연결은 별도 미완료 항목입니다. 완료된 설치·초대·인증을 반복 요구하지 않습니다. 최종 공개와 도메인 연결은 별도 단계입니다.

## 1차 배포·검수 이력 · 2026-09-15

- [A/B 비교](https://15b1116f.smcguwol-review.pages.dev/design/)
- [A안](https://15b1116f.smcguwol-review.pages.dev/design/a.html)
- [B안](https://15b1116f.smcguwol-review.pages.dev/design/b.html)

고객 Cloudflare Pages에 배포했고 완료 상태 success와 실제 화면을 확인했습니다. GitHub 자동 배포는 Cloudflare Git 연결 오류 8000011로 실패하여, 같은 고객 계정에 로컬 빌드의 public 파일만 직접 업로드했습니다. 자동 배포 연결은 아직 미완료입니다. 후속 작업에서는 기존 검토 프로젝트를 조회해 재사용하세요.

신규 프로젝트 지침대로 검토 브랜치를 초기 배포 브랜치로 사용하여 Pages에는 Production으로 표시됩니다. 홈페이지 설정 publish: false와 검색 제외는 유지했습니다. main, 도메인, DNS, 네임서버는 변경하지 않았습니다.

기존 빌드·정적 검사 22개·디자인 검사 3개·공개/편집 통합 검사 8개를 통과했습니다. A/B의 1440px PC·390px 모바일 화면, 사진, 고정 예약 버튼, 시안 전환과 공간·위치·요금 링크를 확인했습니다. 320px·768px에서도 가로 넘침은 없었습니다. 네이버 업체 페이지와 예약 탭, 카카오맵의 업체·주소를 확인했으며 예약·결제·전화 발신·메시지 전송은 하지 않았습니다.

B안의 모바일 문구가 붙는 오류를 검토 브랜치에서 수정하고 재배포했습니다. 최종 배포의 제공 파일 14개는 HTTP 200으로 응답했고 로컬 빌드와 일치했습니다. 검색 제외 응답 헤더도 확인했습니다.

남은 항목: 실제 iPhone/Android의 터치와 전화·외부 앱 전환, Safari 등 다른 브라우저, 기존 전체 원페이지의 메뉴·사진 확대·주소 복사·키보드·200% 글자 확대·JS 비활성 상태 검수. 외부 예약 상세의 주차 안내와 지도 전화번호가 고객 확정 정보와 다른 부분은 공개 전 확인 대상으로 남겼습니다. 최종 디자인은 선택하지 않았습니다.

직접 업로드 프로젝트의 Git 연동 전환 제약은 [Cloudflare 공식 안내](https://developers.cloudflare.com/pages/get-started/direct-upload/)를 확인하세요. 완료된 설치·초대·인증을 반복 요구하지 말고 실제 연결 오류를 확인해야 합니다.

아래 배포 전 진단 및 기존 문서의 미배포·브라우저 미검수 설명은 과거 이력이며 이 최신 결과가 우선합니다.

## 배포 전 진단 이력: 로컬 환경에서 실행 가능

아래 내용은 사용자가 별도 로컬 Work 대화에서 실행한 진단 결과를 현재 Cloud 대화에 전달한 기록입니다. 이 Cloud 대화에서 Cloudflare API를 직접 호출한 결과는 아닙니다.

- 로컬 Windows의 Codex 데스크톱 세션에서 `cloudflare-api`의 search / execute / docs 및 Cloudflare 스킬 제공을 확인했습니다.
- 계정 목록 API 호출은 HTTP 200으로 성공했고, 접근 가능한 계정은 고객 SMC 계정 1개였습니다. 정확한 계정 식별자는 로컬 진단 대화와 사용자 전달 프롬프트를 사용합니다.
- 해당 계정의 Pages 목록도 HTTP 200으로 성공했으며 진단 시점에는 기존 프로젝트가 0개였습니다.
- 첫 Pages 조회의 `8000024: Invalid list options provided` 오류는 page / per_page 옵션을 생략한 뒤 해결됐습니다. 이를 인증 실패로 해석하지 않습니다.
- 진단에서는 조회만 수행했고 Cloudflare 리소스·설정·파일은 변경하지 않았습니다. 인증 완료와 실제 계정 조회 성공을 되돌려 설치·초대·인증을 반복 요구하지 않습니다.
- 현재 Cloud 대화에는 Cloudflare 실행 기능이 여전히 제공되지 않습니다. 로컬 성공으로 Cloudflare가 Work Cloud에서 일반적으로 미지원인지, 현재 Cloud 세션의 기능 제공 문제인지까지 확정된 것은 아닙니다.
- MCP 설정의 `자동 / CIMD / DCR`은 OAuth 클라이언트 등록 방식입니다. 서버 활성화 옵션으로 간주하거나 근거 없이 변경하지 않습니다.
- 다음 실행은 조회에 성공한 동일 로컬 대화에서 이어갑니다. 생성 직전 고객 계정의 Pages 목록을 확인해 중복 생성을 피하고, 여전히 없다면 고객 확인용 Pages 프로젝트를 생성해 검토 브랜치의 A/B 시안을 배포합니다. GitHub 연결 방식의 자동 배포를 우선 검토합니다.
- 다른 프로젝트에서 진단했더라도 그 프로젝트의 파일·설정·저장소는 수정하지 않습니다. SMC 전용 작업 폴더에서 아래 원격 저장소의 최신 검토 브랜치를 사용합니다.
- main 병합, 도메인·DNS·네임서버 변경, 최종 디자인 선택, publish true 전환, 유료 신청은 계속 보류합니다.

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
- 최초 A/B 이후 디자인 검토 03과 태블릿 수정까지 반영했습니다. 코드 커밋은 `b8b275136f14c67252f1c3aadad2cd6cbc3e6758`입니다. 이후 인수인계 문서 커밋이 있으므로 작업 시작 시 원격 브랜치의 최신 내용을 조회합니다.
- main은 초기 README 상태로 유지했습니다. 제작 코드는 검토 브랜치에 있습니다. main을 그대로 빌드하지 않습니다.
- 프레임워크 없는 HTML/CSS/JavaScript, Node.js 20 이상. 외부 빌드 의존성 없음.
- 빌드 명령 `node scripts/build.mjs`, 출력 `public`, 루트 빈칸, Framework None.
- `content/site.json`의 `publish`는 false로 유지합니다. 비교 시안은 검색 제외이며 접근 인증으로 비공개화된 것은 아닙니다.
- 성공한 배포 URL 뒤 `/design/`가 비교 페이지, `/design/a.html`, `/design/b.html`이 각 시안입니다. 생성되지 않은 pages.dev 주소를 추측하지 않습니다.
- Pages 프로젝트가 있으면 검토 브랜치 preview deployment를 사용합니다. 신규 프로젝트의 최초 빌드에 Production branch 지정이 필요하면 코드가 있는 검토 브랜치를 고객 확인용 초기 브랜치로 사용하고 custom domain은 연결하지 않습니다. 상세 절차는 DEPLOYMENT.md에 있습니다.

## 디자인·검수 현황

- 최신 개선안 03: 전체 폭의 C6 실사진, 실제 방 선택에 따라 바뀌는 사진·설명·예약 경로, 펼치는 요금표. src/design-c.html과 해당 CSS·JS가 원본입니다. 아래 A/B는 이전 비교안입니다.
- A: 크림·올리브와 명조 제목, 실제 사진을 중심으로 한 차분한 스튜디오 소개.
- B: 흰색과 선명한 파랑, 굵은 제목과 연습 목적별 공간 선택을 중심으로 한 안내.
- A/B는 첫 화면·공간 소개·요금·예약 안내의 비교 시안이며 완성된 두 개의 전체 사이트가 아닙니다. 기존 전체 원페이지는 public/index.html에 있습니다.
- 실제 SMC 로고와 C6 홀/1번/3번방 사진을 사용했습니다. 임의 생성 공간 사진은 없습니다.
- 기존 정적 검사 22개, A/B 링크·구조 검사, 공개 전환 및 고객 수정 통합 검사 8개를 통과했습니다. 허용된 Chrome에서 로컬 및 실제 Preview 배포의 PC·모바일 크기 화면을 검수했습니다. 실기기와 다른 브라우저 등 남은 범위는 최신 결과에 적었습니다.
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

README.md, docs/DEPLOYMENT.md, docs/DESIGN_ROUND_03.md, docs/DESIGN_ROUND_02.md(2차 이력), docs/DESIGN_DIRECTION.md(1차 이력), docs/QA.md, docs/EDITING.md, docs/CONTENT_SOURCES.md, content/site.json.

원격 저장소가 기준입니다. 이전 임시 작업 폴더나 20260914 ZIP이 사라졌거나 오래됐어도 제작을 처음부터 다시 시작하지 않습니다. 최신 검토 브랜치를 사용합니다. 고객에게 메시지 전송, PR 병합, 최종 공개 완료를 수행했다고 허위 보고하지 않습니다.
