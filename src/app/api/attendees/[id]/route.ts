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
    const {
      participantsName, emailOrPhoneNo, attendeeNo, code,
      under15Participants, adultParticipants,
      transactionNoTransfereeName, transactionMode,
      amount, registrationDate,
      isOnSpotRegistration, isPresent,
    } = body

    if (code !== undefined) {
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
        ...(participantsName            !== undefined && { participantsName: String(participantsName).trim() }),
        ...(emailOrPhoneNo              !== undefined && { emailOrPhoneNo: String(emailOrPhoneNo).trim() }),
        ...(attendeeNo                  !== undefined && { attendeeNo: parseInt(String(attendeeNo), 10) }),
        ...(code                        !== undefined && { code: String(code) }),
        ...(under15Participants         !== undefined && { under15Participants: Math.max(0, parseInt(String(under15Participants), 10) || 0) }),
        ...(adultParticipants           !== undefined && { adultParticipants: Math.max(0, parseInt(String(adultParticipants), 10) || 0) }),
        ...(transactionNoTransfereeName !== undefined && { transactionNoTransfereeName: String(transactionNoTransfereeName).trim() }),
        ...(transactionMode             !== undefined && { transactionMode: String(transactionMode) }),
        ...(amount                      !== undefined && { amount: parseFloat(String(amount)) || 0 }),
        ...(registrationDate            !== undefined && { registrationDate: String(registrationDate) }),
        ...(isOnSpotRegistration        !== undefined && { isOnSpotRegistration: Boolean(isOnSpotRegistration) }),
        ...(isPresent                   !== undefined && { isPresent: Boolean(isPresent) }),
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
