# smcguwol
인천 구월동 음악연습실 SMC 홈페이지

## 첫 페이지 통합본 · 2026-09-17

고객 소유 GitHub 저장소와 Cloudflare Pages를 사용하는 정적 HTML/CSS/JavaScript 홈페이지입니다. 고객이 선호한 개선안 03을 첫 페이지에 통합했습니다. 현재는 **검색 제외된 미리보기**이며, 정식 도메인 공개는 별도 단계입니다. 실제 최신 확인 주소와 배포 결과는 [작업 인수인계](docs/NEXT_SESSION.md)를 참고하세요.

- 첫 화면: 인천 구월동 음악연습실 SMC
- 대표 사진: 실제 야마하 C6 홀, 사진 위에 공간명·방 번호 표시
- PC·태블릿·모바일용 반응형 스타일, 모바일 하단 예약 버튼
- 연습실 소개·시설 장점·실제 공간 갤러리·30분 기준 요금표·최소 1시간 예약 안내·FAQ 5개·오시는 길
- 공간별 이용 설명과 1시간 기본 이용금액 자동 표시, 네이버 플레이스 예약 탭 안내
- 네이버 예약, 전화, 카카오톡, 카카오맵, 인스타그램, 블로그 연결
- 검색엔진이 읽을 수 있는 정적 HTML과 LocalBusiness 구조화 데이터
- 확정 도메인 `근처연습실co.kr` 설정, 정식 공개 시 canonical·sitemap·robots 자동 생성
- 주소를 한 곳에서 수정하면 화면·주소 복사·구조화 데이터에 함께 반영
- 정식 공개용 공유 대표 이미지, 네이버 소유 확인 코드 입력 지원
- 사진 확대·메뉴·주소 복사 기능(지원 브라우저)

### 바로 보기

압축을 푼 뒤 **`smcguwol/START_HERE.html`**을 먼저 열면 시안 열기·요금 수정·사진 교체·전체 파일 보관 방법을 볼 수 있습니다. 이 안내는 공개 전 제작 상태를 기준으로 작성했으며 홈페이지 배포 폴더 밖에 있습니다.

전달한 ZIP의 압축을 풀고 `smcguwol/public/index.html`을 브라우저로 엽니다. 모든 이미지·스타일이 로컬 파일이므로 인터넷 없이도 본문과 사진을 볼 수 있습니다. 외부 예약·지도·연락 링크는 인터넷 또는 해당 앱이 필요합니다.

GitHub 연결과 실제 파일 데이터 쓰기를 확인했습니다. 이번 제작본은 `codex/smc-design-review` 검토 브랜치용입니다. GitHub에서 해당 브랜치를 선택하고 Code → Download ZIP으로 전체 파일을 보관할 수 있습니다. 고객 Cloudflare Pages 미리보기는 직접 업로드 방식이며 Git 자동 배포는 아직 연결되지 않았습니다.

### A/B 디자인 비교

`public/design/index.html`에서 A/B 및 개선안 03의 이력을 비교할 수 있습니다. 현재 `public/index.html`은 개선안 03의 디자인에 예약 절차·교통·문의·업체 정보를 통합한 전체 첫 페이지입니다.

비교 페이지는 `publish: false`일 때만 생성하며, 정식 공개 빌드에서는 `public/design/` 전체가 제거됩니다. 통합 첫 페이지와 사진·기능은 정식 빌드에도 유지됩니다.

### 수정 및 배포

- [디자인 차별화 목표·레퍼런스·다음 비교 시안 기준](docs/DESIGN_DIRECTION.md)
- [GitHub 연결 권한 확인 안내](docs/GITHUB_ACCESS.md)
- [고객 계정·자동 배포·도메인 준비 안내](docs/CLIENT_SETUP.md)
- [사진·문구 수정 안내](docs/EDITING.md)
- [Cloudflare Pages 배포·도메인·검색 등록 안내](docs/DEPLOYMENT.md)
- [사진 출처·해상도·확인 항목](docs/ASSETS.md)
- [검수 결과와 남은 작업](docs/QA.md)
- [고객이 확인한 도메인·사진·요금 근거](docs/CONTENT_SOURCES.md)
- [제공 링크별 열람 상태와 확보하지 못한 자료](docs/SOURCE_ACCESS.md)

```sh
npm run build
npm run check
npm run check:design
npm run check:release
```

빌드 의존성 없음. Node.js 20 이상. Cloudflare 빌드 명령은 `node scripts/build.mjs`, 출력 폴더는 `public`입니다. 고객이 수정할 원본은 `src/`, `content/`, `assets/`입니다.

빌드는 `content/site.json`에서 실제 사용하는 사진만 `public/assets/`에 복사합니다. 이전에 사용하던 배포용 사진은 다시 빌드할 때 정리하며, 원본 `assets/`는 보존합니다. `START_HERE.html`은 `src/guide.html`에서 생성합니다.

`check:release`는 임시 복사본에서만 공개 전환과 고객 수정 시나리오를 검증합니다. 실제 시안의 공개 상태와 외부 서비스는 변경하지 않습니다.

### 정식 공개 전

현재 `publish: false`이므로 시안 안내와 검색 제외 설정이 적용됩니다. **검색 제외는 비공개 인증 기능이 아닙니다.** 이 저장소는 공개 상태이며 파일을 아는 사람은 볼 수 있습니다.

고객이 도메인 `근처연습실co.kr`의 구매 완료와 사진·방 번호, 30분당 요금·최소 1시간 예약을 확인했습니다. Chrome PC·모바일 크기 검수를 진행했으며 실기기·Safari 검수는 남았습니다. 도메인·DNS·네임서버, main, 검색 공개는 변경하지 않았습니다. 외부 업체 정보의 주차·전화번호 차이와 Git 자동 배포 연결도 남아 있습니다. 카카오톡 예약 알림 자동화는 포함하지 않았습니다.
