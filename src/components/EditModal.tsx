'use client'

import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { Attendee } from '@/types'

interface EditModalProps {
  attendee: Attendee
  onClose: () => void
  onSaved: (updated: Attendee) => void
}

export default function EditModal({ attendee, onClose, onSaved }: EditModalProps) {
  const [form, setForm] = useState({
    participantsName:            attendee.participantsName,
    emailOrPhoneNo:              attendee.emailOrPhoneNo,
    code:                        attendee.code,
    registrationDate:            attendee.registrationDate,
    under15Participants:         String(attendee.under15Participants),
    adultParticipants:           String(attendee.adultParticipants),
    transactionNoTransfereeName: attendee.transactionNoTransfereeName,
    transactionMode:             attendee.transactionMode,
    amount:                      String(attendee.amount),
    isPresent:                   attendee.isPresent,
    isOnSpotRegistration:        attendee.isOnSpotRegistration,
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSave = async () => {
    if (!form.participantsName.trim()) {
      setError('Participants name is required.')
      return
    }
    if (!form.code.trim()) {
      setError('Code is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/attendees/${attendee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount:              parseFloat(form.amount) || 0,
          under15Participants: parseInt(form.under15Participants, 10) || 0,
          adultParticipants:   parseInt(form.adultParticipants, 10) || 0,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Update failed.'); return }
      onSaved(data)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const textField = (
    label: string,
    key: keyof typeof form,
    type: string = 'text',
    extra?: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-baisakh-red focus:border-transparent"
        {...extra}
      />
    </div>
  )

  const toggle = (label: string, key: 'isPresent' | 'isOnSpotRegistration', color: string) => (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={form[key]}
        onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          form[key] ? color : 'bg-gray-300'
        }`}
      >
        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          form[key] ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
      <span className="text-sm font-medium text-gray-700">{label}: {form[key] ? 'Yes' : 'No'}</span>
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-baisakh-red px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Edit Attendee</h2>
            <p className="text-red-200 text-xs mt-0.5">#{attendee.attendeeNo} — {attendee.participantsName}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-red-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          {textField('Participants Name', 'participantsName')}
          {textField('Email / Phone No.', 'emailOrPhoneNo')}
          {textField('Transaction No. / Transferee Name', 'transactionNoTransfereeName')}
          {textField('Transaction Mode', 'transactionMode', 'text', { placeholder: 'e.g. Cash, PayPal, Bank Transfer…' })}

          <div className="grid grid-cols-3 gap-3">
            {textField('Amount (€)', 'amount', 'number', { min: 0, step: '0.01' })}
            {textField('Adults', 'adultParticipants', 'number', { min: 0, max: 30 })}
            {textField('Under 15', 'under15Participants', 'number', { min: 0, max: 30 })}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {textField('Code', 'code')}
            {textField('Registration Date', 'registrationDate')}
          </div>

          <div className="flex flex-col gap-3 pt-1">
            {toggle('Present', 'isPresent', 'bg-baisakh-green')}
            {toggle('On-Spot Registration', 'isOnSpotRegistration', 'bg-purple-500')}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-baisakh-red hover:bg-baisakh-red-dark rounded-lg transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
