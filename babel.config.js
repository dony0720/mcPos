module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      "react-native-reanimated/plugin", // react-native-reanimated v3 plugin
    ],
    // react-native-dotenv 는 반드시 node_modules 를 제외해야 합니다.
    // 이 플러그인은 process.env.* 을 전부 가로채서 리터럴로 치환하는데,
    // node_modules 전체(특히 expo-router의 내부 _ctx 파일)에 적용되면
    // expo-router가 EXPO_ROUTER_APP_ROOT 를 상대경로로 계산하기 전에
    // 절대경로 값으로 먼저 치환되어 라우트를 전혀 찾지 못하는 문제가 발생합니다.
    overrides: [
      {
        exclude: /node_modules/,
        plugins: [
          [
            "module:react-native-dotenv",
            {
              moduleName: "@env",
              path: ".env",
              blocklist: null,
              allowlist: null,
              safe: false,
              allowUndefined: true,
              verbose: false,
            },
          ],
        ],
      },
    ],
  };
};
