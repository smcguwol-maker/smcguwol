# SMC 홍보 게시판 사용 안내

현재 상태 (2026-09-23): 화면·저장 기능 구현, 로컬 검수 및 실제 이메일 로그인 연결 완료. 공식 소식 관리에서 고객 전용 이메일 로그인 화면까지 확인했습니다. 고객 본인의 인증번호 입력 후 실서비스 게시물 저장 확인만 남았습니다. 인증번호를 제작자에게 보내지 않습니다.

## 고객님이 사용하는 방법

1. 공식 홈페이지 아래의 **소식 관리**를 누릅니다. 관리 주소는 https://xn--co-002iq89dzga40o12n.kr/admin/ 입니다.
2. Email에 **Smcguwol@gmail.com**을 입력하고 **Send login code**를 누릅니다. 해당 Gmail로 받은 인증번호를 로그인 화면에 직접 입력합니다. 메일이 보이지 않으면 스팸함도 확인하며, 인증번호를 제작자에게 보내지 않습니다.
3. **소식 올리기**를 누릅니다.
4. 영상은 YouTube의 공유 주소를 붙여넣고, 사진·그림은 휴대폰이나 PC에서 선택합니다. 제목과 선택 사항인 짧은 설명을 적습니다.
5. **홈페이지에 공개**를 켜고 **저장하기**를 누릅니다. 새 게시물은 맨 위에 추가됩니다.
6. 홈페이지를 새로 열어 확인합니다. 첫 세 게시물이 바로 보이며 나머지는 더 보기로 펼칩니다.

수정 버튼으로 기존 영상 주소·제목·사진을 교체할 수 있습니다. 공개/숨김으로 첫 화면 노출을 바꾸고 위로/아래로 버튼으로 순서를 바꿉니다. 숨긴 게시물도 편집 화면에 남아 다시 공개할 수 있습니다.

## 파일과 이용 범위

- 동영상 파일 직접 업로드 대신 YouTube 주소를 등록합니다. YouTube에서 공개 또는 일부 공개로 올리고 외부 재생을 허용해야 홈페이지에서 재생됩니다. 업로더 설정에 따라 재생할 수 없는 영상은 원본 링크로 확인하세요.
- JPG·PNG·WebP 원본 15MB 이하를 선택하면 최대 변 2400px, 저장 용량 1MB 이하의 JPEG로 자동 변환됩니다. 원본은 따로 보관해 주세요.
- 게시물은 최대 30개 보관합니다. 필요 없는 기존 게시물은 수정하여 새 소식으로 바꿔 사용할 수 있습니다.
- 제목 80자, 설명 300자. 공개 게시판에 출입 비밀번호나 예약자 개인정보를 적지 않습니다.
- 홈페이지 재배포 없이 저장 내용이 적용됩니다. 다른 창에서 먼저 수정한 경우 덮어쓰지 않고 새로고침을 안내합니다.
- 기존 이용 안내 페이지의 소개 웹툰은 고정 콘텐츠입니다. 게시판에서 해당 소식을 숨겨도 기존 이용 안내 페이지의 웹툰까지 삭제하는 기능은 아닙니다.

## 제작자 연결 설정 (2026-09-23 완료, 재설정하지 않음)

- 고객 Cloudflare 계정 733b1c8faa19799bf480b1192f473635만 사용합니다.
- D1 **smcguwol-promotions**, ID **7086be90-5d6b-4ea6-97c3-c217e6ae789b** 생성 및 초기화 완료. Production Pages 바인딩 **SMC_PROMO_DB** 연결 완료. Preview에 쓰기 권한을 열지 않습니다.
- migrations/0001_promotions.sql과0002_seed_promotions.sql은 이미 실행했습니다. 후자는 INSERT OR IGNORE이며 재배포 시 고객 작성 내용을 초기화하지 않습니다.
- 고객이 Zero Trust Free 초기 설정을 완료했고, 팀은 **broad-hill-4127**입니다. Self-hosted 앱 **SMC 소식 관리**(2ea47ba2-814a-45c8-966c-10998c35e3f7)의 공식 도메인 경로 `admin` 설정으로 **/admin 및 /admin/** 전체를 보호합니다. 공개 페이지는 정상 접근됩니다.
- Allow 정책 **SMC owner only**는 이메일 **smcguwol@gmail.com 하나만** 포함합니다. Everyone/전체 이메일 도메인 허용 금지. 로그인 제공자는 **One-time PIN**만 선택하고 모든 제공자 자동 허용은 껐습니다. 세션24시간입니다.
- Production Text 변수 **SMC_ACCESS_DOMAIN=broad-hill-4127.cloudflareaccess.com**, **SMC_ACCESS_AUD=2355657d389bbb4936ad4548cd620f7fcac5323306428bfa7852c1722ae07eee** 설정·재배포 완료. 둘 다 공개 식별자이며 비밀 토큰이 아닙니다. 기존 AI 바인딩 및 SMC_AI_ENABLED를 보존했습니다.
- 설정이 없거나 서명이 잘못된 JWT는 관리자 페이지/API에서 거부합니다. 다른 pages.dev 호스트에서 관리자 요청도 거부합니다.
- 로그인 설정 후 고객이 직접 로그인하여 이미지 저장·새 영상 교체·숨김·다른 창 재접속을 최종 확인합니다. 제작자가 고객의 인증번호를 받거나 읽지 않습니다.
- 현재 Production은 **fddae4b1-7c15-449e-82fb-1a4526dde834** (2026-09-23 21:12:59 KST)입니다. 홈페이지 하단의 이용 도우미는 소식 관리 링크를 가리지 않도록 링크 아래 별도 줄에 표시됩니다. Cloudflare MCP Access 목록은 실제 UI와 다른 빈목록을 반환하기도 하므로 이 응답만으로 앱을 중복 생성하지 않습니다.

## 비용·복구

이번 작업에서 유료 서비스를 신청하지 않았습니다. 이미지와 게시물은 D1 무료 범위에 맞게 작게 저장하며, 유료 플랜으로 자동 변경하는 기능을 넣지 않았습니다. 무료 한도를 넘으면 저장/조회가 제한될 수 있으므로 무제한 운영을 보장하지 않습니다. D1 Free는 데이터베이스당500MB, 계정 합계5GB, 일500만 행 읽기·10만 행 쓰기 한도입니다. Workers 요청·CPU 무료 한도도 별도로 적용됩니다.

D1 Time Travel 무료 복구 기간은7일입니다. 사고 시 자동 초기화하거나 새 데이터베이스를 만들어 덮어쓰지 말고, 기존 D1에서 복구 시점을 확인합니다. 배포 ZIP에는 고객이 이후 등록한 D1 게시물·사진이 포함되지 않으므로 장기 보관은 D1 별도 내보내기가 필요합니다.

공식 문서: https://developers.cloudflare.com/d1/platform/pricing/ · https://developers.cloudflare.com/d1/platform/limits/ · https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/

## 개발 검수

node scripts/build.mjs
node scripts/check.mjs
node scripts/check-release.mjs
node --test scripts/check-help.mjs scripts/check-promotions.mjs

로컬 관리자 동작 확인은 node scripts/serve-promotions-test.mjs 를 사용합니다(Node24 이상). 127.0.0.1:8774에만 바인딩하며 임시 메모리 SQLite와 테스트용 서명을 사용합니다. 실제 고객 계정 로그인 완료를 의미하지 않습니다. 이 스크립트 및 테스트 서명은 public/에 복사하거나 서버에 배포하지 않습니다.
