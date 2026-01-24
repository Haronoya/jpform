# @haro/jpform 設計書 v1.0

## 概要

日本の業務フォームに特化したHeadless UIライブラリ。ロジックのみ提供し、UIは利用者に委ねる。

## 決定事項

- **パッケージ名**: `@haro/jpform-*`
- **郵便番号データ更新**: 月次（GitHub Actionsで自動化）
- **MVP範囲**: 全パッケージ（core, postal, react, zod, testing）

## 設計原則

1. **Headless First** - UIコンポーネントは提供しない。Hooks + ユーティリティのみ
2. **Tree-shakable** - 使わない機能はバンドルに含まれない
3. **Framework Agnostic Core** - コアロジックはReact非依存
4. **Type Safe** - 厳密な型定義
5. **Server/Client両対応** - App Router時代のServer Components対応

---

## パッケージ構成

```
packages/
├── core/                 # @haro/jpform-core - フレームワーク非依存のロジック
│   ├── converters/       # 全角半角変換など
│   ├── validators/       # バリデーション関数
│   └── types/            # 型定義
├── postal/               # @haro/jpform-postal - 郵便番号→住所解決
│   ├── resolvers/        # Resolver実装
│   └── data/             # 同梱データ
├── react/                # @haro/jpform-react - React Hooks
├── zod/                  # @haro/jpform-zod - Zodスキーマ
└── testing/              # @haro/jpform-testing - テストユーティリティ・faker
```

### 公開パッケージ（npm）

| パッケージ | 説明 | 依存 |
|-----------|------|------|
| `@haro/jpform-core` | 変換・バリデーション関数 | なし |
| `@haro/jpform-postal` | 郵便番号解決 | `@haro/jpform-core` |
| `@haro/jpform-react` | React Hooks | `@haro/jpform-core`, `@haro/jpform-postal` |
| `@haro/jpform-zod` | Zodスキーマ | `@haro/jpform-core`, `zod` |
| `@haro/jpform-testing` | Faker・テストユーティリティ | `@haro/jpform-core` |

---

## 実装範囲（全パッケージ）

### @haro/jpform-core

```typescript
// converters
export { toHankaku } from './converters/hankaku'
export { toZenkaku } from './converters/zenkaku'
export { toKatakana, toHiragana } from './converters/kana'
export { normalizePostalCode } from './converters/postal'

// validators
export { isValidPostalCode } from './validators/postal'
export { isValidPhone } from './validators/phone'

// types
export type { Prefecture, PrefectureCode } from './types/prefecture'
export type { JPAddress } from './types/address'
```

### @haro/jpform-postal

```typescript
// Resolver interface
export interface PostalResolver {
  resolve(postalCode: string): Promise<JPAddress[]>
}

// 実装
export { BundledResolver } from './resolvers/bundled'
export { createApiResolver } from './resolvers/api'
export { createCustomResolver } from './resolvers/custom'

// 便利関数
export { resolvePostalCode } from './resolve'
```

### @haro/jpform-react

```typescript
// Hooks
export { usePostalCode } from './hooks/usePostalCode'
export { useConverter } from './hooks/useConverter'

// Context (Resolver設定用)
export { JPFormProvider, useJPFormConfig } from './context'
```

---

## 型定義

### Prefecture（都道府県）

```typescript
export const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県',
  '山形県', '福島県', '茨城県', '栃木県', '群馬県',
  '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県',
  '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県',
  '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県',
  '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県',
  '鹿児島県', '沖縄県'
] as const

export type Prefecture = typeof PREFECTURES[number]

export type PrefectureCode =
  | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10'
  | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20'
  | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30'
  | '31' | '32' | '33' | '34' | '35' | '36' | '37' | '38' | '39' | '40'
  | '41' | '42' | '43' | '44' | '45' | '46' | '47'
```

### JPAddress（住所）

```typescript
export type JPAddress = {
  postalCode: string           // "1000001"
  prefecture: Prefecture       // "東京都"
  prefectureCode: PrefectureCode // "13"
  city: string                 // "千代田区"
  town: string                 // "千代田"
  prefectureKana?: string      // "トウキョウト"
  cityKana?: string            // "チヨダク"
  townKana?: string            // "チヨダ"
}
```

---

## React Hooks API設計

### usePostalCode

```typescript
type UsePostalCodeOptions = {
  resolver?: PostalResolver
  debounceMs?: number  // default: 300
}

type UsePostalCodeReturn = {
  addresses: JPAddress[]
  isLoading: boolean
  error: Error | null
  resolve: (postalCode: string) => Promise<void>
}

// 使用例
const { addresses, isLoading, error } = usePostalCode(postalCode)
```

### useConverter

```typescript
type UseConverterReturn = {
  toHankaku: (value: string) => string
  toZenkaku: (value: string) => string
  toKatakana: (value: string) => string
  toHiragana: (value: string) => string
  normalizePostalCode: (value: string) => string
}

// 使用例
const { toHankaku } = useConverter()
<input onChange={e => setValue(toHankaku(e.target.value))} />
```

---

## 郵便番号データ設計

### 圧縮形式

```typescript
// data/postal.json の構造
type PostalData = {
  // 都道府県辞書 (index = prefCode - 1)
  prefs: string[]  // ["北海道", "青森県", ...]

  // 市区町村辞書 (prefCode -> cities)
  cities: Record<string, string[]>  // { "01": ["札幌市中央区", ...], ... }

  // 郵便番号データ (postalCode -> [prefIndex, cityIndex, town, prefKana?, cityKana?, townKana?])
  data: Record<string, [number, number, string, string?, string?, string?]>
}
```

### データ生成スクリプト

- 日本郵便のKEN_ALL.csvをダウンロード
- 圧縮形式に変換
- `packages/postal/data/postal.json` に出力

---

## 技術スタック

- **ビルド**: tsup (esbuild)
- **パッケージ管理**: pnpm workspaces
- **テスト**: Vitest
- **型チェック**: TypeScript 5.x (strict)
- **リンター**: ESLint + Prettier
- **CI**: GitHub Actions

---

## ディレクトリ構造（詳細）

```
jpform/
├── packages/
│   ├── core/
│   │   ├── src/
│   │   │   ├── converters/
│   │   │   │   ├── hankaku.ts
│   │   │   │   ├── zenkaku.ts
│   │   │   │   ├── kana.ts
│   │   │   │   ├── postal.ts
│   │   │   │   └── index.ts
│   │   │   ├── validators/
│   │   │   │   ├── postal.ts
│   │   │   │   ├── phone.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   ├── prefecture.ts
│   │   │   │   ├── address.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── postal/
│   │   ├── src/
│   │   │   ├── resolvers/
│   │   │   │   ├── types.ts
│   │   │   │   ├── bundled.ts
│   │   │   │   ├── api.ts
│   │   │   │   ├── custom.ts
│   │   │   │   └── index.ts
│   │   │   ├── resolve.ts
│   │   │   └── index.ts
│   │   ├── data/
│   │   │   └── postal.json
│   │   ├── scripts/
│   │   │   └── build-data.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── react/
│   │   ├── src/
│   │   │   ├── hooks/
│   │   │   │   ├── usePostalCode.ts
│   │   │   │   ├── useConverter.ts
│   │   │   │   └── index.ts
│   │   │   ├── context/
│   │   │   │   ├── JPFormProvider.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── zod/
│   │   ├── src/
│   │   │   ├── schemas/
│   │   │   │   ├── postal.ts
│   │   │   │   ├── phone.ts
│   │   │   │   ├── address.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── testing/
│       ├── src/
│       │   ├── faker/
│       │   │   ├── address.ts
│       │   │   ├── phone.ts
│       │   │   ├── person.ts
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── scripts/
│   └── download-postal-data.ts
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── vitest.config.ts
└── README.md
```

---

## 実装順序

### Step 1: プロジェクト基盤
1. pnpm workspace設定
2. TypeScript設定（tsconfig.base.json）
3. ビルド設定（tsup）
4. テスト設定（Vitest）
5. ESLint + Prettier設定

### Step 2: @haro/jpform-core
1. 型定義（Prefecture, JPAddress）
2. converters実装（hankaku, zenkaku, kana, postal）
3. validators実装（postal, phone）
4. テスト作成

### Step 3: @haro/jpform-postal
1. Resolver interface定義
2. データ生成スクリプト作成
3. BundledResolver実装
4. ApiResolver実装（zipcloud対応）
5. テスト作成

### Step 4: @haro/jpform-react
1. JPFormProvider実装
2. usePostalCode Hook実装
3. useConverter Hook実装
4. テスト作成

### Step 5: @haro/jpform-zod
1. postalCodeSchema
2. phoneSchema
3. addressSchema
4. テスト作成

### Step 6: @haro/jpform-testing
1. faker.address()
2. faker.phone()
3. faker.person()（氏名生成）
4. テスト作成

### Step 7: ドキュメント・公開準備
1. README.md
2. CHANGELOG.md
3. npm publish設定
4. GitHub Actions CI/CD

---

## 検証方法

1. `pnpm install` - 依存関係インストール
2. `pnpm build` - 全パッケージビルド
3. `pnpm test` - 全テスト実行
4. `pnpm lint` - Lintチェック
5. サンプルNext.jsアプリで動作確認

---

## GitHub Actions（月次データ更新）

```yaml
# .github/workflows/update-postal-data.yml
name: Update Postal Data

on:
  schedule:
    - cron: '0 0 1 * *'  # 毎月1日 00:00 UTC
  workflow_dispatch:      # 手動実行も可能

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run update-postal-data
      - name: Create PR
        uses: peter-evans/create-pull-request@v5
        with:
          commit-message: 'chore: update postal data'
          title: '郵便番号データ更新'
          branch: update-postal-data
```
