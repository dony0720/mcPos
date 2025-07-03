// 기본 색상 팔레트 정의
const colorPalette = {
  gray: "#6B7280",
  blue: "#3B82F6",
  green: "#10B981",
  purple: "#8B5CF6",
  orange: "#F59E0B",
  indigo: "#6366F1",
  emerald: "#10B981",
  red: "#EF4444",
  yellow: "#F59E0B",
} as const;

// 기본 카드 스타일 템플릿
const createBaseCardStyle = () => ({
  bg: "bg-white",
  border: "border-gray-200",
  titleColor: "text-gray-600",
  amountColor: "text-gray-900",
});

// 컬러 테마 카드 스타일 생성 함수
const createColoredCardStyle = (color: keyof typeof colorPalette) => ({
  bg: `bg-${color}-50`,
  border: `border-${color}-200`,
  iconColor: colorPalette[color],
  titleColor: `text-${color}-600`,
  amountColor: `text-${color}-900`,
});

// 기본 카드 스타일 (흰색 배경 + 컬러 아이콘)
const createBaseCardStyleWithColor = (color: keyof typeof colorPalette) => ({
  ...createBaseCardStyle(),
  iconColor: colorPalette[color],
});

// 일반 카드 테마 - 일부는 컬러 배경, 일부는 흰색 배경
export const cardThemeStyles = {
  gray: createBaseCardStyleWithColor("gray"),
  blue: createColoredCardStyle("blue"),
  green: createColoredCardStyle("green"),
  purple: createBaseCardStyleWithColor("purple"),
  orange: createColoredCardStyle("orange"),
  indigo: createBaseCardStyleWithColor("indigo"),
  emerald: createBaseCardStyleWithColor("emerald"),
  red: createBaseCardStyleWithColor("red"),
  yellow: createColoredCardStyle("yellow"),
} as const;

// 매출 정보 카드 전용 테마 - 모든 테마가 흰색 배경 + 컬러 아이콘
export const salesCardThemeStyles = Object.fromEntries(
  Object.keys(colorPalette).map((color) => [
    color,
    createBaseCardStyleWithColor(color as keyof typeof colorPalette),
  ])
) as Record<
  keyof typeof colorPalette,
  ReturnType<typeof createBaseCardStyleWithColor>
>;

export type CardTheme = keyof typeof cardThemeStyles;
export type SalesCardTheme = keyof typeof salesCardThemeStyles;
