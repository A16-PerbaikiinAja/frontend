export interface Coupon {
  id: string;
  code: string;
  couponType: 'PERCENTAGE' | 'FIXED' | 'RANDOM';
  discount_amount: number;
  max_usage: number;
  start_date: string;
  end_date: string;
}
