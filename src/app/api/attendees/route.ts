import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function generateAttendeeNo(): Promise<number> {
  const max = await prisma.attendee.aggregate({ _max: { attendeeNo: true } })
  return (max._max.attendeeNo ?? 0) + 1
}

async function generateUniqueCode(): Promise<string> {
  let code: string
  let exists = true
  while (exists) {
    code = String(Math.floor(1000 + Math.random() * 9000))
    const existing = await prisma.attendee.findUnique({ where: { code } })
    exists = !!existing
  }
  return code!
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search   = searchParams.get('search') ?? ''
    const sortBy   = searchParams.get('sortBy') ?? 'attendeeNo'
    const order    = (searchParams.get('order') ?? 'asc') as 'asc' | 'desc'
    const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const pageSize = Math.max(1, parseInt(searchParams.get('pageSize') ?? '10', 10))

    const where = search
      ? {
          OR: [
            { participantsName:            { contains: search, mode: 'insensitive' as const } },
            { transactionNoTransfereeName: { contains: search, mode: 'insensitive' as const } },
            { emailOrPhoneNo:              { contains: search, mode: 'insensitive' as const } },
            { code:                        { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const allowedSort = [
      'attendeeNo', 'participantsName', 'emailOrPhoneNo', 'code',
      'amount', 'transactionMode', 'adultParticipants', 'under15Participants',
      'isPresent', 'createdAt',
    ]
    const safeSort = allowedSort.includes(sortBy) ? sortBy : 'attendeeNo'

    const [
      attendees, total,
      totalPresent,
      totalOnSpotCount,
      totalParticipantsResult,
      totalPresentParticipantsResult,
      totalOnSpotParticipantsResult,
      totalAmountResult,
      totalPresentAmountResult,
      totalOnSpotAmountResult,
    ] = await Promise.all([
      prisma.attendee.findMany({
        where,
        orderBy: { [safeSort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.attendee.count({ where }),
      prisma.attendee.count({ where: { isPresent: true } }),
      prisma.attendee.count({ where: { isOnSpotRegistration: true } }),
      prisma.attendee.aggregate({
        _sum: { adultParticipants: true, under15Participants: true },
      }),
      prisma.attendee.aggregate({
        where: { isPresent: true },
        _sum: { adultParticipants: true, under15Participants: true },
      }),
      prisma.attendee.aggregate({
        where: { isOnSpotRegistration: true },
        _sum: { adultParticipants: true, under15Participants: true },
      }),
      prisma.attendee.aggregate({ _sum: { amount: true } }),
      prisma.attendee.aggregate({ where: { isPresent: true }, _sum: { amount: true } }),
      prisma.attendee.aggregate({ where: { isOnSpotRegistration: true }, _sum: { amount: true } }),
    ])

    return NextResponse.json({
      attendees,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      totalPresent,
      totalUnder15Participants: totalParticipantsResult._sum.under15Participants ?? 0,
      totalAdultParticipants:   totalParticipantsResult._sum.adultParticipants ?? 0,
      totalPresentParticipants:
        (totalPresentParticipantsResult._sum.adultParticipants ?? 0) +
        (totalPresentParticipantsResult._sum.under15Participants ?? 0),
      totalOnSpotCount,
      totalOnSpotParticipants:
        (totalOnSpotParticipantsResult._sum.adultParticipants ?? 0) +
        (totalOnSpotParticipantsResult._sum.under15Participants ?? 0),
      totalAmount:        totalAmountResult._sum.amount ?? 0,
      totalPresentAmount: totalPresentAmountResult._sum.amount ?? 0,
      totalOnSpotAmount:  totalOnSpotAmountResult._sum.amount ?? 0,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch attendees' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      participantsName,
      emailOrPhoneNo,
      under15Participants,
      adultParticipants,
      transactionNoTransfereeName,
      transactionMode,
      amount,
      isOnSpotRegistration,
    } = body

    if (!participantsName?.trim()) {
      return NextResponse.json({ error: 'Participants name is required' }, { status: 400 })
    }

    const [attendeeNo, code] = await Promise.all([
      generateAttendeeNo(),
      generateUniqueCode(),
    ])

    const onSpot = Boolean(isOnSpotRegistration)
    const now = new Date()
    const registrationDate = now.toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })

    const attendee = await prisma.attendee.create({
      data: {
        participantsName:            participantsName.trim(),
        emailOrPhoneNo:              (emailOrPhoneNo ?? '').trim(),
        under15Participants:         Math.max(0, parseInt(String(under15Participants), 10) || 0),
        adultParticipants:           Math.max(0, parseInt(String(adultParticipants), 10) || 0),
        transactionNoTransfereeName: (transactionNoTransfereeName ?? '').trim(),
        transactionMode:             transactionMode ?? '',
        amount:                      parseFloat(String(amount)) || 0,
        isOnSpotRegistration:        onSpot,
        isPresent:                   onSpot,
        registrationDate,
        code,
        attendeeNo,
      },
    })

    return NextResponse.json(attendee, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create attendee' }, { status: 500 })
  }
}
