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
            // A. Customer Receipt
            if (email) {
                try {
                    await resend.emails.send({
                        from: 'FPSOS Bookings <bookings@resend.dev>',
                        to: email,
                        subject: `Booking Received: ${package_name} - Payment Required`,
                        html: `
                        <div style="font-family: sans-serif; padding: 20px; color: #333;">
                            <h1 style="color: #06b6d4;">Booking Received! 🚀</h1>
                            <p>Hi <strong>${client_name}</strong>,</p>
                            <p>We have received your booking request for <strong>${package_name}</strong>.</p>

                            <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="margin-top:0;">Session Details</h3>
                                <p><strong>Booking ID:</strong> #${newBookingId}</p>
                                <p><strong>Package:</strong> ${package_name}</p>
                                <p><strong>Date/Time:</strong> ${date_time}</p>
                                <p><strong>Total:</strong> ${amount}</p>
                                ${add_ons && add_ons.length > 0 ? `<p><strong>Extras:</strong> ${add_ons.join(', ')}</p>` : ''}
                            </div>

                            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                                <h3 style="margin-top:0; color: #856404;">⏳ Payment Pending</h3>
                                <p style="color: #856404;">Your booking will be confirmed automatically once payment is received via PayPal.</p>
                                <p style="color: #856404;"><strong>Manage your booking:</strong> <a href="https://fpsos.gg/booking/${bookingToken}" style="color: #0066cc;">Click here</a></p>
                            </div>

                            <h3>✅ Next Steps Checklist:</h3>
                            <ul>
                                <li>Complete payment via PayPal (you should have been redirected)</li>
                                <li>Join our <strong><a href="https://discord.gg/9UXeaSx4SF" style="color: #5865F2;">Discord Server</a></strong> immediately.</li>
                                <li><strong>DM the bot or an admin</strong> with your Booking ID: #${newBookingId}</li>
                                <li>Ensure you have <strong>TeamViewer</strong> or <strong>AnyDesk</strong> installed.</li>
                                <li>Have your <strong>Windows License Key</strong> ready (if applicable).</li>
                            </ul>
                            <p><em>- The FPSOS Team</em></p>
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
