import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// ─── Config ───────────────────────────────────────────────────────────────────
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'
const ZEPTO_URL = 'https://api.zeptomail.in/v1.1/email'
const ZEPTO_TOKEN = 'Zoho-enczapikey PHtE6r0OQ+G/2mAq+hYE4/PsFcXwMd8mqLxveQJE49tDA/4LF00A/d99wGO/+hl+BqZFEKOazow5t+6au+KAIW7qNzlMWGqyqK3sx/VYSPOZsbq6x00ZsVwec0bbUIPmd9Bt1SHUudrSNA=='

const FROM_EMAIL = 'noreply@itherm.co.in'
const FROM_NAME = 'I-Therm Instruments'
const ADMIN_RECIPIENTS = [
  { address: 'sales@itherm.co.in', name: 'I-Therm Sales' },
  { address: 'keval@itherm.co.in', name: 'I-Therm Sales' },
]

// ─── reCAPTCHA Verification ───────────────────────────────────────────────────
async function verifyRecaptcha(token: string): Promise<boolean> {
  const res = await fetch(RECAPTCHA_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  })
  const data = await res.json()
  return data.success === true
}

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const trimmedString = z.preprocess(
  (value) => (typeof value === 'string' ? value.trim() : ''),
  z.string()
)

const schema = z.object({
  name: trimmedString.pipe(z.string().min(2, 'Name must be at least 2 characters')),
  email: trimmedString.pipe(z.string().email('Enter a valid email address')),
  phone: trimmedString.pipe(z.string().min(10, 'Enter a valid phone number')),
  company: trimmedString.optional(),
  message: trimmedString.pipe(z.string().min(1, 'Message is required')),
  inquiryType: trimmedString.pipe(z.string().min(1, 'Select an inquiry type')),
  _hp_field: trimmedString.optional(),
})

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// ─── Helper to send via ZeptoMail ─────────────────────────────────────────────
async function sendZeptoMail({
  to,
  subject,
  htmlBody,
}: {
  to: Array<{ address: string; name: string }>
  subject: string
  htmlBody: string
}) {
  const payload = {
    from: { address: FROM_EMAIL, name: FROM_NAME },
    to: to.map((recipient) => ({
      email_address: {
        address: recipient.address,
        name: recipient.name,
      },
    })),
    subject,
    htmlbody: htmlBody,
  }

  const response = await fetch(ZEPTO_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: ZEPTO_TOKEN,
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.text()
    console.error('ZeptoMail Error:', response.status, errorData)
    throw new Error(errorData)
  }

  return response.json()
}

// ─── Route Handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // reCAPTCHA verification
    const recaptchaToken = body.recaptchaToken
    if (!recaptchaToken) {
      return NextResponse.json({ success: false, message: 'reCAPTCHA verification required.' }, { status: 400 })
    }
    const isHuman = await verifyRecaptcha(recaptchaToken)
    if (!isHuman) {
      return NextResponse.json({ success: false, message: 'reCAPTCHA verification failed. Please try again.' }, { status: 400 })
    }

    const data = schema.parse(body)

    // Honeypot validation (Bots usually fill hidden fields)
    if (data._hp_field && data._hp_field.trim().length > 0) {
      console.warn('[Spam blocked] Honeypot triggered')
      return NextResponse.json({ success: true, message: 'Inquiry received. We will respond within 24 hours.' })
    }

    // Advanced Bot Check: URL links in message
    const hasUrls = /https?:\/\//i.test(data.message) || /<[a-z][\s\S]*>/i.test(data.message)
    if (hasUrls) {
      console.warn('[Spam blocked] URLs found in message')
      return NextResponse.json({ success: true, message: 'Inquiry received. We will respond within 24 hours.' })
    }

    // ─── 1. Admin Email Template ──────────────────────────────────────────────
    const safeName = escapeHtml(data.name)
    const safeEmail = escapeHtml(data.email)
    const safePhone = escapeHtml(data.phone)
    const safeCompany = escapeHtml(data.company || 'N/A')
    const safeInquiryType = escapeHtml(data.inquiryType)
    const safeMessage = escapeHtml(data.message)

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4ea424; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 24px;">New Inquiry Received</h2>
        </div>
        <div style="padding: 20px;">
          <p>You have received a new inquiry from the I-Therm website.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Name</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeName}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeEmail}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safePhone}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Company</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeCompany}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Inquiry Type</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeInquiryType}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold;" colspan="2">Message:</td></tr>
            <tr><td style="padding: 10px; background-color: #f9fafb; border-radius: 5px; font-style: italic;" colspan="2">${safeMessage}</td></tr>
          </table>
        </div>
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
          This email was generated automatically by the I-Therm contact form.
        </div>
      </div>
    `

    // ─── 2. User Thank You Template ───────────────────────────────────────────
    const userHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #3b82f6; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 24px;">Thank You for Contacting I-Therm</h2>
        </div>
        <div style="padding: 20px;">
          <p>Dear <strong>${safeName}</strong>,</p>
          <p>Thank you for reaching out to us regarding your <strong>${safeInquiryType}</strong>. We have received your message and our team will get back to you within the next 24 business hours.</p>
          <p>Here is a copy of the message you sent:</p>
          <div style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #3b82f6; margin: 15px 0;">
            <em>"${safeMessage}"</em>
          </div>
          <p>If you have any urgent queries, please feel free to call us.</p>
          <p>Best regards,<br/><strong>I-Therm Instruments Team</strong></p>
        </div>
      </div>
    `

    // Send both emails sequentially to prevent concurrent rate-limiting from ZeptoMail
    try {
      await sendZeptoMail({
        to: ADMIN_RECIPIENTS,
        subject: `Website Inquiry: ${data.inquiryType} from ${data.name}`,
        htmlBody: adminHtml,
      })

      await sendZeptoMail({
        to: [{ address: data.email, name: data.name }],
        subject: `Thank you for your inquiry - I-Therm`,
        htmlBody: userHtml,
      })
    } catch (zeptoError: any) {
      console.error('[ZeptoMail Error Details]:', zeptoError.message)
      return NextResponse.json({
        success: false,
        message: 'Mail provider error: ' + zeptoError.message
      }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Inquiry received. We will respond within 24 hours.' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {}
      error.issues.forEach((e) => {
        const key = e.path.join('.')
        if (key) fieldErrors[key] = e.message
      })
      return NextResponse.json(
        { success: false, message: 'Please fix the highlighted fields.', fieldErrors },
        { status: 400 }
      )
    }
    console.error('[Contact API] Error:', error)
    return NextResponse.json({ success: false, message: 'Server error. Please try again later.' }, { status: 500 })
  }
}
