import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
  message: z.string().min(10),
  inquiryType: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = schema.parse(body)

    // In production: send email via nodemailer
    // const transporter = nodemailer.createTransport({ ... })
    // await transporter.sendMail({ ... })
    console.log('Contact form submission:', data)

    return NextResponse.json({ success: true, message: 'Inquiry received. We will respond within 24 hours.' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.flatten() }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
