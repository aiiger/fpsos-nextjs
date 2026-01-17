# 🚀 QUICK UPDATE COMMANDS

**Copy and paste these in SSH terminal:**

---

## 1️⃣ Connect & Navigate
```bash
cd ~/fpsos-bot
```

## 2️⃣ Stop Old Bot
```bash
pkill -f bot.py
```

## 3️⃣ Backup Old Bot
```bash
mv bot.py bot_backup.py
```

## 4️⃣ Upload New Bot
Use SSH "UPLOAD FILE" button and select `ultimate_bot.py` from:
`Y:\fpsos-nextjs\fpsos-bot\ultimate_bot.py`

Then rename it:
```bash
mv ultimate_bot.py bot.py
```

**OR** follow the full guide in `UPDATE_BOT_GUIDE.md` to paste the code directly.

## 5️⃣ Start New Bot
```bash
nohup python bot.py > bot.log 2>&1 &
```

## 6️⃣ Check Status
```bash
ps aux | grep bot.py
tail -f bot.log
```

---

## ✅ Done!

Test in Discord:
- `/ping` 
- `/diagnostic`
- Invite new member to see welcome message

---

**Full guide:** See `UPDATE_BOT_GUIDE.md`
