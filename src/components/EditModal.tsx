'use client'

import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { Attendee, PAYMENT_METHODS } from '@/types'

interface EditModalProps {
  attendee: Attendee
  onClose: () => void
  onSaved: (updated: Attendee) => void
}

export default function EditModal({ attendee, onClose, onSaved }: EditModalProps) {
  const [form, setForm] = useState({
    name:          attendee.name,
    email:         attendee.email,
    code:          attendee.code,
    amount:        String(attendee.amount),
    paymentMethod: attendee.paymentMethod,
    quantity:      String(attendee.quantity),
    comment:       attendee.comment ?? '',
    isPresent:     attendee.isPresent,
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.')
      return
    }
    if (!/^\d{4}$/.test(form.code)) {
      setError('Code must be exactly 4 digits.')
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
          amount:   parseFloat(form.amount) || 0,
          quantity: Math.max(1, parseInt(form.quantity, 10) || 1),
          comment:  form.comment.trim() || null,
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

  const field = (
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-baisakh-red px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Edit Attendee</h2>
            <p className="text-red-200 text-xs mt-0.5">#{attendee.attendeeNo} — {attendee.name}</p>
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

          {field('Full Name', 'name')}
          {field('Email Address', 'email', 'email')}

          {field('4-Digit Code', 'code', 'text', { maxLength: 4, pattern: '\\d{4}', placeholder: '0000' })}

          <div className="grid grid-cols-3 gap-3">
            {field('Amount (€)', 'amount', 'number', { min: 0, step: '0.01' })}
            {field('Participants', 'quantity', 'number', { min: 1, max: 20 })}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                value={form.paymentMethod}
                onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-baisakh-red"
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comment / Notes</label>
            <textarea
              rows={3}
              placeholder="Special instructions or notes…"
              value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-baisakh-red focus:border-transparent resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={form.isPresent}
              onClick={() => setForm(f => ({ ...f, isPresent: !f.isPresent }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.isPresent ? 'bg-baisakh-green' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                form.isPresent ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
            <span className="text-sm font-medium text-gray-700">
              {form.isPresent ? 'Present' : 'Absent'}
            </span>
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
