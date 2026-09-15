# SMC GitHub 연결 권한 확인 안내

최종 확인일: 2026-09-15. 저장소 https://github.com/smcguwol-maker/smcguwol

## 최신 상태: 연결 정상

고객님이 `smcguwol`만 선택해 설치·인증한 뒤 고객 계정 `smcguwol-maker`의 앱 설치 ID `161894829`가 조회됐습니다. 저장소 선택은 `selected`이며, 작업 연결 계정은 기존 `woowon9909`입니다.

제작용 `package.json` 내용을 실제 Git blob으로 저장해 쓰기 성공을 확인했습니다. 결과 SHA는 `22e8e055eafb799cefd4435fcf307a26b3a26824`입니다. 이 SHA 자체는 당시 파일 데이터 저장 결과이며 브랜치 커밋 또는 배포를 의미하지 않습니다.

**이전 403 오류는 해결됐습니다. 앱 재설치·협업자 재초대는 필요하지 않습니다.** 이번 제작본의 검토 브랜치는 `codex/smc-design-review`입니다. 고객 저장소 소유권은 유지하며, Cloudflare 자동 배포 연결은 별도입니다.

아래는 문제 해결 이전 기록과 필요할 때 참고하는 설정 방법입니다. 다시 수행할 작업 목록이 아닙니다.

## 이전 상태: 2026-09-14

| 구분 | 상태 |
| --- | --- |
| 저장소 소유자 | 고객 `smcguwol-maker` |
| ChatGPT 연결 GitHub 사용자 | 제작자 `woowon9909` |
| 저장소 메타데이터의 사용자 권한 | `push: true`, `admin: false` |
| 사용 앱 | OpenAI의 **ChatGPT Codex Connector**, 재연결 완료 |
| 현재 연결에서 조회 가능한 GitHub App 설치 | `woowon9909` 계정 1개, ID `161757282`, 저장소 선택 `all` |
| 고객 계정의 앱 설치 | 현재 연결에서 조회되지 않음. 고객 실제 설정 화면은 미확인 |
| 재연결 후 실제 파일 쓰기 | 제작 파일 `package.json` 내용으로 Create a blob 1회 → `403 Resource not accessible by integration` |
| 이전 별도 협업자 권한 조회 | 같은403. 저장소 메타데이터 읽기는 성공 |

사용자 계정의 쓰기 권한과 연결 앱의 API 권한은 별개입니다. 재연결 뒤 실제 파일 저장 요청도403으로 거부되어 현재 인증의 권한 부족은 확인됐습니다. 고객 계정의 실제 앱 설정은 아직 직접 확인하지 않았으므로 앱 미설치만이 유일한 원인이라고 단정하지 않습니다. 고객 계정의 동일 앱 설치 여부, 대상 저장소, 파일 쓰기 권한을 확인하는 것이 다음 조치입니다. 새 파일/커밋은 반영하지 않았으며 권한 변경 전에는 쓰기를 반복하지 않습니다.

## 1. 우원님 쪽 확인 완료

ChatGPT 플러그인 상세 화면의 **연결됨 → 다시 연결**을 통해 재연결했습니다. 사용자 캡처에서 앱 이름 **ChatGPT Codex Connector**, 설치 계정 **woowon9909**, code 읽기·쓰기 요청 권한을 확인했고 공식 앱 페이지에서도 이름·개발자(OpenAI)를 확인했습니다.

재연결 뒤 우원님 계정의 앱 설치 1개가 조회됩니다. 화면의 **All repositories**는 그 설치 대상 계정의 저장소에 적용됩니다. 고객님 소유인 `smcguwol-maker/smcguwol`이 자동 포함되는 것은 아닙니다. 우원님 재연결만으로 고객 저장소 쓰기가 해결되지는 않았습니다.

## 2. 고객님: 고객 저장소에 동일 앱 접근 설정

확인된 앱은 **ChatGPT Codex Connector**입니다. 공식 설치 주소는 https://github.com/apps/chatgpt-codex-connector/installations/new 입니다.

1. GitHub에 고객 계정 `smcguwol-maker`로 로그인합니다.
2. 오른쪽 위 프로필 사진 → **Settings** → **Applications** → **Installed GitHub Apps**를 엽니다.
3. **ChatGPT Codex Connector**를 찾아 **Configure**를 누릅니다.
4. **Repository access**에서 **Only select repositories**를 선택합니다.
5. **Select repositories**에서 **smcguwol**을 추가하고 **Save**를 누릅니다. 이미 선택되어 있으면 선택 상태를 유지합니다.
6. **Permissions**에서 파일 내용에 대한 쓰기 권한을 확인합니다. 파일 쓰기에는 **Contents: Read and write**에 해당하는 권한이 필요합니다. 읽기 전용인 경우 저장소 선택만으로 쓰기 권한이 생기지 않습니다. 앱이 제공하지 않는 권한을 임의로 추가하는 드롭다운이 있다고 가정하지 않습니다.

앱이 목록에 없다면 위 공식 설치 주소로 이동해 설치 계정 `smcguwol-maker`와 **Only select repositories → smcguwol**을 선택합니다. 요청 권한을 확인한 뒤 고객이 **Install** 또는 **Install & Authorize**를 누릅니다. 고객 개인 계정 소유 저장소이므로 우원님 개인 계정에 앱을 설치하는 것만으로는 이 저장소 접근 설정이 완료되지 않습니다.

현재 이미 승인한 앱이 읽기 전용만 제공하거나 추가 권한 승인 화면이 있는 경우에는 해당 앱 이름·Permissions 화면을 먼저 확인해야 합니다. 같은 앱을 반복해서 삭제·설치하는 것으로 해결된다고 보장하지 않습니다.

## 3. 설정 후 연결 다시 확인

- 고객님은 앱의 **Repository access에 smcguwol이 선택된 화면**과 **Permissions 화면**을 전달합니다.
- 필요하면 우원님 ChatGPT의 GitHub 플러그인에서 기존 `woowon9909` 계정으로 다시 연결합니다. 고객 계정으로 우원님 ChatGPT를 바꿔 연결하지 않습니다.
- 이 대화에서 설치 목록·대상 저장소 접근 상태를 재조회합니다. 새 권한 상태가 확인되면 실제 제작 파일로 쓰기를 검증하고 업로드를 이어갑니다.
- 설치·저장소 선택·쓰기 권한이 맞는데도403이 유지되면 현재 연결의 인증 발급 또는 서비스 문제를 추가 확인해야 합니다. 그때도 저장소 이전·협업자 재초대를 먼저 반복하지 않습니다.

고객 저장소 소유권과 Cloudflare 계정 소유권은 그대로 유지합니다. 비밀번호나 개인 액세스 토큰을 채팅으로 전달할 필요는 없습니다.

## 완료 기준

설치됨 표시나 저장소 읽기 성공만으로 완료 처리하지 않습니다. 고객 저장소에서 실제 제작 파일 쓰기가 성공해야 GitHub 업로드가 가능하다고 판정합니다. 현재는 업로드·배포 미완료입니다.

## 확인한 공식 문서

- 앱 이름·개발자: https://github.com/apps/chatgpt-codex-connector
- ChatGPT 플러그인 메뉴·설치·연결 구분: https://learn.chatgpt.com/ko-KR/docs/plugins
- GitHub의 설치와 사용자 승인 차이, 계정별 설치: https://docs.github.com/en/apps/using-github-apps/installing-a-github-app-from-a-third-party
- GitHub Installed GitHub Apps, Configure, Repository access, Save: https://docs.github.com/en/apps/using-github-apps/reviewing-and-modifying-installed-github-apps
- GitHub Resource not accessible 오류: https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api#resource-not-accessible
- 실제 파일 쓰기에 필요한 Contents 권한: https://docs.github.com/en/rest/git/blobs#create-a-blob
