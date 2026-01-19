"""
FPSOS Bot Database Service
Handles all database operations for users, diagnostics, bookings, and testimonials
"""

import sqlite3
from pathlib import Path
from datetime import datetime
import json


class FPSOSDatabase:
    """Singleton database connection for FPSOS bot"""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.initialized = False
        return cls._instance
    
    def __init__(self, db_path='fpsos_bot.db'):
        if not self.initialized:
            self.db_path = db_path
            self.init_database()
            self.initialized = True
    
    def get_connection(self):
        """Get a database connection with row factory"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_database(self):
        """Create all tables if they don't exist"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                discord_id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT,
                join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                referral_code TEXT UNIQUE,
                referred_by TEXT,
                total_bookings INTEGER DEFAULT 0,
                total_diagnostics INTEGER DEFAULT 0,
                FOREIGN KEY (referred_by) REFERENCES users(discord_id)
            )
        ''')
        
        # Diagnostics table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS diagnostics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                json_data TEXT NOT NULL,
                critical_count INTEGER DEFAULT 0,
                warning_count INTEGER DEFAULT 0,
                recommendation TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(discord_id)
            )
        ''')
        
        # Bookings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                service_type TEXT NOT NULL,
                calendly_event_id TEXT UNIQUE,
                scheduled_date DATETIME,
                completed BOOLEAN DEFAULT 0,
                payment_received BOOLEAN DEFAULT 0,
                amount_aed REAL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(discord_id)
            )
        ''')
        
        # Testimonials table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS testimonials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                booking_id INTEGER,
                rating INTEGER CHECK(rating >= 1 AND rating <= 10),
                feedback TEXT,
                fps_before INTEGER,
                fps_after INTEGER,
                latency_before INTEGER,
                latency_after INTEGER,
                approved BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(discord_id),
                FOREIGN KEY (booking_id) REFERENCES bookings(id)
            )
        ''')
        
        # Referrals table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS referrals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                referrer_id TEXT NOT NULL,
                referred_id TEXT NOT NULL,
                booking_id INTEGER,
                credit_amount REAL DEFAULT 50.00,
                credit_used BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (referrer_id) REFERENCES users(discord_id),
                FOREIGN KEY (referred_id) REFERENCES users(discord_id),
                FOREIGN KEY (booking_id) REFERENCES bookings(id)
            )
        ''')
        

        # Tickets table (Modmail)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                channel_id TEXT NOT NULL,
                status TEXT DEFAULT 'open',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(discord_id)
            )
        ''')

        # Tags table (Dynamic Knowledge Base)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tags (
                name TEXT PRIMARY KEY,
                content TEXT NOT NULL,
                created_by TEXT,
                usage_count INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        self._ensure_specs_column()
        print("Database initialized with all tables")
    
    # ========== USER OPERATIONS ==========
    
    def add_user(self, discord_id, username, email=None):
        """Add or update user in database"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO users (discord_id, username, email)
            VALUES (?, ?, ?)
            ON CONFLICT(discord_id) DO UPDATE SET
                username = excluded.username,
                email = COALESCE(excluded.email, email)
        ''', (str(discord_id), username, email))
        
        conn.commit()
        conn.close()
    
    def get_user(self, discord_id):
        """Get user by Discord ID"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM users WHERE discord_id = ?', (str(discord_id),))
        result = cursor.fetchone()
        conn.close()
        
        return dict(result) if result else None
    
    def update_user_specs(self, discord_id, specs_str):
        """Update user's PC specs"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Ensure user exists first
        self.add_user(discord_id, "Unknown", None)
        
        cursor.execute('''
            UPDATE users 
            SET specs = ? 
            WHERE discord_id = ?
        ''', (specs_str, str(discord_id)))
        
        conn.commit()
        conn.close()

    def _ensure_specs_column(self):
        """Migration: Ensure specs column exists in users table"""
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN specs TEXT")
            conn.commit()
            print("Added 'specs' column to users table.")
        except sqlite3.OperationalError:
            pass # Column likely exists
        conn.close()
    
    # ========== DIAGNOSTIC OPERATIONS ==========
    
    def save_diagnostic(self, user_id, json_data, critical_count, warning_count, recommendation):
        """Save diagnostic result to database"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Save diagnostic
        cursor.execute('''
            INSERT INTO diagnostics (user_id, json_data, critical_count, warning_count, recommendation)
            VALUES (?, ?, ?, ?, ?)
        ''', (str(user_id), json.dumps(json_data), critical_count, warning_count, recommendation))
        
        # Update user's diagnostic count
        cursor.execute('''
            UPDATE users 
            SET total_diagnostics = total_diagnostics + 1
            WHERE discord_id = ?
        ''', (str(user_id),))
        
        conn.commit()
        diagnostic_id = cursor.lastrowid
        conn.close()
        
        return diagnostic_id
    
    def get_user_diagnostics(self, discord_id, limit=5):
        """Get user's recent diagnostics"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM diagnostics 
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        ''', (str(discord_id), limit))
        
        results = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in results]
    
    # ========== BOOKING OPERATIONS ==========
    
    def create_booking(self, user_id, service_type, calendly_event_id=None, scheduled_date=None, amount_aed=None):
        """Create a new booking"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO bookings (user_id, service_type, calendly_event_id, scheduled_date, amount_aed)
            VALUES (?, ?, ?, ?, ?)
        ''', (str(user_id), service_type, calendly_event_id, scheduled_date, amount_aed))
        
        # Update user's booking count
        cursor.execute('''
            UPDATE users
            SET total_bookings = total_bookings + 1
            WHERE discord_id = ?
        ''', (str(user_id),))
        
        conn.commit()
        booking_id = cursor.lastrowid
        conn.close()
        
        return booking_id
    
    def get_booking_by_calendly_id(self, calendly_event_id):
        """Get booking by Calendly event ID"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM bookings WHERE calendly_event_id = ?', (calendly_event_id,))
        result = cursor.fetchone()
        conn.close()
        
        return dict(result) if result else None
    
    def mark_booking_complete(self, booking_id):
        """Mark booking as completed"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE bookings
            SET completed = 1
            WHERE id = ?
        ''', (booking_id,))
        
        conn.commit()
        conn.close()
        
    # ========== TICKET OPERATIONS (MODMAIL) ==========

    def create_ticket(self, user_id, channel_id):
        """Create a new open ticket"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO tickets (user_id, channel_id, status) VALUES (?, ?, ?)', 
                       (str(user_id), str(channel_id), 'open'))
        conn.commit()
        ticket_id = cursor.lastrowid
        conn.close()
        return ticket_id

    def get_active_ticket(self, user_id):
        """Get active (open) ticket for a user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tickets WHERE user_id = ? AND status = 'open'", (str(user_id),))
        result = cursor.fetchone()
        conn.close()
        return dict(result) if result else None
        
    def get_ticket_by_channel(self, channel_id):
        """Get ticket associated with a channel ID"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tickets WHERE channel_id = ? AND status = 'open'", (str(channel_id),))
        result = cursor.fetchone()
        conn.close()
        return dict(result) if result else None

    def close_ticket(self, ticket_id):
        """Close a ticket"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE tickets SET status = 'closed' WHERE id = ?", (ticket_id,))
        conn.commit()
        conn.close()

    # ========== TAG OPERATIONS (KNOWLEDGE BASE) ==========

    def add_tag(self, name, content, created_by):
        """Create or update a tag"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO tags (name, content, created_by) VALUES (?, ?, ?)
            ON CONFLICT(name) DO UPDATE SET content=excluded.content, created_by=excluded.created_by
        ''', (name.lower(), content, str(created_by)))
        conn.commit()
        conn.close()

    def delete_tag(self, name):
        """Delete a tag by name"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM tags WHERE name = ?', (name.lower(),))
        conn.commit()
        conn.close()

    def get_tag(self, name):
        """Get a tag and increment usage"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM tags WHERE name = ?', (name.lower(),))
        result = cursor.fetchone()
        
        if result:
            cursor.execute('UPDATE tags SET usage_count = usage_count + 1 WHERE name = ?', (name.lower(),))
            conn.commit()
            
        conn.close()
        return dict(result) if result else None
    
    def get_all_tags(self):
        """List all available tags"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT name FROM tags ORDER BY name ASC')
        results = cursor.fetchall()
        conn.close()
        return [row['name'] for row in results]

    # ========== ANALYTICS ==========
    
    def get_stats(self):
        """Get overall bot statistics"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Total users
        cursor.execute('SELECT COUNT(*) as count FROM users')
        total_users = cursor.fetchone()['count']
        
        # Total diagnostics
        cursor.execute('SELECT COUNT(*) as count FROM diagnostics')
        total_diagnostics = cursor.fetchone()['count']
        
        # Total bookings
        cursor.execute('SELECT COUNT(*) as count FROM bookings')
        total_bookings = cursor.fetchone()['count']
        
        # Completed bookings
        cursor.execute('SELECT COUNT(*) as count FROM bookings WHERE completed = 1')
        completed_bookings = cursor.fetchone()['count']
        
        # Total revenue
        cursor.execute('SELECT SUM(amount_aed) as total FROM bookings WHERE completed = 1')
        total_revenue = cursor.fetchone()['total'] or 0
        
        # Conversion rate
        conversion_rate = (total_bookings / total_diagnostics * 100) if total_diagnostics > 0 else 0
        
        # Popular service
        cursor.execute('''
            SELECT service_type, COUNT(*) as count
            FROM bookings
            GROUP BY service_type
            ORDER BY count DESC
            LIMIT 1
        ''')
        popular_service = cursor.fetchone()
        
        conn.close()
        
        return {
            'total_users': total_users,
            'total_diagnostics': total_diagnostics,
            'total_bookings': total_bookings,
            'completed_bookings': completed_bookings,
            'total_revenue': total_revenue,
            'conversion_rate': round(conversion_rate, 2),
            'popular_service': popular_service['service_type'] if popular_service else 'None'
        }


# Global database instance
db = FPSOSDatabase()

if __name__ == '__main__':
    # Test database initialization
    print("Testing database...")
    stats = db.get_stats()
    print(f"Database stats: {stats}")
