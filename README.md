# MCPOS - React Native POS 시스템

React Native로 구현된 포인트 오브 세일(POS) 시스템입니다.

## 🚀 주요 기능

### 장부 관리 시스템

- **장부 등록**: 새로운 고객 장부 등록
- **장부 충전**: 기존 고객 장부에 금액 충전
- **장부 사용**: 장부에서 금액 사용 (결제 시)
- **거래 내역**: 모든 거래 내역 조회 및 관리
- **장부 삭제**: 고객 장부 삭제 (확인 모달 포함)

### 데이터 영속성

- **Zustand Persist**: AsyncStorage를 사용한 데이터 영구 저장
- **새로고침 후에도 데이터 유지**: 앱을 재시작해도 모든 데이터가 보존됨

## 🛠 기술 스택

- **React Native 0.79.3**
- **TypeScript 5.8.3**
- **Expo Router 5.1.0**
- **NativeWind 4.1.23** (Tailwind CSS for React Native)
- **Zustand** (상태 관리)
- **React Hook Form** (폼 관리)
- **Zod** (스키마 검증)
- **Expo Vector Icons**

## 📁 프로젝트 구조

```
mcPos/
├── app/                    # Expo Router 페이지
│   └── (tabs)/            # 탭 네비게이션
│       ├── ledger.tsx     # 장부 관리 페이지
│       └── ...
├── components/            # 재사용 가능한 컴포넌트
│   └── ledger/           # 장부 관련 컴포넌트
│       ├── ChargeModal.tsx
│       ├── HistoryModal.tsx
│       ├── LedgerRegistrationModal.tsx
│       ├── DeleteConfirmModal.tsx
│       └── ...
├── stores/               # Zustand 스토어
│   ├── ledgerStore.ts    # 장부 관리 스토어
│   └── index.ts
├── types/                # TypeScript 타입 정의
│   └── ledger.ts
└── schemas/              # Zod 스키마
    └── ledgerSchema.ts
```

## 🔧 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start

# iOS 시뮬레이터에서 실행
npm run ios

# Android 에뮬레이터에서 실행
npm run android
```

## 📱 주요 화면

### 장부 관리 페이지

- 고객 장부 목록 표시
- 장부 등록, 충전, 내역 조회, 삭제 기능
- 실시간 데이터 업데이트

### 장부 등록 모달

- 고객 정보 입력 (이름, 전화번호)
- 초기 충전 금액 설정
- 접수자 및 결제수단 선택
- 실시간 폼 검증

### 장부 충전 모달

- 충전 금액 입력
- 접수자 및 결제수단 선택
- 자동 회원번호 생성 (M001, M002, ...)

### 거래 내역 모달

- 모든 거래 내역 표시
- 거래 타입별 아이콘 및 색상 구분
- 거래 내역 삭제 기능

### 삭제 확인 모달

- 삭제 전 최종 확인
- 삭제할 장부 정보 표시
- 실수 방지 기능

## 💾 데이터 저장

### Zustand Persist 설정

```typescript
persist(
  (set, get) => ({
    // 스토어 로직
  }),
  {
    name: 'ledger-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: state => ({
      ledgerData: state.ledgerData,
      transactions: state.transactions,
    }),
  }
);
```

### 저장되는 데이터

- **ledgerData**: 고객 장부 정보
- **transactions**: 고객별 거래 내역

## 🔄 상태 관리

### 주요 액션

- `registerLedger`: 장부 등록
- `chargeLedger`: 장부 충전
- `useLedger`: 장부 사용
- `deleteLedger`: 장부 삭제
- `deleteTransaction`: 거래 내역 삭제

### 모달 상태 관리

- `isRegistrationModalVisible`: 등록 모달
- `isChargeModalVisible`: 충전 모달
- `isHistoryModalVisible`: 내역 모달
- `isDeleteConfirmModalVisible`: 삭제 확인 모달

## 🎨 UI/UX 특징

- **반응형 디자인**: 다양한 화면 크기 지원
- **일관된 디자인 시스템**: NativeWind 클래스 사용
- **직관적인 네비게이션**: 탭 기반 네비게이션
- **사용자 친화적 모달**: 확인 및 경고 모달 포함

## 🔒 데이터 검증

### Zod 스키마 검증

- 이름: 한글, 영문, 공백만 허용
- 전화번호: 010-0000-0000 형식
- 금액: 1,000원 ~ 1,000,000원 범위
- 필수 필드 검증

## 🚀 향후 계획

- [ ] 장부 검색 기능
- [ ] 거래 내역 필터링
- [ ] 데이터 백업/복원
- [ ] 다중 사용자 지원
- [ ] 오프라인 모드 지원

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
