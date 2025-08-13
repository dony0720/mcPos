// 기본 색상 팔레트 정의
const colorPalette = {
  gray: '#6B7280',
  blue: '#3B82F6',
  green: '#10B981',
  purple: '#8B5CF6',
  orange: '#F59E0B',
  indigo: '#6366F1',
  emerald: '#44D7BE',
  red: '#EF4444',
  yellow: '#F59E0B',
} as const;

// 기본 카드 스타일 템플릿
const createBaseCardStyle = () => ({
  bg: 'bg-white',
  border: 'border-gray-200',
  titleColor: 'text-gray-600',
  amountColor: 'text-gray-900',
});

// 컬러 테마 카드 스타일 생성 함수
const createColoredCardStyle = (color: keyof typeof colorPalette) => ({
  bg: `bg-${color}-50`,
  border: `border-${color}-200`,
  iconColor: colorPalette[color],
  titleColor: `text-${color}-600`,
  amountColor: `text-${color}-900`,
});

// 부드러운 blue 테마 스타일 생성 함수
const createSoftBlueCardStyle = () => ({
  bg: 'bg-blue-50',
  border: 'border-blue-200',
  iconColor: colorPalette.blue,
  titleColor: 'text-blue-600',
  amountColor: 'text-blue-900',
});

// 5만원권 전용 노란색 테마 스타일
const createYellowCardStyle = () => ({
  bg: 'bg-yellow-100',
  border: 'border-yellow-300',
  iconColor: colorPalette.yellow,
  titleColor: 'text-yellow-700',
  amountColor: 'text-yellow-900',
});

// 1만원권 전용 초록색 테마 스타일
const createGreenCardStyle = () => ({
  bg: 'bg-green-100',
  border: 'border-green-300',
  iconColor: colorPalette.green,
  titleColor: 'text-green-700',
  amountColor: 'text-green-900',
});

// 5천원권 전용 오렌지색 테마 스타일
const createOrangeCardStyle = () => ({
  bg: 'bg-orange-100',
  border: 'border-orange-300',
  iconColor: colorPalette.orange,
  titleColor: 'text-orange-700',
  amountColor: 'text-orange-900',
});

// 인디고 전용 테마 스타일
const createIndigoCardStyle = () => ({
  bg: 'bg-indigo-100',
  border: 'border-indigo-300',
  iconColor: colorPalette.indigo,
  titleColor: 'text-indigo-700',
  amountColor: 'text-indigo-900',
});

// 에메랄드 전용 테마 스타일
const createEmeraldCardStyle = () => ({
  bg: 'bg-emerald-100',
  border: 'border-emerald-300',
  iconColor: colorPalette.emerald,
  titleColor: 'text-emerald-700',
  amountColor: 'text-emerald-900',
});

// 기본 카드 스타일 (흰색 배경 + 컬러 아이콘)
const createBaseCardStyleWithColor = (color: keyof typeof colorPalette) => ({
  ...createBaseCardStyle(),
  iconColor: colorPalette[color],
});

// 일반 카드 테마 - 일부는 컬러 배경, 일부는 흰색 배경
export const cardThemeStyles = {
  gray: createBaseCardStyleWithColor('gray'),
  blue: createSoftBlueCardStyle(),
  green: createGreenCardStyle(),
  purple: createBaseCardStyleWithColor('purple'),
  orange: createOrangeCardStyle(),
  indigo: createIndigoCardStyle(),
  emerald: createEmeraldCardStyle(),
  red: createBaseCardStyleWithColor('red'),
  yellow: createYellowCardStyle(),
} as const;

// 매출 정보 카드 전용 테마 - 모든 테마가 흰색 배경 + 컬러 아이콘
export const salesCardThemeStyles = Object.fromEntries(
  Object.keys(colorPalette).map(color => [
    color,
    createBaseCardStyleWithColor(color as keyof typeof colorPalette),
  ])
) as Record<
  keyof typeof colorPalette,
  ReturnType<typeof createBaseCardStyleWithColor>
>;

import { CashTheme, SalesTheme } from '../../types';

export type CashCardTheme = CashTheme;
export type SalesInfoCardTheme = SalesTheme;
