import { NextRequest, NextResponse } from 'next/server';
import { validateRequest, contactFormSchema } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

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
  // Rate limiting
  const rateLimitResponse = checkRateLimit(request, 'contact-form', RATE_LIMITS.CONTACT_FORM);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Validate request body
    const validation = await validateRequest(request, contactFormSchema);
    if (!validation.success) {
      return validation.response;
    }

    const body = validation.data;

    // Validation passed - in production, implement email/database/discord notifications
    if (process.env.NODE_ENV === 'development') {
      console.log('Contact form submission:', {
        timestamp: new Date().toISOString(),
        ...body
      })
    }

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
    if (process.env.NODE_ENV === 'development') {
      console.error('Contact form error:', error)
    }
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
