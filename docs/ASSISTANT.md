# 무료 이용 도우미 운영 안내

2026-09-19 고객 Cloudflare 계정의 Workers plans 화면에서 Free / Current plan을 확인했습니다. 유료 전환은 하지 않았습니다.

## 방문자가 받는 답변

- 요금·예약 방법·주차·운영 시간·연습 용도·시설·오시는 길은 홈페이지에 반영된 안내를 사용합니다.
- 기본 버튼/명확한 질문은 브라우저에서 즉시 답해 AI 사용량을 쓰지 않습니다.
- 나머지 질문은 Workers AI의 llama-3.2-3b-instruct가 주제 하나만 고릅니다. 화면에는 모델이 새로 쓴 답 대신 고객이 확인한 안내문을 표시합니다.
- 예약 가능 시간·예약 내역·취소는 네이버 또는 전화 문의로 연결합니다. 예약자 인증이나 문 열기 기능은 없습니다.
- 입력은 200자 이내입니다. 개인정보 입력 금지 안내와 전화번호/이메일 일부 형식 검사가 있지만 모든 개인정보를 자동 탐지하는 기능은 아닙니다.
- 서버는 질문 내용을 애플리케이션 로그/DB에 저장하지 않습니다. AI로 보내는 질문은 Cloudflare가 처리합니다.

## 무료 한도와 장애

Cloudflare Workers AI의 현재 무료 할당량은 계정 전체 10,000 neurons/일입니다. 질문 길이에 따라 사용량이 달라지므로 특정 상담 건수를 보장하지 않습니다. 매일 UTC 00:00(한국 09:00)에 갱신됩니다.

Free 플랜에서는 한도를 넘으면 AI 요청이 제한됩니다. 자동 유료 전환을 설정하지 않았습니다. 기본 안내 버튼, 5개 정적 페이지, 예약·전화 링크는 계속 이용할 수 있도록 구성했습니다. Pages 함수 무료 요청 한도도 계정 전체에 적용됩니다. AI 경로만 함수로 실행하고 일반 페이지는 정적 자산으로 제공합니다.

현재 구성은 Free 플랜을 전제로 합니다. 향후 계정을 Paid로 바꾸면 무료량 초과 비용이 생길 수 있으므로 먼저 SMC_AI_ENABLED를 false로 바꾸고 재배포하거나 별도 사용량 제한을 검토하세요. 이 구현이 유료 계정의 청구를 강제로 차단하는 것은 아닙니다.

## 설정/끄기

- Pages → Settings → Preview 또는 Production → Bindings: Workers AI, 변수명 AI.
- Variables and secrets: 일반 Text 변수 SMC_AI_ENABLED=true. 민감정보/토큰이 아닙니다.
- 비활성화: 위 변수를 false로 바꾸고 재배포. 기본 안내는 유지됩니다.
- 위젯의 AI 연결 자체를 제거: content/site.json의 assistant.enabled=false로 빌드/배포. Worker 파일도 출력에서 제거합니다.
- 현재 운영 반영 여부는 NEXT_SESSION.md를 확인하세요. Preview 설정만으로 기존 Production이 바뀌지는 않습니다.

## 검증

npm run check:help는 다른 출처 요청·너무 긴 입력·일부 연락처·잘못된 모델 답변·무료한도 오류·AI 미설정·정적 파일 응답을 검사합니다. 실제 모델 응답은 배포 후 별도로 확인합니다. 모형 응답 테스트 통과만으로 실제 AI 연결 성공이라고 보고하지 않습니다.

공식 기준: [Workers AI 요금](https://developers.cloudflare.com/workers-ai/platform/pricing/) / [Pages AI 바인딩](https://developers.cloudflare.com/pages/functions/bindings/#workers-ai) / [직접 업로드](https://developers.cloudflare.com/pages/get-started/direct-upload/).
