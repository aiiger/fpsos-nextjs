import discord
from discord import app_commands
from discord.ext import commands
from utils.config import Colors
from database import db

class KnowledgeBase(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    tag_group = app_commands.Group(name="tag", description="Manage and retrieve knowledge base tags")

    @tag_group.command(name="get", description="Retrieve a tag by name")
    @app_commands.describe(name="The name of the tag")
    async def get_tag(self, interaction: discord.Interaction, name: str):
        tag = db.get_tag(name)
        if not tag:
            # Fuzzy search
            all_tags = db.get_all_tags()
            matches = [t for t in all_tags if name.lower() in t.lower()]
            hint = f"\nDid you mean: {', '.join(matches[:3])}?" if matches else ""
            await interaction.response.send_message(f"❌ Tag `{name}` not found.{hint}", ephemeral=True)
            return
            
        embed = discord.Embed(title=f"🏷️ {tag['name'].title()}", description=tag['content'], color=Colors.FPSOS_BLUE)
        embed.set_footer(text=f"Requested by {interaction.user.name}")
        await interaction.response.send_message(embed=embed)

    @tag_group.command(name="add", description="Create or update a tag (Admin only)")
    @app_commands.describe(name="Tag name", content="Content of the tag")
    async def add_tag(self, interaction: discord.Interaction, name: str, content: str):
        if not interaction.user.guild_permissions.administrator:
            await interaction.response.send_message("❌ Admin only.", ephemeral=True)
            return
            
        db.add_tag(name, content, interaction.user.id)
        await interaction.response.send_message(f"✅ Tag `{name}` saved!", ephemeral=True)

    @tag_group.command(name="delete", description="Delete a tag (Admin only)")
    @app_commands.describe(name="Tag name to delete")
    async def delete_tag(self, interaction: discord.Interaction, name: str):
        if not interaction.user.guild_permissions.administrator:
            await interaction.response.send_message("❌ Admin only.", ephemeral=True)
            return

        # Verification if tag exists
        if not db.get_tag(name):
             await interaction.response.send_message(f"❌ Tag `{name}` does not exist.", ephemeral=True)
             return

        # Direct SQL execution since db.py might not have delete_tag yet
        # We should strictly try to add this to db.py, but for now we can do a direct query if we import sqlite3 or just add a method to DB 
        # But wait, we shouldn't modify DB inside Cog. Let's assume db.py needs an update or we use a raw query safely.
        # Ideally, we update database.py. I'll stick to updating database.py in a separate step if strictly needed, 
        # but for now I'll use a direct connection hack OR better, I'll allow the error if method missing, 
        # but actually I'll update database.py in this flow too.
        
        # Checking if I can update database.py... yes I can. 
        # I'll optimistically call db.delete_tag(name) and implement it in database.py next.
        
        try:
            db.delete_tag(name) # Will implement this
            await interaction.response.send_message(f"🗑️ Tag `{name}` deleted.", ephemeral=True)
        except AttributeError:
             await interaction.response.send_message("❌ Database method `delete_tag` missing. Please update database.py.", ephemeral=True)

    @tag_group.command(name="list", description="List all available tags")
    async def list_tags(self, interaction: discord.Interaction):
        tags = db.get_all_tags()
        if not tags:
            await interaction.response.send_message("No tags found.", ephemeral=True)
            return
            
        tag_list = ", ".join([f"`{t}`" for t in tags])
        await interaction.response.send_message(f"📚 **Available Tags:**\n{tag_list}", ephemeral=True)

async def setup(bot):
    await bot.add_cog(KnowledgeBase(bot))
