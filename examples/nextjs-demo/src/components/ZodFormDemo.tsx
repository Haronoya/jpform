'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { postalCodeSchema, phoneSchema } from '@haro/jpform-zod'
import { usePostalCode, useConverter } from '@haro/jpform-react'

const formSchema = z.object({
  postalCode: postalCodeSchema(),
  phone: phoneSchema(),
  name: z.string().min(1, '氏名を入力してください'),
})

type FormData = z.infer<typeof formSchema>

export function ZodFormDemo() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postalCode: '',
      phone: '',
      name: '',
    },
  })

  const postalCode = watch('postalCode')
  const { normalizePostalCode } = useConverter()
  const normalizedPostalCode = normalizePostalCode(postalCode)
  const { addresses } = usePostalCode(normalizedPostalCode)
  const address = addresses[0]

  const onSubmit = (data: FormData) => {
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <div className="section">
      <h2>Zod + React Hook Form</h2>
      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
        @haro/jpform-zod のスキーマを React Hook Form と組み合わせて使用できます。
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="name">氏名</label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={errors.name ? 'error' : ''}
            placeholder="山田 太郎"
          />
          {errors.name && (
            <p className="error-message">{errors.name.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="postalCode">郵便番号</label>
          <input
            id="postalCode"
            type="text"
            {...register('postalCode')}
            className={errors.postalCode ? 'error' : ''}
            placeholder="100-0001"
          />
          {errors.postalCode && (
            <p className="error-message">{errors.postalCode.message}</p>
          )}
          {address && (
            <p style={{ fontSize: '0.85rem', color: '#0070f3', marginTop: '0.25rem' }}>
              → {address.prefecture} {address.city} {address.town}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">電話番号</label>
          <input
            id="phone"
            type="text"
            {...register('phone')}
            className={errors.phone ? 'error' : ''}
            placeholder="03-1234-5678"
          />
          {errors.phone && (
            <p className="error-message">{errors.phone.message}</p>
          )}
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>
          送信
        </button>
      </form>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
        <strong>バリデーション:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>郵便番号: 7桁の数字（ハイフン可）</li>
          <li>電話番号: 有効な日本の電話番号</li>
        </ul>
      </div>
    </div>
  )
}
