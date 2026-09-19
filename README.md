# SMC 인천 구월점 프리미엄 홈페이지

고객 소유 저장소의 HTML/CSS/JavaScript 홈페이지입니다. 2026-09-19 고객의 프리미엄 추가 결제 및 수정 요청을 반영해 5페이지로 확장했습니다.

## 구성

- 홈: 확대된 SMC 로고, 실제 공간 사진, 페이지 이동, 7개 방 썸네일, 유튜브·블로그·인스타그램.
- 공간과 요금: 1·2·3·4·5·9·10번방 사진 전환/확대, 전체 요금표 기본 펼침.
- 예약 안내: 일반방 네이버 예약, C6 홀·개인룸 전화 문의, 방문 순서.
- 이용 안내: 고객 제공 시설 장점, 연습/방송 용도, FAQ·주차 안내.
- 오시는 길: 주소·복사·길찾기, 대중교통·주변시설·주차, 예약·공실 문의.
- 이용 도우미: 기본 안내는 브라우저에서 즉시 답변. 추가 질문은 Cloudflare AI가 주제를 선택하고 확인된 안내문만 반환합니다.

자동 알림톡, 네이버 예약 내역 조회/검증, 출입 비밀번호 제공·발송은 포함하지 않습니다.

## 실행·검사

Node.js 20 이상. 빌드에 외부 패키지가 필요하지 않습니다.

~~~sh
npm run build
npm run check
npm run check:release
npm run check:help
npm run preview
~~~

로컬 주소는 서버가 출력한 주소를 엽니다. 5페이지는 사이트 루트 기준 경로를 사용하므로 HTML 파일을 더블클릭하는 방식으로 검수하지 않습니다.

검토용 빌드는 다음과 같습니다. content/site.json의 정식 공개 설정을 바꾸지 않고 검색 제외된 5페이지를 생성합니다.

~~~sh
npm run build:preview
node scripts/check.mjs --preview
~~~

## 배포

- 고객 계정: 733b1c8faa19799bf480b1192f473635 / Pages: smcguwol-review.
- 작업 브랜치: codex/smc-design-review. main은 변경/병합하지 않았습니다.
- 현재 프로젝트는 직접 업로드 방식입니다. GitHub 커밋만으로 자동 배포되지 않습니다.
- 배포 대상은 public 폴더의 **내용 전체**입니다. _worker.js와 _routes.json도 포함합니다.
- AI 사용 환경에 Workers AI 바인딩 AI와 일반 텍스트 변수 SMC_AI_ENABLED=true가 필요합니다. 무료 플랜 확인 후 설정합니다. 빠지면 기본 안내로 대체됩니다.
- _routes.json은 /api/help만 함수로 실행합니다. 일반 페이지와 사진은 정적 자산으로 제공됩니다.
- 최신 검토/정식 배포 여부 및 실제 링크는 [docs/NEXT_SESSION.md](docs/NEXT_SESSION.md)에서 확인하세요.

## 문서

- [프리미엄 계획과 합의](docs/PREMIUM_PLAN.md)
- [고객 수정 안내](docs/EDITING.md)
- [배포·검색 등록](docs/DEPLOYMENT.md)
- [AI 무료 운영과 제한](docs/ASSISTANT.md)
- [검수 및 인수인계](docs/NEXT_SESSION.md)

과거 A/B 원본은 src/design-*에 보존합니다. 프리미엄 검토 ZIP에는 과거 비교 시안을 넣지 않습니다. content/site.json에서 publish=false로 일반 빌드할 때만 과거 비교본이 생성됩니다.
