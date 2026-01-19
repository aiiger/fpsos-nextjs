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

  // InputZero Architecture: Premium PC Builds with Amazon PAAPI Integration
  await db.execute(`
    CREATE TABLE IF NOT EXISTS forge_builds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      tier TEXT NOT NULL,
      description TEXT,
      motherboard_asin TEXT,
      cpu_asin TEXT,
      gpu_asin TEXT,
      ram_asin TEXT,
      case_asin TEXT,
      psu_asin TEXT,
      storage_asin TEXT,
      cooler_asin TEXT,
      mouse_asin TEXT,
      mousepad_asin TEXT,
      mouse_glides_asin TEXT,
      service_fee_aed REAL DEFAULT 2500,
      markup_uae REAL DEFAULT 0.125,
      markup_international REAL DEFAULT 0.225,
      approved INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

    ;

  // Component price cache for Amazon PAAPI
  await db.execute(`
    CREATE TABLE IF NOT EXISTS component_prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asin TEXT NOT NULL UNIQUE,
      title TEXT,
      price_usd REAL,
      currency TEXT DEFAULT 'USD',
      availability INTEGER DEFAULT 1,
      image_url TEXT,
      last_checked DATETIME DEFAULT CURRENT_TIMESTAMP
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
