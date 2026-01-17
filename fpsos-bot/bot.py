# FPSOS Discord Bot - Enhanced Version
# Apple-inspired UX with Bloomberg void black theme
# Now with diagnostic JSON processing and database integration

import discord
from discord import app_commands
from discord.ext import commands
import os
import json
from dotenv import load_dotenv
from database import db

# Load environment variables
load_dotenv()

# Bot configuration
TOKEN = os.getenv('DISCORD_BOT_TOKEN')
APPLICATION_ID = os.getenv('DISCORD_APPLICATION_ID')
GUILD_ID = os.getenv('DISCORD_GUILD_ID')

# Bot setup with intents
intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix='!', intents=intents)

# Brand colors (Bloomberg void black theme)
class Colors:
    FPSOS_PURPLE = 0x680036
    FPSOS_ORANGE = 0xE89900
    FPSOS_BLUE = 0x64D2FF
    SUCCESS = 0x30D158
    WARNING = 0xFF9F0A
    ERROR = 0xFF453A
    VOID_BLACK = 0x000000

# Web Server Setup (Control Plane)
from aiohttp import web

async def handle_trigger_diagnostic(request):
    """API Endpoint: Trigger a diagnostic DM for a specific user"""
    try:
        data = await request.json()
        user_id = int(data.get('user_id'))
        # shared_secret = request.headers.get('Authorization') # TODO: Add checking
        
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
        await user.send(view=view) # Send the view with the button separately or attached
        
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
        'uptime_s': 0 # TODO: Calculate detailed uptime
    })

async def header_auth_middleware(app, handler):
    async def middleware(request):
        # Allow localhost traffic freely for now
        # if request.remote != "127.0.0.1": 
        #    return web.json_response({'error': 'Unauthorized'}, status=401)
        return await handler(request)
    return middleware

async def start_web_server():
    app = web.Application(middlewares=[header_auth_middleware])
    app.router.add_post('/api/trigger-diagnostic', handle_trigger_diagnostic)
    app.router.add_get('/api/status', handle_bot_status)
    
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '0.0.0.0', 8080)
    await site.start()
    print(f'🌐 Control Plane API running on http://localhost:8080')

@bot.event
async def on_ready():
    """Bot startup - sync commands and start web server"""
    print(f'━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    print(f'🎯 FPSOS Bot Online')
    print(f'━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    print(f'Bot User: {bot.user.name}')
    print(f'Bot ID: {bot.user.id}')
    
    # Start the API server
    await start_web_server()
    
    # Sync slash commands
    try:
        synced = await bot.tree.sync()
        print(f'✅ Synced {len(synced)} command(s)')
    except Exception as e:
        print(f'❌ Failed to sync commands: {e}')
    
    # Register persistent views
    bot.add_view(WelcomeView())
    bot.add_view(DiagnosticView())
    bot.add_view(PreBookingView())
    
    # Set bot status
    await bot.change_presence(
        activity=discord.Activity(
            type=discord.ActivityType.watching,
            name="CS2 Performance | /diagnostic"
        )
    )

@bot.event
async def on_member_join(member: discord.Member):
    """Welcome new members with smooth onboarding flow"""
    print(f"DEBUG: Member joined: {member.name}")
    
    # Save user to database
    db.add_user(member.id, member.name)
    print(f"✅ Saved user to database: {member.name}")
    
    try:
        embed = get_welcome_embed(member)
        await member.send(embed=embed, view=WelcomeView())
    except discord.Forbidden:
        # Fallback to general channel if DMs are closed
        channel = discord.utils.get(member.guild.text_channels, name="general")
        if channel:
            await channel.send(f"👋 {member.mention} welcome! Check your DMs to start your CS2 diagnostic.", delete_after=15)

@bot.event
async def on_message(message):
    """Conversational greeting, assistance, and JSON diagnostic processing"""
    if message.author == bot.user:
        return

    content = message.content.lower().strip()
    
    # PRIORITY: Check for JSON file uploads (diagnostic results)
    if message.attachments:
        for attachment in message.attachments:
            if attachment.filename.endswith('.json'):
                await handle_diagnostic_json(message, attachment)
                return  # Don't process other handlers
    
    # Greetings
    if content in ["hi", "hello", "hey", "hello bot", "yo"]:
        async with message.channel.typing():
            embed = discord.Embed(
                title="👋 Hello! I\'m the FPSOS Assistant",
                description=f"Hey {message.author.mention}! How can I assist you today?\n\nI specialize in **CS2 System Optimization**.",
                color=Colors.FPSOS_BLUE
            )
            await message.reply(embed=embed, view=WelcomeView())
            return

    # Booking intent
    if any(word in content for word in ["book", "session", "schedule", "calendar", "appointment", "packages", "pricing"]):
        async with message.channel.typing():
            embed = discord.Embed(
                title="📅 Schedule Your Optimization",
                description="Before you book, let\'s check which package is best for your system.",
                color=Colors.FPSOS_PURPLE
            )
            await message.reply(embed=embed, view=PreBookingView())
            return

    await bot.process_commands(message)


async def handle_diagnostic_json(message, attachment):
    """
    Process diagnostic JSON file upload
    This is the CRITICAL missing feature - analyzes JSON and recommends a package
    """
    async with message.channel.typing():
        try:
            # Download and parse JSON
            file_bytes = await attachment.read()
            diagnostic_data = json.loads(file_bytes.decode('utf-8'))
            
            # Extract system info
            system_info = diagnostic_data.get('system', {})
            issues = diagnostic_data.get('issues', {})
            
            critical_issues = issues.get('critical', [])
            warning_issues = issues.get('warnings', [])
            
            critical_count = len(critical_issues)
            warning_count = len(warning_issues)
            
            # Smart recommendation algorithm
            if critical_count >= 2:
                recommendation = 'extreme'
                package_name = 'Extreme BIOSPRIME'
                price = 'AED 699'
                reason = f"{critical_count} critical issues detected - requires deep BIOS optimization"
                color = Colors.ERROR
            elif critical_count >= 1 or warning_count >= 3:
                recommendation = 'full'
                package_name = 'Full System Tune-Up'
                price = 'AED 399'
                reason = f"{critical_count} critical + {warning_count} warnings - comprehensive optimization needed"
                color = Colors.WARNING
            elif warning_count >= 1:
                recommendation = 'quick'
                package_name = 'Quick Remote Fix'
                price = 'AED 199'
                reason = f"{warning_count} minor issues - quick fixes available"
                color = Colors.FPSOS_BLUE
            else:
                recommendation = 'good'
                package_name = 'Your System Looks Great!'
                price = 'No service needed'
                reason = "No critical issues detected - you're good to go!"
                color = Colors.SUCCESS
            
            # Save to database
            db.save_diagnostic(
                message.author.id,
                diagnostic_data,
                critical_count,
                warning_count,
                recommendation
            )
            print(f"✅ Saved diagnostic for {message.author.name}: {recommendation}")
            
            # Create beautiful result embed
            embed = discord.Embed(
                title="🎯 Diagnostic Analysis Complete",
                description=f"**Recommendation:** {package_name}\n{reason}",
                color=color
            )
            
            # Add system info
            if system_info:
                sys_text = f"""
                **CPU:** {system_info.get('cpu', 'Unknown')}
                **GPU:** {system_info.get('gpu', 'Unknown')}
                **RAM:** {system_info.get('ram', 'Unknown')} GB
                **Network:** {system_info.get('network', 'Unknown')}
                """
                embed.add_field(name="💻 System", value=sys_text.strip(), inline=False)
            
            # Add critical issues
            if critical_count > 0:
                critical_text = '\n'.join([f"❌ {issue}" for issue in critical_issues[:5]])
                embed.add_field(name=f"⚠️ Critical Issues ({critical_count})", value=critical_text, inline=False)
            
            # Add warnings (limit to 5)
            if warning_count > 0:
                warning_text = '\n'.join([f"⚠️ {issue}" for issue in warning_issues[:5]])
                if warning_count > 5:
                    warning_text += f"\n... and {warning_count - 5} more"
                embed.add_field(name=f"⚠️ Warnings ({warning_count})", value=warning_text, inline=False)
            
            # Add pricing and score
            embed.add_field(name="💰 Investment", value=price, inline=True)
            embed.add_field(name="📊 Health Score", value=f"{max(0, 100 - (critical_count * 20 + warning_count * 5))}/100", inline=True)
            
            embed.set_footer(text=f"Diagnostic saved • {message.author.name}")
            
            # Send result with booking option if needed
            if recommendation != 'good':
                view = BookingView(recommendation)
                await message.reply(embed=embed, view=view)
            else:
                await message.reply(embed=embed)
            
        except json.JSONDecodeError:
            error_embed = discord.Embed(
                title="❌ Invalid JSON File",
                description="The file you uploaded doesn't appear to be a valid diagnostic JSON.\n\nPlease run the **FPSOS PowerShell diagnostic tool** and upload the generated JSON file.",
                color=Colors.ERROR
            )
            await message.reply(embed=error_embed)
        
        except KeyError as e:
            error_embed = discord.Embed(
                title="❌ Incomplete Diagnostic Data",
                description=f"The diagnostic file is missing required data: `{e}`\n\nPlease re-run the diagnostic tool and try again.",
                color=Colors.ERROR
            )
            await message.reply(embed=error_embed)
        
        except Exception as e:
            error_embed = discord.Embed(
                title="❌ Processing Error",
                description=f"An error occurred while analyzing your diagnostic:\n```{str(e)}```\n\nPlease contact support if this persists.",
                color=Colors.ERROR
            )
            await message.reply(embed=error_embed)
            print(f"❌ Diagnostic processing error: {e}")

# Views & Modals

# Views & Modals

class SystemProfileModal(discord.ui.Modal, title="💻 System Profiling Assessment"):
    """Detailed initial assessment for new users"""
    
    specs = discord.ui.TextInput(
        label="CPU & GPU",
        placeholder="e.g. Ryzen 7800X3D / RTX 4070",
        max_length=100
    )
    
    windows = discord.ui.TextInput(
        label="Windows Version & Install Date",
        placeholder="e.g. Win 10 22H2, installed 2 years ago",
        max_length=100
    )
    
    bios = discord.ui.TextInput(
        label="BIOS Version (if known)",
        placeholder="e.g. Latest / Unknown",
        required=False,
        max_length=50
    )
    
    issues = discord.ui.TextInput(
        label="Main Issues Experienced",
        style=discord.TextStyle.paragraph,
        placeholder="e.g. Micro-stutters in CS2, FPS drops in smoke, high input lag...",
        max_length=500
    )
    
    async def on_submit(self, interaction: discord.Interaction):
        # Determine initial advice based on input
        advice = "✅ **Initial Check:** Your hardware looks capable."
        package_rec = "full"
        color = Colors.FPSOS_BLUE
        
        # Simple heuristic analysis
        last_install = self.windows.value.lower()
        issues_text = self.issues.value.lower()
        
        if "year" in last_install and ("2" in last_install or "3" in last_install or "4" in last_install):
            advice = "⚠️ **Create Recommendation:** It's been over 2 years since your last Windows install.\n\nOver time, Windows accumulates bloatware, registry errors, and driver conflicts that degrade performance. A fresh install is the #1 way to restore peak responsiveness."
            color = Colors.WARNING
        elif "stutter" in issues_text or "drop" in issues_text:
            advice = "⚠️ **Insight:** Stutters typically indicate deep system latency issues (DPC Latency) or BIOS misconfigurations (C-States, HPET)."
            package_rec = "extreme"
            
        # Create response embed
        embed = discord.Embed(
            title="🔍 Profile Analysis Result",
            description=f"Thanks **{interaction.user.name}**! I've reviewed your system profile.\n\n{advice}\n\n**Recommendation:** To fix this permanently, we need data. Please run our analyzer tool below.",
            color=color
        )
        
        embed.add_field(name="🖥️ Your Rig", value=self.specs.value, inline=True)
        embed.add_field(name="⚠️ Reported Issue", value=self.issues.value, inline=True)
        
        # Add button to download tool
        view = DiagnosticView()
        await interaction.response.send_message(embed=embed, view=view, ephemeral=True)


class PreBookingView(discord.ui.View):
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
            'full': "**Full System Tune-Up (AED 399)**\n• Deep Windows Stripping\n• Network Optimization\n• Process Lasso Config\n• Latency Reduction",
            'extreme': "**Extreme BIOSPRIME (AED 699)**\n• Custom BIOS Tuning\n• RAM Overclocking\n• Electrical Optimization\n• Input Lag Nullification"
        }
        embed = discord.Embed(title="📦 Package Details", description=details[select.values[0]], color=Colors.FPSOS_BLUE)
        await interaction.response.send_message(embed=embed, view=BookingView(select.values[0]), ephemeral=True)


class WelcomeView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="📝 Start System Profiling", style=discord.ButtonStyle.primary, emoji="💻", custom_id="btn_profile")
    async def start_profile(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_modal(SystemProfileModal())

    @discord.ui.button(label="Book Session Directly", style=discord.ButtonStyle.secondary, emoji="📅", custom_id="btn_book_direct")
    async def book_direct(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_message(embed=discord.Embed(title="📅 Choose Package"), view=PreBookingView(), ephemeral=True)

class DiagnosticView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="PowerShell Tool", style=discord.ButtonStyle.primary, emoji="🔬", custom_id="diag:powershell")
    async def powershell_method(self, interaction: discord.Interaction, button: discord.ui.Button):
        dm_embed = discord.Embed(title="🔬 Diagnostic Tool", description="[Download Tool](https://fpsos.gg/FPSOS-CS2-Suite.ps1)", color=Colors.FPSOS_PURPLE)
        await interaction.user.send(embed=dm_embed)
        await interaction.response.send_message("📥 Check your DMs!", ephemeral=True)

    @discord.ui.button(label="Quick Questions", style=discord.ButtonStyle.secondary, emoji="📋", custom_id="diag:quick")
    async def quick_questions(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_modal(QuickAssessmentModal())

class QuickAssessmentModal(discord.ui.Modal, title="Quick Assessment"):
    gpu = discord.ui.TextInput(label="GPU Brand", placeholder="NVIDIA / AMD...")
    fps = discord.ui.TextInput(label="Current FPS", placeholder="e.g. 144")
    issue = discord.ui.TextInput(label="Main Issue", style=discord.TextStyle.paragraph)
    
    async def on_submit(self, interaction: discord.Interaction):
        # Simple recommendation
        embed = discord.Embed(title="🎯 Recommendation", description="Based on your inputs, we recommend the **Full System Tune-Up**.", color=Colors.SUCCESS)
        await interaction.response.send_message(embed=embed, view=BookingView("full"), ephemeral=True)

class BookingView(discord.ui.View):
    def __init__(self, package_code: str):
        super().__init__(timeout=None)
        # Updated to use new FPSOS booking page instead of Calendly
        booking_url = f'https://fpsos.gg/book?package={package_code}'
        self.add_item(discord.ui.Button(label="Book Session", url=booking_url, emoji="📅"))

# Helper Embeds

def get_welcome_embed(member):
    embed = discord.Embed(
        title=f"👋 Welcome to the Elite Circle, {member.name}!",
        description=(
            f"Glad to have you here, **{member.name}**.\n\n"
            "We specialize in pushing **CS2 performance** to its absolute limit. "
            "Whether you're looking for a quick fix or a complete system overhaul, we've got you covered.\n\n"
            "**Let's start by analyzing your rig.**\n"
            "Click **'Start System Profiling'** below so I can give you a personalized recommendation."
        ),
        color=Colors.FPSOS_BLUE
    )
    embed.set_thumbnail(url=member.display_avatar.url)
    embed.set_footer(text="FPS Optimization Station • Official Bot")
    return embed

def get_packages_embed():
    embed = discord.Embed(title="📦 Service Packages", color=Colors.FPSOS_PURPLE)
    embed.add_field(name="💨 Quick Fix - AED 199", value="Basic optimization", inline=False)
    embed.add_field(name="🔧 Full Tune-Up - AED 399", value="Advanced optimization", inline=False)
    embed.add_field(name="⚡ Extreme - AED 699", value="Total system overhaul", inline=False)
    return embed

def get_resources_embed():
    """Returns a beautifully formatted resource hub embed"""
    embed = discord.Embed(
        title="🚀 FPSOS Optimization & Resource Hub",
        description=(
            "Everything you need to squeeze every frame out of your system and minimize input latency.\n\n"
            "**Official Links & Tools:**"
        ),
        color=Colors.FPSOS_BLUE
    )
    
    embed.add_field(
        name="🌳 Linktree (DDU & NVCleanInstall)",
        value="👉 [linktr.ee/t1glish](https://linktr.ee/t1glish)\n*Download recommended DDU versions and NVCleanInstall profiles.*",
        inline=False
    )
    
    embed.add_field(
        name="🔬 FPSOS CS2 Suite v4.0",
        value="👉 [Download Script](https://fpsos.gg/FPSOS-CS2-Suite.ps1)\n*Unified interrupt affinity, Process Lasso profiles, and system diagnostics.*",
        inline=True
    )
    
    embed.add_field(
        name="📚 Optimization Guide",
        value="👉 [Read Guide](https://fpsos.gg/guides/basic-optimization)\n*Step-by-step walkthrough for a responsive system.*",
        inline=True
    )
    
    embed.add_field(
        name="🛠️ Hardware Recommendations",
        value="Optimized for 9800X3D + RTX 40-series builds.",
        inline=False
    )
    
    embed.set_footer(text="FPSOS.GG • Subtick-Perfect Performance")
    embed.set_thumbnail(url="https://fpsos.gg/logo.png") # Assuming there's a logo
    return embed

# Commands

@bot.tree.command(name="diagnostic")
async def diagnostic_cmd(interaction: discord.Interaction):
    await interaction.response.send_message(embed=discord.Embed(title="🎯 Diagnostic"), view=DiagnosticView(), ephemeral=True)

@bot.tree.command(name="book")
async def book_cmd(interaction: discord.Interaction):
    await interaction.response.send_message(embed=discord.Embed(title="📅 Booking"), view=PreBookingView(), ephemeral=True)

@bot.tree.command(name="resources")
async def resources_cmd(interaction: discord.Interaction):
    """Post the optimization hub with Linktree and script details"""
    # Admin only to keep channels clean, or use ephemeral if you want users to see it privately
    if not interaction.user.guild_permissions.administrator:
        # If not admin, send ephemerally
        await interaction.response.send_message(embed=get_resources_embed(), ephemeral=True)
        return
    
    # If admin, post publicly (not ephemeral)
    await interaction.response.send_message(embed=get_resources_embed())

@bot.command(name="fpsos")
async def fpsos_cmd(ctx):
    await ctx.send(embed=get_welcome_embed(ctx.author), view=WelcomeView())

@bot.tree.command(name="stats")
async def stats_cmd(interaction: discord.Interaction):
    """View bot statistics (admin only)"""
    # Check if user is admin (you can customize this check)
    if not interaction.user.guild_permissions.administrator:
        await interaction.response.send_message("❌ This command is for administrators only.", ephemeral=True)
        return
    
    stats = db.get_stats()
    
    embed = discord.Embed(
        title="📊 FPSOS Bot Statistics",
        description="Current performance metrics",
        color=Colors.FPSOS_PURPLE
    )
    
    embed.add_field(name="👥 Total Users", value=f"{stats['total_users']}", inline=True)
    embed.add_field(name="🔬 Diagnostics Run", value=f"{stats['total_diagnostics']}", inline=True)
    embed.add_field(name="📅 Total Bookings", value=f"{stats['total_bookings']}", inline=True)
    
    embed.add_field(name="✅ Completed Sessions", value=f"{stats['completed_bookings']}", inline=True)
    embed.add_field(name="💰 Total Revenue", value=f"AED {stats['total_revenue']:.2f}", inline=True)
    embed.add_field(name="📈 Conversion Rate", value=f"{stats['conversion_rate']}%", inline=True)
    
    embed.add_field(name="🏆 Popular Service", value=stats['popular_service'], inline=False)
    
    embed.set_footer(text=f"Requested by {interaction.user.name}")
    
    await interaction.response.send_message(embed=embed, ephemeral=True)

@bot.command(name="sync")
async def sync_cmd(ctx):
    """Force sync slash commands"""
    if not ctx.author.guild_permissions.administrator:
        await ctx.send("❌ Admin only.")
        return
        
    async with ctx.typing():
        fmt = await ctx.bot.tree.sync()
        await ctx.send(f"✅ Synced {len(fmt)} commands to current guild.")
    
# Run
if __name__ == '__main__':
    bot.run(TOKEN)