import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '@haro/jpform Demo',
  description: '日本の業務フォーム向けHeadless UIライブラリのデモ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
