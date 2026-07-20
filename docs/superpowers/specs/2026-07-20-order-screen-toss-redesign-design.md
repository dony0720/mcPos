# 주문 화면 Toss 스타일 리디자인 (Phase 1)

## 배경

`claude.ai/design` 프로젝트("Toss 바 차트 디자인 시스템")의 `CafePOS.dc.html` 목업을 기준으로,
mcPos 앱의 UI를 Toss 디자인 시스템 스타일(그린 포인트 `#03b26c`, Pretendard 폰트, 큰 radius)로
단계적으로 리디자인한다. 목업은 iPad 가로 화면(1194×834) 기준 6개 화면(주문/결제수단/키패드/결제완료/거래내역/대시보드)을
담고 있지만, 이번 Phase 1은 **주문 화면 1개**만 다룬다. 나머지 5개 화면은 이후 별도 스펙으로 순서대로 진행한다.

별개로 논의된 "테이블 QR 주문" 확장(손님이 QR로 주문 → 백엔드 → POS 태블릿 실시간 반영)은
백엔드 신설이 필요한 완전히 다른 프로젝트이므로 이번 스펙의 범위에서 제외한다.

## 목표

- 주문 화면(`app/(tabs)/index.tsx`)의 레이아웃을 세로 스택(그리드 위 + 주문내역 아래)에서
  Toss 목업과 같은 **좌(메뉴 그리드) / 우(고정 주문서 패널) 2컬럼 구조**로 전환한다.
- 색상(`primaryGreen`), 폰트(Pretendard), radius 등 비주얼 토큰을 Toss 스타일로 교체한다.
- 앱 전체 방향을 세로(portrait) → **가로 고정(landscape_left)**으로 전환한다.
- 기존 기능(카테고리 필터, 메뉴 추가/상세모달, 수량 증감, 항목 삭제, 할인 표시, 관리자모드, 결제 화면 이동)은
  전부 그대로 유지한다 — 시각적 레이어만 바꾸고 동작/스토어 로직은 건드리지 않는다.

## 비범위 (Non-goals)

- 결제/키패드/결제완료/거래내역/대시보드 화면 리디자인 → 다음 단계에서 순서대로 진행
- 장부(ledger), 시재(cash), 관리(menuManagement 등) 화면의 스타일 변경 → 이번엔 그대로 둠.
  가로 전환으로 인해 이 화면들이 일시적으로 세로 레이아웃인 채 가로 화면에 렌더링되어
  어색해 보일 수 있음을 인지하고 있으며, 이는 의도된 임시 상태다.
- 테이블 QR 주문, 백엔드/실시간 동기화 — 완전히 별도 프로젝트

## 레이아웃 구조

현재(`app/(tabs)/index.tsx`):
```
헤더(로고 + 관리자모드)
CategoryTabs
MenuGrid (flex-13, 3열)
"주문 내역" 타이틀
OrderSection (flex-7, 그리드 아래 가로 배치: 리스트 70% + 합계/결제버튼 30%)
```

변경 후:
```
헤더(로고 + "영업중" 배지 + 관리자모드)
┌─────────────────────────────┬──────────────────┐
│ CategoryTabs (pill 스타일)     │ 주문서 패널 (고정폭)   │
│ MenuGrid (4열, 카드 radius↑)  │  - 헤더: "주문서 · 총 N개" + 전체삭제 │
│                              │  - 장바구니 리스트(스크롤)         │
│                              │  - 합계(상품금액/할인/결제금액)     │
│                              │  - 결제하기 버튼(전체폭, 큼)        │
└─────────────────────────────┴──────────────────┘
```
좌측 ≈70%, 우측 패널 ≈30% 고정폭. "주문 내역" 별도 타이틀 텍스트는 주문서 패널 헤더로 흡수되어 제거.

## 비주얼 토큰

`tailwind.config.js`:
- `primaryGreen`: `#2CC56F` → `#03b26c`
- 카드/버튼 radius를 전반적으로 확대 (`rounded-lg` 계열 → `rounded-2xl`/`rounded-[18px]` 수준)

폰트:
- Pretendard(Regular/SemiBold/Bold)를 `assets/fonts/`에 추가하고 `expo-font`(`useFonts`)로 로드
- 제목/가격 등 큰 텍스트에 자간(letter-spacing) 살짝 좁게 적용

## 컴포넌트별 변경

- **헤더** (`app/(tabs)/index.tsx` 상단): 로고 + "영업중" 배지(장식용, 토글 기능 없음) + 관리자모드 버튼.
  목업의 매장명/담당자/테이블 항목은 대응 기능이 없어 제외.
- **`CategoryTabs`**: 밑줄 탭 → pill 버튼. 선택 시 그린 배경(`#03b26c`) + 흰 글씨, 미선택 시 흰 배경 + 회색 글씨.
- **`MenuGrid` / `MenuItem`**: 3열 → 4열 그리드, 카드 radius 확대. 실제 메뉴 이미지(`item.image`)는
  그대로 사용하고, 목업의 색상 블록(tint)은 이미지가 없을 때의 fallback 배경으로만 사용.
- **`OrderSection` / `OrderItem`**: 그리드 아래 가로 배치 → 우측 고정 패널로 이동.
  각 항목은 "이름/옵션 — 수량(−/+) — 금액" 한 줄 배치로 재구성(목업 참고),
  기존 할인 표시(원가 취소선 + 할인가)는 유지. 하단에 상품금액/할인/결제금액 요약과
  전체폭 결제하기 버튼 배치.

데이터 흐름(스토어/타입)은 변경 없음: `useOrderStore`(장바구니), `useMenuStore`(메뉴),
`useCategoryStore`(카테고리), `useAuthStore`(관리자모드), `/payment` 라우팅 그대로 사용.

## 가로 고정 설정

- `app.config.js`: `orientation: "portrait"` → `"landscape_left"`
- `ios/mcPos/Info.plist`의 `UISupportedInterfaceOrientations`를 landscape-left만 남도록 수정
- `android/app/src/main/AndroidManifest.xml`의 해당 Activity `android:screenOrientation`을
  `"landscape"`(Android는 iOS의 landscape-left에 해당하는 고정값이 별도로 없어 표준 landscape 단일 방향 값을 사용하고,
  기기에서 실제 회전 방향이 iOS와 일치하는지 확인 후 필요하면 `"reverseLandscape"`로 교체)로 수정
- 네이티브 프로젝트(`ios/`, `android/`)가 git에 커밋되어 있으므로 `expo prebuild --clean`으로
  덮어쓰지 않고, 위 두 네이티브 파일을 직접 수정한다.

## 검증 방법

`npm run ios`(또는 `npm run android`)로 실기기/시뮬레이터 실행 후:

- 앱이 가로 방향으로 고정되어 뜨는지, 기기를 돌려도 세로로 전환되지 않는지 확인
- 주문 화면에서 카테고리 전환, 메뉴 추가(옵션 모달 포함), 수량 증감, 항목 삭제,
  할인 적용된 항목의 원가/할인가 표시, 관리자모드 로그인/로그아웃, "결제하기" 버튼으로
  `/payment` 이동까지 실제로 조작하며 확인
- 다른 탭(장부/시재/관리)으로 이동해 가로 화면에서 깨지지 않고 최소한 조작 가능한 상태인지 확인(완벽한 리디자인은 아니어도 됨)
