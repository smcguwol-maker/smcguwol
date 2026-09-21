# SMC 홍보 게시판 사용 안내

현재 상태: 화면·저장 기능 구현 및 로컬 검수 완료. 고객 계정의 Cloudflare Access 설정 권한이 아직 없어 실제 고객 로그인은 활성화 대기입니다. 활성화 후 아래 방법으로 이용합니다.

## 고객님이 사용하는 방법

1. 공식 홈페이지 아래의 **소식 관리**를 누릅니다. 관리 주소는 https://xn--co-002iq89dzga40o12n.kr/admin/ 입니다.
2. 승인된 이메일 **Smcguwol@gmail.com**으로 로그인합니다. 인증번호는 로그인 화면에서 직접 입력하며 제작자에게 보내지 않습니다.
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

## 제작자 초기 설정 (고객의 매번 작업 아님)

- 고객 Cloudflare 계정 733b1c8faa19799bf480b1192f473635만 사용합니다.
- D1 **smcguwol-promotions**, ID **7086be90-5d6b-4ea6-97c3-c217e6ae789b** 생성 및 초기화 완료. Production Pages 바인딩 **SMC_PROMO_DB** 연결 완료. Preview에 쓰기 권한을 열지 않습니다.
- migrations/0001_promotions.sql과0002_seed_promotions.sql은 이미 실행했습니다. 후자는 INSERT OR IGNORE이며 재배포 시 고객 작성 내용을 초기화하지 않습니다.
- Cloudflare Access를 무료 플랜 범위에서 초기 설정하고, self-hosted 애플리케이션으로 공식 도메인의 **/admin 및 /admin/** 전체를 보호합니다. 필요하다면 경로 admin*로 잡되 다른 공개 페이지 전체를 보호하지 않습니다.
- Allow 정책은 이메일 **smcguwol@gmail.com 하나만** 포함합니다. Everyone/전체 이메일 도메인 허용 금지. 이메일 OTP 또는 고객이 사용할 수 있는 인증 제공자를 설정합니다.
- 앱의 실제 인증 도메인을 Production Text 변수 **SMC_ACCESS_DOMAIN** (https 없이 xxx.cloudflareaccess.com), 실제 Audience를 **SMC_ACCESS_AUD**로 추가합니다. 둘 다 공개 식별자이며 비밀 토큰이 아닙니다. 기존 AI 바인딩 및 SMC_AI_ENABLED는 보존합니다.
- 설정이 없거나 서명이 잘못된 JWT는 관리자 페이지/API에서 거부합니다. 다른 pages.dev 호스트에서 관리자 요청도 거부합니다.
- 로그인 설정 후 고객이 직접 로그인하여 이미지 저장·새 영상 교체·숨김·다른 창 재접속을 최종 확인합니다. 제작자가 고객의 인증번호를 받거나 읽지 않습니다.

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
