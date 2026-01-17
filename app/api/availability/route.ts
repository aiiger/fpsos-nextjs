import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getAvailableSlots } from '@/lib/availability';

// GET: Fetch available time slots (Dynamic Generation)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const timezone = searchParams.get('timezone') || 'Asia/Dubai'; // Target timezone

    if (!startDate || !endDate) {
        return NextResponse.json({ error: 'Start and end date required' }, { status: 400 });
    }

    try {
        // Get slots in Dubai Time (Source of Truth)
        const slots = await getAvailableSlots(startDate, endDate);
        
        return NextResponse.json(slots);
    } catch (error) {
        console.error('Availability fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
    }
}

// POST: Admin creates/updates availability slots
export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { date, times, action } = body;

        if (action === 'add') {
            // Add availability for multiple time slots
            for (const time of times) {
                try {
                    await db.execute({
                        sql: 'INSERT OR IGNORE INTO availability_slots (date, time, is_available) VALUES (?, ?, 1)',
                        args: [date, time]
                    });
                } catch (e) {
                    console.error(`Failed to add slot ${date} ${time}:`, e);
                }
            }
        } else if (action === 'remove') {
            // Mark slot as unavailable
            for (const time of times) {
                await db.execute({
                    sql: 'UPDATE availability_slots SET is_available = 0 WHERE date = ? AND time = ?',
                    args: [date, time]
                });
            }
        } else if (action === 'bulk_add') {
            // Add recurring availability (e.g., Mon-Fri 2pm-10pm for next 30 days)
            const { dates, times: bulkTimes } = body;
            for (const bulkDate of dates) {
                for (const bulkTime of bulkTimes) {
                    try {
                        await db.execute({
                            sql: 'INSERT OR IGNORE INTO availability_slots (date, time, is_available) VALUES (?, ?, 1)',
                            args: [bulkDate, bulkTime]
                        });
                    } catch (e) {
                        console.error(`Bulk add failed for ${bulkDate} ${bulkTime}`);
                    }
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Availability update error:', error);
        return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
    }
}

// DELETE: Remove availability slot
export async function DELETE(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const time = searchParams.get('time');

    if (!date || !time) {
        return NextResponse.json({ error: 'Date and time required' }, { status: 400 });
    }

    try {
        await db.execute({
            sql: 'DELETE FROM availability_slots WHERE date = ? AND time = ?',
            args: [date, time]
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete availability error:', error);
        return NextResponse.json({ error: 'Failed to delete slot' }, { status: 500 });
    }
}
