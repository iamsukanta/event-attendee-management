import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

async function generateAttendeeNo(): Promise<number> {
  const max = await prisma.attendee.aggregate({ _max: { attendeeNo: true } })
  return (max._max.attendeeNo ?? 0) + 1
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
            { name:  { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { code:  { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const allowedSort = ['name','email','attendeeNo','code','amount','paymentMethod','quantity','isPresent','createdAt']
    const safeSort = allowedSort.includes(sortBy) ? sortBy : 'attendeeNo'

    const [
      attendees, total,
      totalPresent,
      totalQtyResult,
      totalPresentQtyResult,
      totalOnspotQtyResult,
      totalAmountResult,
      totalPresentAmountResult,
    ] = await Promise.all([
      prisma.attendee.findMany({
        where,
        orderBy: { [safeSort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.attendee.count({ where }),
      prisma.attendee.count({ where: { isPresent: true } }),
      prisma.attendee.aggregate({ _sum: { quantity: true } }),
      prisma.attendee.aggregate({ where: { isPresent: true }, _sum: { quantity: true } }),
      prisma.attendee.aggregate({ where: { isOnspot: true }, _sum: { quantity: true } }),
      prisma.attendee.aggregate({ _sum: { amount: true } }),
      prisma.attendee.aggregate({ where: { isPresent: true }, _sum: { amount: true } }),
    ])

    const totalQuantity = totalQtyResult._sum.quantity ?? 0

    return NextResponse.json({
      attendees,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      totalPresent,
      totalQuantity,
      totalPresentQuantity: totalPresentQtyResult._sum.quantity ?? 0,
      totalOnspotQuantity:  totalOnspotQtyResult._sum.quantity ?? 0,
      totalAmount: totalAmountResult._sum.amount ?? 0,
      totalPresentAmount: totalPresentAmountResult._sum.amount ?? 0,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch attendees' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, amount, paymentMethod, quantity, comment, isOnspot } = body

    if (!name?.trim() || !email?.trim() || !paymentMethod) {
      return NextResponse.json({ error: 'Name, email, and payment method are required' }, { status: 400 })
    }

    const existing = await prisma.attendee.findUnique({ where: { email: email.trim() } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const [code, attendeeNo] = await Promise.all([
      generateUniqueCode(),
      generateAttendeeNo(),
    ])

    const attendee = await prisma.attendee.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        amount: parseFloat(amount) || 0,
        paymentMethod,
        quantity: Math.max(1, parseInt(quantity) || 1),
        comment: comment?.trim() || null,
        isOnspot: Boolean(isOnspot),
        code,
        attendeeNo,
        isPresent: Boolean(isOnspot),
      },
    })

    return NextResponse.json(attendee, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create attendee' }, { status: 500 })
  }
}
