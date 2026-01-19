import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { validateRequest, bookingCreateSchema } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// POST: Create a new booking (Public)
export async function POST(request: Request) {
    // Rate limiting
    const rateLimitResponse = checkRateLimit(request, 'booking-create', RATE_LIMITS.BOOKING_CREATE);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        // Validate request body
        const validation = await validateRequest(request, bookingCreateSchema);
        if (!validation.success) {
            return validation.response;
        }

        const {
            client_name,
            discord_id,
            email,
            package_id,
            package_name,
            amount,
            date_time,
            add_ons,
            customer_notes
        } = validation.data;

        // Generate unique booking token for customer portal access
        const bookingToken = `fpsos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // 1. Check slot availability and reserve it
        try {
            const [date, time] = date_time.split(' ');

            // Check if slot exists and is available
            const slotCheck = await db.execute({
                sql: 'SELECT * FROM availability_slots WHERE date = ? AND time = ? AND is_available = 1',
                args: [date, time]
            });

            // If no slot exists, create one (for backwards compatibility)
            if (slotCheck.rows.length === 0) {
                await db.execute({
                    sql: 'INSERT OR IGNORE INTO availability_slots (date, time, is_available) VALUES (?, ?, 1)',
                    args: [date, time]
                });
            }
        } catch (slotError) {
            console.error('Slot check/creation error:', slotError);
        }

        // 2. Save to Database (Async - Cloud)
        const result = await db.execute({
            sql: `INSERT INTO bookings (
                    client_name, discord_id, email, package_id, package_name,
                    amount, date_time, add_ons, customer_notes, booking_token,
                    status, payment_status
                  )
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'unpaid')
                  RETURNING id`,
            args: [
                client_name,
                discord_id,
                email || null,
                package_id,
                package_name,
                amount,
                date_time,
                JSON.stringify(add_ons || []),
                customer_notes || '',
                bookingToken
            ]
        });

        // Get ID (handle LibSQL's bigint or missing id quirks)
        const newBookingId = result.rows[0]?.id?.toString() || result.lastInsertRowid?.toString() || '0';

        // 3. Create initial booking history entry
        try {
            await db.execute({
                sql: `INSERT INTO booking_history (booking_id, old_status, new_status, changed_by, notes)
                      VALUES (?, ?, ?, ?, ?)`,
                args: [newBookingId, '', 'pending', 'customer', 'Booking created']
            });
        } catch (historyError) {
            console.error('Booking history insert failed:', historyError);
        }

        // 2. Emails (Customer + Admin)
        if (resend) {
            // A. Customer Receipt - Enhanced
            if (email) {
                // Generate Google Calendar link (with fallback)
                let gcalLink = '';
                try {
                    const sessionDate = new Date(date_time);
                    if (!isNaN(sessionDate.getTime())) {
                        const endDate = new Date(sessionDate.getTime() + 60 * 60 * 1000); // +1 hour
                        const gcalStart = sessionDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                        const gcalEnd = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                        gcalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=FPSOS%20${encodeURIComponent(package_name)}&dates=${gcalStart}/${gcalEnd}&details=Booking%20ID:%20${newBookingId}%0APackage:%20${encodeURIComponent(package_name)}%0AHave%20TeamViewer%20ready!&location=Remote%20Session`;
                    }
                } catch (e) {
                    console.error('Calendar link generation failed:', e);
                }

                try {
                    await resend.emails.send({
                        from: 'FPSOS Bookings <bookings@resend.dev>',
                        to: email,
                        subject: `🎮 Booking Confirmed: ${package_name} | Action Required`,
                        html: `
                        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 0;">
                            <!-- Header -->
                            <div style="background: linear-gradient(135deg, #06b6d4, #3b82f6); padding: 30px; text-align: center;">
                                <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">FPSOS</h1>
                                <p style="margin: 5px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; opacity: 0.9;">Consulting Group</p>
                            </div>

                            <!-- Main Content -->
                            <div style="padding: 30px;">
                                <h2 style="color: #4ade80; margin: 0 0 10px; font-size: 24px;">Booking Received! 🚀</h2>
                                <p style="color: #a1a1aa; margin: 0 0 25px;">Hi <strong style="color: #fff;">${client_name}</strong>, your session is locked in.</p>

                                <!-- Session Card -->
                                <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Booking ID</td>
                                            <td style="padding: 8px 0; color: #fff; font-weight: 600; text-align: right; font-family: monospace;">#${newBookingId}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Package</td>
                                            <td style="padding: 8px 0; color: #06b6d4; font-weight: 600; text-align: right;">${package_name}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Date & Time</td>
                                            <td style="padding: 8px 0; color: #fff; font-weight: 600; text-align: right;">${date_time}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Total</td>
                                            <td style="padding: 8px 0; color: #4ade80; font-weight: 700; text-align: right; font-size: 18px;">${amount}</td>
                                        </tr>
                                    </table>
                                </div>

                                <!-- Payment Warning -->
                                <div style="background: #422006; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 25px;">
                                    <p style="margin: 0; color: #fbbf24; font-weight: 600;">⏳ Payment Required</p>
                                    <p style="margin: 8px 0 0; color: #fcd34d; font-size: 14px;">Complete your PayPal payment to confirm this booking.</p>
                                </div>

                                <!-- Add to Calendar -->
                                ${gcalLink ? `
                                <div style="text-align: center; margin-bottom: 25px;">
                                    <a href="${gcalLink}" target="_blank" style="display: inline-block; background: #fff; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                                        📅 Add to Google Calendar
                                    </a>
                                </div>
                                ` : ''}

                                <!-- Checklist -->
                                <h3 style="color: #fff; font-size: 16px; margin: 0 0 15px; text-transform: uppercase; letter-spacing: 1px;">✅ Before Your Session</h3>
                                
                                <div style="background: #18181b; border-radius: 12px; overflow: hidden;">
                                    <!-- Item 1 -->
                                    <div style="padding: 15px 20px; border-bottom: 1px solid #27272a;">
                                        <p style="margin: 0 0 5px; color: #fff; font-weight: 600;">1. Install Remote Software</p>
                                        <p style="margin: 0 0 10px; color: #71717a; font-size: 13px;">We need one of these to access your PC:</p>
                                        <a href="https://www.teamviewer.com/en/download/" target="_blank" style="display: inline-block; background: #0e7490; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600; margin-right: 8px;">Download TeamViewer</a>
                                        <a href="https://anydesk.com/en/downloads" target="_blank" style="display: inline-block; background: #27272a; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600;">Download AnyDesk</a>
                                    </div>
                                    
                                    <!-- Item 2 -->
                                    <div style="padding: 15px 20px; border-bottom: 1px solid #27272a;">
                                        <p style="margin: 0 0 5px; color: #fff; font-weight: 600;">2. Join Our Discord</p>
                                        <p style="margin: 0 0 10px; color: #71717a; font-size: 13px;">We'll coordinate the session through Discord:</p>
                                        <a href="https://discord.gg/9UXeaSx4SF" target="_blank" style="display: inline-block; background: #5865F2; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600;">Join FPSOS Discord</a>
                                    </div>
                                    
                                    <!-- Item 3 -->
                                    <div style="padding: 15px 20px; border-bottom: 1px solid #27272a;">
                                        <p style="margin: 0 0 5px; color: #fff; font-weight: 600;">3. Have Your Windows Key Ready</p>
                                        <p style="margin: 0; color: #71717a; font-size: 13px;">If you need a fresh install, we'll need your license key.</p>
                                    </div>
                                    
                                    <!-- Item 4 -->
                                    <div style="padding: 15px 20px;">
                                        <p style="margin: 0 0 5px; color: #fff; font-weight: 600;">4. Close Background Apps</p>
                                        <p style="margin: 0; color: #71717a; font-size: 13px;">Close games, browsers, and unnecessary programs before we start.</p>
                                    </div>
                                </div>

                                <!-- Manage Booking -->
                                <div style="text-align: center; margin-top: 25px; padding-top: 25px; border-top: 1px solid #27272a;">
                                    <p style="color: #71717a; font-size: 13px; margin: 0 0 10px;">Need to make changes?</p>
                                    <a href="https://fpsos.gg/booking/${bookingToken}" style="color: #06b6d4; font-size: 14px;">Manage Your Booking →</a>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div style="background: #18181b; padding: 20px; text-align: center; border-top: 1px solid #27272a;">
                                <p style="margin: 0; color: #52525b; font-size: 12px;">FPSOS Consulting Group</p>
                                <p style="margin: 5px 0 0; color: #3f3f46; font-size: 11px;">Engineering, Not Magic.</p>
                            </div>
                        </div>
                    `
                    });
                } catch (e) { console.error("Customer email failed", e); }
            }

            // B. Admin Notification (Instant Alert)
            try {
                await resend.emails.send({
                    from: 'FPSOS Alerts <alerts@resend.dev>',
                    to: '3ali.mohammadi@gmail.com',
                    subject: `💰 NEW ORDER: ${package_name} (${client_name})`,
                    html: `
                    <div style="font-family: monospace; color: #333;">
                        <h1>💰 Cha-Ching! New Order Received</h1>
                        <hr/>
                        <p><strong>Client:</strong> ${client_name}</p>
                        <p><strong>Discord:</strong> ${discord_id}</p>
                        <p><strong>Package:</strong> ${package_name}</p>
                        <p><strong>Total:</strong> ${amount}</p>
                        <p><strong>Date:</strong> ${date_time}</p>
                        <p><strong>Add-Ons:</strong> ${JSON.stringify(add_ons)}</p>
                        <p><strong>Booking ID:</strong> #${newBookingId}</p>
                    </div>
                    `
                });
            } catch (e) { console.error("Admin email failed", e); }
        }

        return NextResponse.json({ success: true, id: newBookingId });
    } catch (error) {
        console.error('Booking Error:', error);
        return NextResponse.json({ success: false, error: 'Database Error' }, { status: 500 });
    }
}

// GET: Fetch all bookings (Admin Only)
export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await db.execute('SELECT * FROM bookings ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Fetch Error:", error);
        return NextResponse.json([]);
    }
}
