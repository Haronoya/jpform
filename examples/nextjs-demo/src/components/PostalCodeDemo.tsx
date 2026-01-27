'use client'

import { useState } from 'react'
import { usePostalCode, useConverter } from '@haro/jpform-react'

export function PostalCodeDemo() {
  const [inputValue, setInputValue] = useState('')
  const { normalizePostalCode, formatPostalCode } = useConverter()

  // 正規化された値
  const normalizedPostalCode = normalizePostalCode(inputValue)

  // usePostalCodeに正規化された値を渡す（自動解決モード）
  const { addresses, isLoading, error } = usePostalCode(normalizedPostalCode)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const address = addresses[0]

  return (
    <div className="section">
      <h2>郵便番号から住所を自動入力</h2>
      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
        usePostalCode フックを使用して、郵便番号から住所を自動補完します。
        全角数字やハイフン付きでも入力できます。
      </p>

      <div className="form-group">
        <label htmlFor="postal">郵便番号</label>
        <input
          id="postal"
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="例: 100-0001"
        />
        {normalizedPostalCode && (
          <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.25rem' }}>
            正規化: {formatPostalCode(normalizedPostalCode)} ({normalizedPostalCode.length}桁)
          </p>
        )}
      </div>

      {isLoading && <p className="loading">検索中...</p>}

      {error && <p className="error-message">エラー: {error.message}</p>}

      {address && (
        <div className="result">
          <div className="grid">
            <div>
              <div className="result-label">都道府県</div>
              <div className="result-value">{address.prefecture}</div>
            </div>
            <div>
              <div className="result-label">市区町村</div>
              <div className="result-value">{address.city}</div>
            </div>
            <div>
              <div className="result-label">町域</div>
              <div className="result-value">{address.town || '（なし）'}</div>
            </div>
            <div>
              <div className="result-label">都道府県コード</div>
              <div className="result-value">{address.prefectureCode}</div>
            </div>
          </div>
          {address.prefectureKana && (
            <div style={{ marginTop: '1rem' }}>
              <div className="result-label">カナ</div>
              <div className="result-value">
                {address.prefectureKana} {address.cityKana} {address.townKana}
              </div>
            </div>
          )}
        </div>
      )}

      {!address && normalizedPostalCode.length === 7 && !isLoading && (
        <p style={{ color: '#666', marginTop: '1rem' }}>
          該当する住所が見つかりませんでした
        </p>
      )}

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
        <strong>試してみてください:</strong> 1000001, １００－０００１, 〒100-0001
      </div>
    </div>
  )
}
