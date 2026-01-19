import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Bot configuration
TOKEN = os.getenv('DISCORD_BOT_TOKEN')
APPLICATION_ID = os.getenv('DISCORD_APPLICATION_ID')
GUILD_ID = os.getenv('DISCORD_GUILD_ID')
FIRECRAWL_API_KEY = os.getenv('FIRECRAWL_API_KEY')
NEWS_CHANNEL_ID = os.getenv('NEWS_CHANNEL_ID')

# 2026 Industry Standard Palette (Vibrant, Premium, Apple/Bloomberg inspired)
class Colors:
    FPSOS_PURPLE = 0x680036
    FPSOS_ORANGE = 0xE89900
    FPSOS_BLUE = 0x007AFF   # Modern iOS Blue
    SUCCESS = 0x00FF90      # Electric Neon Green
    WARNING = 0xFFD600      # High-Viz Yellow
    ERROR = 0xFF1744        # Radical Red
    VOID_BLACK = 0x010101   # Absolute OLED Black
    NEON_WHITE = 0xF8F8F8   # Premium High-Contrast White
