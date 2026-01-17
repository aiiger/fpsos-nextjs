const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createAdmin() {
    const email = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4] || 'Admin';

    if (!email || !password) {
        console.log('Usage: node scripts/create-admin.js <email> <password> [name]');
        process.exit(1);
    }

    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
        console.error('Missing Turso credentials in .env.local');
        process.exit(1);
    }

    const db = createClient({ url, authToken });

    try {
        // Check if exists
        const existing = await db.execute({
            sql: 'SELECT * FROM users WHERE email = ?',
            args: [email]
        });

        if (existing.rows.length > 0) {
            console.error('User already exists!');
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const username = email.split('@')[0];

        await db.execute({
            sql: 'INSERT INTO users (email, password_hash, name, username) VALUES (?, ?, ?, ?)',
            args: [email, hashedPassword, name, username]
        });

        console.log(`✅ Admin account created for ${email}`);
        process.exit(0);

    } catch (e) {
        console.error('Failed to create account:', e);
        process.exit(1);
    }
}

createAdmin();
