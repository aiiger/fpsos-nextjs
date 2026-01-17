# Mock verification for FPSOS Bot Embeds
import sys
import os

# Add bot directory to path
sys.path.append(r'y:\fpsos-nextjs\fpsos-bot')

try:
    from bot import get_resources_embed, Colors
    import discord

    print("--- Testing get_resources_embed ---")
    embed = get_resources_embed()
    
    print(f"Title: {embed.title}")
    print(f"Color: {hex(embed.color.value)}")
    print(f"Description: {embed.description}")
    
    for field in embed.fields:
        print(f"Field Name: {field.name}")
        print(f"Field Value: {field.value}")
        print("-" * 10)
    
    print("✅ Embed generation successful!")

except ImportError as e:
    print(f"❌ Import error: {e}")
except Exception as e:
    print(f"❌ Error during verification: {e}")
