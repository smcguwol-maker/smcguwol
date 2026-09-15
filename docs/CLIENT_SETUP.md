# 고객님께 한 번에 요청할 연결 준비

확인일: 2026-09-15

업체 정보·로고·사진·요금·30분 단위/최소1시간·도메인 철자는 확보되어 있으므로 다시 요청하지 않습니다. 아래는 고객 계정 소유권을 유지하며 업로드·배포·도메인 연결을 진행하기 위해 필요한 설정입니다.

## 1. GitHub 코드 업로드용 앱

**완료:** 고객님이 **ChatGPT Codex Connector → smcguwol**만 선택해 설치·인증했습니다. 고객 계정 설치와 제작 파일 데이터 쓰기 성공을 확인했습니다. 이 설치를 다시 요청하지 않습니다. 자세한 기록은 `GITHUB_ACCESS.md`에 있습니다.

## 2. 고객 Cloudflare 계정의 배포 연결·작업자 초대

### 고객 GitHub를 고객 Cloudflare에 연결

1. 고객님 Cloudflare 계정에 로그인하고 **Workers & Pages → Create application → Pages → Connect to Git**을 선택합니다.
2. GitHub 연결 시 `smcguwol-maker` 계정으로 진행합니다.
3. **Cloudflare Workers and Pages** 앱이 요청하는 저장소 접근은 **Only select repositories → smcguwol**로 지정합니다.
4. Cloudflare에 돌아와 고객 GitHub 계정과 저장소가 선택 가능한지 확인합니다.

이 단계는 코드 저장용 OpenAI 앱과 다른 자동 배포용 연결입니다. 코드가 있는 검토 브랜치는 `codex/smc-design-review`입니다. `main`은 아직 기존 상태이므로 Pages에 빌드할 브랜치가 실제 코드가 있는 브랜치인지 확인합니다. 배포·브랜치 설정은 `DEPLOYMENT.md`를 참고합니다. 화면 명칭이 다르면 보이는 화면을 확인하고 이어갑니다.

### 작업자 초대

고객님 Cloudflare의 **Manage Account → Members → Invite**에서 제작자가 실제 사용하는 Cloudflare 이메일로 초대합니다. 이메일은 고객님께 안내하기 전에 제작자 주소로 확인합니다. GitHub 사용자명 자체를 초대 이메일로 사용하지 않습니다.

Pages 작업에는 공식 역할 **Workers Platform Admin**을 검토합니다. 이 역할은 Pages 외에도 Workers 등 개발 플랫폼 제품을 읽고 수정할 수 있으므로 'Pages만의 권한'이라고 설명하지 않습니다. 결제·전체 계정 관리를 위한 Super Administrator 역할을 기본 요청하지 않습니다. 도메인의 DNS 수정 권한은 실제 도메인이 추가된 뒤 필요한 도메인 범위로 확인합니다.

계정 초대 완료만으로 현재 작업 환경에 Cloudflare 접근이 생기는 것은 아닙니다. 제작자는 본인의 초대를 수락하고 정상적인 Cloudflare 로그인으로 고객 계정 접근을 확인해야 합니다. 현재 이 대화에서 사용 가능한 Cloudflare 연결 도구는 확인되지 않았으며, 고객 계정에서 인증된 실제 화면 접근도 아직 없습니다.

## 3. 도메인 구매처·현재 사용 상태

고객님께 다음을 한 번에 요청합니다.

- 정확한 도메인 `근처연습실co.kr`의 구매 업체명.
- 도메인 주소와 현재 네임서버/DNS 설정이 보이는 관리 화면.
- 해당 도메인으로 현재 운영 중인 홈페이지·이메일·기타 서비스가 있는지. 연결 없이 구매만 한 상태인지.

최상위 주소를 Cloudflare Pages에서 쓰려면 같은 고객 Cloudflare 계정에 zone을 추가하고 Cloudflare 네임서버를 사용합니다. 기존 서비스가 있으면 DNS를 먼저 검토합니다. 네임서버 값은 실제 계정에서 발급된 값을 사용하며 임의의 값을 미리 안내하지 않습니다. 구매처 계정의 비밀번호를 전달받는 대신 고객이 변경할 항목과 값을 안내합니다.

## 이후 순서

1. GitHub 권한 확인 → 제작 파일 업로드.
2. 고객 Cloudflare 계정에서 Pages 빌드·미리보기 생성. 설정값은 `DEPLOYMENT.md` 참조.
3. 모바일·PC 실제 화면과 버튼 검수 → 고객 시안 확인.
4. 고객 도메인 zone·기존 DNS 검토 → 발급된 네임서버 및 Custom domains 연결 → HTTPS 확인.
5. 정식 공개 설정 후 네이버 서치어드바이저 소유 확인·사이트맵 제출 방법 안내.

네임서버 값과 검색 등록용 확인 정보는 실제 설정 과정에서 발급됩니다. 따라서 '지금 자료만 받으면 고객의 추가 조작이 전혀 없다'고 약속하지 않습니다. 제작과 파일 수정은 연결 작업과 별개로 계속 진행합니다.

## 공식 문서

- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/
- https://developers.cloudflare.com/fundamentals/manage-members/manage/
- https://developers.cloudflare.com/fundamentals/manage-members/roles/
- https://developers.cloudflare.com/pages/configuration/custom-domains/
