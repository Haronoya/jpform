'use client'

import { useState } from 'react'
import { PostalCodeDemo } from '@/components/PostalCodeDemo'
import { ConverterDemo } from '@/components/ConverterDemo'
import { ZodFormDemo } from '@/components/ZodFormDemo'
import { FakerDemo } from '@/components/FakerDemo'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'postal' | 'converter' | 'zod' | 'faker'>('postal')

  return (
    <main className="container">
      <h1>@haro/jpform デモ</h1>
      <p className="description">
        日本の業務フォーム向けHeadless UIライブラリ
      </p>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'postal' ? 'active' : ''}`}
          onClick={() => setActiveTab('postal')}
        >
          郵便番号検索
        </button>
        <button
          className={`tab ${activeTab === 'converter' ? 'active' : ''}`}
          onClick={() => setActiveTab('converter')}
        >
          文字変換
        </button>
        <button
          className={`tab ${activeTab === 'zod' ? 'active' : ''}`}
          onClick={() => setActiveTab('zod')}
        >
          Zodバリデーション
        </button>
        <button
          className={`tab ${activeTab === 'faker' ? 'active' : ''}`}
          onClick={() => setActiveTab('faker')}
        >
          テストデータ生成
        </button>
      </div>

      {activeTab === 'postal' && <PostalCodeDemo />}
      {activeTab === 'converter' && <ConverterDemo />}
      {activeTab === 'zod' && <ZodFormDemo />}
      {activeTab === 'faker' && <FakerDemo />}
    </main>
  )
}
