import discord
from discord.ext import commands
from discord.ui import Button, View
import os
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('DISCORD_BOT_TOKEN')

intents = discord.Intents.default()
intents.message_content = True
intents.members = True
intents.guilds = True
bot = commands.Bot(command_prefix='!', intents=intents)

# Custom View with Buttons
class WelcomeView(View):
    def __init__(self):
        super().__init__(timeout=None)
        
        # Add buttons
        self.add_item(Button(label="🔧 Start Diagnostic", style=discord.ButtonStyle.primary, custom_id="diagnostic_button"))
        self.add_item(Button(label="📦 View Packages", style=discord.ButtonStyle.secondary, url="https://fpsos.gg/packages"))
        self.add_item(Button(label="📅 Book Session", style=discord.ButtonStyle.success, url="https://fpsos.gg/book"))

@bot.event
async def on_ready():
    print(f'✅ {bot.user} is online!')
    print(f'📊 Connected to {len(bot.guilds)} server(s)')
    print(f'👥 Serving {sum(guild.member_count for guild in bot.guilds)} members')
    
    # Sync slash commands
    try:
        synced = await bot.tree.sync()
        print(f'🔄 Synced {len(synced)} slash command(s)')
    except Exception as e:
        print(f'❌ Error syncing commands: {e}')

@bot.event
async def on_member_join(member):
    """Send a professional welcome message when a new member joins"""
    
    # Try to find the best channel to send welcome message
    channel = None
    
    # Priority 1: System channel (usually #general)
    if member.guild.system_channel:
        channel = member.guild.system_channel
    # Priority 2: Channel named 'welcome' or 'general'
    elif welcome_channel := discord.utils.get(member.guild.text_channels, name='welcome'):
        channel = welcome_channel
    elif general_channel := discord.utils.get(member.guild.text_channels, name='general'):
        channel = general_channel
    # Priority 3: First channel bot can send messages to
    else:
        for text_channel in member.guild.text_channels:
            if text_channel.permissions_for(member.guild.me).send_messages:
                channel = text_channel
                break
    
    if not channel:
        print(f"⚠️ No suitable channel found to welcome {member.name}")
        return
    
    # Create beautiful embed
    embed = discord.Embed(
        title="🎮 Welcome to FPSOS!",
        description=f"**Welcome {member.mention} to the ultimate CS2 optimization community!**\n\nWe specialize in professional PC optimization for competitive Counter-Strike 2 players in Dubai and UAE.",
        color=0x680036  # FPSOS purple
    )
    
    # Add member avatar
    embed.set_thumbnail(url=member.display_avatar.url)
    
    # Add fields
    embed.add_field(
        name="🔧 What We Do",
        value="Remote PC optimization focusing on:\n• Subtick system performance\n• Frame time consistency\n• Interrupt affinity tuning\n• BIOS optimization",
        inline=False
    )
    
    embed.add_field(
        name="📋 Get Started",
        value="Use `/diagnostic` to analyze your system and get personalized recommendations!",
        inline=False
    )
    
    embed.add_field(
        name="💎 Our Services",
        value=(
            "**Quick Remote Fix** - AED 199\n"
            "**Full System Tune-Up** - AED 399\n"
            "**Extreme BIOSPRIME** - AED 699"
        ),
        inline=False
    )
    
    embed.add_field(
        name="🎯 Quick Links",
        value="• Visit [fpsos.gg](https://fpsos.gg)\n• Check our [packages](https://fpsos.gg/packages)\n• Test your [reaction time](https://fpsos.gg/reaction-test)",
        inline=False
    )
    
    embed.set_footer(
        text=f"Member #{member.guild.member_count} • FPSOS.gg - Frame Per Second Operating System",
        icon_url="https://fpsos.gg/fpsos-icon.png"
    )
    
    embed.set_image(url="https://fpsos.gg/preview.webp")  # Add hero image if available
    
    # Create view with buttons
    view = WelcomeView()
    
    try:
        await channel.send(f"👋 Everyone, please welcome {member.mention}!", embed=embed, view=view)
        print(f"✅ Sent welcome message for {member.name} in {channel.name}")
    except discord.Forbidden:
        print(f"❌ No permission to send message in {channel.name}")
    except Exception as e:
        print(f"❌ Error sending welcome message: {e}")

@bot.event
async def on_member_remove(member):
    """Log when a member leaves"""
    print(f"👋 {member.name} has left the server")

@bot.tree.command(name="ping", description="Check bot latency and status")
async def ping(interaction: discord.Interaction):
    """Check if bot is responsive"""
    latency = round(bot.latency * 1000)
    
    embed = discord.Embed(
        title="🏓 Pong!",
        description=f"Bot is online and responsive!",
        color=0x00CCBC  # Quick fix cyan
    )
    embed.add_field(name="⚡ Latency", value=f"{latency}ms", inline=True)
    embed.add_field(name="📊 Status", value="✅ Online", inline=True)
    embed.set_footer(text="FPSOS Bot • All systems operational")
    
    await interaction.response.send_message(embed=embed)

@bot.tree.command(name="diagnostic", description="Start CS2 system diagnostic")
async def diagnostic(interaction: discord.Interaction):
    """Interactive diagnostic tool"""
    
    embed = discord.Embed(
        title="🔧 FPSOS CS2 Diagnostic System",
        description="Welcome to the professional CS2 optimization diagnostic tool!\n\n**We'll analyze:**",
        color=0x680036
    )
    
    embed.add_field(
        name="⚙️ System Performance",
        value="• CPU/GPU utilization\n• Frame time consistency\n• DPC latency issues\n• WHEA error detection",
        inline=True
    )
    
    embed.add_field(
        name="🎮 CS2 Optimization",
        value="• Subtick performance\n• Input lag analysis\n• Network optimization\n• Process affinity tuning",
        inline=True
    )
    
    embed.add_field(
        name="📦 Recommended Packages",
        value=(
            "**Quick Remote Fix** (AED 199)\n"
            "Basic optimization + DPC fixes\n\n"
            "**Full System Tune-Up** (AED 399)\n"
            "Complete Windows + BIOS tuning\n\n"
            "**Extreme BIOSPRIME** (AED 699)\n"
            "Ultimate performance package"
        ),
        inline=False
    )
    
    embed.add_field(
        name="📅 Next Steps",
        value="[Book a session](https://fpsos.gg/book) or [view full details](https://fpsos.gg/packages)",
        inline=False
    )
    
    embed.set_footer(text="FPSOS.gg • Professional CS2 Optimization • Dubai, UAE")
    
    # Add action buttons
    view = View()
    view.add_item(Button(label="📦 View Packages", style=discord.ButtonStyle.primary, url="https://fpsos.gg/packages"))
    view.add_item(Button(label="📅 Book Now", style=discord.ButtonStyle.success, url="https://fpsos.gg/book"))
    view.add_item(Button(label="❓ Support", style=discord.ButtonStyle.secondary, custom_id="support_button"))
    
    await interaction.response.send_message(embed=embed, view=view)

@bot.tree.command(name="packages", description="View all FPSOS optimization packages")
async def packages(interaction: discord.Interaction):
    """Display available packages"""
    
    embed = discord.Embed(
        title="💎 FPSOS Optimization Packages",
        description="Professional CS2 optimization services tailored to your needs",
        color=0x680036
    )
    
    # Quick Remote Fix
    embed.add_field(
        name="🔧 Quick Remote Fix - AED 199",
        value=(
            "✅ Basic system optimization\n"
            "✅ DPC latency fixes\n"
            "✅ Process priority tuning\n"
            "✅ Windows tweaks\n"
            "⏱️ Duration: ~1 hour"
        ),
        inline=False
    )
    
    # Full System Tune-Up
    embed.add_field(
        name="⚙️ Full System Tune-Up - AED 399",
        value=(
            "✅ Everything in Quick Fix\n"
            "✅ Complete Windows optimization\n"
            "✅ Basic BIOS tuning\n"
            "✅ Advanced process affinity\n"
            "✅ Network optimization\n"
            "⏱️ Duration: ~2-3 hours"
        ),
        inline=False
    )
    
    # Extreme BIOSPRIME
    embed.add_field(
        name="🚀 Extreme BIOSPRIME - AED 699",
        value=(
            "✅ Everything in Full Tune-Up\n"
            "✅ Fresh Windows install\n"
            "✅ Complete BIOS optimization\n"
            "✅ Advanced interrupt tuning\n"
            "✅ Custom launch parameters\n"
            "✅ 30-day optimization support\n"
            "⏱️ Duration: ~4-5 hours"
        ),
        inline=False
    )
    
    embed.set_footer(text="All services performed remotely via AnyDesk • Based in Dubai, UAE")
    
    view = View()
    view.add_item(Button(label="📅 Book Session", style=discord.ButtonStyle.success, url="https://fpsos.gg/book"))
    view.add_item(Button(label="🌐 Visit Website", style=discord.ButtonStyle.link, url="https://fpsos.gg"))
    
    await interaction.response.send_message(embed=embed, view=view)

@bot.tree.command(name="support", description="Get support or contact FPSOS team")
async def support(interaction: discord.Interaction):
    """Support command"""
    
    embed = discord.Embed(
        title="💬 FPSOS Support",
        description="Need help? We're here for you!",
        color=0x680036
    )
    
    embed.add_field(
        name="📧 Contact",
        value="Email: support@fpsos.gg\nResponse time: 24 hours",
        inline=False
    )
    
    embed.add_field(
        name="🌐 Resources",
        value="• [Website](https://fpsos.gg)\n• [FAQ](https://fpsos.gg/faq)\n• [Packages](https://fpsos.gg/packages)",
        inline=False
    )
    
    embed.add_field(
        name="📍 Location",
        value="Dubai, UAE\nRemote services worldwide",
        inline=False
    )
    
    embed.set_footer(text="FPSOS.gg • Professional CS2 Optimization")
    
    await interaction.response.send_message(embed=embed, ephemeral=True)

@bot.tree.command(name="info", description="About FPSOS and this bot")
async def info(interaction: discord.Interaction):
    """Bot and company info"""
    
    embed = discord.Embed(
        title="ℹ️ About FPSOS",
        description="**Frame Per Second Operating System**\n\nProfessional PC optimization specialists for competitive CS2 players.",
        color=0x680036
    )
    
    embed.add_field(
        name="🎯 Our Mission",
        value="Maximize your CS2 performance through expert system optimization and tuning",
        inline=False
    )
    
    embed.add_field(
        name="🔧 Services",
        value="Remote PC optimization, BIOS tuning, Windows configuration, and advanced tweaking",
        inline=False
    )
    
    embed.add_field(
        name="📊 Bot Stats",
        value=f"Servers: {len(bot.guilds)}\nMembers: {sum(guild.member_count for guild in bot.guilds)}\nLatency: {round(bot.latency * 1000)}ms",
        inline=False
    )
    
    embed.set_footer(text="Bot developed for FPSOS.gg • Dubai, UAE")
    
    await interaction.response.send_message(embed=embed)

# Error handling
@bot.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.CommandNotFound):
        return
    print(f"❌ Error: {error}")

# Run bot
if __name__ == "__main__":
    try:
        print("🚀 Starting FPSOS Discord Bot...")
        bot.run(TOKEN)
    except Exception as e:
        print(f"❌ Failed to start bot: {e}")
