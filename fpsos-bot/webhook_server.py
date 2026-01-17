"""
Calendly Webhook Handler for FPSOS Bot
Receives booking notifications from Calendly and syncs to database
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import os
import sys
from datetime import datetime
from pathlib import Path

# Add parent directory to path so we can import database
sys.path.insert(0, str(Path(__file__).parent))
from database import db

app = FastAPI(title="FPSOS Calendly Webhook Receiver")

# Store for bot reference (will be set if running alongside bot)
discord_bot = None


def set_bot_reference(bot):
    """Set Discord bot reference for sending DMs"""
    global discord_bot
    discord_bot = bot


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "online", "service": "FPSOS Calendly Webhook"}


@app.post("/calendly")
async def calendly_webhook(request: Request):
    """
    Handle Calendly booking webhooks
    
    Webhook events:
    - invitee.created: New booking made
    - invitee.canceled: Booking canceled
    - invitee.rescheduled: Booking rescheduled
    """
    try:
        data = await request.json()
        
        event_type = data.get('event')
        payload = data.get('payload', {})
        
        print(f"📥 Received Calendly webhook: {event_type}")
        
        if event_type == 'invitee.created':
            await handle_new_booking(payload)
        elif event_type == 'invitee.canceled':
            await handle_booking_cancellation(payload)
        elif event_type == 'invitee.rescheduled':
            await handle_booking_reschedule(payload)
        else:
            print(f"⚠️ Unknown event type: {event_type}")
        
        return JSONResponse({"status": "ok", "event": event_type})
    
    except Exception as e:
        print(f"❌ Webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


async def handle_new_booking(payload):
    """Process new booking from Calendly"""
    try:
        invitee = payload.get('invitee', {})
        event = payload.get('event', {})
        
        # Extract booking details
        email = invitee.get('email')
        event_id = event.get('uri')
        event_name = event.get('name', '')
        scheduled_time = event.get('start_time')
        
        # Extract Discord ID or username from custom questions
        discord_id = None
        for qa in invitee.get('questions_and_answers', []):
            question = qa.get('question', '').lower()
            if 'discord' in question:
                answer = qa.get('answer', '').strip()
                # Try to extract Discord ID (numbers only)
                if answer.isdigit():
                    discord_id = answer
                else:
                    # Could be a username - log it for manual matching
                    print(f"⚠️ Discord username provided (not ID): {answer}")
                    discord_id = answer
        
        # Determine service type and price from event name
        event_name_lower = event_name.lower()
        if 'quick' in event_name_lower or 'remote fix' in event_name_lower:
            service_type = 'quick'
            amount_aed = 199
        elif 'extreme' in event_name_lower or 'biosprime' in event_name_lower:
            service_type = 'extreme'
            amount_aed = 699
        else:
            service_type = 'full'
            amount_aed = 399
        
        # Save to database
        booking_id = db.create_booking(
            user_id=discord_id or email,  # Use email as fallback
            service_type=service_type,
            calendly_event_id=event_id,
            scheduled_date=scheduled_time,
            amount_aed=amount_aed
        )
        
        print(f"✅ Booking created: ID {booking_id} | User: {discord_id or email} | Service: {service_type}")
        
        # Send Discord DM confirmation (if bot is running)
        if discord_bot and discord_id and discord_id.isdigit():
            try:
                user = await discord_bot.fetch_user(int(discord_id))
                await send_booking_confirmation_dm(user, service_type, scheduled_time, amount_aed)
                print(f"✅ Sent booking confirmation DM to {user.name}")
            except Exception as e:
                print(f"⚠️ Could not send DM: {e}")
        
        return booking_id
    
    except Exception as e:
        print(f"❌ Error handling new booking: {e}")
        raise


async def handle_booking_cancellation(payload):
    """Process booking cancellation"""
    try:
        event = payload.get('event', {})
        event_id = event.get('uri')
        
        # Find booking in database
        booking = db.get_booking_by_calendly_id(event_id)
        
        if booking:
            # Could mark as canceled (add a column) or delete
            print(f"⚠️ Booking canceled: {event_id}")
            # TODO: Implement cancellation logic
        else:
            print(f"⚠️ Cancellation for unknown booking: {event_id}")
    
    except Exception as e:
        print(f"❌ Error handling cancellation: {e}")


async def handle_booking_reschedule(payload):
    """Process booking reschedule"""
    try:
        event = payload.get('event', {})
        event_id = event.get('uri')
        new_time = event.get('start_time')
        
        print(f"📅 Booking rescheduled: {event_id} → {new_time}")
        # TODO: Update scheduled_date in database
    
    except Exception as e:
        print(f"❌ Error handling reschedule: {e}")


async def send_booking_confirmation_dm(user, service_type, scheduled_time, amount_aed):
    """Send booking confirmation via Discord DM"""
    import discord
    
    service_names = {
        'quick': 'Quick Remote Fix',
        'full': 'Full System Tune-Up',
        'extreme': 'Extreme BIOSPRIME'
    }
    
    formatted_time = scheduled_time.replace('T', ' ').replace('Z', ' UTC')
    
    embed = discord.Embed(
        title="✅ Booking Confirmed!",
        description=f"Your **{service_names.get(service_type, 'Optimization')}** session is scheduled!",
        color=0x30D158  # Success green
    )
    
    embed.add_field(name="📅 Session Date", value=formatted_time, inline=False)
    embed.add_field(name="💰 Price", value=f"AED {amount_aed}", inline=True)
    embed.add_field(name="⏱️ Duration", value="3-4 hours", inline=True)
    
    checklist = """
    **Before your session:**
    1. ✅ Install AnyDesk: https://anydesk.com/download
    2. ✅ Update GPU drivers to latest version
    3. ✅ Close all games and applications
    4. ✅ Join FPSOS Discord voice channel 15 minutes before
    5. ✅ Have payment ready (bank transfer or card)
    
    **What to expect:**
    • Full system diagnostic review
    • Windows and game optimizations
    • Network optimization for CS2
    • BIOS tweaks (if Extreme package)
    • Before/after performance testing
    """
    
    embed.add_field(name="📋 Pre-Session Checklist", value=checklist.strip(), inline=False)
    embed.set_footer(text="See you soon! - FPSOS Team")
    
    try:
        await user.send(embed=embed)
    except discord.Forbidden:
        print(f"⚠️ Cannot DM user {user.id} - DMs are closed")


if __name__ == '__main__':
    """
    Run standalone webhook server
    
    Usage:
        python webhook_server.py
    
    Then configure Calendly webhook to point to:
        http://YOUR_SERVER_IP:8000/calendly
    
    For local testing with ngrok:
        ngrok http 8000
        Use the ngrok URL in Calendly webhook settings
    """
    import uvicorn
    
    print("🚀 Starting FPSOS Calendly Webhook Server...")
    print("📡 Listening on http://0.0.0.0:8000")
    print("📋 Webhook endpoint: http://0.0.0.0:8000/calendly")
    print("\n💡 For local testing, use ngrok: ngrok http 8000")
    
    uvicorn.run(app, host='0.0.0.0', port=8000)
