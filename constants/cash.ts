// 현금 관리 관련 상수 및 enum 정의

// 현금 서랍 카드 테마 enum
export enum CashTheme {
  YELLOW = 'yellow',
  GREEN = 'green',
  ORANGE = 'orange',
  BLUE = 'blue',
  GRAY = 'gray',
}

// 매출 정보 카드 테마 enum
export enum SalesTheme {
  GRAY = 'gray',
  BLUE = 'blue',
  EMERALD = 'emerald',
  RED = 'red',
  GREEN = 'green',
  PURPLE = 'purple',
  ORANGE = 'orange',
  INDIGO = 'indigo',
}

// 현금 서랍 아이템 타입
export interface CashDrawerItem {
  type: string;
  title: string;
  theme: CashTheme;
  quantity: number;
  unitValue: number;
}
