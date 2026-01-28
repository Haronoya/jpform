# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-01-26

### Added

#### @haro/jpform-core
- 文字変換関数: `toHankaku`, `toZenkaku`, `toKatakana`, `toHiragana`, `toZenkakuKana`
- 郵便番号ユーティリティ: `normalizePostalCode`, `formatPostalCode`
- 電話番号ユーティリティ: `normalizePhone`, `extractPhoneDigits`
- バリデーション関数: `isValidPostalCode`, `isValidPhone`, `isMobilePhone`, `isLandlinePhone`, `isFreeDialPhone`
- 型定義: `Prefecture`, `PrefectureCode`, `JPAddress`
- 都道府県ユーティリティ: `PREFECTURES`, `getPrefectureCode`, `getPrefectureName`, `isPrefecture`

#### @haro/jpform-postal
- `PostalResolver` インターフェース
- `BundledResolver` - 同梱データを使用した郵便番号解決
- `ApiResolver` - 外部API（zipcloud）を使用した郵便番号解決
- `CustomResolver` - カスタム関数による郵便番号解決
- `resolvePostalCode` - 便利関数

#### @haro/jpform-react
- `usePostalCode` - 郵便番号から住所を解決するHook
- `useConverter` - 文字変換ユーティリティを提供するHook
- `useInputConverter` - 入力変換ハンドラを生成するHook
- `JPFormProvider` - 設定を提供するContext Provider

#### @haro/jpform-zod
- `postalCodeSchema` - 郵便番号のZodスキーマ
- `phoneSchema` - 電話番号のZodスキーマ
- `addressSchema` - 住所のZodスキーマ

#### @haro/jpform-testing
- `faker.address()` - ランダムな住所生成
- `faker.phone()` - ランダムな電話番号生成
- `faker.mobile()` - ランダムな携帯電話番号生成
- `faker.person()` - ランダムな氏名生成
