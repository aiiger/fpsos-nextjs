import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const times = ['14:00', '16:00', '18:00', '20:00', '22:00'];
        let added = 0;

        for (let i = 0; i < 14; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i + 1);
            const dateStr = date.toISOString().split('T')[0];

            for (const time of times) {
                try {
                    await db.execute({
                        sql: 'INSERT OR IGNORE INTO availability_slots (date, time, is_available) VALUES (?, ?, 1)',
                        args: [dateStr, time]
                    });
                    added++;
                } catch (e) {
                    console.error(`Failed to add ${dateStr} ${time}`);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Added ${added} availability slots for next 14 days`
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
