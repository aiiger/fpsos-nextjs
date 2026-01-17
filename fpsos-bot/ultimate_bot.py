import discord
from discord.ext import commands, tasks
from discord.ui import Button, View, Select, Modal, TextInput
from discord import app_commands
import os
import asyncio
import json
from datetime import datetime
from dotenv import load_dotenv
from firecrawl import FirecrawlApp
from aiohttp import web
from database import db

# Load environment variables
load_dotenv()
TOKEN = os.getenv('DISCORD_BOT_TOKEN')
FIRECRAWL_API_KEY = os.getenv('FIRECRAWL_API_KEY')
GUILD_ID = os.getenv('DISCORD_GUILD_ID')

# Setup Firecrawl
firecrawl_app = FirecrawlApp(api_key=FIRECRAWL_API_KEY)

# Setup Intents
intents = discord.Intents.default()
intents.message_content = True
intents.members = True
intents.guilds = True

# Initialize Bot
bot = commands.Bot(command_prefix='!', intents=intents)

# -----------------------------------------------------------------------------
# Brand Colors (Bloomberg Void Black Theme)
# -----------------------------------------------------------------------------
class Colors:
    FPSOS_PURPLE = 0x680036
    FPSOS_ORANGE = 0xE89900
    FPSOS_BLUE = 0x64D2FF
    SUCCESS = 0x30D158
    WARNING = 0xFF9F0A
    ERROR = 0xFF453A
    VOID_BLACK = 0x000000

# -----------------------------------------------------------------------------
# Web Server (Control Plane for Website Integration)
# -----------------------------------------------------------------------------
async def handle_trigger_diagnostic(request):
    """API Endpoint: Trigger a diagnostic DM for a specific user"""
    try:
        data = await request.json()
        user_id = int(data.get('user_id'))
        
        user = bot.get_user(user_id) or await bot.fetch_user(user_id)
        if not user:
            return web.json_response({'error': 'User not found'}, status=404)
            
        # Send the diagnostic embed directly
        view = DiagnosticView()
        embed = discord.Embed(
            title="🔬 Manual Diagnostic Request",
            description="An admin has requested a system diagnostic.\nPlease download the tool below:",
            color=Colors.FPSOS_PURPLE
        )
        await user.send(embed=embed)
        await user.send(view=view)
        
        return web.json_response({'status': 'sent', 'user': user.name})
    except Exception as e:
        return web.json_response({'error': str(e)}, status=500)

async def handle_bot_status(request):
    """API Endpoint: Get bot health metrics"""
    return web.json_response({
        'status': 'online',
        'latency': round(bot.latency * 1000),
        'guilds': len(bot.guilds),
        'users': sum(guild.member_count for guild in bot.guilds),
        'server': 'GCP-Ultimate'
    })

async def start_web_server():
    app = web.Application()
    app.router.add_post('/api/trigger-diagnostic', handle_trigger_diagnostic)
    app.router.add_get('/api/status', handle_bot_status)
    
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '0.0.0.0', 8080)
    await site.start()
    print(f'🌐 Control Plane API running on http://localhost:8080')

# -----------------------------------------------------------------------------
# Views & UI Components
# -----------------------------------------------------------------------------
class WelcomeView(View):
    def __init__(self):
        super().__init__(timeout=None)
        
        self.add_item(Button(label="🔧 Start Diagnostic", style=discord.ButtonStyle.primary, custom_id="start_diagnostic"))
        self.add_item(Button(label="📦 View Packages", style=discord.ButtonStyle.secondary, url="https://fpsos.gg/packages"))
        self.add_item(Button(label="📅 Book Session", style=discord.ButtonStyle.success, url="https://fpsos.gg/book"))
        self.add_item(Button(label="⚡ Reaction Test", style=discord.ButtonStyle.secondary, url="https://fpsos.gg/reaction-test"))

class DiagnosticView(View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="PowerShell Tool", style=discord.ButtonStyle.primary, emoji="🔬", custom_id="diag:powershell")
    async def powershell_method(self, interaction: discord.Interaction, button: discord.ui.Button):
        dm_embed = discord.Embed(title="🔬 Diagnostic Tool", description="[Download Tool](https://fpsos.gg/FPSOS-CS2-Suite.ps1)", color=Colors.FPSOS_PURPLE)
        await interaction.user.send(embed=dm_embed)
        await interaction.response.send_message("📥 Check your DMs!", ephemeral=True)

class PreBookingView(View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.select(placeholder="Select a package to view details...", custom_id="select_package", options=[
        discord.SelectOption(label="Quick Remote Fix", value="quick", description="Basic optimization & troubleshooting", emoji="⚡"),
        discord.SelectOption(label="Full System Tune-Up", value="full", description="Comprehensive OS & Game optimization", emoji="🚀"),
        discord.SelectOption(label="Extreme BIOSPRIME", value="extreme", description="Deep BIOS, RAM & Input Lag tuning", emoji="🔥")
    ])
    async def select_callback(self, interaction, select):
        details = {
            'quick': "**Quick Remote Fix (AED 199)**\n• Driver Optimization\n• Basic Windows Debloat\n• Game Config Tuning",
            'full': "**Full System Tune-Up (AED 399)**\n• Deep Windows Stripping\n• Network Optimization\n• Process Lasso Config",
            'extreme': "**Extreme BIOSPRIME (AED 699)**\n• Custom BIOS Tuning\n• RAM Overclocking\n• Electrical Optimization"
        }
        embed = discord.Embed(title="📦 Package Details", description=details[select.values[0]], color=Colors.FPSOS_BLUE)
        await interaction.response.send_message(embed=embed, view=BookingView(select.values[0]), ephemeral=True)

class BookingView(View):
    def __init__(self, package_code: str):
        super().__init__(timeout=None)
        booking_url = f'https://fpsos.gg/book?package={package_code}'
        self.add_item(discord.ui.Button(label="Book Session", url=booking_url, emoji="📅"))

class DiagnosticModal(Modal, title="CS2 System Diagnostic"):
    pc_specs = TextInput(label="PC Specs", placeholder="e.g. Ryzen 7800X3D, RTX 4090", style=discord.TextStyle.short)
    current_fps = TextInput(label="Avg FPS", placeholder="e.g. 400-600", style=discord.TextStyle.short)
    issues = TextInput(label="Issues", placeholder="e.g. Stuttering, Input Lag", style=discord.TextStyle.paragraph, required=False)
    
    async def on_submit(self, interaction: discord.Interaction):
        embed = discord.Embed(title="🔍 Diagnostic Analysis", description=f"Analysis for {interaction.user.mention}", color=Colors.FPSOS_PURPLE)
        embed.add_field(name="Specs", value=self.pc_specs.value)
        embed.add_field(name="FPS", value=self.current_fps.value)
        embed.add_field(name="Issues", value=self.issues.value or "None reported")
        await interaction.response.send_message(embed=embed, view=PreBookingView(), ephemeral=False)

# -----------------------------------------------------------------------------
# Core Events
# -----------------------------------------------------------------------------
@bot.event
async def on_ready():
    print(f'━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    print(f'🚀 FPSOS Ultimate Bot Online')
    print(f'━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    print(f'Bot: {bot.user.name} (ID: {bot.user.id})')
    print(f'Firecrawl: {"Active" if FIRECRAWL_API_KEY else "Disabled"}')
    
    # Start Control Plane
    await start_web_server()
    
    # Sync Slash Commands
    try:
        synced = await bot.tree.sync()
        print(f'✅ Synced {len(synced)} slash commands')
    except Exception as e:
        print(f'❌ Sync Error: {e}')
        
    # Status Loop
    status_update.start()

@tasks.loop(minutes=5)
async def status_update():
    statuses = [
        discord.Activity(type=discord.ActivityType.watching, name="CS2 performance 🎮"),
        discord.Activity(type=discord.ActivityType.listening, name="/diagnostic 🔧"),
        discord.Activity(type=discord.ActivityType.watching, name=f"{sum(guild.member_count for guild in bot.guilds)} players"),
    ]
    for status in statuses:
        await bot.change_presence(activity=status)
        await asyncio.sleep(75)

@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    # Check for JSON Diagnostic Files
    if message.attachments:
        for attachment in message.attachments:
            if attachment.filename.endswith('.json'):
                await handle_diagnostic_json(message, attachment)
                return

    # Conversational Logic
    content = message.content.lower().strip()
    if content in ["hi", "hello", "hey", "sup"]:
        embed = discord.Embed(
            title="👋 Hello Protocol Initiated",
            description=f"Greetings {message.author.mention}. I am the FPSOS Neural Assistant.\nUse `/research` to scan the web or `/diagnostic` to analyze your rig.",
            color=Colors.FPSOS_BLUE
        )
        await message.reply(embed=embed, view=WelcomeView())
        return

    await bot.process_commands(message)

# -----------------------------------------------------------------------------
# Diagnostic Logic (JSON Analysis)
# -----------------------------------------------------------------------------
async def handle_diagnostic_json(message, attachment):
    async with message.channel.typing():
        try:
            file_bytes = await attachment.read()
            data = json.loads(file_bytes.decode('utf-8'))
            
            # Simple Analysis Logic
            issues = data.get('issues', {}).get('critical', [])
            score = max(0, 100 - (len(issues) * 20))
            
            recommendation = "Full System Tune-Up" if score < 80 else "Quick Remote Fix"
            color = Colors.WARNING if score < 80 else Colors.SUCCESS
            
            # Save to DB
            db.save_diagnostic(message.author.id, data, len(issues), 0, recommendation)
            
            embed = discord.Embed(title="🎯 Diagnostic Result", color=color)
            embed.add_field(name="Health Score", value=f"{score}/100")
            embed.add_field(name="Recommended", value=recommendation)
            
            if issues:
                embed.add_field(name="Critical Issues", value="\n".join(issues[:5]), inline=False)
                
            await message.reply(embed=embed, view=BookingView("full"))
            
        except Exception as e:
            await message.reply(f"❌ Error analyzing report: {e}")

# -----------------------------------------------------------------------------
# Slash Commands
# -----------------------------------------------------------------------------
@bot.tree.command(name="research", description="🔎 Research CS2 topics with AI (Firecrawl)")
async def research(interaction: discord.Interaction, query: str):
    await interaction.response.defer()
    try:
        response = firecrawl_app.search(query, params={"limit": 3, "scrapeOptions": {"formats": ["markdown"]}})
        
        embed = discord.Embed(title=f"🔎 Research: {query}", color=Colors.FPSOS_PURPLE)
        
        data = response.get('data', [])
        if not data and hasattr(response, 'data'): data = response.data
            
        for item in data[:3]:
            desc = item.get('description', 'No description')[:200] + "..."
            embed.add_field(name=item.get('title', 'Result'), value=f"{desc}\n[Link]({item.get('url')})", inline=False)
            
        await interaction.followup.send(embed=embed)
    except Exception as e:
        await interaction.followup.send(f"❌ Research failed: {e}")

@bot.tree.command(name="diagnostic", description="🔧 Start interactive system diagnostic")
async def diagnostic(interaction: discord.Interaction):
    await interaction.response.send_modal(DiagnosticModal())

@bot.tree.command(name="packages", description="💎 View optimization packages")
async def packages(interaction: discord.Interaction):
    embed = discord.Embed(title="💎 FPSOS Packages", description="Professional CS2 Optimization", color=Colors.FPSOS_PURPLE)
    embed.add_field(name="⚡ Quick Fix (199 AED)", value="Drivers, Debloat, Config", inline=False)
    embed.add_field(name="🚀 Full Tune-Up (399 AED)", value="BIOS, Network, Latency", inline=False)
    embed.add_field(name="🔥 Extreme (699 AED)", value="Hardware Tuning, Overclocking", inline=False)
    await interaction.response.send_message(embed=embed, view=PreBookingView())

@bot.tree.command(name="ping", description="🏓 Check latency")
async def ping(interaction: discord.Interaction):
    latency = round(bot.latency * 1000)
    await interaction.response.send_message(f"🏓 Pong! Latency: {latency}ms")

# -----------------------------------------------------------------------------
# Entry Point
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    bot.run(TOKEN)
