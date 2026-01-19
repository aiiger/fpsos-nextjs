import json
import discord
from utils.config import Colors
from utils.views import BookingView, DiagnosticView
from database import db

async def handle_diagnostic_json(message, attachment):
    """
    Process diagnostic JSON file upload
    Analyzes JSON and recommends a package
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
