import { db } from './db';

// Configuration (Could be moved to admin_settings table later)
const BUSINESS_CONFIG = {
  timezone: 'Asia/Dubai',
  startHour: 13, // 1 PM
  endHour: 23,   // 11 PM
  days: [1, 2, 3, 4, 5, 6, 0], // All days (0=Sun, 1=Mon, etc.)
  slotDurationMinutes: 60,
};

/**
 * Generates all potential slots for a given date range in the business timezone.
 */
function generateBaseSlots(startDate: string, endDate: string) {
  const slots = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Iterate through each day
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();

    // Check if open on this day
    if (!BUSINESS_CONFIG.days.includes(dayOfWeek)) continue;

    // Generate hourly slots
    for (let h = BUSINESS_CONFIG.startHour; h < BUSINESS_CONFIG.endHour; h++) {
      // Create slot string "YYYY-MM-DD HH:mm"
      const dateStr = d.toISOString().split('T')[0];
      const timeStr = `${h.toString().padStart(2, '0')}:00`;
      slots.push({ date: dateStr, time: timeStr });
    }
  }
  return slots;
}

export async function getAvailableSlots(startDate: string, endDate: string) {
  // 1. Generate theoretical slots based on business hours
  const baseSlots = generateBaseSlots(startDate, endDate);

  // 2. Fetch existing bookings (Blocking)
  const bookingsResult = await db.execute({
    sql: `SELECT date_time FROM bookings 
          WHERE status IN ('pending', 'confirmed', 'paid')
          AND date_time >= ?`,
    args: [`${startDate} 00:00`]
  });

  const bookedKeys = new Set(
    bookingsResult.rows.map((b: any) => {
      try {
        // date_time format in DB is likely "YYYY-MM-DD HH:mm"
        // Normalize just in case
        return b.date_time.trim();
      } catch { return ''; }
    })
  );

  // 3. Fetch Manual Overrides (availability_slots table)
  // We can use this table to specifically BLOCK slots (is_available=0) 
  // or ADD extra slots outside business hours (is_available=1)
  const overridesResult = await db.execute({
    sql: `SELECT date, time, is_available FROM availability_slots 
          WHERE date BETWEEN ? AND ?`,
    args: [startDate, endDate]
  });

  const overrides = new Map();
  overridesResult.rows.forEach((row: any) => {
    const key = `${row.date} ${row.time}`;
    overrides.set(key, row.is_available === 1); // true if available, false if blocked
  });

  // 4. Merge Logic - filter and add is_available property
  const finalSlots = baseSlots
    .filter(slot => {
      const key = `${slot.date} ${slot.time}`;

      // A. Check specific overrides first
      if (overrides.has(key)) {
        return overrides.get(key) === true; // If manually blocked (false), exclude. If manually added (true), include.
      }

      // B. Check if booked
      if (bookedKeys.has(key)) {
        return false;
      }

      // C. Default to available (since we generated it from business hours)
      return true;
    })
    .map(slot => ({
      ...slot,
      is_available: true  // All slots that pass the filter are available
    }));

  return finalSlots;
}
