import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

export async function GET() {
    try {
        await initDB();
        return NextResponse.json({
            success: true,
            message: 'Database initialized successfully'
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
