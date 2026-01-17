import discord
from discord.ext import commands
import os
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('DISCORD_BOT_TOKEN')

intents = discord.Intents.default()
intents.message_content = True
intents.members = True
bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'✅ Bot {bot.user} is online!')
    try:
        synced = await bot.tree.sync()
        print(f'🔄 Synced {len(synced)} commands')
    except Exception as e:
        print(f'❌ Error: {e}')

@bot.tree.command(name="ping", description="Check bot status")
async def ping(interaction: discord.Interaction):
    await interaction.response.send_message('🏓 Pong!')

bot.run(TOKEN)
