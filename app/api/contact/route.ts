import { NextRequest, NextResponse } from 'next/server';
import { validateRequest, contactFormSchema } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { Resend } from 'resend';

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

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

    const body = validation.data as ContactFormData;
    const submissionId = `FPSOS-${Date.now()}`;

    // Send email notification via Resend
    if (resend) {
      try {
        await resend.emails.send({
          from: 'FPSOS Contact <contact@resend.dev>',
          to: process.env.ADMIN_EMAIL || 'admin@fpsos.gg',
          subject: `New Contact Form: ${body.serviceType.toUpperCase()} - ${body.name}`,
          html: `
            <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px;">
              <h1 style="color: #06b6d4; margin: 0 0 20px;">New Contact Form Submission</h1>
              
              <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #71717a; font-size: 12px; text-transform: uppercase;">Submission ID</td>
                    <td style="padding: 8px 0; color: #fff; font-weight: 600; text-align: right; font-family: monospace;">${submissionId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #71717a; font-size: 12px; text-transform: uppercase;">Name</td>
                    <td style="padding: 8px 0; color: #fff; font-weight: 600; text-align: right;">${body.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #71717a; font-size: 12px; text-transform: uppercase;">Email</td>
                    <td style="padding: 8px 0; color: #06b6d4; font-weight: 600; text-align: right;">${body.email}</td>
                  </tr>
                  ${body.discord ? `
                  <tr>
                    <td style="padding: 8px 0; color: #71717a; font-size: 12px; text-transform: uppercase;">Discord</td>
                    <td style="padding: 8px 0; color: #fff; font-weight: 600; text-align: right;">${body.discord}</td>
                  </tr>
                  ` : ''}
                  ${body.phone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #71717a; font-size: 12px; text-transform: uppercase;">Phone</td>
                    <td style="padding: 8px 0; color: #fff; font-weight: 600; text-align: right;">${body.phone}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #71717a; font-size: 12px; text-transform: uppercase;">Service Type</td>
                    <td style="padding: 8px 0; color: #a855f7; font-weight: 600; text-align: right;">${body.serviceType.toUpperCase()}</td>
                  </tr>
                  ${body.budget ? `
                  <tr>
                    <td style="padding: 8px 0; color: #71717a; font-size: 12px; text-transform: uppercase;">Budget</td>
                    <td style="padding: 8px 0; color: #fff; font-weight: 600; text-align: right;">${body.budget}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #71717a; font-size: 12px; text-transform: uppercase; margin: 0 0 10px;">System Info</h3>
                <p style="color: #fff; margin: 0; white-space: pre-wrap;">${body.systemInfo}</p>
              </div>

              <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px;">
                <h3 style="color: #71717a; font-size: 12px; text-transform: uppercase; margin: 0 0 10px;">Issues Described</h3>
                <p style="color: #fff; margin: 0; white-space: pre-wrap;">${body.issues}</p>
              </div>

              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #27272a; text-align: center; color: #71717a; font-size: 12px;">
                Submitted at ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' })} GST
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Continue execution even if email fails
      }
    }

    // Send Discord webhook notification
    if (process.env.DISCORD_CONTACT_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_CONTACT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [{
              title: '📬 New Contact Form Submission',
              color: 0x06b6d4,
              fields: [
                { name: 'Name', value: body.name, inline: true },
                { name: 'Email', value: body.email, inline: true },
                { name: 'Service', value: body.serviceType.toUpperCase(), inline: true },
                ...(body.discord ? [{ name: 'Discord', value: body.discord, inline: true }] : []),
                ...(body.phone ? [{ name: 'Phone', value: body.phone, inline: true }] : []),
                ...(body.budget ? [{ name: 'Budget', value: body.budget, inline: true }] : []),
                { name: 'System Info', value: body.systemInfo.substring(0, 1024), inline: false },
                { name: 'Issues', value: body.issues.substring(0, 1024), inline: false },
              ],
              footer: { text: `ID: ${submissionId}` },
              timestamp: new Date().toISOString(),
            }],
          }),
        });
      } catch (discordError) {
        console.error('Failed to send Discord notification:', discordError);
        // Continue execution even if Discord fails
      }
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Contact form submission:', {
        timestamp: new Date().toISOString(),
        id: submissionId,
        ...body
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for contacting us! We will get back to you within 24 hours.',
        id: submissionId
      },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Contact form error:', error);
    }
    return NextResponse.json(
      { error: 'Failed to process request. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}
