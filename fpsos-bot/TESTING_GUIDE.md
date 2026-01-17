# 🧪 Testing Guide for Enhanced FPSOS Bot

## What's New

Your bot now has **3 critical enhancements**:

1. ✅ **JSON Diagnostic Processing** - Bot can now receive and analyze diagnostic JSON files
2. ✅ **Database Integration** - Tracks users, diagnostics, bookings with SQLite
3. ✅ **Calendly Webhook Server** - Auto-confirms bookings and sends DMs
4. ✅ **Admin Stats Command** - `/stats` to view performance metrics

---

## 🚀 Quick Test (5 Minutes)

### Step 1: Install New Dependencies

```powershell
cd Y:\fpsos-nextjs\fpsos-bot
pip install fastapi uvicorn
```

### Step 2: Test Database Initialization

```powershell
python database.py
```

**Expected Output:**
```
✅ Database initialized with all tables
Database stats: {'total_users': 0, 'total_diagnostics': 0, ...}
```

### Step 3: Start the Enhanced Bot

```powershell
python bot.py
```

**Expected Output:**
```
✅ Database initialized with all tables
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 FPSOS Bot Online
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bot User: FPSOS BOT
Bot ID: 1325942732348497930
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Synced 3 command(s)
✅ Registered persistent views
```

### Step 4: Test JSON Upload in Discord

1. Go to your Discord server
2. **Create a test JSON file** (`test_diagnostic.json`):

```json
{
  "system": {
    "cpu": "AMD Ryzen 5 5600",
    "gpu": "NVIDIA RTX 3060",
    "ram": 16,
    "network": "WiFi"
  },
  "issues": {
    "critical": [
      "Integrated GPU detected",
      "HPET enabled"
    ],
    "warnings": [
      "WiFi network detected (jitter risk)",
      "Power plan: Balanced",
      "Windows Game Mode: OFF"
    ]
  }
}
```

3. **Upload the JSON file** to any channel
4. Bot should respond with:
   - System information
   - Critical issues list
   - Warnings list
   - **Recommendation: Full System Tune-Up (AED 399)**
   - "Book Now" button

### Step 5: Check Database

```powershell
sqlite3 fpsos_bot.db "SELECT * FROM diagnostics;"
```

**Expected:** You should see the diagnostic record saved.

### Step 6: Test Admin Stats Command

In Discord, type: `/stats`

**Expected:** Embed showing:
- Total Users: 1
- Diagnostics Run: 1
- Total Bookings: 0
- Conversion Rate: 0%

---

## 🔬 Detailed Testing Scenarios

### Test Case 1: Low Severity Issues

**JSON:**
```json
{
  "system": {"cpu": "Intel i7-12700K", "gpu": "RTX 4070", "ram": 32, "network": "Ethernet"},
  "issues": {
    "critical": [],
    "warnings": ["Power plan: Balanced"]
  }
}
```

**Expected:**
- Recommendation: **Quick Remote Fix (AED 199)**
- Health Score: 95/100
- Book button appears

---

### Test Case 2: No Issues (Perfect System)

**JSON:**
```json
{
  "system": {"cpu": "AMD Ryzen 7 7800X3D", "gpu": "RTX 4090", "ram": 64, "network": "Ethernet"},
  "issues": {
    "critical": [],
    "warnings": []
  }
}
```

**Expected:**
- Recommendation: **Your System Looks Great!**
- Health Score: 100/100
- NO book button (system is fine)

---

### Test Case 3: Severe Issues

**JSON:**
```json
{
  "system": {"cpu": "Intel i5-9400", "gpu": "GTX 1650", "ram": 8, "network": "WiFi"},
  "issues": {
    "critical": ["Integrated GPU detected", "HPET enabled", "Outdated BIOS"],
    "warnings": ["WiFi network", "Low RAM", "HDD instead of SSD", "Multiple overlays"]
  }
}
```

**Expected:**
- Recommendation: **Extreme BIOSPRIME (AED 699)**
- Health Score: 40/100 or lower
- Red color embed

---

### Test Case 4: Invalid JSON

Upload a `.txt` file renamed to `.json`

**Expected:**
- Error embed: "❌ Invalid JSON File"
- Helpful message about using PowerShell tool

---

## 🌐 Testing Calendly Webhook (Optional)

### Option A: Local Testing with ngrok

1. **Install ngrok** (if not installed):
   - Download from: https://ngrok.com/download
   - Extract and add to PATH

2. **Start webhook server:**
   ```powershell
   python webhook_server.py
   ```

3. **Expose with ngrok:**
   ```powershell
   ngrok http 8000
   ```

4. **Configure Calendly:**
   - Go to Calendly → Integrations → Webhooks
   - Add webhook URL: `https://YOUR_NGROK_URL.ngrok.io/calendly`
   - Subscribe to: `invitee.created`, `invitee.canceled`

5. **Test booking:**
   - Book a test session on Calendly
   - Check console output for "✅ Booking created"
   - Check database: `sqlite3 fpsos_bot.db "SELECT * FROM bookings;"`

### Option B: Production Deployment (Later)

Deploy webhook server to Railway/Heroku and use public URL.

---

## 📊 Database Inspection Commands

### View All Tables
```powershell
sqlite3 fpsos_bot.db ".tables"
```

### View Users
```powershell
sqlite3 fpsos_bot.db "SELECT discord_id, username, total_diagnostics, total_bookings FROM users;"
```

### View Recent Diagnostics
```powershell
sqlite3 fpsos_bot.db "SELECT user_id, recommendation, critical_count, warning_count, created_at FROM diagnostics ORDER BY created_at DESC LIMIT 10;"
```

### View Bookings
```powershell
sqlite3 fpsos_bot.db "SELECT user_id, service_type, scheduled_date, amount_aed, completed FROM bookings;"
```

### Calculate Conversion Rate
```powershell
sqlite3 fpsos_bot.db "SELECT 
    (SELECT COUNT(*) FROM bookings) * 1.0 / (SELECT COUNT(*) FROM diagnostics) * 100 as conversion_rate;"
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "ModuleNotFoundError: No module named 'database'"

**Fix:**
```powershell
# Make sure you're in the fpsos-bot directory
cd Y:\fpsos-nextjs\fpsos-bot
python bot.py
```

### Issue 2: "No such table: users"

**Fix:**
```powershell
# Delete old database and let it reinitialize
del fpsos_bot.db
python bot.py
```

### Issue 3: Bot doesn't respond to JSON upload

**Check:**
- Is the file actually `.json`?
- Is the JSON valid? Test at: https://jsonlint.com/
- Check bot console for error messages

### Issue 4: "/stats command not showing"

**Fix:**
```powershell
# Slash commands need to sync
# In Discord, type: !sync
# Or restart the bot (it syncs on startup)
```

---

## 📈 Performance Expectations

### Response Times
- JSON analysis: < 2 seconds
- Database write: < 100ms
- Webhook processing: < 500ms

### Database Size
- 100 users ≈ 50 KB
- 1000 diagnostics ≈ 5 MB
- SQLite handles 100k+ records easily

---

## ✅ Success Checklist

After testing, you should have:

- [x] Bot starts without errors
- [x] Database created with 5 tables
- [x] JSON upload triggers analysis
- [x] Correct package recommendation
- [x] Data saved to database
- [x] `/stats` command works
- [x] Booking button appears for issues
- [x] Error handling works for bad JSON

---

## 🚀 What's Next?

### Week 1: Finish Testing
1. Test with real PowerShell diagnostic output
2. Fine-tune recommendation algorithm
3. Deploy webhook server

### Week 2: Enhancement
1. Add reminder system (24h before session)
2. Add testimonial request after session
3. Add referral code generation

### Week 3: Launch
1. Beta test with 5-10 real users
2. Collect feedback
3. Iterate

---

## 🆘 Need Help?

**If bot crashes:**
1. Check console for error message
2. Check `fpsos_bot.db` exists
3. Try deleting database and restarting

**If webhook fails:**
1. Check port 8000 is not in use
2. Verify ngrok is running
3. Check Calendly webhook logs

**If unsure about JSON format:**
1. Run PowerShell diagnostic tool
2. Check the generated JSON structure
3. Update `handle_diagnostic_json()` if needed

---

**Ready to test? Start with Step 1!** 🎯
