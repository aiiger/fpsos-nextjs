# FPSOS Discord Bot

Modern, Apple-inspired CS2 optimization bot with diagnostic analysis and booking automation.

## Features
- 🎯 `/diagnostic` - Automated system analysis
- 📋 Quick questionnaire (modal form)
- 🔧 Smart package recommendations
- 📅 Calendly booking integration
- 💬 Beautiful Bloomberg-themed embeds

## Setup

### 1. Install Python 3.11+
Download from: https://www.python.org/downloads/

### 2. Install Dependencies
```powershell
cd Y:\fpsos-nextjs\fpsos-bot
pip install -r requirements.txt
```

### 3. Get Discord Bot Token
- Go to: https://discord.com/developers/applications
- Click FPSOS BOT → Bot → Reset Token
- Copy token → Paste in `.env` file

**Note:** Requires 2FA authentication. If stuck:
1. Go to Discord app → User Settings → My Account
2. Add SMS as backup method
3. Use SMS code to authenticate

### 4. Run Bot
```powershell
python bot.py
```

Bot should come online in your Discord server!

## Commands

- `/diagnostic` - Start diagnostic flow
- `/book [package]` - Show booking links
- `/support` - Create support ticket

## File Structure

```
fpsos-bot/
├── bot.py                 # Main bot entry point
├── commands/
│   ├── diagnostic.py      # /diagnostic command
│   ├── book.py           # /book command
│   └── support.py        # /support command
├── utils/
│   ├── analyzer.py       # Diagnostic JSON analysis
│   └── embeds.py         # Embed templates
├── embeds/
│   └── templates.py      # Bloomberg-themed designs
├── .env                  # Configuration (DO NOT COMMIT)
└── requirements.txt      # Dependencies
```

## Next Steps (When Token Works)

1. Invite bot to server
2. Test `/diagnostic` command
3. Upload sample diagnostic JSON
4. Verify recommendation logic
5. Add Calendly webhook
6. Deploy to Railway.app for 24/7 uptime

---

**Current Status:** Waiting for Discord token authentication (SMS backup setup needed)
