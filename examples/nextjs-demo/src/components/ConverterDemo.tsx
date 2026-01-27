'use client'

import { useState } from 'react'
import { useConverter } from '@haro/jpform-react'

export function ConverterDemo() {
  const [hankakuInput, setHankakuInput] = useState('')
  const [kanaInput, setKanaInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')

  const {
    toHankaku,
    toZenkaku,
    toKatakana,
    toHiragana,
    normalizePhone,
  } = useConverter()

  return (
    <div className="section">
      <h2>文字変換ユーティリティ</h2>
      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
        useConverter フックで全角/半角変換、カナ変換などが簡単に行えます。
      </p>

      {/* 全角半角変換 */}
      <div className="form-group">
        <label>全角 → 半角変換</label>
        <input
          type="text"
          value={hankakuInput}
          onChange={(e) => setHankakuInput(e.target.value)}
          placeholder="全角で入力: １２３ＡＢＣ"
        />
        {hankakuInput && (
          <div className="result">
            <div className="grid">
              <div>
                <div className="result-label">toHankaku()</div>
                <div className="result-value">{toHankaku(hankakuInput)}</div>
              </div>
              <div>
                <div className="result-label">toZenkaku()</div>
                <div className="result-value">{toZenkaku(hankakuInput)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* カナ変換 */}
      <div className="form-group" style={{ marginTop: '1.5rem' }}>
        <label>カナ変換</label>
        <input
          type="text"
          value={kanaInput}
          onChange={(e) => setKanaInput(e.target.value)}
          placeholder="ひらがな/カタカナで入力: やまだたろう"
        />
        {kanaInput && (
          <div className="result">
            <div className="grid">
              <div>
                <div className="result-label">toKatakana()</div>
                <div className="result-value">{toKatakana(kanaInput)}</div>
              </div>
              <div>
                <div className="result-label">toHiragana()</div>
                <div className="result-value">{toHiragana(kanaInput)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 電話番号正規化 */}
      <div className="form-group" style={{ marginTop: '1.5rem' }}>
        <label>電話番号正規化</label>
        <input
          type="text"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          placeholder="電話番号: ０３（１２３４）５６７８"
        />
        {phoneInput && (
          <div className="result">
            <div className="result-label">normalizePhone()</div>
            <div className="result-value">{normalizePhone(phoneInput)}</div>
          </div>
        )}
      </div>
    </div>
  )
}
