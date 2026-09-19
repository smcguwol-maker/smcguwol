# SMC 프리미엄 홈페이지 수정 안내

2026-09-19 기준. 별도의 유료 관리자 서비스 없이 고객 GitHub 저장소의 원본 파일로 관리합니다.

## 어디를 수정하나요?

| 내용 | 원본 파일 |
| --- | --- |
| 업체명·대표전화·예약/문의 링크 | content/site.json |
| 추가 예약·공실 문의번호 | content/site.json의 inquiryPhones |
| 주차 안내(FAQ·위치·도우미) | content/site.json의 parking과 faq 내 주차 답변 |
| 주소·운영시간·연습 용도 | content/site.json의 address / hours / practiceUses |
| 방 번호·사진·설명·예약 방식 | content/site.json의 gallery 각 항목과 room |
| 30분 요금과 부가 안내 | content/site.json의 rates / rateNote |
| FAQ 질문·답변 | content/site.json의 faq |
| 첫 화면·영상 영역 | src/index.html |
| 홈의 유튜브 영상 목록·제목 | content/site.json의 videos (id와 title) |
| 소개 웹툰 원본·대체 설명·크기 | content/site.json의 webtoon / assets/smc-introduction-webtoon.jpg |
| 공간/예약/시설/오시는 길 본문 | src/pages/rooms.html / booking.html / guide.html / visit.html |
| 공통 헤더·큰 로고·메뉴·푸터 | src/layout.html |
| 화면 디자인·사진 프레임 | src/styles.css |
| 사진 확대·방 선택·영상 재생·상담 UI | src/app.js |
| 기본 상담 내용·질문 분류 | scripts/help-config.mjs |
| AI 요청 처리 | src/help-worker.js |

public 폴더는 자동 생성되는 배포 파일이므로 직접 수정하지 않습니다. 사진 원본은 assets에 보관합니다. 새로운 기능·알림톡·예약 조회는 별도 개발 범위입니다.

소개 웹툰은 홈의 미리보기에서 이용 안내의 `/guide/#webtoon`으로 연결됩니다. 전체 그림은 자르지 않고 원본 비율로 표시하며, 누르면 원본 이미지를 새 탭에서 크게 볼 수 있습니다. `webtoon.src`, `alt`, `width`, `height`를 교체하면 두 위치에 함께 반영됩니다. 장면의 글 설명은 scripts/pages.mjs의 webtoon-transcript 부분에 있습니다.

## 요금·사진을 바꿀 때

요금은 30분 기준입니다. 고정 금액은 3,500원처럼 적으면 1시간 금액을 2배로 계산합니다. 개인룸처럼 변동이면 자동 계산하지 않습니다. 현재 최소 예약시간은 1시간입니다.

사진은 assets에 먼저 추가한 뒤 gallery 항목의 src, alt, width, height와 방 정보를 수정합니다. 실제 원본 크기를 넣으세요. 2·10번방 세로 사진은 정사각 프레임에 채우고 position 값으로 위치를 조절합니다. 확대 화면에서는 원본 비율 전체를 볼 수 있습니다. 원본 이미지 파일을 늘이거나 합성하지 않습니다.

7개 방은 room.number 순서로 표시됩니다. 사진 배열의 첫 항목은 공유 대표 사진이며, 첫 화면 사진은 hero에서 별도로 정합니다. 2번방은 확인된 커즈와일, 5번은 야마하 C6 홀, 10번은 야마하 G3 그랜드로 구분합니다.

## 수정 내용을 사이트에 반영하기

1. codex/smc-design-review에서 원본을 수정합니다.
2. Node.js 20 이상에서 npm run build를 실행합니다.
3. npm run check, npm run check:release, npm run check:help로 검사합니다.
4. npm run preview로 로컬 서버를 열어 PC·모바일 화면을 확인합니다.
5. 고객 Pages 프로젝트에 public의 내용 전체를 업로드합니다. 검토본은 npm run build:preview 후 Preview에 올립니다.
6. 발급된 주소에서 메뉴·사진·예약 링크·상담을 다시 확인합니다.

현재 Cloudflare는 직접 업로드 방식입니다. GitHub 파일을 저장했다는 사실만으로 배포가 끝나지는 않습니다. 기존 배포를 먼저 삭제할 필요는 없습니다.

## 상담·통계·검색

AI의 무료 한도 및 설정은 ASSISTANT.md를 참고하세요. 기본 안내 버튼은 AI를 호출하지 않습니다. 요금이나 정책을 수정하면 다시 빌드/배포하여 브라우저 안내와 서버 안내를 함께 갱신합니다. 전화번호나 출입코드를 상담 데이터에 넣지 마세요.

공식 도메인의 Cloudflare Web Analytics 등록이 이미 존재합니다. 새 계정/새 추적 서비스를 중복 가입하지 않습니다. 수집 여부와 확인 경로는 최신 인수인계를 참고하세요.

content/site.json의 publish=true는 기존 정식 공개 설정입니다. 프리미엄 검토본은 --preview 옵션으로 검색을 제외합니다. 검색 제외는 로그인 보호가 아닙니다. 정식 5페이지 배포 후 사이트맵에 새 5개 주소가 포함됩니다.

네이버 소유 확인은 content/site.json의 naverVerification에 발급된 메타태그의 content 값만 넣은 후 빌드/배포합니다. 현재 값이 비어 있다면 등록 완료라고 안내하지 않습니다. 검색 노출 순위나 반영 시점은 보장하지 않습니다.

## 보관·이전

src, scripts, content, assets, docs, package.json을 함께 보관하세요. GitHub Code → Download ZIP으로 전체 소스를 받을 수 있습니다. START_HERE.html은 간단한 파일 안내입니다. main 병합과 정식 배포는 해당 승인 범위를 확인한 뒤 진행합니다.
