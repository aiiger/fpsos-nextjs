import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL?.trim() || ':memory:';
const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

if (url === ':memory:') {
  console.warn('⚠️ TURSO_DATABASE_URL not found. Using in-memory database for build/dev.');
}

export const db = createClient({
  url,
  authToken,
});

// Helper to initialize tables (Async)
export async function initDB() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      discordId TEXT,
      score REAL NOT NULL,
      rank TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      pin TEXT
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      username TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT NOT NULL,
      discord_id TEXT NOT NULL,
      email TEXT,
      package_id TEXT NOT NULL,
      package_name TEXT NOT NULL,
      amount TEXT NOT NULL,
      date_time TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_id TEXT,
      payment_status TEXT DEFAULT 'unpaid',
      payment_method TEXT,
      add_ons TEXT,
      admin_notes TEXT,
      customer_notes TEXT,
      booking_token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Availability slots table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS availability_slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      is_available INTEGER DEFAULT 1,
      booking_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date, time)
    )
  `);

  // Booking history for status changes
  await db.execute(`
    CREATE TABLE IF NOT EXISTS booking_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      old_status TEXT,
      new_status TEXT NOT NULL,
      changed_by TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Forge Recommended Builds
  await db.execute(`
    CREATE TABLE IF NOT EXISTS forge_builds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,          -- e.g. "The FPSOS Standard"
      description TEXT,            -- e.g. "7800X3D + 4080 Super"
      parts_url TEXT,              -- e.g. pcpartpicker.com/list/...
      hardware_cost REAL NOT NULL, -- Manual or Scraped Total
      service_fee REAL NOT NULL,   -- "Optimization Upsell" 
      total_price REAL NOT NULL,   -- (Hardware + Fee) - Calculated or Stored
      active INTEGER DEFAULT 1,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Admin settings table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Safe migrations for existing bookings table
  const migrations = [
    'ALTER TABLE bookings ADD COLUMN payment_id TEXT',
    'ALTER TABLE bookings ADD COLUMN payment_status TEXT DEFAULT "unpaid"',
    'ALTER TABLE bookings ADD COLUMN payment_method TEXT',
    'ALTER TABLE bookings ADD COLUMN add_ons TEXT',
    'ALTER TABLE bookings ADD COLUMN admin_notes TEXT',
    'ALTER TABLE bookings ADD COLUMN customer_notes TEXT',
    'ALTER TABLE bookings ADD COLUMN booking_token TEXT',
    'ALTER TABLE bookings ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP',
    'ALTER TABLE scores ADD COLUMN pin TEXT'
  ];

  for (const migration of migrations) {
    try {
      await db.execute(migration);
    } catch (e) {
      // Ignore if column already exists
    }
  }
}
