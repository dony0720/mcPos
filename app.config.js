/**
 * Expo 앱 설정 파일
 * 환경변수를 사용하여 동적으로 앱 설정을 관리
 */

require('dotenv').config();

const config = {
  expo: {
    name: process.env.APP_NAME || "mcPos",
    slug: "mcPos",
    version: process.env.APP_VERSION || "1.0.0",
    orientation: "landscape_left",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mcpos.app"
    },
    android: {
      package: "com.mcpos.app",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: process.env.EAS_PROJECT_ID
      }
    }
  }
};

// 개발 환경에서만 추가 설정
if (process.env.APP_ENV === 'development') {
  config.expo.extra.debug = true;
  config.expo.extra.devTools = process.env.SHOW_DEV_TOOLS === 'true';
}

module.exports = config;
