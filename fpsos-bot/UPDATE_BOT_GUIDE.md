# 🚀 Update Your Discord Bot - Step by Step

**Date:** January 12, 2026
**Goal:** Replace current bot with enhanced version

---

## ✨ NEW FEATURES IN ULTIMATE BOT

### **🎉 Enhanced Welcome Message:**
- Beautiful embed with member avatar
- Interactive buttons (Diagnostic, Packages, Book, Reaction Test)
- Smart channel detection
- Welcome reactions (👋🎮🔥)
- Optional welcome DM
- Member count tracking

### **🤖 Bot Status Rotation:**
- Changes status every 75 seconds:
  - "Watching CS2 performance 🎮"
  - "Listening to /diagnostic 🔧"
  - "Playing fpsos.gg 💎"
  - "Watching X players 👥"

### **📋 Interactive Diagnostic Modal:**
- Users fill out a form with:
  - PC specs (CPU, GPU, RAM)
  - Monitor refresh rate
  - Current FPS
  - Issues they're experiencing
- Bot analyzes and recommends package!

### **💬 New Slash Commands:**
1. `/ping` - Enhanced status with detailed metrics
2. `/diagnostic` - Interactive form-based analysis
3. `/packages` - Beautiful package display with buttons
4. `/support` - Help and contact info
5. `/info` - About FPSOS and bot stats
6. `/reaction` - Link to reaction test
7. `/book` - Direct booking with instructions

### **📊 Enhanced Logging:**
- Startup banner with stats
- Welcome confirmations
- Member leave tracking
- Error logging
- Command sync status

---

## 📝 STEP-BY-STEP UPDATE PROCESS

### **Step 1: Connect to Your Google Cloud VM**

1. Go to: https://console.cloud.google.com/compute/instances
2. Find your VM: `fpsos-bot`
3. Click **"SSH"** button
4. Wait for terminal to open

---

### **Step 2: Navigate to Bot Folder**

In the SSH terminal, type:
```bash
cd ~/fpsos-bot
```

Press Enter.

---

### **Step 3: Stop Current Bot**

```bash
pkill -f bot.py
```

Press Enter. This stops the old bot.

---

### **Step 4: Backup Old Bot**

```bash
mv bot.py bot_backup.py
```

Press Enter. Your old bot is now saved as `bot_backup.py`.

---

### **Step 5: Create New Bot File**

Copy the entire command below and paste it in the SSH terminal:

```bash
cat > bot.py << 'ENDOFFILE'
import discord
from discord.ext import commands, tasks
from discord.ui import Button, View, Select, Modal, TextInput
import os
import asyncio
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('DISCORD_BOT_TOKEN')

intents = discord.Intents.default()
intents.message_content = True
intents.members = True
intents.guilds = True
bot = commands.Bot(command_prefix='!', intents=intents)

# Custom Views and Buttons
class WelcomeView(View):
    def __init__(self):
        super().__init__(timeout=None)
        
        self.add_item(Button(label="🔧 Start Diagnostic", style=discord.ButtonStyle.primary, custom_id="start_diagnostic"))
        self.add_item(Button(label="📦 View Packages", style=discord.ButtonStyle.secondary, url="https://fpsos.gg/packages"))
        self.add_item(Button(label="📅 Book Session", style=discord.ButtonStyle.success, url="https://calendly.com/fpsos"))
        self.add_item(Button(label="⚡ Reaction Test", style=discord.ButtonStyle.secondary, url="https://fpsos.gg/reaction-test"))

class DiagnosticModal(Modal, title="CS2 System Diagnostic"):
    pc_specs = TextInput(
        label="PC Specs (CPU, GPU, RAM)",
        placeholder="e.g. Ryzen 9 9800X3D, RTX 4090, 32GB DDR5",
        style=discord.TextStyle.short,
        required=True
    )
    
    monitor = TextInput(
        label="Monitor Refresh Rate",
        placeholder="e.g. 240Hz, 360Hz, 500Hz",
        style=discord.TextStyle.short,
        required=True
    )
    
    current_fps = TextInput(
        label="Current Average FPS in CS2",
        placeholder="e.g. 400-600",
        style=discord.TextStyle.short,
        required=True
    )
    
    issues = TextInput(
        label="What issues are you experiencing?",
        placeholder="e.g. Frame drops, stuttering, input lag, etc.",
        style=discord.TextStyle.paragraph,
        required=False
    )
    
    async def on_submit(self, interaction: discord.Interaction):
        embed = discord.Embed(
            title="🔍 Diagnostic Analysis Complete",
            description=f"**Analysis for {interaction.user.mention}**",
            color=0x680036
        )
        
        embed.add_field(name="📊 System Specs", value=self.pc_specs.value, inline=False)
        embed.add_field(name="🖥️ Monitor", value=self.monitor.value, inline=True)
        embed.add_field(name="📈 Current FPS", value=self.current_fps.value, inline=True)
        
        if self.issues.value:
            embed.add_field(name="⚠️ Reported Issues", value=self.issues.value, inline=False)
        
        fps_value = self.current_fps.value.lower()
        if "200" in fps_value or "300" in fps_value:
            recommendation = "**Full System Tune-Up** (AED 399)\nYour system has potential for significant improvements!"
        elif "400" in fps_value or "500" in fps_value:
            recommendation = "**Quick Remote Fix** (AED 199)\nFine-tuning to eliminate inconsistencies!"
        else:
            recommendation = "**Extreme BIOSPRIME** (AED 699)\nMaximum optimization for competitive advantage!"
        
        embed.add_field(name="💡 Recommended Package", value=recommendation, inline=False)
        embed.add_field(name="📅 Next Steps", value="[Book your session](https://calendly.com/fpsos) to get started!", inline=False)
        embed.set_footer(text="FPSOS.gg • Professional CS2 Optimization")
        
        view = View()
        view.add_item(Button(label="📅 Book Now", style=discord.ButtonStyle.success, url="https://calendly.com/fpsos"))
        
        await interaction.response.send_message(embed=embed, view=view, ephemeral=False)

@bot.event
async def on_ready():
    print(f"{'='*50}")
    print(f"✅ {bot.user} is ONLINE!")
    print(f"{'='*50}")
    print(f"📊 Connected to {len(bot.guilds)} server(s)")
    print(f"👥 Serving {sum(guild.member_count for guild in bot.guilds)} members")
    print(f"⚡ Latency: {round(bot.latency * 1000)}ms")
    print(f"🕐 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print(f"{'='*50}")
    
    try:
        synced = await bot.tree.sync()
        print(f"🔄 Synced {len(synced)} slash command(s)")
        for cmd in synced:
            print(f"  ✓ /{cmd.name}")
    except Exception as e:
        print(f"❌ Error syncing commands: {e}")
    
    print(f"{'='*50}")
    status_update.start()

@tasks.loop(minutes=5)
async def status_update():
    statuses = [
        discord.Activity(type=discord.ActivityType.watching, name="CS2 performance 🎮"),
        discord.Activity(type=discord.ActivityType.listening, name="/diagnostic 🔧"),
        discord.Activity(type=discord.ActivityType.playing, name="fpsos.gg 💎"),
        discord.Activity(type=discord.ActivityType.watching, name=f"{sum(guild.member_count for guild in bot.guilds)} players 👥"),
    ]
    
    for status in statuses:
        await bot.change_presence(activity=status)
        await asyncio.sleep(75)

@bot.event
async def on_member_join(member):
    channel = None
    if member.guild.system_channel:
        channel = member.guild.system_channel
    elif welcome_channel := discord.utils.get(member.guild.text_channels, name='welcome'):
        channel = welcome_channel
    elif general_channel := discord.utils.get(member.guild.text_channels, name='general'):
        channel = general_channel
    else:
        for text_channel in member.guild.text_channels:
            if text_channel.permissions_for(member.guild.me).send_messages:
                channel = text_channel
                break
    
    if not channel:
        print(f"⚠️ No suitable channel found to welcome {member.name}")
        return
    
    embed = discord.Embed(
        title="🎮 Welcome to FPSOS Community!",
        description=f"**Hey {member.mention}, welcome to the ultimate CS2 optimization hub!** 🚀\n\nWe're professionals based in Dubai, UAE specializing in remote PC optimization for competitive Counter-Strike 2 players worldwide.",
        color=0x680036
    )
    
    embed.set_thumbnail(url=member.display_avatar.url)
    
    embed.add_field(
        name="🔧 What We Do",
        value=(
            "• **Subtick System** optimization\n"
            "• **Frame Time** consistency tuning\n"
            "• **BIOS** advanced configuration\n"
            "• **Interrupt Affinity** optimization\n"
            "• **DPC Latency** elimination"
        ),
        inline=True
    )
    
    embed.add_field(
        name="⚡ Quick Start",
        value=(
            "🔹 Use `/diagnostic` for free analysis\n"
            "🔹 Try `/packages` to see our services\n"
            "🔹 Test your skills with `/reaction`\n"
            "🔹 Need help? Use `/support`"
        ),
        inline=True
    )
    
    embed.add_field(
        name="💎 Our Packages",
        value=(
            "**Quick Remote Fix** - AED 199 ⚡\n"
            "**Full System Tune-Up** - AED 399 🔧\n"
            "**Extreme BIOSPRIME** - AED 699 🚀\n"
            "[View Details](https://fpsos.gg/packages)"
        ),
        inline=False
    )
    
    embed.add_field(
        name="🌐 Useful Links",
        value=(
            "[🌍 Website](https://fpsos.gg) • "
            "[📦 Packages](https://fpsos.gg/packages) • "
            "[⚡ Reaction Test](https://fpsos.gg/reaction-test) • "
            "[📅 Book Session](https://calendly.com/fpsos)"
        ),
        inline=False
    )
    
    embed.set_image(url="https://fpsos.gg/preview.webp")
    embed.set_footer(
        text=f"Member #{member.guild.member_count} • FPSOS.gg - Frame Per Second Operating System • Dubai, UAE",
        icon_url=bot.user.display_avatar.url
    )
    embed.timestamp = datetime.now()
    
    view = WelcomeView()
    
    try:
        welcome_msg = await channel.send(
            f"👋 **Everyone, please welcome {member.mention} to the squad!** 🎯\n",
            embed=embed,
            view=view
        )
        
        await welcome_msg.add_reaction("👋")
        await welcome_msg.add_reaction("🎮")
        await welcome_msg.add_reaction("🔥")
        
        print(f"✅ Welcomed {member.name} (#{member.guild.member_count}) in {channel.name}")
        
        try:
            dm_embed = discord.Embed(
                title="👋 Welcome to FPSOS!",
                description=f"Hey {member.name}! Thanks for joining our CS2 optimization community.",
                color=0x680036
            )
            dm_embed.add_field(name="🎯 Get Started", value="Head over to the server and use `/diagnostic` to get a free system analysis!", inline=False)
            dm_embed.set_footer(text="FPSOS.gg • Professional CS2 Optimization")
            await member.send(embed=dm_embed)
            print(f"  ↳ Sent welcome DM to {member.name}")
        except:
            pass
            
    except Exception as e:
        print(f"❌ Error sending welcome: {e}")

@bot.event
async def on_member_remove(member):
    print(f"👋 {member.name} has left the server (Total: {member.guild.member_count})")

@bot.tree.command(name="ping", description="🏓 Check bot latency and status")
async def ping(interaction: discord.Interaction):
    latency = round(bot.latency * 1000)
    embed = discord.Embed(title="🏓 Pong!", description="Bot status and performance metrics", color=0x00CCBC)
    embed.add_field(name="⚡ Latency", value=f"`{latency}ms`", inline=True)
    embed.add_field(name="📊 Status", value="✅ Online", inline=True)
    embed.add_field(name="🖥️ Servers", value=f"`{len(bot.guilds)}`", inline=True)
    embed.add_field(name="👥 Users", value=f"`{sum(guild.member_count for guild in bot.guilds)}`", inline=True)
    embed.add_field(name="⏰ Uptime", value="`24/7`", inline=True)
    embed.add_field(name="🌍 Location", value="`Google Cloud`", inline=True)
    embed.set_footer(text="FPSOS Bot • All systems operational")
    embed.timestamp = datetime.now()
    await interaction.response.send_message(embed=embed)

@bot.tree.command(name="diagnostic", description="🔧 Start interactive CS2 system diagnostic")
async def diagnostic(interaction: discord.Interaction):
    modal = DiagnosticModal()
    await interaction.response.send_modal(modal)

@bot.tree.command(name="packages", description="💎 View all FPSOS optimization packages")
async def packages(interaction: discord.Interaction):
    embed = discord.Embed(
        title="💎 FPSOS Optimization Packages",
        description="**Professional CS2 optimization services tailored to your needs**\n\nAll services performed remotely via AnyDesk from Dubai, UAE 🇦🇪",
        color=0x680036
    )
    
    embed.add_field(
        name="⚡ Quick Remote Fix - AED 199",
        value="```\n✓ Basic system optimization\n✓ DPC latency fixes\n✓ Process priority tuning\n✓ Windows performance tweaks\n✓ CS2 launch parameters\n```\n⏱️ Duration: ~1 hour",
        inline=False
    )
    
    embed.add_field(
        name="🔧 Full System Tune-Up - AED 399",
        value="```\n✓ Everything in Quick Fix\n✓ Complete Windows optimization\n✓ Basic BIOS tuning\n✓ Advanced process affinity\n✓ Network optimization\n✓ Registry tweaks\n```\n⏱️ Duration: ~2-3 hours",
        inline=False
    )
    
    embed.add_field(
        name="🚀 Extreme BIOSPRIME - AED 699",
        value="```\n✓ Everything in Full Tune-Up\n✓ Fresh Windows installation\n✓ Complete BIOS optimization\n✓ Advanced interrupt tuning\n✓ Custom system configuration\n✓ 30-day optimization support\n```\n⏱️ Duration: ~4-5 hours",
        inline=False
    )
    
    embed.add_field(
        name="🎯 What You Get",
        value="• Remote optimization via AnyDesk\n• Before/After benchmarks\n• Performance documentation\n• Post-optimization support",
        inline=False
    )
    
    embed.set_footer(text="🇦🇪 Based in Dubai, UAE • Serving players worldwide • FPSOS.gg")
    embed.timestamp = datetime.now()
    
    view = View()
    view.add_item(Button(label="📅 Book Session", style=discord.ButtonStyle.success, url="https://calendly.com/fpsos"))
    view.add_item(Button(label="🌐 Visit Website", style=discord.ButtonStyle.link, url="https://fpsos.gg"))
    
    await interaction.response.send_message(embed=embed, view=view)

@bot.tree.command(name="support", description="💬 Get support or contact FPSOS team")
async def support(interaction: discord.Interaction):
    embed = discord.Embed(title="💬 FPSOS Support", description="**Need help? We're here for you!**", color=0x680036)
    embed.add_field(name="📧 Contact", value="**Email:** support@fpsos.gg\n**Response Time:** Within 24 hours", inline=False)
    embed.add_field(name="🌐 Useful Links", value="• [Website](https://fpsos.gg)\n• [Packages](https://fpsos.gg/packages)\n• [Reaction Test](https://fpsos.gg/reaction-test)\n• [Book Session](https://calendly.com/fpsos)", inline=True)
    embed.add_field(name="📍 Location", value="**Dubai, UAE** 🇦🇪\nRemote services worldwide", inline=True)
    embed.set_footer(text="FPSOS.gg • Professional CS2 Optimization • Dubai, UAE")
    embed.timestamp = datetime.now()
    await interaction.response.send_message(embed=embed, ephemeral=True)

@bot.tree.command(name="info", description="ℹ️ About FPSOS and bot information")
async def info(interaction: discord.Interaction):
    embed = discord.Embed(title="ℹ️ About FPSOS", description="**Frame Per Second Operating System**\n\nProfessional PC optimization specialists for competitive CS2 players worldwide. Based in Dubai, UAE.", color=0x680036)
    embed.set_thumbnail(url=bot.user.display_avatar.url)
    embed.add_field(name="🎯 Our Mission", value="Maximize CS2 performance through expert system optimization, BIOS tuning, and advanced configuration.", inline=False)
    embed.add_field(name="📊 Bot Statistics", value=f"**Servers:** {len(bot.guilds)}\n**Members:** {sum(guild.member_count for guild in bot.guilds)}\n**Latency:** {round(bot.latency * 1000)}ms\n**Uptime:** 24/7", inline=True)
    embed.add_field(name="⚡ Available Commands", value="`/ping` `/diagnostic` `/packages` `/support` `/reaction` `/book` `/info`", inline=False)
    embed.set_footer(text="🇦🇪 Based in Dubai, UAE • Serving players worldwide")
    embed.timestamp = datetime.now()
    view = View()
    view.add_item(Button(label="🌐 Visit Website", style=discord.ButtonStyle.link, url="https://fpsos.gg"))
    await interaction.response.send_message(embed=embed, view=view)

@bot.tree.command(name="reaction", description="⚡ Test your reaction time")
async def reaction(interaction: discord.Interaction):
    embed = discord.Embed(title="⚡ FPSOS Reaction Time Test", description="Test your reaction time and compete on the leaderboard!", color=0x00CCBC)
    embed.add_field(name="🎯 How It Works", value="Click the button below to visit our reaction test on fpsos.gg and see how you stack up against other players!", inline=False)
    embed.add_field(name="🏆 Leaderboard", value="Top players are displayed with:\n• Godlike (< 200ms)\n• Pro (< 300ms)\n• Rookie (300ms+)", inline=False)
    embed.set_footer(text="FPSOS.gg • Test your competitive edge")
    view = View()
    view.add_item(Button(label="⚡ Start Test", style=discord.ButtonStyle.success, url="https://fpsos.gg/reaction-test"))
    await interaction.response.send_message(embed=embed, view=view)

@bot.tree.command(name="book", description="📅 Book your optimization session")
async def book(interaction: discord.Interaction):
    embed = discord.Embed(title="📅 Book Your Optimization Session", description="Ready to maximize your CS2 performance? Let's schedule your session!", color=0x680036)
    embed.add_field(name="🔧 What to Expect", value="1️⃣ Choose your package\n2️⃣ Select available time slot\n3️⃣ We'll send AnyDesk instructions\n4️⃣ Remote optimization session\n5️⃣ Performance testing & documentation", inline=False)
    embed.add_field(name="⏰ Session Duration", value="• Quick Fix: ~1 hour\n• Full Tune-Up: ~2-3 hours\n• Extreme BIOSPRIME: ~4-5 hours", inline=True)
    embed.add_field(name="💳 Payment", value="Secure payment options\nAll major cards accepted\nAED pricing", inline=True)
    embed.set_footer(text="🇦🇪 FPSOS.gg • Professional CS2 Optimization • Dubai, UAE")
    view = View()
    view.add_item(Button(label="📅 Book Now", style=discord.ButtonStyle.success, url="https://calendly.com/fpsos"))
    await interaction.response.send_message(embed=embed, view=view)

if __name__ == "__main__":
    try:
        print("🚀 Starting FPSOS Discord Bot...")
        bot.run(TOKEN)
    except Exception as e:
        print(f"❌ Failed to start: {e}")
ENDOFFILE
```

**After pasting, type:**
```
ENDOFFILE
```

Press Enter.

---

### **Step 6: Start New Bot**

```bash
nohup python bot.py > bot.log 2>&1 &
```

Press Enter.

---

### **Step 7: Verify Bot is Running**

```bash
ps aux | grep bot.py
```

You should see the bot process running!

---

### **Step 8: Check Logs**

```bash
tail -f bot.log
```

You should see:
```
==================================================
✅ FPSOS BOT#0463 is ONLINE!
==================================================
📊 Connected to X server(s)
👥 Serving X members
⚡ Latency: Xms
==================================================
🔄 Synced 7 slash command(s)
  ✓ /ping
  ✓ /diagnostic
  ✓ /packages
  ✓ /support
  ✓ /info
  ✓ /reaction
  ✓ /book
==================================================
```

Press `Ctrl + C` to exit log view.

---

## ✅ SUCCESS CHECKLIST

- [ ] Connected to Google Cloud VM via SSH
- [ ] Stopped old bot with `pkill -f bot.py`
- [ ] Created backup of old bot
- [ ] Created new `bot.py` with enhanced code
- [ ] Started new bot with `nohup`
- [ ] Verified bot is running with `ps aux`
- [ ] Checked logs show successful startup
- [ ] Bot shows online in Discord (green dot)
- [ ] Tested `/ping` command in Discord
- [ ] Welcome message works when new member joins

---

## 🎯 TEST THE NEW FEATURES

### **In Your Discord Server:**

1. **Test Commands:**
   - `/ping` - Should show detailed stats
   - `/diagnostic` - Should open interactive form
   - `/packages` - Should show beautiful package display
   - `/support` - Should show support info
   - `/info` - Should show bot info
   - `/reaction` - Should link to reaction test
   - `/book` - Should show booking info

2. **Test Welcome Message:**
   - Create a test invite link
   - Join with another account (or ask friend)
   - Check welcome message appears with:
     - Beautiful embed
     - Member avatar
     - Action buttons
     - Welcome reactions

3. **Check Bot Status:**
   - Look at bot in member list
   - Should show rotating status every 75 seconds

---

## 🚨 TROUBLESHOOTING

### **Bot not starting:**
```bash
cd ~/fpsos-bot
cat bot.log
```
Check for errors in the log.

### **Commands not showing:**
Wait 5 minutes for Discord to sync, or:
- Right-click bot in Discord
- Kick bot
- Re-invite bot with this link:
  `https://discord.com/api/oauth2/authorize?client_id=1458907328689733778&permissions=8&scope=bot%20applications.commands`

### **Restore old bot:**
```bash
pkill -f bot.py
mv bot_backup.py bot.py
nohup python bot.py > bot.log 2>&1 &
```

---

## 🎉 CONGRATULATIONS!

Your bot now has:
✅ Professional welcome messages
✅ Interactive diagnostic forms
✅ 7 slash commands
✅ Rotating status messages
✅ Action buttons and links
✅ Enhanced logging
✅ Welcome DMs
✅ Smart channel detection
✅ Member tracking

**The ULTIMATE Discord bot experience for FPSOS!** 🚀

---

**Need help? The bot is running 24/7 on Google Cloud!**
