'use client';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export default function CreateCouponPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    couponType: 'PERCENTAGE',
    discount_amount: '',
    max_usage: '',
    start_date: '',
    end_date: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const body = {
      couponType: form.couponType,
      discount_amount: Number(form.discount_amount),
      max_usage: Number(form.max_usage),
      start_date: form.start_date + 'T00:00:00',
      end_date: form.end_date + 'T23:59:59',
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Error:', errorText)
        throw new Error(`Status ${res.status}`)
      }

      router.push('/dashboard/')
    } catch (err) {
      console.error(err)
      alert('Failed to create coupon')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New Coupon</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Coupon Type</Label>
              <Select value={form.couponType} onValueChange={value => setForm(f => ({ ...f, couponType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED">Fixed</SelectItem>
                  <SelectItem value="RANDOM">Random</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Discount Amount</Label>
              <Input name="discount_amount" type="number" value={form.discount_amount} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label>Max Usage</Label>
              <Input name="max_usage" type="number" value={form.max_usage} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label>Start Date</Label>
              <Input name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label>End Date</Label>
              <Input name="end_date" type="date" value={form.end_date} onChange={handleChange} required />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Create Coupon'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
