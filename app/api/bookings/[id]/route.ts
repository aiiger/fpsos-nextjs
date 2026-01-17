import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { Resend } from 'resend';
import { validateRequest, bookingUpdateSchema } from '@/lib/validation';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// GET: Fetch single booking (Admin or by token)
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    try {
        let result;

        if (token) {
            // Public access via booking token
            result = await db.execute({
                sql: 'SELECT * FROM bookings WHERE booking_token = ?',
                args: [token]
            });
        } else {
            // Admin access
            const session = await getSession();
            if (!session) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            result = await db.execute({
                sql: 'SELECT * FROM bookings WHERE id = ?',
                args: [params.id]
            });
        }

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const booking = result.rows[0];

        // Get booking history
        const historyResult = await db.execute({
            sql: 'SELECT * FROM booking_history WHERE booking_id = ? ORDER BY created_at DESC',
            args: [booking.id]
        });

        return NextResponse.json({
            ...booking,
            history: historyResult.rows
        });
    } catch (error) {
        console.error('Fetch booking error:', error);
        return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
    }
}

// PATCH: Update booking status/details (Admin only)
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Validate request body
        const validation = await validateRequest(request, bookingUpdateSchema);
        if (!validation.success) {
            return validation.response;
        }

        const { status, admin_notes, payment_status, payment_id } = validation.data;

        // Get current booking
        const currentResult = await db.execute({
            sql: 'SELECT * FROM bookings WHERE id = ?',
            args: [params.id]
        });

        if (currentResult.rows.length === 0) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const currentBooking = currentResult.rows[0] as any;

        // Build update query dynamically
        const updates: string[] = [];
        const args: any[] = [];

        if (status && status !== currentBooking.status) {
            updates.push('status = ?');
            args.push(status);

            // Log status change
            await db.execute({
                sql: `INSERT INTO booking_history (booking_id, old_status, new_status, changed_by, notes)
                      VALUES (?, ?, ?, ?, ?)`,
                args: [params.id, currentBooking.status, status, 'admin', admin_notes || `Status changed to ${status}`]
            });

            // Send status change notification
            if (resend && currentBooking.email) {
                const statusMessages: Record<string, { subject: string, message: string, color: string }> = {
                    confirmed: {
                        subject: '✅ Booking Confirmed',
                        message: 'Your session has been confirmed! We\'re all set for your optimization session.',
                        color: '#4ade80'
                    },
                    completed: {
                        subject: '🎉 Session Completed',
                        message: 'Thank you for choosing FPSOS! We hope you enjoyed the performance boost.',
                        color: '#06b6d4'
                    },
                    cancelled: {
                        subject: '❌ Booking Cancelled',
                        message: 'Your booking has been cancelled. If this was a mistake, please contact us.',
                        color: '#ef4444'
                    }
                };

                const statusInfo = statusMessages[status];
                if (statusInfo) {
                    try {
                        await resend.emails.send({
                            from: 'FPSOS Bookings <bookings@resend.dev>',
                            to: currentBooking.email,
                            subject: `${statusInfo.subject} - Booking #${params.id}`,
                            html: `
                                <div style="font-family: sans-serif; padding: 30px; background: #0a0a0a; color: #fff;">
                                    <h1 style="color: ${statusInfo.color};">${statusInfo.subject}</h1>
                                    <p>Hi <strong>${currentBooking.client_name}</strong>,</p>
                                    <p>${statusInfo.message}</p>
                                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin: 20px 0;">
                                        <p><strong>Booking ID:</strong> #${params.id}</p>
                                        <p><strong>Package:</strong> ${currentBooking.package_name}</p>
                                        <p><strong>Date/Time:</strong> ${currentBooking.date_time}</p>
                                        ${admin_notes ? `<p><strong>Note:</strong> ${admin_notes}</p>` : ''}
                                    </div>
                                    <p>Questions? Reply to this email or join our <a href="https://discord.gg/9UXeaSx4SF" style="color: #5865F2;">Discord</a>.</p>
                                    <p><em>- The FPSOS Team</em></p>
                                </div>
                            `
                        });
                    } catch (e) {
                        console.error('Status notification email failed:', e);
                    }
                }
            }
        }

        if (admin_notes !== undefined) {
            updates.push('admin_notes = ?');
            args.push(admin_notes);
        }

        if (payment_status && payment_status !== currentBooking.payment_status) {
            updates.push('payment_status = ?');
            args.push(payment_status);
        }

        if (payment_id) {
            updates.push('payment_id = ?');
            args.push(payment_id);
        }

        if (updates.length > 0) {
            updates.push('updated_at = datetime("now")');
            args.push(params.id);

            await db.execute({
                sql: `UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`,
                args
            });
        }

        // Return updated booking
        const updatedResult = await db.execute({
            sql: 'SELECT * FROM bookings WHERE id = ?',
            args: [params.id]
        });

        return NextResponse.json(updatedResult.rows[0]);
    } catch (error) {
        console.error('Update booking error:', error);
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
}

// DELETE: Cancel booking (Admin only)
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Mark as cancelled instead of deleting
        await db.execute({
            sql: `UPDATE bookings SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?`,
            args: [params.id]
        });

        // Log cancellation
        await db.execute({
            sql: `INSERT INTO booking_history (booking_id, old_status, new_status, changed_by, notes)
                  VALUES (?, (SELECT status FROM bookings WHERE id = ?), 'cancelled', 'admin', 'Booking cancelled by admin')`,
            args: [params.id, params.id]
        });

        return NextResponse.json({ success: true, message: 'Booking cancelled' });
    } catch (error) {
        console.error('Delete booking error:', error);
        return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
    }
}
