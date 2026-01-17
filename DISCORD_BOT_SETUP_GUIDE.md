# Discord Bot Setup & Capabilities Extraction Guide

**Last Updated:** 2026-01-12  
**Purpose:** Complete guide to set up your FPSOS Discord bot for booking automation and extract all capabilities

---

## 📋 Table of Contents

1. [Current Architecture Analysis](#current-architecture-analysis)
2. [Best Setup Architecture](#best-setup-architecture)
3. [Extracting All Capabilities](#extracting-all-capabilities)
4. [Implementation Recommendations](#implementation-recommendations)
5. [Database Integration](#database-integration)
6. [Booking Automation Flow](#booking-automation-flow)
7. [Next Steps](#next-steps)

---

## 🏗️ Current Architecture Analysis

### What You Have Now

**Structure:**
```
fpsos-bot/
├── bot.py (215 lines - monolithic)
├── commands/ (empty - unused)
├── utils/ (empty - unused)
├── embeds/ (empty)
├── .env
├── requirements.txt
└── README.md
```

**Current Capabilities:**
- ✅ `/diagnostic` command (sends PowerShell tool)
- ✅ `/book` command (shows Calendly links)
- ✅ Quick assessment modal (form-based intake)
- ✅ Welcome flow for new members
- ✅ Conversational greeting detection
- ✅ Pre-booking assessment
- ✅ Package recommendation system

**Issues:**
- ❌ All code in one 215-line `bot.py` file (monolithic)
- ❌ No database integration
- ❌ No file upload handling for diagnostic JSON
- ❌ No Calendly webhook integration
- ❌ Empty modular folders (commands/, utils/, embeds/)
- ❌ No analytics or tracking

---

## 🎯 Best Setup Architecture

### Recommended Structure (Modular)

```
fpsos-bot/
├── bot.py                          # Main bot entry (minimal, just loads cogs)
├── cogs/                           # Discord.py cogs (modular commands)
│   ├── __init__.py
│   ├── diagnostic.py               # /diagnostic command + JSON analysis
│   ├── booking.py                  # /book command + booking flow
│   ├── support.py                  # /support ticket system
│   ├── admin.py                    # Admin commands (stats, user management)
│   └── events.py                   # on_member_join, on_message handlers
├── services/                       # Business logic (separate from Discord)
│   ├── __init__.py
│   ├── diagnostic_analyzer.py      # Parse JSON, apply scoring rules
│   ├── booking_manager.py          # Handle bookings, Calendly integration
│   ├── user_manager.py             # User CRUD operations
│   └── notification_service.py     # DMs, reminders, follow-ups
├── database/
│   ├── __init__.py
│   ├── models.py                   # SQLAlchemy models
│   ├── connection.py               # Singleton DB connection
│   └── migrations/                 # Database schema changes
├── webhooks/
│   ├── __init__.py
│   ├── calendly_handler.py         # Calendly webhook receiver
│   └── stripe_handler.py           # Payment webhooks (future)
├── utils/
│   ├── __init__.py
│   ├── embeds.py                   # Reusable embed templates
│   ├── validators.py               # Input validation
│   └── logger.py                   # Custom logging setup
├── config/
│   ├── __init__.py
│   ├── settings.py                 # Environment variables, constants
│   └── messages.py                 # Bot message templates (multi-language ready)
├── tests/                          # Unit tests
│   ├── test_diagnostic.py
│   ├── test_booking.py
│   └── test_webhooks.py
├── .env                            # Environment variables (NOT in git)
├── .env.example                    # Template for .env
├── requirements.txt
├── README.md
└── docker-compose.yml              # Optional: for local dev with DB
```

---

## 🔍 Extracting All Capabilities

### Method 1: Extract from Current bot.py

Your current `bot.py` has these capabilities that need to be modularized:

#### **Views (Interactive Components):**
1. `WelcomeView` - Start diagnostic or see packages
2. `DiagnosticView` - PowerShell tool or quick questions
3. `PreBookingView` - Find package or book directly
4. `BookingView` - Direct Calendly booking links
5. `QuickAssessmentModal` - Form for quick assessment

#### **Commands:**
1. `/diagnostic` - Trigger diagnostic flow
2. `/book` - Trigger booking flow
3. `!fpsos` - Prefix command for welcome message

#### **Event Handlers:**
1. `on_member_join` - Welcome new members
2. `on_message` - Conversational greetings and intents

#### **Helper Functions:**
1. `get_welcome_embed()` - Generate welcome message
2. `get_packages_embed()` - Show service packages

### Method 2: Create Capability Extraction Script

Create a script to document all capabilities:

```python
# extract_capabilities.py
"""
Analyzes bot.py and extracts all commands, views, and handlers
"""
import ast
import inspect

def extract_bot_capabilities(file_path='bot.py'):
    with open(file_path, 'r', encoding='utf-8') as f:
        tree = ast.parse(f.read())
    
    capabilities = {
        'commands': [],
        'views': [],
        'modals': [],
        'event_handlers': [],
        'helper_functions': []
    }
    
    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef):
            if 'View' in node.name:
                capabilities['views'].append(node.name)
            elif 'Modal' in node.name:
                capabilities['modals'].append(node.name)
        
        elif isinstance(node, ast.FunctionDef):
            if node.name.startswith('on_'):
                capabilities['event_handlers'].append(node.name)
            elif node.name.endswith('_cmd'):
                capabilities['commands'].append(node.name)
            elif node.name.startswith('get_'):
                capabilities['helper_functions'].append(node.name)
    
    return capabilities

if __name__ == '__main__':
    caps = extract_bot_capabilities()
    
    print("═══════════════════════════════════")
    print("FPSOS BOT CAPABILITIES EXTRACTION")
    print("═══════════════════════════════════")
    
    for category, items in caps.items():
        print(f"\n{category.upper().replace('_', ' ')}:")
        for item in items:
            print(f"  • {item}")
```

---

## 💡 Implementation Recommendations

### 1. **Migrate to Modular Structure (Recommended)**

**Why:**
- ✅ Better maintainability (each file has one responsibility)
- ✅ Easier testing (unit tests per module)
- ✅ Team collaboration (multiple people can work on different files)
- ✅ Scalability (add new features without bloating main file)

**Migration Plan:**

#### Step 1: Create Cogs for Commands
```python
# cogs/diagnostic.py
from discord.ext import commands
from discord import app_commands
import discord

class Diagnostic(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @app_commands.command(name="diagnostic")
    async def diagnostic(self, interaction: discord.Interaction):
        """Start CS2 diagnostic flow"""
        # Your diagnostic logic here
        pass

async def setup(bot):
    await bot.add_cog(Diagnostic(bot))
```

#### Step 2: Minimal bot.py
```python
# bot.py (new minimal version)
import discord
from discord.ext import commands
import os
from dotenv import load_dotenv
import asyncio

load_dotenv()

intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix='!', intents=intents)

async def load_cogs():
    """Load all cog modules"""
    cogs = [
        'cogs.diagnostic',
        'cogs.booking',
        'cogs.support',
        'cogs.events',
        'cogs.admin'
    ]
    for cog in cogs:
        try:
            await bot.load_extension(cog)
            print(f'✅ Loaded {cog}')
        except Exception as e:
            print(f'❌ Failed to load {cog}: {e}')

@bot.event
async def on_ready():
    print(f'🎯 {bot.user.name} is online')
    await load_cogs()
    await bot.tree.sync()
    print(f'✅ Synced {len(bot.tree.get_commands())} commands')

if __name__ == '__main__':
    bot.run(os.getenv('DISCORD_BOT_TOKEN'))
```

### 2. **Add Database Integration**

**Current Issue:** Your `leaderboard.db` only has a `scores` table for reaction test. You need booking/user tables.

**Recommended Schema:**

```sql
-- Users table (Discord members)
CREATE TABLE users (
    discord_id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    referral_code TEXT UNIQUE,
    referred_by TEXT REFERENCES users(discord_id),
    total_bookings INTEGER DEFAULT 0
);

-- Diagnostics table (JSON uploads)
CREATE TABLE diagnostics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT REFERENCES users(discord_id),
    json_data TEXT,  -- Store full JSON
    critical_count INTEGER,
    warning_count INTEGER,
    recommendation TEXT,  -- 'quick', 'full', 'extreme', 'good'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT REFERENCES users(discord_id),
    service_type TEXT,  -- 'quick', 'full', 'extreme'
    calendly_event_id TEXT UNIQUE,
    scheduled_date DATETIME,
    completed BOOLEAN DEFAULT 0,
    payment_received BOOLEAN DEFAULT 0,
    amount_aed REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials table
CREATE TABLE testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT REFERENCES users(discord_id),
    booking_id INTEGER REFERENCES bookings(id),
    rating INTEGER CHECK(rating >= 1 AND rating <= 10),
    feedback TEXT,
    fps_before INTEGER,
    fps_after INTEGER,
    approved BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Referrals table
CREATE TABLE referrals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referrer_id TEXT REFERENCES users(discord_id),
    referred_id TEXT REFERENCES users(discord_id),
    booking_id INTEGER REFERENCES bookings(id),
    credit_amount REAL DEFAULT 50.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Python Database Service:**

```python
# database/connection.py
import sqlite3
from pathlib import Path

class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            db_path = Path(__file__).parent.parent / 'fpsos_bot.db'
            cls._instance.conn = sqlite3.connect(db_path)
            cls._instance.conn.row_factory = sqlite3.Row
        return cls._instance
    
    def execute(self, query, params=()):
        cursor = self.conn.cursor()
        cursor.execute(query, params)
        self.conn.commit()
        return cursor
    
    def fetchone(self, query, params=()):
        cursor = self.execute(query, params)
        return cursor.fetchone()
    
    def fetchall(self, query, params=()):
        cursor = self.execute(query, params)
        return cursor.fetchall()

# Usage in cogs:
# from database.connection import Database
# db = Database()
# db.execute("INSERT INTO users (discord_id, username) VALUES (?, ?)", (user.id, user.name))
```

### 3. **Add File Upload Handler (Critical Missing Feature)**

Your bot currently sends the PowerShell tool but doesn't handle the JSON upload. Add this:

```python
# cogs/events.py
from discord.ext import commands
import discord
import json
from services.diagnostic_analyzer import DiagnosticAnalyzer

class Events(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @commands.Cog.listener()
    async def on_message(self, message):
        if message.author == self.bot.user:
            return
        
        # Check for JSON file attachments
        if message.attachments:
            for attachment in message.attachments:
                if attachment.filename.endswith('.json'):
                    await self.handle_diagnostic_upload(message, attachment)
    
    async def handle_diagnostic_upload(self, message, attachment):
        """Handle diagnostic JSON file upload"""
        try:
            # Download and parse JSON
            file_bytes = await attachment.read()
            diagnostic_data = json.loads(file_bytes.decode('utf-8'))
            
            # Analyze diagnostic data
            analyzer = DiagnosticAnalyzer()
            result = analyzer.analyze(diagnostic_data)
            
            # Store in database
            from database.connection import Database
            db = Database()
            db.execute("""
                INSERT INTO diagnostics (user_id, json_data, critical_count, warning_count, recommendation)
                VALUES (?, ?, ?, ?, ?)
            """, (
                str(message.author.id),
                json.dumps(diagnostic_data),
                result['critical_count'],
                result['warning_count'],
                result['recommendation']
            ))
            
            # Send personalized recommendation
            embed = self.create_diagnostic_result_embed(result)
            view = BookingView(result['recommendation'])
            await message.reply(embed=embed, view=view)
            
        except json.JSONDecodeError:
            await message.reply("❌ Invalid JSON file. Please upload the diagnostic JSON from the PowerShell tool.")
        except Exception as e:
            await message.reply(f"❌ Error processing diagnostic: {e}")
            print(f"Diagnostic upload error: {e}")

async def setup(bot):
    await bot.add_cog(Events(bot))
```

### 4. **Add Calendly Webhook Integration**

Create a separate webhook server (Flask/FastAPI) that runs alongside your bot:

```python
# webhooks/calendly_handler.py
from fastapi import FastAPI, Request
from database.connection import Database
import discord
import os

app = FastAPI()
bot = None  # Will be set from main bot instance

@app.post("/calendly")
async def calendly_webhook(request: Request):
    """Handle Calendly booking webhooks"""
    data = await request.json()
    
    event_type = data.get('event')
    payload = data.get('payload', {})
    
    if event_type == 'invitee.created':
        await handle_new_booking(payload)
    elif event_type == 'invitee.canceled':
        await handle_booking_cancellation(payload)
    
    return {"status": "ok"}

async def handle_new_booking(payload):
    """Process new booking from Calendly"""
    invitee = payload.get('invitee', {})
    event = payload.get('event', {})
    
    email = invitee.get('email')
    scheduled_time = event.get('start_time')
    event_id = event.get('uri')
    
    # Extract Discord ID from custom questions
    discord_id = None
    for qa in invitee.get('questions_and_answers', []):
        if 'discord' in qa.get('question', '').lower():
            # Parse Discord ID or username
            discord_id = qa.get('answer')
    
    # Determine service type from event name
    service_type = 'full'  # Default
    event_name = event.get('name', '').lower()
    if 'quick' in event_name:
        service_type = 'quick'
    elif 'extreme' in event_name:
        service_type = 'extreme'
    
    # Save to database
    db = Database()
    db.execute("""
        INSERT INTO bookings (user_id, service_type, calendly_event_id, scheduled_date, amount_aed)
        VALUES (?, ?, ?, ?, ?)
    """, (
        discord_id,
        service_type,
        event_id,
        scheduled_time,
        get_price_for_service(service_type)
    ))
    
    # Send Discord DM
    if bot and discord_id:
        try:
            user = await bot.fetch_user(int(discord_id))
            embed = discord.Embed(
                title="✅ Booking Confirmed!",
                description=f"Your **{service_type.title()} System Tune-Up** is scheduled!",
                color=0x30D158
            )
            embed.add_field(name="📅 Date", value=scheduled_time, inline=False)
            embed.add_field(name="📋 Pre-Session Checklist", value="""
            1. ✅ Install AnyDesk
            2. ✅ Update GPU drivers
            3. ✅ Join FPSOS Discord voice channel
            """, inline=False)
            await user.send(embed=embed)
        except Exception as e:
            print(f"Failed to send booking confirmation DM: {e}")

def get_price_for_service(service_type):
    prices = {'quick': 199, 'full': 399, 'extreme': 699}
    return prices.get(service_type, 399)
```

**Running Webhook Server:**
```python
# run_webhook_server.py
import uvicorn
from webhooks.calendly_handler import app

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
```

---

## 🔄 Booking Automation Flow

### Complete End-to-End Flow

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: USER JOINS DISCORD                                │
└─────────────────────────────────────────────────────────────┘
  1. User joins FPSOS Discord server
  2. Bot sends welcome DM with /diagnostic button
  3. User record created in database

┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: DIAGNOSTIC (2 OPTIONS)                            │
└─────────────────────────────────────────────────────────────┘
  
  OPTION A: PowerShell Tool (Recommended)
  ├─ User runs /diagnostic command
  ├─ Bot DMs PowerShell script
  ├─ User runs script locally
  ├─ User uploads JSON result to Discord
  ├─ Bot parses JSON automatically
  └─ Bot stores in diagnostics table
  
  OPTION B: Quick Assessment (Fallback)
  ├─ User clicks "Quick Questions"
  ├─ Modal form appears (GPU, FPS, issues)
  ├─ User submits form
  └─ Bot stores responses

┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: ANALYSIS & RECOMMENDATION                         │
└─────────────────────────────────────────────────────────────┘
  1. Bot analyzes diagnostic data
  2. Applies scoring rules:
     • 2+ critical issues → Extreme BIOSPRIME (AED 699)
     • 1 critical OR 3+ warnings → Full Tune-Up (AED 399)
     • 1-2 warnings → Quick Fix (AED 199)
     • 0 issues → Congratulate, offer guides
  3. Sends personalized embed with:
     • Specific issues found
     • Recommended package
     • "Book Now" button

┌─────────────────────────────────────────────────────────────┐
│  PHASE 4: BOOKING                                           │
└─────────────────────────────────────────────────────────────┘
  1. User clicks "Book Now"
  2. Bot sends Calendly link for recommended service
  3. User books on Calendly
  4. Calendly webhook triggers → Bot receives notification
  5. Bot creates booking record in database
  6. Bot sends confirmation DM with:
     • Session date/time
     • Pre-session checklist
     • AnyDesk instructions

┌─────────────────────────────────────────────────────────────┐
│  PHASE 5: PRE-SESSION REMINDERS                             │
└─────────────────────────────────────────────────────────────┘
  1. Bot task runs every hour to check upcoming sessions
  2. 24 hours before → Send reminder DM
  3. 2 hours before → Send final reminder + voice channel link

┌─────────────────────────────────────────────────────────────┐
│  PHASE 6: SERVICE DELIVERY (Manual)                         │
└─────────────────────────────────────────────────────────────┘
  1. User joins Discord voice channel
  2. You (human) perform optimization via AnyDesk
  3. You mark session as complete in Discord
  4. Bot detects "session complete" keyword

┌─────────────────────────────────────────────────────────────┐
│  PHASE 7: POST-SESSION FOLLOW-UP                            │
└─────────────────────────────────────────────────────────────┘
  1. Bot requests testimonial:
     • Rating (1-10)
     • Before/after FPS
     • Written feedback
  2. Bot saves to testimonials table
  3. Bot offers referral code (10% off for friend, AED 50 credit)
  4. After 1 week → Bot follows up "How's performance?"
  5. After 3 months → Bot offers re-optimization (AED 99)
```

---

## 📊 Analytics & Tracking

### Key Metrics to Track

```python
# services/analytics.py
from database.connection import Database
from datetime import datetime, timedelta

class Analytics:
    def __init__(self):
        self.db = Database()
    
    def get_conversion_rate(self, days=30):
        """Diagnostic → Booking conversion rate"""
        start_date = datetime.now() - timedelta(days=days)
        
        total_diagnostics = self.db.fetchone(
            "SELECT COUNT(*) as count FROM diagnostics WHERE created_at > ?",
            (start_date,)
        )['count']
        
        total_bookings = self.db.fetchone(
            "SELECT COUNT(*) as count FROM bookings WHERE created_at > ?",
            (start_date,)
        )['count']
        
        if total_diagnostics == 0:
            return 0
        
        return (total_bookings / total_diagnostics) * 100
    
    def get_revenue(self, days=30):
        """Total revenue in AED"""
        start_date = datetime.now() - timedelta(days=days)
        
        result = self.db.fetchone(
            "SELECT SUM(amount_aed) as total FROM bookings WHERE created_at > ? AND completed = 1",
            (start_date,)
        )
        
        return result['total'] or 0
    
    def get_popular_service(self):
        """Most booked service type"""
        result = self.db.fetchone("""
            SELECT service_type, COUNT(*) as count
            FROM bookings
            GROUP BY service_type
            ORDER BY count DESC
            LIMIT 1
        """)
        
        return result['service_type'] if result else None

# Usage in admin command:
# /stats → Shows conversion rate, revenue, popular service
```

---

## 🚀 Next Steps (Priority Order)

### Week 1: Foundation
- [ ] **Day 1-2:** Refactor bot.py into modular structure
  - Create cogs/ folder
  - Move commands to separate cog files
  - Test that bot still works
- [ ] **Day 3:** Create database schema
  - Add users, diagnostics, bookings, testimonials tables
  - Write database service layer
- [ ] **Day 4-5:** Implement JSON upload handler
  - Add on_message listener for file uploads
  - Parse JSON and analyze
  - Store in database

### Week 2: Booking Automation
- [ ] **Day 6-7:** Create Calendly webhook receiver
  - Set up FastAPI webhook server
  - Test with Calendly webhook simulator
- [ ] **Day 8-9:** Implement booking confirmation flow
  - DM user with session details
  - Create pre-session checklist
- [ ] **Day 10:** Add reminder system
  - Background task to check upcoming sessions
  - Send 24h and 2h reminders

### Week 3: Polish & Deploy
- [ ] **Day 11:** Add testimonial request automation
- [ ] **Day 12:** Implement referral code generation
- [ ] **Day 13:** Add analytics dashboard (/stats command for admin)
- [ ] **Day 14:** Deploy to Railway/DigitalOcean for 24/7 uptime

---

## 🛠️ Tools & Technologies

### Required
- **Python 3.11+**
- **discord.py 2.0+** (bot framework)
- **SQLite** (database - already using in project)
- **FastAPI** (webhook server)
- **python-dotenv** (environment variables)

### Optional But Recommended
- **SQLAlchemy** (ORM for cleaner database code)
- **APScheduler** (scheduled tasks for reminders)
- **Sentry** (error tracking in production)
- **Docker** (containerization for deployment)

---

## 🎓 Learning Resources

### Discord.py Cogs Tutorial
- [Official Discord.py Cogs Guide](https://discordpy.readthedocs.io/en/stable/ext/commands/cogs.html)

### Webhook Integration
- [Calendly Webhooks Documentation](https://developer.calendly.com/api-docs/docs/using-webhooks)

### Database Best Practices
- Use connection pooling for SQLite (or migrate to PostgreSQL for production)
- Always parameterize queries (prevent SQL injection)

---

## 📞 Support

If you need help with any of these steps, check:
1. Your existing `DISCORD_BOT_CAPABILITIES.md` (comprehensive feature guide)
2. Your `FPSOS_BUSINESS_PLAN_AND_ROADMAP.md` (business context)
3. Discord.py documentation
4. FPSOS Discord community

---

**Ready to build? Start with Week 1, Day 1-2 (refactor to modular structure).** 🚀
