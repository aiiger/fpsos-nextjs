import { NextRequest, NextResponse } from 'next/server'

interface ContactFormData {
  name: string
  email: string
  discord?: string
  phone?: string
  serviceType: 'quick-fix' | 'full-tune' | 'extreme' | 'diagnosis'
  systemInfo: string
  issues: string
  budget?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.systemInfo || !body.issues) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Here you would normally:
    // 1. Send email to your admin
    // 2. Store in database
    // 3. Trigger Discord bot notification
    // 4. Create calendar invite, etc.

    // For now, log the data (in production, send email)
    console.log('Contact form submission:', {
      timestamp: new Date().toISOString(),
      ...body
    })

    // TODO: Send email via Resend, SendGrid, or similar
    // TODO: Store in Supabase/MongoDB
    // TODO: Send Discord notification
    // TODO: Create calendar booking

    return NextResponse.json(
      {
        success: true,
        message: 'Booking request received. We will contact you within 24 hours.',
        id: `FPSOS-${Date.now()}`
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
