/**
 * 日本郵便の郵便番号データをダウンロードして変換するスクリプト
 *
 * 使い方: pnpm run update-postal-data
 *
 * データソース: https://www.post.japanpost.jp/zipcode/download.html
 */

import { createWriteStream, existsSync, mkdirSync, createReadStream } from 'node:fs'
import { writeFile, unlink } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import { createInterface } from 'node:readline'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const POSTAL_DATA_URL = 'https://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip'
const OUTPUT_PATH = join(__dirname, '../packages/postal/data/postal.json')
const TEMP_DIR = join(__dirname, '../.temp')
const TEMP_ZIP = join(TEMP_DIR, 'ken_all.zip')
const TEMP_CSV = join(TEMP_DIR, 'KEN_ALL.CSV')

// 都道府県一覧
const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県',
  '山形県', '福島県', '茨城県', '栃木県', '群馬県',
  '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県',
  '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県',
  '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県',
  '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県',
  '鹿児島県', '沖縄県',
]

const PREFECTURES_KANA = [
  'ホッカイドウ', 'アオモリケン', 'イワテケン', 'ミヤギケン', 'アキタケン',
  'ヤマガタケン', 'フクシマケン', 'イバラキケン', 'トチギケン', 'グンマケン',
  'サイタマケン', 'チバケン', 'トウキョウト', 'カナガワケン', 'ニイガタケン',
  'トヤマケン', 'イシカワケン', 'フクイケン', 'ヤマナシケン', 'ナガノケン',
  'ギフケン', 'シズオカケン', 'アイチケン', 'ミエケン', 'シガケン',
  'キョウトフ', 'オオサカフ', 'ヒョウゴケン', 'ナラケン', 'ワカヤマケン',
  'トットリケン', 'シマネケン', 'オカヤマケン', 'ヒロシマケン', 'ヤマグチケン',
  'トクシマケン', 'カガワケン', 'エヒメケン', 'コウチケン', 'フクオカケン',
  'サガケン', 'ナガサキケン', 'クマモトケン', 'オオイタケン', 'ミヤザキケン',
  'カゴシマケン', 'オキナワケン',
]

type PostalData = {
  prefs: string[]
  prefsKana: string[]
  cities: Record<string, string[]>
  citiesKana: Record<string, string[]>
  data: Record<string, Array<[number, number, string, string?]>>
}

async function downloadFile(url: string, dest: string): Promise<void> {
  console.log(`Downloading ${url}...`)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status}`)
  }
  const fileStream = createWriteStream(dest)
  // @ts-expect-error Node.js types don't match
  await pipeline(response.body, fileStream)
  console.log(`Downloaded to ${dest}`)
}

async function extractZip(zipPath: string, destDir: string): Promise<void> {
  console.log(`Extracting ${zipPath}...`)
  const AdmZip = (await import('adm-zip')).default
  const zip = new AdmZip(zipPath)
  zip.extractAllTo(destDir, true)
  console.log(`Extracted to ${destDir}`)
}

async function parseCSV(csvPath: string): Promise<PostalData> {
  console.log(`Parsing ${csvPath}...`)

  const cities: Record<string, string[]> = {}
  const citiesKana: Record<string, string[]> = {}
  const data: Record<string, Array<[number, number, string, string?]>> = {}

  // 都道府県ごとの市区町村マップ
  const cityIndexMap: Record<string, Map<string, number>> = {}

  // Shift_JISをUTF-8に変換
  const iconv = (await import('iconv-lite')).default
  const fileStream = createReadStream(csvPath).pipe(iconv.decodeStream('Shift_JIS'))
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  for await (const line of rl) {
    const fields = parseCSVLine(line)

    if (fields.length < 9) continue

    const postalCode = fields[2]?.replace(/"/g, '') ?? ''
    const cityKanaRaw = fields[4]?.replace(/"/g, '') ?? ''
    const townKanaRaw = fields[5]?.replace(/"/g, '') ?? ''
    const pref = fields[6]?.replace(/"/g, '') ?? ''
    const city = fields[7]?.replace(/"/g, '') ?? ''
    const town = fields[8]?.replace(/"/g, '') ?? ''

    // 半角カナを全角カナに変換
    const cityKana = hankakuToZenkakuKana(cityKanaRaw)
    const townKana = hankakuToZenkakuKana(townKanaRaw)

    if (!postalCode || postalCode.length !== 7) continue

    // 都道府県インデックス
    const prefIndex = PREFECTURES.indexOf(pref)
    if (prefIndex === -1) continue

    const prefCode = String(prefIndex + 1).padStart(2, '0')

    // 市区町村インデックス
    if (!cityIndexMap[prefCode]) {
      cityIndexMap[prefCode] = new Map()
      cities[prefCode] = []
      citiesKana[prefCode] = []
    }

    let cityIndex = cityIndexMap[prefCode]!.get(city)
    if (cityIndex === undefined) {
      cityIndex = cities[prefCode]!.length
      cityIndexMap[prefCode]!.set(city, cityIndex)
      cities[prefCode]!.push(city)
      citiesKana[prefCode]!.push(cityKana)
    }

    // 町域名の正規化
    const normalizedTown = normalizeTown(town)
    const normalizedTownKana = normalizeTown(townKana)

    // データ追加
    if (!data[postalCode]) {
      data[postalCode] = []
    }

    // 重複チェック
    const exists = data[postalCode]!.some(
      ([pi, ci, t]) => pi === prefIndex && ci === cityIndex && t === normalizedTown
    )

    if (!exists) {
      if (normalizedTownKana) {
        data[postalCode]!.push([prefIndex, cityIndex, normalizedTown, normalizedTownKana])
      } else {
        data[postalCode]!.push([prefIndex, cityIndex, normalizedTown])
      }
    }
  }

  console.log(`Parsed ${Object.keys(data).length} postal codes`)

  return {
    prefs: PREFECTURES,
    prefsKana: PREFECTURES_KANA,
    cities,
    citiesKana,
    data
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

function normalizeTown(town: string): string {
  // 「以下に掲載がない場合」などを空文字に
  if (town.includes('以下に掲載がない場合')) {
    return ''
  }
  return town
}

// 半角カナから全角カナへの変換マップ
const HANKAKU_TO_ZENKAKU_KANA: Record<string, string> = {
  'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
  'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
  'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
  'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
  'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
  'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
  'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
  'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
  'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
  'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
  'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
  'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ', 'ｯ': 'ッ',
  'ﾞ': '゛', 'ﾟ': '゜', 'ｰ': 'ー',
  '(': '（', ')': '）',
}

// 濁点・半濁点の結合マップ
const DAKUTEN_MAP: Record<string, string> = {
  'カ゛': 'ガ', 'キ゛': 'ギ', 'ク゛': 'グ', 'ケ゛': 'ゲ', 'コ゛': 'ゴ',
  'サ゛': 'ザ', 'シ゛': 'ジ', 'ス゛': 'ズ', 'セ゛': 'ゼ', 'ソ゛': 'ゾ',
  'タ゛': 'ダ', 'チ゛': 'ヂ', 'ツ゛': 'ヅ', 'テ゛': 'デ', 'ト゛': 'ド',
  'ハ゛': 'バ', 'ヒ゛': 'ビ', 'フ゛': 'ブ', 'ヘ゛': 'ベ', 'ホ゛': 'ボ',
  'ウ゛': 'ヴ',
  'ハ゜': 'パ', 'ヒ゜': 'ピ', 'フ゜': 'プ', 'ヘ゜': 'ペ', 'ホ゜': 'ポ',
}

/**
 * 半角カナを全角カナに変換
 */
function hankakuToZenkakuKana(str: string): string {
  // まず単純な置換
  let result = ''
  for (const char of str) {
    result += HANKAKU_TO_ZENKAKU_KANA[char] ?? char
  }

  // 濁点・半濁点の結合
  for (const [from, to] of Object.entries(DAKUTEN_MAP)) {
    result = result.replaceAll(from, to)
  }

  return result
}

async function main() {
  try {
    // 一時ディレクトリ作成
    if (!existsSync(TEMP_DIR)) {
      mkdirSync(TEMP_DIR, { recursive: true })
    }

    // ダウンロード
    await downloadFile(POSTAL_DATA_URL, TEMP_ZIP)

    // 展開
    await extractZip(TEMP_ZIP, TEMP_DIR)

    // パース
    const data = await parseCSV(TEMP_CSV)

    // 出力
    console.log(`Writing to ${OUTPUT_PATH}...`)
    await writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2))
    console.log('Done!')

    // クリーンアップ
    await unlink(TEMP_ZIP).catch(() => {})
    await unlink(TEMP_CSV).catch(() => {})

  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
