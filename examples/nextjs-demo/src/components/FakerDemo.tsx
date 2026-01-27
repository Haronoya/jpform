'use client'

import { useState } from 'react'
import { faker } from '@haro/jpform-testing'

export function FakerDemo() {
  const [addressResult, setAddressResult] = useState<string>('')
  const [personResult, setPersonResult] = useState<string>('')
  const [phoneResult, setPhoneResult] = useState<string>('')

  const generateAddress = () => {
    const address = faker.address()
    setAddressResult(JSON.stringify(address, null, 2))
  }

  const generatePerson = () => {
    const person = faker.person()
    setPersonResult(JSON.stringify(person, null, 2))
  }

  const generatePhone = () => {
    const phones = {
      phone: faker.phone(),
      mobile: faker.mobile(),
      landline: faker.landline(),
      freeDial: faker.freeDial(),
    }
    setPhoneResult(JSON.stringify(phones, null, 2))
  }

  return (
    <div className="section">
      <h2>テストデータ生成（Faker）</h2>
      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
        @haro/jpform-testing のfakerでテスト用のダミーデータを生成できます。
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={generateAddress}>住所を生成</button>
        <button onClick={generatePerson}>氏名を生成</button>
        <button onClick={generatePhone}>電話番号を生成</button>
      </div>

      {addressResult && (
        <div style={{ marginTop: '1rem' }}>
          <div className="result-label">faker.address()</div>
          <pre className="faker-result">{addressResult}</pre>
        </div>
      )}

      {personResult && (
        <div style={{ marginTop: '1rem' }}>
          <div className="result-label">faker.person()</div>
          <pre className="faker-result">{personResult}</pre>
        </div>
      )}

      {phoneResult && (
        <div style={{ marginTop: '1rem' }}>
          <div className="result-label">faker.phone() / mobile() / landline() / freeDial()</div>
          <pre className="faker-result">{phoneResult}</pre>
        </div>
      )}
    </div>
  )
}
