# @haro/jpform

日本の業務フォームに特化したHeadless UIライブラリ。ロジックのみ提供し、UIは利用者に委ねます。

## 特徴

- **Headless First** - UIコンポーネントは提供せず、Hooks + ユーティリティのみ
- **Tree-shakable** - 使わない機能はバンドルに含まれない
- **Framework Agnostic Core** - コアロジックはReact非依存
- **Type Safe** - 厳密な型定義
- **Server/Client両対応** - Next.js App Router対応

## パッケージ

| パッケージ | 説明 |
|-----------|------|
| `@haro/jpform-core` | 変換・バリデーション関数 |
| `@haro/jpform-postal` | 郵便番号→住所解決 |
| `@haro/jpform-react` | React Hooks |
| `@haro/jpform-zod` | Zodスキーマ |
| `@haro/jpform-testing` | Faker・テストユーティリティ |

## インストール

```bash
# React プロジェクト向け（推奨）
pnpm add @haro/jpform-react

# コア機能のみ
pnpm add @haro/jpform-core

# Zodスキーマ
pnpm add @haro/jpform-zod zod

# テストユーティリティ
pnpm add -D @haro/jpform-testing
```

## 使い方

### 郵便番号から住所を取得

```tsx
import { usePostalCode } from '@haro/jpform-react'

function AddressForm() {
  const [postalCode, setPostalCode] = useState('')
  const { addresses, isLoading } = usePostalCode(postalCode)

  return (
    <div>
      <input
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        placeholder="郵便番号"
      />
      {isLoading && <span>検索中...</span>}
      {addresses[0] && (
        <p>
          {addresses[0].prefecture}
          {addresses[0].city}
          {addresses[0].town}
        </p>
      )}
    </div>
  )
}
```

### 文字変換

```tsx
import { useConverter } from '@haro/jpform-react'

function NameInput() {
  const [value, setValue] = useState('')
  const { toHankaku, toKatakana } = useConverter()

  return (
    <input
      value={value}
      onChange={(e) => setValue(toHankaku(e.target.value))}
      placeholder="全角→半角自動変換"
    />
  )
}
```

### Zodバリデーション

```tsx
import { postalCodeSchema, phoneSchema, addressSchema } from '@haro/jpform-zod'
import { z } from 'zod'

const formSchema = z.object({
  postalCode: postalCodeSchema,
  phone: phoneSchema,
  address: addressSchema,
})

// React Hook Form との連携
const { register, handleSubmit } = useForm({
  resolver: zodResolver(formSchema),
})
```

### テストデータ生成

```tsx
import { faker } from '@haro/jpform-testing'

// ランダムな住所
const address = faker.address()
// { postalCode: '1000001', prefecture: '東京都', city: '千代田区', ... }

// ランダムな電話番号
const phone = faker.phone()       // '03-1234-5678'
const mobile = faker.mobile()     // '090-1234-5678'

// ランダムな氏名
const person = faker.person()
// { lastName: '山田', firstName: '太郎', lastNameKana: 'ヤマダ', ... }
```

## API リファレンス

### @haro/jpform-core

#### 変換関数

| 関数 | 説明 |
|------|------|
| `toHankaku(value)` | 全角→半角変換 |
| `toZenkaku(value)` | 半角→全角変換 |
| `toKatakana(value)` | ひらがな→カタカナ変換 |
| `toHiragana(value)` | カタカナ→ひらがな変換 |
| `toZenkakuKana(value)` | 半角カナ→全角カナ変換 |
| `normalizePostalCode(value)` | 郵便番号正規化（7桁数字） |
| `formatPostalCode(value)` | 郵便番号フォーマット（123-4567） |
| `normalizePhone(value)` | 電話番号正規化 |

#### バリデーション関数

| 関数 | 説明 |
|------|------|
| `isValidPostalCode(value)` | 有効な郵便番号か |
| `isValidPhone(value)` | 有効な電話番号か |
| `isMobilePhone(value)` | 携帯電話番号か |
| `isLandlinePhone(value)` | 固定電話番号か |
| `isFreeDialPhone(value)` | フリーダイヤルか |

#### 型定義

| 型 | 説明 |
|------|------|
| `Prefecture` | 都道府県名（47種） |
| `PrefectureCode` | 都道府県コード（01〜47） |
| `JPAddress` | 住所オブジェクト |

### @haro/jpform-postal

#### Resolver

```tsx
import {
  bundledResolver,    // 同梱データ（デフォルト）
  createApiResolver,  // 外部API（zipcloud）
  createCustomResolver, // カスタム
} from '@haro/jpform-postal'

// 同梱データを使用
const addresses = await bundledResolver.resolve('1000001')

// 外部APIを使用
const apiResolver = createApiResolver()
const addresses = await apiResolver.resolve('1000001')

// カスタムAPIを使用
const customResolver = createCustomResolver({
  resolve: async (postalCode) => {
    const res = await fetch(`/api/address?postal=${postalCode}`)
    return res.json()
  },
})
```

### @haro/jpform-react

#### Hooks

| Hook | 説明 |
|------|------|
| `usePostalCode(postalCode?, options?)` | 郵便番号→住所解決 |
| `useConverter()` | 文字変換ユーティリティ |
| `useInputConverter(converter, onChange)` | 入力変換ハンドラ生成 |

#### Provider

```tsx
import { JPFormProvider } from '@haro/jpform-react'
import { createApiResolver } from '@haro/jpform-postal'

// カスタムResolverを使用する場合
function App() {
  return (
    <JPFormProvider postalResolver={createApiResolver()} debounceMs={500}>
      <MyForm />
    </JPFormProvider>
  )
}
```

## 郵便番号データについて

デフォルトでは同梱データを使用するため、外部APIへのリクエストは発生しません。

- **データソース**: 日本郵便 郵便番号データ
- **更新頻度**: 月次（GitHub Actionsで自動更新）
- **ライセンス**: 日本郵便のデータは再配布可能

外部APIを使用する場合は `createApiResolver()` を使用してください（デフォルトは zipcloud API）。

## 開発

```bash
# 依存関係インストール
pnpm install

# ビルド
pnpm build

# テスト
pnpm test

# 型チェック
pnpm typecheck

# Lint
pnpm lint
```

## ライセンス

MIT
