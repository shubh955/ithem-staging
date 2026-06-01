'use client'

import { useRef, useState } from 'react'
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'
type FieldErrors = Record<string, string>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getFormValue(fd: FormData, name: string) {
  return String(fd.get(name) ?? '').trim()
}

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState('submitting')
    setMessage('')
    setFieldErrors({})

    if (!formRef.current) return
    const fd = new FormData(formRef.current)

    const payload = {
      name: getFormValue(fd, 'name'),
      email: getFormValue(fd, 'email'),
      phone: getFormValue(fd, 'phone'),
      company: getFormValue(fd, 'company'),
      inquiryType: getFormValue(fd, 'inquiryType'),
      message: getFormValue(fd, 'message'),
      _hp_field: getFormValue(fd, '_hp_field'),
    }

    const nextFieldErrors: FieldErrors = {}
    if (payload.name.length < 2) nextFieldErrors.name = 'Name must be at least 2 characters.'
    if (!emailPattern.test(payload.email)) nextFieldErrors.email = 'Enter a valid email address.'
    if (payload.phone.length < 10) nextFieldErrors.phone = 'Enter a valid phone number.'
    if (!payload.inquiryType) nextFieldErrors.inquiryType = 'Select an inquiry type.'
    if (!payload.message) nextFieldErrors.message = 'Message is required.'

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors)
      setFormState('error')
      setMessage('Please fix the highlighted fields.')
      return
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setFormState('success')
        setFieldErrors({})
        setMessage(data.message)
        formRef.current.reset()
      } else {
        setFormState('error')
        setFieldErrors(data.fieldErrors || {})
        setMessage(data.message || 'Something went wrong.')
      }
    } catch (error) {
      setFormState('error')
      setMessage('Failed to submit form. Please check your network connection.')
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6 md:p-10 shadow-xl border border-gray-50">
      <h2 className="text-xl font-bold text-dark mb-1">Send an Inquiry</h2>
      <p className="text-sm text-gray-500 mb-8">Fill out the form and we&apos;ll get back to you within 24 hours.</p>

      <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Honeypot Field */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <label htmlFor="_hp_website">Website URL</label>
          <input type="text" id="_hp_website" name="_hp_field" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark uppercase ml-1">Full Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" required aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/5 transition-all" placeholder="John Doe" />
            {fieldErrors.name && <p id="contact-name-error" className="text-xs font-medium text-red-600 ml-1">{fieldErrors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark uppercase ml-1">Phone Number <span className="text-red-500">*</span></label>
            <input type="tel" name="phone" required aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? 'contact-phone-error' : undefined} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/5 transition-all" placeholder="+91 00000 00000" />
            {fieldErrors.phone && <p id="contact-phone-error" className="text-xs font-medium text-red-600 ml-1">{fieldErrors.phone}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-dark uppercase ml-1">Email Address <span className="text-red-500">*</span></label>
          <input type="email" name="email" required aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/5 transition-all" placeholder="john@company.com" />
          {fieldErrors.email && <p id="contact-email-error" className="text-xs font-medium text-red-600 ml-1">{fieldErrors.email}</p>}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark uppercase ml-1">Inquiry Type</label>
            <select name="inquiryType" aria-invalid={Boolean(fieldErrors.inquiryType)} aria-describedby={fieldErrors.inquiryType ? 'contact-inquiry-type-error' : undefined} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/5 transition-all bg-white cursor-pointer">
              <option>Product Inquiry</option>
              <option>Technical Support</option>
              <option>Custom Automation</option>
              <option>Dealer Opportunity</option>
            </select>
            {fieldErrors.inquiryType && <p id="contact-inquiry-type-error" className="text-xs font-medium text-red-600 ml-1">{fieldErrors.inquiryType}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark uppercase ml-1">Company</label>
            <input type="text" name="company" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/5 transition-all" placeholder="Your Company Name" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-dark uppercase ml-1">Message <span className="text-red-500">*</span></label>
          <textarea name="message" required rows={4} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/5 transition-all resize-none" placeholder="How can we help you?"></textarea>
          {fieldErrors.message && <p id="contact-message-error" className="text-xs font-medium text-red-600 ml-1">{fieldErrors.message}</p>}
        </div>

        {message && (
          <div className={`p-4 rounded-xl flex items-start gap-3 ${
            formState === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {formState === 'success' ? (
              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            )}
            <div className="text-sm font-medium">{message}</div>
          </div>
        )}

        <button 
          type="submit"
          disabled={formState === 'submitting'}
          className="btn-premium btn-orange-to-black group w-full rounded-xl py-4 text-sm font-bold shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {formState === 'submitting' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Inquiry
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
