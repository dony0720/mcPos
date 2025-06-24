export default {
  // 기본 설정
  semi: true, // 세미콜론 사용
  trailingComma: 'es5', // ES5에서 유효한 후행 쉼표
  singleQuote: true, // 작은따옴표 사용
  printWidth: 80, // 라인 길이 80자
  tabWidth: 2, // 탭 크기 2칸
  useTabs: false, // 스페이스 사용 (탭 대신)

  // JSX 관련 설정
  jsxSingleQuote: true, // JSX에서 작은따옴표 사용
  bracketSameLine: false, // JSX 태그의 `>`를 다음 줄에 배치 (jsxBracketSameLine 대체)

  // 기타 설정
  bracketSpacing: true, // 객체 리터럴에서 괄호 내부 공백
  arrowParens: 'avoid', // 화살표 함수 매개변수 괄호 (단일 매개변수일 때 생략)
  endOfLine: 'lf', // 줄바꿈 문자 (LF)

  // 파일별 설정
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always',
      },
    },
  ],
};
