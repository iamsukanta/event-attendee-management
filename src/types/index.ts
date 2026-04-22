export interface Attendee {
  id: number
  attendeeNo: number
  code: string
  registrationDate: string
  participantsName: string
  under15Participants: number
  adultParticipants: number
  transactionNoTransfereeName: string
  emailOrPhoneNo: string
  transactionMode: string
  amount: number
  isPresent: boolean
  isOnSpotRegistration: boolean
  createdAt: string
  updatedAt: string
}

export type SortField =
  | 'attendeeNo'
  | 'participantsName'
  | 'emailOrPhoneNo'
  | 'code'
  | 'amount'
  | 'transactionMode'
  | 'adultParticipants'
  | 'under15Participants'
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
  totalUnder15Participants: number
  totalAdultParticipants: number
  totalPresentParticipants: number
  totalOnSpotCount: number
  totalOnSpotParticipants: number
  totalOnSpotAmount: number
  totalAmount: number
  totalPresentAmount: number
}

export const ON_SPOT_TRANSACTION_MODES = ['Cash', 'PayPal', 'Bank Transfer', 'Other'] as const
export type OnSpotTransactionMode = (typeof ON_SPOT_TRANSACTION_MODES)[number]
