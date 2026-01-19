import discord
from discord import app_commands
from discord.ext import commands
from utils.config import Colors
from database import db

class TicketSystem(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    ticket_group = app_commands.Group(name="ticket", description="Manage support tickets")

    @ticket_group.command(name="close", description="Close the current ticket")
    async def close_ticket(self, interaction: discord.Interaction):
        # 1. Check if channel is a ticket channel
        ticket = db.get_ticket_by_channel(interaction.channel_id)
        if not ticket:
            await interaction.response.send_message("❌ This is not an active ticket channel.", ephemeral=True)
            return

        # 2. Confirm closure
        # For simplicity, we just close it. In a robust system, we'd ask for confirmation or reason.
        
        await interaction.response.send_message("🔒 Closing ticket in 5 seconds...")
        
        # 3. Update DB
        db.close_ticket(ticket['id'])
        
        # 4. Delete Channel (with a delay usually, but here immediate for simplicity)
        import asyncio
        await asyncio.sleep(5)
        await interaction.channel.delete(reason=f"Ticket closed by {interaction.user.name}")

    @ticket_group.command(name="add_user", description="Add a user to this ticket")
    async def add_user(self, interaction: discord.Interaction, member: discord.Member):
        ticket = db.get_ticket_by_channel(interaction.channel_id)
        if not ticket:
             await interaction.response.send_message("❌ This is not an active ticket channel.", ephemeral=True)
             return
             
        # Add overwrite
        await interaction.channel.set_permissions(member, read_messages=True, send_messages=True)
        await interaction.response.send_message(f"✅ Added {member.mention} to the ticket.")

async def setup(bot):
    await bot.add_cog(TicketSystem(bot))
