import { z } from 'zod';
import { NextResponse } from 'next/server';

// ============================================================================
// BOOKING SCHEMAS
// ============================================================================

export const bookingCreateSchema = z.object({
    client_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    discord_id: z.string().min(2, 'Discord ID is required').max(100),
    email: z.string().email('Invalid email address').optional().nullable(),
    package_id: z.string().min(1, 'Package ID is required'),
    package_name: z.string().min(1, 'Package name is required'),
    amount: z.string().min(1, 'Amount is required'),
    date_time: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, 'Date/time must be in format: YYYY-MM-DD HH:MM'),
    add_ons: z.array(z.string()).optional().default([]),
    customer_notes: z.string().max(1000).optional().default(''),
});

export const bookingUpdateSchema = z.object({
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
    admin_notes: z.string().max(2000).optional(),
    payment_status: z.enum(['unpaid', 'paid', 'refunded']).optional(),
    payment_id: z.string().optional(),
});

export type BookingCreate = z.infer<typeof bookingCreateSchema>;
export type BookingUpdate = z.infer<typeof bookingUpdateSchema>;

// ============================================================================
// LEADERBOARD SCHEMAS
// ============================================================================

export const scoreSubmitSchema = z.object({
    username: z.string().min(2, 'Username must be at least 2 characters').max(50),
    discordId: z.string().max(50).optional().nullable(),
    score: z.number().positive('Score must be positive').max(10000, 'Score seems too high'),
    rank: z.string().max(50).optional(),
    pin: z.string().min(4, 'PIN must be at least 4 characters').max(20),
});

export type ScoreSubmit = z.infer<typeof scoreSubmitSchema>;

// ============================================================================
// CONTACT SCHEMAS
// ============================================================================

export const contactFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    discord: z.string().max(100).optional(),
    phone: z.string().max(20).optional(),
    serviceType: z.enum(['quick-fix', 'full-tune', 'extreme', 'diagnosis']),
    systemInfo: z.string().min(10, 'Please provide more system details').max(2000),
    issues: z.string().min(10, 'Please describe your issues').max(2000),
    budget: z.string().max(100).optional(),
});

export type ContactForm = z.infer<typeof contactFormSchema>;

// ============================================================================
// AVAILABILITY SCHEMAS
// ============================================================================

export const availabilityActionSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in format: YYYY-MM-DD').optional(),
    dates: z.array(z.string()).optional(),
    times: z.array(z.string()).optional(),
    action: z.enum(['add', 'remove', 'bulk_add']),
});

export type AvailabilityAction = z.infer<typeof availabilityActionSchema>;

// ============================================================================
// VALIDATION HELPER
// ============================================================================

/**
 * Validates request body against a Zod schema
 * Returns parsed data or NextResponse with validation errors
 */
export async function validateRequest<T>(
    request: Request,
    schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
    try {
        const body = await request.json();
        const result = schema.safeParse(body);

        if (!result.success) {
            const errors = result.error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            return {
                success: false,
                response: NextResponse.json(
                    { error: 'Validation failed', details: errors },
                    { status: 400 }
                ),
            };
        }

        return { success: true, data: result.data };
    } catch (e) {
        return {
            success: false,
            response: NextResponse.json(
                { error: 'Invalid JSON body' },
                { status: 400 }
            ),
        };
    }
}
