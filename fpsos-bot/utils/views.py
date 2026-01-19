import discord
import asyncio
from utils.config import Colors, GUILD_ID, FIRECRAWL_API_KEY
from database import db
from firecrawl import FirecrawlApp
import os

firecrawl = FirecrawlApp(api_key=FIRECRAWL_API_KEY) if FIRECRAWL_API_KEY else None

# Wrapper to avoid circular imports usually, but we need these classes to reference each other
# so we define them in order or handle forward references.

class BookingView(discord.ui.View):
    def __init__(self, package_code: str):
        super().__init__(timeout=None)
        # Updated to use new FPSOS booking page instead of Calendly
        booking_url = f'https://fpsos.gg/book?package={package_code}'
        self.add_item(discord.ui.Button(label="Book Session", url=booking_url, emoji="📅"))

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

class QuickAssessmentModal(discord.ui.Modal, title="Quick Assessment"):
    gpu = discord.ui.TextInput(label="GPU Brand", placeholder="NVIDIA / AMD...")
    fps = discord.ui.TextInput(label="Current FPS", placeholder="e.g. 144")
    issue = discord.ui.TextInput(label="Main Issue", style=discord.TextStyle.paragraph)
    
    async def on_submit(self, interaction: discord.Interaction):
        # Simple recommendation
        embed = discord.Embed(title="🎯 Recommendation", description="Based on your inputs, we recommend the **Full System Tune-Up**.", color=Colors.SUCCESS)
        await interaction.response.send_message(embed=embed, view=BookingView("full"), ephemeral=True)

class DiagnosticView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="PowerShell Tool", style=discord.ButtonStyle.primary, emoji="🔬", custom_id="diag:powershell")
    async def powershell_method(self, interaction: discord.Interaction, button: discord.ui.Button):
        dm_embed = discord.Embed(title="🔬 Diagnostic Tool", description="[Download Tool](https://fpsos.gg/FPSOS-CS2-Suite.ps1)", color=Colors.FPSOS_PURPLE)
        
        try:
            await interaction.user.send(embed=dm_embed)
            await interaction.response.send_message("📥 Check your DMs!", ephemeral=True)
        except discord.Forbidden:
            await interaction.response.send_message("❌ I couldn't send you a DM. Please enable DMs for this server.", ephemeral=True)

    @discord.ui.button(label="Quick Questions", style=discord.ButtonStyle.secondary, emoji="📋", custom_id="diag:quick")
    async def quick_questions(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_modal(QuickAssessmentModal())

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

class WelcomeView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="📝 Start System Profiling", style=discord.ButtonStyle.primary, emoji="💻", custom_id="btn_profile")
    async def start_profile(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_modal(SystemProfileModal())

    @discord.ui.button(label="Book Session Directly", style=discord.ButtonStyle.secondary, emoji="📅", custom_id="btn_book_direct")
    async def book_direct(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_message(embed=discord.Embed(title="📅 Choose Package"), view=PreBookingView(), ephemeral=True)

    @discord.ui.button(label="🤖 Ask FPSOS AI", style=discord.ButtonStyle.success, emoji="🧠", custom_id="btn_ask_ai")
    async def ask_ai(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_modal(AIAskModal())

class AIAskModal(discord.ui.Modal, title="🤖 FPSOS AI Intelligence"):
    question = discord.ui.TextInput(
        label="What's your performance bottleneck?",
        style=discord.TextStyle.paragraph,
        placeholder="e.g. Consistent micro-stuttering on 1000Hz polling rate...",
        max_length=500
    )

    async def on_submit(self, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True)
        
        # 2026 Standard: Contextual Web-Augmented AI
        advice = "CS2 performance in 2026 is heavily tied to Subtick consistency and driver interrupt affinity."
        
        if firecrawl:
            try:
                # Search for latest solutions
                search = firecrawl.search(f"CS2 optimization fix {self.question.value[:60]}", limit=1)
                if search and 'data' in search and search['data']:
                    advice = search['data'][0].get('description', advice)
            except:
                pass

        embed = discord.Embed(
            title="🧠 AI Strategy Hub",
            description=f"**Query:** `{self.question.value}`\n\n**Strategic Recommendation:**\n{advice}",
            color=Colors.SUCCESS
        )
        embed.set_footer(text="Powered by FPSOS Neural Engine v4.0", icon_url="https://fpsos.gg/ico.png")
        await interaction.followup.send(embed=embed)

class TicketCloseView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="🔒 Close Ticket", style=discord.ButtonStyle.danger, custom_id="ticket:close")
    async def close_ticket(self, interaction: discord.Interaction, button: discord.ui.Button):
        # Verify valid ticket
        ticket = db.get_ticket_by_channel(interaction.channel_id)
        if not ticket:
            await interaction.response.send_message("❌ This is not an active ticket channel.", ephemeral=True)
            return
            
        # Close in DB
        db.close_ticket(ticket['id'])
        
        # Archive/Delete channel
        await interaction.response.send_message("🔒 Ticket closed. Deleting channel in 5 seconds...")
        
        # Notify user (optional)
        user = interaction.client.get_user(int(ticket['user_id']))
        if user:
            try:
                await user.send("✅ Your support ticket has been closed. If you need more help, just reply here!")
            except:
                pass

        await asyncio.sleep(5)
        await interaction.channel.delete()

    @discord.ui.button(label="🧠 AI Summarize", style=discord.ButtonStyle.secondary, emoji="📋", custom_id="ticket:ai_summary")
    async def ai_summarize(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.defer()
        
        ticket = db.get_ticket_by_channel(interaction.channel_id)
        if not ticket:
            await interaction.followup.send("❌ Error: Ticket not found.", ephemeral=True)
            return

        # Fetch diagnostic data for this user
        latest_diag = db.get_latest_diagnostic(ticket['user_id'])
        summary = "No diagnostic data found for this user."
        
        if latest_diag:
            summary = (
                f"**System:** {latest_diag.get('system_info', 'N/A')}\n"
                f"**Issues:** {latest_diag['critical_count']} Critical, {latest_diag['warning_count']} Warnings\n"
                f"**Package Recommendation:** {latest_diag['recommendation'].upper()}"
            )
            
        embed = discord.Embed(
            title="🎯 Case Brief (AI)",
            description=summary,
            color=Colors.FPSOS_ORANGE
        )
        embed.set_footer(text="Synthesized by FPSOS AI")
        await interaction.channel.send(embed=embed)

class TicketView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="📩 Open Support Ticket", style=discord.ButtonStyle.success, custom_id="ticket:open")
    async def open_ticket(self, interaction: discord.Interaction, button: discord.ui.Button):
        # Check if already has ticket
        existing = db.get_active_ticket(interaction.user.id)
        if existing:
            await interaction.response.send_message("❌ You already have an open ticket.", ephemeral=True)
            return

        # Create private channel
        # Use interaction.client to get guild
        guild = interaction.client.get_guild(int(GUILD_ID))
        if not guild:
            # Fallback if GUILD_ID is not set or bot not in guild
            if interaction.guild:
                guild = interaction.guild
            else:
                await interaction.response.send_message("❌ Error: Service guild not found.", ephemeral=True)
                return

        # Create channel
        category = discord.utils.get(guild.categories, name="Tickets") # Ensure this exists or create it
        if not category:
            category = await guild.create_category("Tickets")

        overwrites = {
            guild.default_role: discord.PermissionOverwrite(read_messages=False),
            guild.me: discord.PermissionOverwrite(read_messages=True),
            # Add admin role here if needed
        }
        
        channel = await guild.create_text_channel(f"ticket-{interaction.user.name}", category=category, overwrites=overwrites)
        
        # Register in DB
        db.create_ticket(interaction.user.id, channel.id)
        
        # Send controls to channel
        await channel.send(f"🔔 New ticket from {interaction.user.mention}", view=TicketCloseView())
        
        await interaction.response.send_message("✅ Ticket created! Please check your DMs/wait for staff.", ephemeral=True)
