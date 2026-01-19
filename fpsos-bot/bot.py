# FPSOS Discord Bot - Enhanced Version
# Apple-inspired UX with Bloomberg void black theme
# Now with diagnostic JSON processing and database integration

import discord
from discord.ext import commands
import os
import json
from aiohttp import web
from database import db
from firecrawl import FirecrawlApp
import asyncio
from datetime import datetime
from utils.config import (
    TOKEN,
    APPLICATION_ID,
    GUILD_ID,
    Colors
)
from utils.views import (
    DiagnosticView,
    WelcomeView,
    PreBookingView,
    TicketView,
    TicketCloseView
)
from utils.diagnostics import handle_diagnostic_json
from commands.general import get_welcome_embed

# Bot setup with intents
intents = discord.Intents.default()
intents.message_content = True
intents.members = True
intents.guilds = True

bot = commands.Bot(command_prefix='!', intents=intents)

# Initialize Firecrawl for 2026-era web data fetching
FIRECRAWL_API_KEY = os.getenv('FIRECRAWL_API_KEY')
firecrawl = FirecrawlApp(api_key=FIRECRAWL_API_KEY) if FIRECRAWL_API_KEY else None
bot.firecrawl = firecrawl # Attach to bot instance for access in Cogs

# Web Server Setup (Control Plane)
async def handle_create_ticket(request):
    """API Endpoint: Create a ticket from the website"""
    try:
        data = await request.json()
        username = data.get('username', 'Guest')
        reason = data.get('reason', 'No reason provided')
        
        guild = bot.get_guild(int(GUILD_ID))
        if not guild:
            print(f"❌ CRITICAL: Guild {GUILD_ID} not found or bot not a member.")
            return web.json_response({'error': 'Guild not found'}, status=500)
            
        # Create Ticket Channel
        # Ideally, check for a "Tickets" category
        category = discord.utils.get(guild.categories, name="Tickets")
        if not category:
            category = await guild.create_category("Tickets")
            
        # Sanitize username for channel name
        safe_name = "".join(c for c in username if c.isalnum()).lower()[:10]
        channel_name = f"ticket-web-{safe_name}-{datetime.now().strftime('%M%S')}"
        
        overwrites = {
            guild.default_role: discord.PermissionOverwrite(read_messages=False),
            guild.me: discord.PermissionOverwrite(read_messages=True)
        }
        
        channel = await guild.create_text_channel(channel_name, category=category, overwrites=overwrites)
        
        # Post the ticket details
        embed = discord.Embed(title="🌐 Website Ticket", description=f"**User:** {username}\n**Issue:** {reason}", color=Colors.FPSOS_ORANGE)
        embed.set_footer(text="Created via fpsos.gg")
        await channel.send(embed=embed)
        
        # Log to DB (Optional but good practice)
        # db.create_ticket(username, channel.id) # user_id is guest/string here
        
        return web.json_response({'status': 'created', 'channel_id': str(channel.id), 'channel_name': channel.name})
        
    except Exception as e:
        print(f"❌ Ticket Creation Error: {e}")
        return web.json_response({'error': str(e)}, status=500)

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

        thread_name = f"Ticket: {username}"
        try:
            thread = await support_channel.create_thread(
                name=thread_name,
                auto_archive_duration=10080, # 1 week
                reason=f"Website Ticket for {username}"
            )
        except Exception as te:
            return web.json_response({'error': f'Thread creation failed: {te}'}, status=500)

        # Log in DB
        db.create_ticket(discord_id or "GUEST", str(thread.id))
        
        # Initial Message
        embed = discord.Embed(
            title="🎫 New Website Ticket",
            description=f"**User**: {username}\n**Discord ID**: {discord_id or 'Not provided'}\n\n**Issue**:\n{reason}",
            color=Colors.FPSOS_BLUE
        )
        embed.set_footer(text="Open from FPSOS Website Support Portal")
        await thread.send(embed=embed)
        
        # If user is on the server, add them to the thread
        if discord_id:
            try:
                member = guild.get_member(int(discord_id))
                if member:
                    await thread.add_user(member)
            except:
                pass # User not on server or invalid ID

        return web.json_response({'status': 'created', 'thread_id': str(thread.id), 'url': thread.jump_url})
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
    app.router.add_post('/api/create-ticket', handle_create_ticket)
    app.router.add_get('/api/status', handle_bot_status)
    
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '0.0.0.0', 8088)
    await site.start()
    print(f'🌐 Control Plane API running on http://localhost:8088')

@bot.event
async def on_ready():
    """Bot startup - sync commands and start web server"""
    print(f'━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    print(f'🎯 FPSOS Bot Online')
    print(f'━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    print(f'Bot User: {bot.user.name}')
    print(f'Bot ID: {bot.user.id}')
    print(f'Configured Guild ID: {GUILD_ID}')
    print('--- Connected Guilds ---')
    for g in bot.guilds:
        print(f'- {g.name} (ID: {g.id})')
    print('------------------------')
    
    # Load Extensions (Cogs)
    try:
        await bot.load_extension('commands.general')
        await bot.load_extension('commands.admin')
        await bot.load_extension('commands.knowledge_base')
        await bot.load_extension('commands.tickets')
        print('Loaded Cogs: General, Admin, KnowledgeBase, Tickets')
    except Exception as e:
        print(f'Failed to load cogs: {e}')

    # Start the API server
    await start_web_server()
    
    # Sync slash commands
    try:
        synced = await bot.tree.sync()
        print(f'Synced {len(synced)} command(s)')
    except Exception as e:
        print(f'Failed to sync commands: {e}')
    
    # Register persistent views
    bot.add_view(WelcomeView())
    bot.add_view(DiagnosticView())
    bot.add_view(PreBookingView())
    bot.add_view(TicketView())
    bot.add_view(TicketCloseView())
    
    # Set bot status
    try:
        guild = bot.get_guild(int(GUILD_ID))
        if guild:
             print(f"✅ Active in Guild: {guild.name}")
        else:
             print(f"❌ WARNING: Guild {GUILD_ID} not found. Some features may fail.")
    except Exception as e:
        print(f"❌ Guild Check Error: {e}")

    await bot.change_presence(
        activity=discord.Activity(
            type=discord.ActivityType.watching,
            name="CS2 Performance | /diagnostic"
        )
    )
    
    # Start the 2026-standard News Ticker
    bot.loop.create_task(cs2_news_ticker())
    
    # Start the 24/7 Heartbeat Logger
    bot.loop.create_task(uptime_heartbeat())

async def uptime_heartbeat():
    """Background task: Log a pulse every 6 hours to confirm the bot is active"""
    while not bot.is_closed():
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{now}] HEARTBEAT: Bot is active and responsive.")
        await asyncio.sleep(21600) # 6 hours

@bot.tree.error
async def on_app_command_error(interaction: discord.Interaction, error: discord.app_commands.AppCommandError):
    """Global Slash Command Error Handler"""
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"[{now}] SLASH ERROR: {error}")
    
    if interaction.response.is_done():
        await interaction.followup.send(
            f"⚠️ **Internal Error**: {error}\nPlease try again or contact support.", 
            ephemeral=True
        )
    else:
        await interaction.response.send_message(
            f"⚠️ **Internal Error**: {error}\nPlease try again or contact support.", 
            ephemeral=True
        )

@bot.event
async def on_error(event_method, *args, **kwargs):
    """Global Event Error Handler (e.g., on_message, on_ready)"""
    import traceback
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"[{now}] EVENT ERROR in {event_method}:")
    traceback.print_exc()

async def cs2_news_ticker():
    """Background task: Periodically fetch CS2 news via Firecrawl"""
    if not firecrawl:
        print("⚠️ Firecrawl API key missing. News ticker disabled.")
        return

    print("📡 Starting 2026 CS2 News Ticker...")
    channel_id = os.getenv('NEWS_CHANNEL_ID')
    
    while not bot.is_closed():
        try:
            # Industry Standard: Fetching structured patch notes via Firecrawl
            search_result = await asyncio.to_thread(firecrawl.search, "latest CS2 patch notes and official updates", limit=1)
            
            if search_result and 'data' in search_result and search_result['data']:
                latest = search_result['data'][0]
                url = latest.get('url', '')
                title = latest.get('title', 'CS2 Update')
                description = latest.get('description', '')
                
                # Check if we've already posted this (in a production environment we'd store this in DB)
                # For this demo, let's just log it or post it to a specific channel if configured
                if channel_id:
                    channel = bot.get_channel(int(channel_id))
                    if channel:
                        embed = discord.Embed(
                            title=f"🔔 {title}",
                            url=url,
                            description=description,
                            color=Colors.SUCCESS
                        )
                        embed.set_author(name="CS2 Official Intelligence", icon_url="https://www.counter-strike.net/favicon.ico")
                        embed.set_footer(text=f"Fetched via Firecrawl AI • {datetime.now().strftime('%Y-%m-%d %H:%M')}")
                        await channel.send(embed=embed)
            
            # Check every 6 hours
            await asyncio.sleep(21600)
        except Exception as e:
            print(f"News Ticker Error: {e}")
            await asyncio.sleep(3600) # Wait an hour before retrying on error

@bot.event
async def on_member_join(member: discord.Member):
    """Welcome new members with smooth onboarding flow"""
    print(f"DEBUG: Member joined: {member.name}")
    
    # Save user to database
    db.add_user(member.id, member.name)
    print(f"Saved user to database: {member.name}")
    
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

    content = message.content.strip()
    clean_content = content.lower()
    
    # 0. HANDLE TAGS SHORTCUT (Use ? prefix, e.g. ?bios)
    if content.startswith('?'):
        tag_name = clean_content[1:].strip() # remove '?'
        if tag_name:
            tag = db.get_tag(tag_name)
            if tag:
                embed = discord.Embed(description=tag['content'], color=Colors.FPSOS_BLUE)
                embed.set_footer(text=f"Requested by {message.author.name} • ?{tag['name']}")
                await message.channel.send(embed=embed)
                return
    
    # 1. ADMIN REPLYING IN TICKET CHANNEL
    if isinstance(message.channel, discord.TextChannel) and message.channel.name.startswith('ticket-'):
        ticket = db.get_ticket_by_channel(message.channel.id)
        if ticket:
            user = bot.get_user(int(ticket['user_id']))
            if user:
                try:
                    # Forward to user
                    embed = discord.Embed(description=content, color=Colors.FPSOS_ORANGE)
                    embed.set_author(name=f"Staff: {message.author.name}", icon_url=message.author.display_avatar.url)
                    await user.send(embed=embed)
                    await message.add_reaction("✅")
                except Exception as e:
                    await message.channel.send(f"❌ Failed to reach user: {e}")
            return

    # 2. USER MESSAGING BOT (DM)
    if isinstance(message.channel, discord.DMChannel):
        # PRIORITY: Check for JSON file uploads (diagnostic results)
        if message.attachments:
            for attachment in message.attachments:
                if attachment.filename.endswith('.json'):
                    await handle_diagnostic_json(message, attachment)
                    return

        # Check for active ticket
        active_ticket = db.get_active_ticket(message.author.id)
        
        if active_ticket:
            # Forward to admin channel
            guild = bot.get_guild(int(GUILD_ID))
            if guild:
                channel = guild.get_channel(int(active_ticket['channel_id']))
                if channel:
                    embed = discord.Embed(description=content, color=Colors.FPSOS_BLUE)
                    embed.set_author(name=message.author.name, icon_url=message.author.display_avatar.url)
                    if message.attachments:
                        embed.set_image(url=message.attachments[0].url)
                        
                    await channel.send(embed=embed)
                    await message.add_reaction("📨")
                    return
        
        # Greetings (Only if no ticket)
        if clean_content in ["hi", "hello", "hey", "hello bot", "yo"]:
            async with message.channel.typing():
                embed = discord.Embed(
                    title="👋 Hello! I'm the FPSOS Assistant",
                    description=f"Hey {message.author.mention}! How can I assist you today?\n\nI specialize in **CS2 System Optimization**.",
                    color=Colors.FPSOS_BLUE
                )
                await message.reply(embed=embed, view=WelcomeView())
                return

        # Booking intent
        if any(word in clean_content for word in ["book", "session", "schedule", "calendar", "appointment", "packages", "pricing"]):
            async with message.channel.typing():
                embed = discord.Embed(
                    title="📅 Schedule Your Optimization",
                    description="Before you book, let's check which package is best for your system.",
                    color=Colors.FPSOS_PURPLE
                )
                await message.reply(embed=embed, view=PreBookingView())
                return
    
    await bot.process_commands(message)

# Run
if __name__ == '__main__':
    bot.run(TOKEN)