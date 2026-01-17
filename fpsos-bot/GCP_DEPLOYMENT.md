# FPSOS Discord Bot - Google Cloud Platform Deployment

**Date:** January 12, 2026
**Platform:** Google Cloud Platform Free Tier
**Status:** Already Verified ✅

---

## 🎯 Why Google Cloud?

✅ **You're already verified!**
✅ **Free Tier includes:**
- 1 f1-micro VM instance (0.6GB RAM) - Always Free
- 30GB standard persistent disk
- 1GB network egress/month (Americas)
- $300 credit for 90 days (new accounts)

✅ **Easy to use** - Best UI of all cloud providers
✅ **Fast deployment** - 10 minutes to live bot

---

## 🚀 Quick Deployment Steps

### **Step 1: Go to Google Cloud Console**

1. Open: https://console.cloud.google.com/
2. Login with your verified Google account
3. Accept terms if prompted

---

### **Step 2: Create a New Project**

1. Click project dropdown (top left, near "Google Cloud")
2. Click "New Project"
3. **Project Name:** `fpsos-discord-bot`
4. Click "Create"
5. Wait 10 seconds
6. Select the new project from dropdown

---

### **Step 3: Enable Compute Engine API**

1. In search bar, type: "Compute Engine"
2. Click "Compute Engine API"
3. Click "Enable" (if not already enabled)
4. Wait 30 seconds for activation

---

### **Step 4: Create VM Instance**

1. Click hamburger menu (☰) → Compute Engine → VM instances
2. Click "Create Instance"

**Configure VM:**
- **Name:** `fpsos-bot`
- **Region:** `us-central1` (Iowa - Free tier eligible)
- **Zone:** `us-central1-a`
- **Machine Type:**
  - Click "Machine type"
  - Select **"e2-micro"** (0.5-2GB RAM, 2 vCPU)
  - This is in free tier! ✅

- **Boot Disk:**
  - Click "Change"
  - **Operating System:** Ubuntu
  - **Version:** Ubuntu 22.04 LTS
  - **Boot disk type:** Standard persistent disk
  - **Size:** 30 GB (free tier limit)
  - Click "Select"

- **Firewall:**
  - ✅ Check "Allow HTTP traffic" (not needed but safe)
  - ✅ Check "Allow HTTPS traffic" (not needed but safe)

3. Click **"Create"** at bottom
4. Wait 1-2 minutes

---

### **Step 5: Connect to VM (Super Easy!)**

1. Once VM is running, find it in the list
2. Click **"SSH"** button (it opens a browser terminal!)
3. A black terminal window opens - you're connected! ✅

**That's it! No SSH keys needed with Google Cloud!** 🎉

---

### **Step 6: Install Dependencies**

In the SSH terminal that just opened, paste these commands:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.11 and pip
sudo apt install python3.11 python3.11-venv python3-pip git -y

# Create bot directory
mkdir ~/fpsos-bot
cd ~/fpsos-bot

# Check Python version
python3.11 --version
```

---

### **Step 7: Upload Bot Files**

#### **Option A: Direct Upload (Easiest)**

1. In the SSH window, click the gear icon (⚙️) top right
2. Click "Upload file"
3. Navigate to `Y:\fpsos-nextjs\fpsos-bot`
4. Select all files and upload

Or upload one folder at a time:
- Upload `commands` folder
- Upload `embeds` folder
- Upload `utils` folder
- Upload individual files (bot.py, requirements.txt, etc.)

#### **Option B: SCP from Windows**

Open PowerShell on your computer:

```powershell
# Install gcloud CLI if needed
# Download from: https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set project
gcloud config set project fpsos-discord-bot

# Upload files
cd Y:\fpsos-nextjs\fpsos-bot
gcloud compute scp --recurse * fpsos-bot:~/fpsos-bot/ --zone=us-central1-a
```

#### **Option C: Git (If you have GitHub)**

In the SSH terminal:

```bash
cd ~/fpsos-bot
git clone https://github.com/YOUR_USERNAME/fpsos-bot.git .
```

---

### **Step 8: Install Python Packages**

In the SSH terminal:

```bash
cd ~/fpsos-bot

# Create virtual environment
python3.11 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Verify
pip list
```

---

### **Step 9: Create .env File**

```bash
# Create .env file
nano .env
```

Paste your Discord token:
```
DISCORD_BOT_TOKEN=[REDACTED_DISCORD_TOKEN_PLACEHOLDER]
DISCORD_APPLICATION_ID=1458907328689733778
DISCORD_GUILD_ID=your_guild_id_here
```

**Save:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

---

### **Step 10: Test Bot**

```bash
# Run bot
python bot.py
```

**You should see:**
```
Bot is ready!
Logged in as FPSOS BOT#1234
```

✅ **Success!** Press `Ctrl + C` to stop.

---

### **Step 11: Make Bot Run 24/7**

Create systemd service:

```bash
sudo nano /etc/systemd/system/fpsos-bot.service
```

Paste this:

```ini
[Unit]
Description=FPSOS Discord Bot
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/home/$USER/fpsos-bot
Environment="PATH=/home/$USER/fpsos-bot/venv/bin"
ExecStart=/home/$USER/fpsos-bot/venv/bin/python bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Save** (Ctrl + X, Y, Enter)

---

### **Step 12: Start Bot Service**

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service (auto-start on boot)
sudo systemctl enable fpsos-bot

# Start service
sudo systemctl start fpsos-bot

# Check status
sudo systemctl status fpsos-bot
```

**Should show:**
```
● fpsos-bot.service - FPSOS Discord Bot
   Active: active (running)
```

---

## 🎮 Bot Management

```bash
# Check status
sudo systemctl status fpsos-bot

# View logs (live)
sudo journalctl -u fpsos-bot -f

# Restart bot
sudo systemctl restart fpsos-bot

# Stop bot
sudo systemctl stop fpsos-bot
```

---

## 💰 Cost Estimate

### **Free Tier (First 12 months):**
- e2-micro instance: **FREE** (always free in us-central1)
- 30GB storage: **FREE**
- Network egress: 1GB/month **FREE**

### **After Free Tier:**
- e2-micro: ~$6-8/month
- 30GB storage: ~$2/month
- **Total:** ~$8-10/month

**For now: $0/month!** ✅

---

## 🔧 Keeping Costs Low

1. **Use f1-micro** instead of e2-micro (even smaller, always free)
2. **Stop VM when not needed** (you pay only when running)
3. **Delete old snapshots**
4. **Monitor usage** in Google Cloud Console

---

## 🚨 Troubleshooting

### Bot won't start:
```bash
# Check logs
sudo journalctl -u fpsos-bot -n 100

# Run manually to see errors
cd ~/fpsos-bot
source venv/bin/activate
python bot.py
```

### Out of memory:
```bash
# Check memory
free -h

# If needed, create swap file
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Connection issues:
```bash
# Test Discord connection
curl https://discord.com/api/v10/gateway
```

---

## ✅ Success Checklist

- [ ] Google Cloud project created
- [ ] VM instance running (e2-micro)
- [ ] SSH terminal opened in browser
- [ ] Python 3.11 installed
- [ ] Bot files uploaded
- [ ] Dependencies installed
- [ ] .env file created with token
- [ ] Bot runs manually
- [ ] Systemd service enabled
- [ ] Bot running 24/7
- [ ] Bot responds in Discord

---

## 🎯 Advantages of Google Cloud

✅ **Browser SSH** - No keys needed, click and connect
✅ **Easy UI** - Best cloud console interface
✅ **Fast deployment** - 10 minutes total
✅ **You're verified** - No payment verification needed
✅ **$300 credit** - Try other services free
✅ **Always free tier** - f1-micro runs forever free

---

## 📊 Monitor Your Bot

1. Go to: https://console.cloud.google.com/
2. Select your project
3. Click Compute Engine → VM instances
4. Click "fpsos-bot"
5. See CPU, memory, network usage in real-time

---

**Total Setup Time:** 10-15 minutes
**Current Cost:** $0/month (free tier)
**After 12 months:** ~$8/month (or keep free with f1-micro)

---

## 🚀 Next Steps

1. **Follow Steps 1-12 above**
2. **Test bot in Discord:** Try `/diagnostic`
3. **Set up monitoring** (optional)
4. **Enjoy your 24/7 bot!**

---

**Google Cloud = Easiest deployment for you since you're already verified!** 🎉

Let me know which step you're on and I'll help guide you through!
