# FPSOS Discord Bot - Oracle Cloud Deployment Guide

**Date:** January 12, 2026
**Platform:** Oracle Cloud Free Tier (Always Free)

---

## 🎯 Why Oracle Cloud?

✅ **Always Free Tier includes:**
- 2 AMD-based VMs (1/8 OCPU, 1GB RAM each)
- OR 4 Arm-based VMs (1 OCPU, 6GB RAM each) ⭐ RECOMMENDED
- 200GB block storage
- 10TB outbound data transfer/month
- No credit card required for free tier

**Perfect for running Discord bots 24/7 forever!**

---

## 📋 Prerequisites

1. Oracle Cloud account (free): https://cloud.oracle.com/free
2. Discord bot token (already have: in `.env`)
3. SSH client (Windows Terminal or PuTTY)

---

## 🚀 Step-by-Step Deployment

### **Step 1: Create Oracle Cloud Account**

1. Go to: https://cloud.oracle.com/free
2. Click "Start for free"
3. Fill in:
   - Email
   - Country: United Arab Emirates
   - Name
4. Verify email
5. Add phone number (for verification, no charges)
6. Choose "Free Tier Account" (no credit card needed)
7. Complete setup (takes 5-10 minutes)

---

### **Step 2: Create a VM Instance**

1. **Log into Oracle Cloud Console**
   - https://cloud.oracle.com/

2. **Navigate to Compute Instances**
   - Click hamburger menu (☰) → Compute → Instances

3. **Create Instance**
   - Click "Create Instance"
   - **Name:** `fpsos-discord-bot`
   - **Compartment:** Keep default (root)

4. **Choose Image and Shape**
   - **Image:** Ubuntu 22.04 (Canonical)
   - Click "Change Shape"
   - Select **Ampere (Arm-based)** ⭐
   - Choose **VM.Standard.A1.Flex**
   - Set: 1 OCPU, 6GB RAM (free tier)

5. **Networking**
   - Keep default VCN and subnet
   - **Assign public IP:** ✅ YES

6. **Add SSH Keys**
   - Click "Generate SSH key pair"
   - **Download both keys:**
     - Private key: `ssh-key-[date].key`
     - Public key: `ssh-key-[date].key.pub`
   - Save them to: `C:\Users\YourName\.ssh\`

7. **Boot Volume**
   - Keep default (50GB is plenty)

8. **Click "Create"**
   - Wait 1-2 minutes for provisioning

9. **Copy Public IP**
   - Once running, copy the **Public IP address**
   - Example: `150.230.45.123`

---

### **Step 3: Configure Firewall (Security List)**

1. **Open Port 22 (SSH)**
   - Click on your instance
   - Click "Subnet" link
   - Click "Default Security List"
   - Click "Add Ingress Rules"
   - **Source CIDR:** `0.0.0.0/0`
   - **Destination Port:** `22`
   - Click "Add Ingress Rules"

*Note: Oracle Cloud blocks all ports by default. We only need SSH.*

---

### **Step 4: Connect to Your VM**

#### Option A: Windows Terminal (Recommended)

```powershell
# Open PowerShell or Windows Terminal
cd C:\Users\YourName\.ssh\

# Set correct permissions (if needed)
icacls "ssh-key-*.key" /inheritance:r /grant:r "$($env:USERNAME):R"

# Connect to VM
ssh -i ssh-key-*.key ubuntu@YOUR_PUBLIC_IP
```

Replace `YOUR_PUBLIC_IP` with the IP you copied.

#### Option B: PuTTY

1. Download PuTTY: https://www.putty.org/
2. Download PuTTYgen (comes with PuTTY)
3. Convert key:
   - Open PuTTYgen
   - Load your `.key` file
   - Save as `.ppk`
4. Open PuTTY:
   - Host: `ubuntu@YOUR_PUBLIC_IP`
   - Connection → SSH → Auth → Browse → Select `.ppk` file
   - Click "Open"

---

### **Step 5: Install Bot Dependencies on VM**

Once connected via SSH, run these commands:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.11
sudo apt install python3.11 python3.11-venv python3-pip -y

# Install Git
sudo apt install git -y

# Create bot directory
mkdir -p ~/fpsos-bot
cd ~/fpsos-bot

# Verify Python version
python3.11 --version
```

---

### **Step 6: Upload Bot Files**

#### Option A: Git (If you have GitHub repo)

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/fpsos-bot.git
cd fpsos-bot
```

#### Option B: SCP (Secure Copy) from Windows

Open **another PowerShell window** on your local machine:

```powershell
# Navigate to bot directory
cd Y:\fpsos-nextjs\fpsos-bot

# Upload all files
scp -i C:\Users\YourName\.ssh\ssh-key-*.key -r * ubuntu@YOUR_PUBLIC_IP:~/fpsos-bot/
```

#### Option C: Manual File Transfer (SFTP)

1. Download WinSCP: https://winscp.net/
2. Connect using:
   - Host: `YOUR_PUBLIC_IP`
   - User: `ubuntu`
   - Key: Your private key file
3. Drag and drop files from `Y:\fpsos-nextjs\fpsos-bot` to `~/fpsos-bot`

---

### **Step 7: Install Python Dependencies**

Back in your SSH session:

```bash
cd ~/fpsos-bot

# Create virtual environment
python3.11 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Verify installation
pip list
```

---

### **Step 8: Configure Environment Variables**

```bash
# Create .env file
nano .env
```

Paste your bot token:
```
DISCORD_BOT_TOKEN=[REDACTED_DISCORD_TOKEN_PLACEHOLDER]
DISCORD_APPLICATION_ID=1458907328689733778
DISCORD_GUILD_ID=your_guild_id_here
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

---

### **Step 9: Test Bot**

```bash
# Make sure you're in the bot directory
cd ~/fpsos-bot
source venv/bin/activate

# Run bot
python bot.py
```

**You should see:**
```
Bot is ready!
Logged in as FPSOS BOT#1234
```

If it works, press `Ctrl + C` to stop it. Now let's make it run 24/7.

---

### **Step 10: Setup Bot as System Service (24/7 Running)**

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/fpsos-bot.service
```

Paste this configuration:

```ini
[Unit]
Description=FPSOS Discord Bot
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/fpsos-bot
Environment="PATH=/home/ubuntu/fpsos-bot/venv/bin"
ExecStart=/home/ubuntu/fpsos-bot/venv/bin/python bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Save and exit** (Ctrl + X, Y, Enter)

---

### **Step 11: Enable and Start Service**

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service (start on boot)
sudo systemctl enable fpsos-bot

# Start service now
sudo systemctl start fpsos-bot

# Check status
sudo systemctl status fpsos-bot
```

**You should see:**
```
● fpsos-bot.service - FPSOS Discord Bot
   Active: active (running)
```

---

### **Step 12: Monitor Bot Logs**

```bash
# View live logs
sudo journalctl -u fpsos-bot -f

# View last 100 lines
sudo journalctl -u fpsos-bot -n 100
```

Press `Ctrl + C` to exit log view.

---

## 🎮 Bot Management Commands

```bash
# Check status
sudo systemctl status fpsos-bot

# Stop bot
sudo systemctl stop fpsos-bot

# Start bot
sudo systemctl start fpsos-bot

# Restart bot
sudo systemctl restart fpsos-bot

# View logs
sudo journalctl -u fpsos-bot -f

# Update bot code (if using Git)
cd ~/fpsos-bot
git pull
sudo systemctl restart fpsos-bot
```

---

## 🔧 Updating Bot Files

### If using SCP:

```powershell
# On your Windows machine
cd Y:\fpsos-nextjs\fpsos-bot
scp -i C:\Users\YourName\.ssh\ssh-key-*.key bot.py ubuntu@YOUR_PUBLIC_IP:~/fpsos-bot/

# Then restart on VM
ssh -i C:\Users\YourName\.ssh\ssh-key-*.key ubuntu@YOUR_PUBLIC_IP
sudo systemctl restart fpsos-bot
```

---

## 🛡️ Security Best Practices

1. **Change SSH port from 22 to custom** (optional)
2. **Setup UFW firewall:**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```
3. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
4. **Regular backups** of bot database

---

## 📊 Resource Monitoring

```bash
# Check CPU/RAM usage
htop

# Check disk space
df -h

# Check bot process
ps aux | grep bot.py
```

---

## 🚨 Troubleshooting

### Bot won't start:
```bash
# Check logs
sudo journalctl -u fpsos-bot -n 100

# Check Python errors
cd ~/fpsos-bot
source venv/bin/activate
python bot.py
```

### Connection issues:
```bash
# Test internet connectivity
ping google.com

# Check if port 443/80 open
curl https://discord.com
```

### Permission issues:
```bash
# Fix ownership
sudo chown -R ubuntu:ubuntu ~/fpsos-bot
```

---

## ✅ Success Checklist

- [ ] Oracle Cloud VM created (Arm, 1 OCPU, 6GB RAM)
- [ ] SSH connection working
- [ ] Python 3.11 installed
- [ ] Bot files uploaded
- [ ] Dependencies installed (requirements.txt)
- [ ] .env file configured with bot token
- [ ] Bot starts manually with `python bot.py`
- [ ] Systemd service created and enabled
- [ ] Bot shows "Active: active (running)" in status
- [ ] Bot responds to `/diagnostic` in Discord

---

## 🎯 Oracle Cloud Free Tier Limits

✅ **What's Included Forever:**
- 2 VMs (AMD) OR 4 VMs (Arm) - Always Free
- 200GB storage
- 10TB outbound transfer/month
- No time limit - runs forever

❌ **Not Included:**
- Load balancers (not needed for bot)
- Additional storage beyond 200GB
- GPU instances

**Your Discord bot will run 24/7 forever for FREE!** 🎉

---

## 📞 Support

If you get stuck:
1. Check Oracle Cloud docs: https://docs.oracle.com/
2. Discord.py docs: https://discordpy.readthedocs.io/
3. Oracle Cloud Support (Free tier includes basic support)

---

**Total Setup Time:** 30-45 minutes
**Cost:** $0/month (Forever Free Tier)
**Uptime:** 99.9%+ (Oracle Cloud SLA)

---

**Your bot will be running 24/7 on enterprise-grade infrastructure for FREE!** 🚀

**Next:** Follow steps 1-12 to deploy. Let me know if you need help with any step!
