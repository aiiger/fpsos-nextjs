import discord
from discord import app_commands
from discord.ext import commands
from utils.config import Colors
from database import db




class AdminCommands(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="setup_server", description="🛡️ Pimp up the server with elite 2026 structure (Admin Only)")
    @app_commands.describe(confirm="Set to True to execute the reorganization")
    async def setup_server(self, interaction: discord.Interaction, confirm: bool = False):
        """Automated Server Pimping"""
        if not interaction.user.guild_permissions.administrator:
            await interaction.response.send_message("❌ Admin only.", ephemeral=True)
            return

        if not confirm:
            await interaction.response.send_message(
                "⚠️ **WARNING**: This will create new categories and channels according to the FPSOS Elite structure.\n"
                "To proceed, run this command again with `confirm: True`.",
                ephemeral=True
            )
            return

        await interaction.response.send_message("🚀 **FPSOS Protocol Initiated**: Pimping up your server...", ephemeral=True)
        guild = interaction.guild

        # Define the structure
        structure = {
            "🏁 START HERE": ["welcome", "rules", "get-verified"],
            "📢 BROADCAST": ["news-ticker", "announcements", "resource-hub"],
            "🔬 OPTIMIZATION LAB": ["diagnose", "general-help", "advanced-tweaks", "gear-talk"],
            "🥇 FPSOS SERVICES": ["book-session", "success-stories", "private-tickets"],
            "🎮 COMMAND CENTER": [("🎙️ Support Lobby", "voice"), ("🎙️ The Warzone", "voice"), ("🎙️ 9800X3D Lounge", "voice")]
        }

        try:
            for cat_name, channels in structure.items():
                category = await guild.create_category(cat_name)
                for channel_info in channels:
                    if isinstance(channel_info, tuple):
                        name, type = channel_info
                        if type == "voice":
                            await guild.create_voice_channel(name, category=category)
                    else:
                        await guild.create_text_channel(channel_info, category=category)
            
            await interaction.followup.send("✅ **Server Pimping Complete**! Optimized structure deployed.", ephemeral=True)
        except Exception as e:
            await interaction.followup.send(f"❌ **Error during setup**: {e}", ephemeral=True)

    @app_commands.command(name="stats", description="View bot statistics (admin only)")
    async def stats_cmd(self, interaction: discord.Interaction):
        """View bot statistics (admin only)"""
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

    @app_commands.command(name="sync", description="Force sync slash commands (Admin only)")
    async def sync_cmd(self, interaction: discord.Interaction):
        """Force sync slash commands (Admin only)"""
        if not interaction.user.guild_permissions.administrator:
            await interaction.response.send_message("❌ Admin only.", ephemeral=True)
            return
            
        await interaction.response.defer(ephemeral=True)
        try:
            fmt = await self.bot.tree.sync()
            await interaction.followup.send(f"✅ Synced {len(fmt)} commands.")
        except Exception as e:
            await interaction.followup.send(f"❌ Error syncing: {e}")

async def setup(bot):
    await bot.add_cog(AdminCommands(bot))
