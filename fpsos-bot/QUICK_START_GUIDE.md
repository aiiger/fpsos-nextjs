# 🚀 Quick Start Implementation Guide

## Summary

Based on the analysis, your current bot has:
- **4 Interactive Views** (PreBookingView, WelcomeView, DiagnosticView, BookingView)
- **1 Modal Form** (QuickAssessmentModal)
- **2 Helper Functions** (get_welcome_embed, get_packages_embed)
- **215 total lines** in a single file

---

## 🎯 My Recommendations

### 1. **Keep It Simple First (Recommended for Now)**

Since you're just starting and your bot is relatively simple (215 lines), you have **3 options**:

#### **Option A: Stay Monolithic (Easiest - Do This First)** ⭐ RECOMMENDED
- **Pros:** No refactoring needed, works now
- **Cons:** Gets messy as features grow
- **When to choose:** If you want to add features quickly first
- **Action:** Just enhance current bot.py with:
  1. Add file upload handler (for JSON diagnostics)
  2. Add database integration
  3. Add Calendly webhook
  4. Refactor later when it gets messy

#### **Option B: Light Refactoring (Middle Ground)**
- **Pros:** Cleaner code, not too complex
- **Cons:** Some work upfront
- **When to choose:** If you plan to add many features
- **Action:** Keep bot.py but extract to separate files:
  ```
  fpsos-bot/
  ├── bot.py (main, 50 lines)
  ├── views.py (all Views + Modals, 100 lines)
  ├── embeds.py (all embed helpers, 30 lines)
  ├── database.py (DB operations, 50 lines)
  └── webhooks.py (Calendly handler, 50 lines)
  ```

#### **Option C: Full Modular (Professional)**
- **Pros:** Best long-term, scalable, team-friendly
- **Cons:** Significant upfront work
- **When to choose:** If building serious business
- **Action:** Full cogs structure (see DISCORD_BOT_SETUP_GUIDE.md)

---

## 🏁 Immediate Action Plan (Next 2 Hours)

### I recommend starting with **critical missing features** before refactoring:

1. **Add JSON Upload Handler (30 min)** - Your bot can't process diagnostic results yet!
2. **Add Database Tables (20 min)** - Track users, bookings, diagnostics
3. **Test Full Flow (30 min)** - Welcome → Diagnostic → JSON Upload → Recommendation → Booking
4. **Add Calendly Webhook (40 min)** - Auto-confirm bookings

**After these work**, then decide if you want to refactor.

---

## 📝 Quick Implementation Templates

### 1. Add JSON Upload Handler to Current bot.py

Add this to your existing `bot.py` after the `on_message` event handler (around line 109):

```python
@bot.event
async def on_message(message):
    """Conversational greeting and assistance"""
    if message.author == bot.user:
        return

    content = message.content.lower().strip()
    
    # NEW: Check for JSON file uploads (DIAGNOSTIC RESULTS)
    if message.attachments:
        for attachment in message.attachments:
            if attachment.filename.endswith('.json'):
                await handle_diagnostic_json(message, attachment)
                return  # Don't process other message handling
    
    # Existing greeting code...
    if content in ["hi", "hello", "hey", "hello bot", "yo"]:
        # ... existing code
        pass

    # Existing booking intent code...
    if any(word in content for word in ["book", "session", "schedule"]):
        # ... existing code
        pass

    await bot.process_commands(message)


async def handle_diagnostic_json(message, attachment):
    """Handle diagnostic JSON file upload"""
    try:
        import json
        
        # Download and parse JSON
        file_bytes = await attachment.read()
        diagnostic_data = json.loads(file_bytes.decode('utf-8'))
        
        # Simple scoring (enhance this later)
        critical_count = len(diagnostic_data.get('issues', {}).get('critical', []))
        warning_count = len(diagnostic_data.get('issues', {}).get('warnings', []))
        
        # Determine recommendation
        if critical_count >= 2:
            recommendation = 'extreme'
            package_name = 'Extreme BIOSPRIME'
            price = 'AED 699'
        elif critical_count >= 1 or warning_count >= 3:
            recommendation = 'full'
            package_name = 'Full System Tune-Up'
            price = 'AED 399'
        elif warning_count >= 1:
            recommendation = 'quick'
            package_name = 'Quick Remote Fix'
            price = 'AED 199'
        else:
            recommendation = 'good'
            package_name = 'Your system looks good!'
            price = 'No service needed'
        
        # Create result embed
        embed = discord.Embed(
            title="🎯 Diagnostic Results",
            description=f"**Recommendation:** {package_name}",
            color=Colors.FPSOS_PURPLE if recommendation != 'good' else Colors.SUCCESS
        )
        
        # Add issues found
        if critical_count > 0:
            critical_issues = '\n'.join([f"• {issue}" for issue in diagnostic_data['issues']['critical']])
            embed.add_field(name="❌ Critical Issues", value=critical_issues, inline=False)
        
        if warning_count > 0:
            warning_issues = '\n'.join([f"• {issue}" for issue in diagnostic_data['issues']['warnings'][:5]])  # Limit to 5
            embed.add_field(name="⚠️ Warnings", value=warning_issues, inline=False)
        
        embed.add_field(name="💰 Price", value=price, inline=True)
        embed.add_field(name="📊 Score", value=f"Critical: {critical_count} | Warnings: {warning_count}", inline=True)
        
        # Send result with booking button if needed
        if recommendation != 'good':
            view = BookingView(recommendation)
            await message.reply(embed=embed, view=view)
        else:
            await message.reply(embed=embed)
        
    except json.JSONDecodeError:
        await message.reply("❌ Invalid JSON file. Please upload the diagnostic file from the PowerShell tool.")
    except Exception as e:
        await message.reply(f"❌ Error processing diagnostic: {str(e)}")
        print(f"Diagnostic upload error: {e}")
```

### 2. Add Database Integration

Create a new file `database.py` in `fpsos-bot/`:

```python
# database.py
import sqlite3
from pathlib import Path
from datetime import datetime

class FPSOSDatabase:
    def __init__(self, db_path='fpsos_bot.db'):
        self.db_path = db_path
        self.init_database()
    
    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_database(self):
        """Create tables if they don't exist"""
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
                total_bookings INTEGER DEFAULT 0
            )
        ''')
        
        # Diagnostics table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS diagnostics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                json_data TEXT,
                critical_count INTEGER,
                warning_count INTEGER,
                recommendation TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(discord_id)
            )
        ''')
        
        # Bookings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                service_type TEXT,
                calendly_event_id TEXT UNIQUE,
                scheduled_date DATETIME,
                completed BOOLEAN DEFAULT 0,
                amount_aed REAL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(discord_id)
            )
        ''')
        
        conn.commit()
        conn.close()
        print("✅ Database initialized")
    
    def add_user(self, discord_id, username, email=None):
        """Add or update user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT OR REPLACE INTO users (discord_id, username, email)
            VALUES (?, ?, ?)
        ''', (str(discord_id), username, email))
        conn.commit()
        conn.close()
    
    def save_diagnostic(self, user_id, json_data, critical_count, warning_count, recommendation):
        """Save diagnostic result"""
        import json
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO diagnostics (user_id, json_data, critical_count, warning_count, recommendation)
            VALUES (?, ?, ?, ?, ?)
        ''', (str(user_id), json.dumps(json_data), critical_count, warning_count, recommendation))
        conn.commit()
        conn.close()
    
    def get_user_stats(self, discord_id):
        """Get user statistics"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT 
                COUNT(DISTINCT d.id) as total_diagnostics,
                COUNT(DISTINCT b.id) as total_bookings
            FROM users u
            LEFT JOIN diagnostics d ON u.discord_id = d.user_id
            LEFT JOIN bookings b ON u.discord_id = b.user_id
            WHERE u.discord_id = ?
        ''', (str(discord_id),))
        result = cursor.fetchone()
        conn.close()
        return dict(result) if result else None

# Global database instance
db = FPSOSDatabase()
```

Then in your `bot.py`, import and use it:

```python
# At top of bot.py
from database import db

# In on_member_join:
@bot.event
async def on_member_join(member: discord.Member):
    """Welcome new members with smooth onboarding flow"""
    db.add_user(member.id, member.name)  # NEW: Save to database
    # ... rest of existing code

# In handle_diagnostic_json (after determining recommendation):
# Save to database
db.save_diagnostic(
    message.author.id,
    diagnostic_data,
    critical_count,
    warning_count,
    recommendation
)
```

### 3. Add Simple Calendly Webhook (FastAPI)

Create `webhook_server.py` in `fpsos-bot/`:

```python
# webhook_server.py
from fastapi import FastAPI, Request
from database import db
import os

app = FastAPI()

@app.post("/calendly")
async def calendly_webhook(request: Request):
    """Handle Calendly booking webhooks"""
    data = await request.json()
    
    event_type = data.get('event')
    payload = data.get('payload', {})
    
    if event_type == 'invitee.created':
        # New booking
        invitee = payload.get('invitee', {})
        event = payload.get('event', {})
        
        # Extract info
        email = invitee.get('email')
        event_id = event.get('uri')
        scheduled_time = event.get('start_time')
        
        # Get Discord ID from custom question
        discord_id = None
        for qa in invitee.get('questions_and_answers', []):
            if 'discord' in qa.get('question', '').lower():
                discord_id = qa.get('answer')
        
        # Determine service type from event name
        event_name = event.get('name', '').lower()
        if 'quick' in event_name:
            service_type, amount = 'quick', 199
        elif 'extreme' in event_name:
            service_type, amount = 'extreme', 699
        else:
            service_type, amount = 'full', 399
        
        # Save to database
        if discord_id:
            conn = db.get_connection()
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO bookings (user_id, service_type, calendly_event_id, scheduled_date, amount_aed)
                VALUES (?, ?, ?, ?, ?)
            ''', (discord_id, service_type, event_id, scheduled_time, amount))
            conn.commit()
            conn.close()
            
            print(f"✅ Booking saved: {discord_id} - {service_type} - {scheduled_time}")
    
    return {"status": "ok"}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
```

**To run webhook server:**
```bash
pip install fastapi uvicorn
python webhook_server.py
```

Then configure Calendly webhook to send to: `http://YOUR_IP:8000/calendly`

---

## 🧪 Test Your Enhanced Bot

### Step 1: Test JSON Upload
1. Run bot: `python bot.py`
2. Send a test JSON file in Discord (get from PowerShell tool)
3. Bot should analyze and recommend a package

### Step 2: Test Booking Flow
1. User clicks "Book Now" button
2. Opens Calendly link
3. User books session
4. Webhook triggers (if running `webhook_server.py`)
5. Booking saved to database

### Step 3: Check Database
```bash
sqlite3 fpsos_bot.db "SELECT * FROM diagnostics;"
sqlite3 fpsos_bot.db "SELECT * FROM bookings;"
```

---

## 📊 Suggested Order of Implementation

**This Week (Critical Features):**
1. ✅ Add JSON upload handler ← DO THIS FIRST
2. ✅ Add database tables
3. ✅ Test diagnostic flow end-to-end
4. ✅ Add Calendly webhook (optional for now)

**Next Week (Nice to Have):**
5. Add admin stats command (`/stats`)
6. Add reminder system (24h before session)
7. Add testimonial request after session

**Month 2 (Professional Polish):**
8. Refactor to modular structure IF needed
9. Add unit tests
10. Deploy to production (Railway/Heroku)

---

## 🎯 Key Takeaway

**Don't over-engineer early!** Your current 215-line bot is fine. Focus on:
1. Making it **functional** (handle JSON, save to DB, confirm bookings)
2. Proving it **works** (get 10-20 real users)
3. **Then** refactor if it gets messy

The modular structure I outlined is for when you have 5-10+ commands and 1000+ lines of code.

---

## 🆘 Need Help?

**If stuck on:**
- JSON parsing → Check `diagnostic_data` structure from PowerShell tool
- Database → Use SQLite Browser to inspect `fpsos_bot.db`
- Webhooks → Use ngrok to expose localhost for testing
- Discord API → Check discord.py documentation

**Next Steps:**
1. Copy the JSON handler code into your `bot.py`
2. Create `database.py` file
3. Test with a sample JSON file
4. Report back results!

Good luck! 🚀
