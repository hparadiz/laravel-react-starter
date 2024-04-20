# Quick Starter for a React Native Web App built on Tamagui with a Laravel back-end

### Requirements
PHP 8.1, MariaDB, NodeJS

#### To Build Android
OpenJDK-17

## Quick Start

- `composer install`
- `cd react-app`
- `npm i`

## Running Dev Server
`php -S localhost:8383 -t ./public`


## Compiling Web
- `cd react-app`
- `./node_modules/.bin/webpack --config webpack.config.js --watch`

## Compiling Android
- `cd react-app`
- `react-native bundle --platform android --dev false --entry-file ./src/index.tsx --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
- `cd android`
- `./gradlew assembleDebug`
- Your APK should be in `react-app/android/app/build/outputs/apk/debug/app-debug.apk`