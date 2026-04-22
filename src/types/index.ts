export interface Attendee {
  id: number
  name: string
  email: string
  attendeeNo: number
  code: string
  amount: number
  paymentMethod: string
  quantity: number
  isPresent: boolean
  isOnspot: boolean
  comment: string | null
  createdAt: string
  updatedAt: string
}

export type SortField =
  | 'name'
  | 'email'
  | 'attendeeNo'
  | 'code'
  | 'amount'
  | 'paymentMethod'
  | 'quantity'
  | 'isPresent'
  | 'createdAt'

export type SortOrder = 'asc' | 'desc'

export interface AttendeeListResponse {
  attendees: Attendee[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  totalPresent: number
  totalQuantity: number
  totalPresentQuantity: number
  totalOnspotQuantity: number
  totalAmount: number
  totalPresentAmount: number
}

export const PAYMENT_METHODS = ['PayPal', 'Bank Transfer', 'Cash'] as const
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]
