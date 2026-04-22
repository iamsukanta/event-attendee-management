import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numId = parseInt(id, 10)
    if (isNaN(numId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

    const body = await req.json()
    const { name, email, attendeeNo, code, amount, paymentMethod, quantity, comment, isOnspot, isPresent } = body

    if (email) {
      const conflict = await prisma.attendee.findFirst({
        where: { email: email.trim().toLowerCase(), NOT: { id: numId } },
      })
      if (conflict) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
      }
    }

    if (code) {
      const codeConflict = await prisma.attendee.findFirst({
        where: { code: String(code), NOT: { id: numId } },
      })
      if (codeConflict) {
        return NextResponse.json({ error: 'Code already in use' }, { status: 409 })
      }
    }

    const updated = await prisma.attendee.update({
      where: { id: numId },
      data: {
        ...(name          !== undefined && { name: String(name).trim() }),
        ...(email         !== undefined && { email: String(email).trim().toLowerCase() }),
        ...(attendeeNo    !== undefined && { attendeeNo: parseInt(String(attendeeNo), 10) }),
        ...(code          !== undefined && { code: String(code) }),
        ...(amount        !== undefined && { amount: parseFloat(String(amount)) }),
        ...(paymentMethod !== undefined && { paymentMethod: String(paymentMethod) }),
        ...(quantity      !== undefined && { quantity: Math.max(1, parseInt(String(quantity), 10)) }),
        ...(comment       !== undefined && { comment: comment ? String(comment).trim() || null : null }),
        ...(isOnspot      !== undefined && { isOnspot: Boolean(isOnspot) }),
        ...(isPresent     !== undefined && { isPresent: Boolean(isPresent) }),
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update attendee' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numId = parseInt(id, 10)
    if (isNaN(numId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

    await prisma.attendee.delete({ where: { id: numId } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete attendee' }, { status: 500 })
  }
}
