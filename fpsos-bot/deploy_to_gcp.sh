#!/bin/bash
# Stop any rogue processes
sudo pkill -9 -f 'bot.py'

# Consolidate files
sudo cp -r /home/t1glish/fpsos-bot/* /home/g3ali_mohammadi/fpsos-bot/
sudo chown -R g3ali_mohammadi:g3ali_mohammadi /home/g3ali_mohammadi/fpsos-bot/

# Setup virtualenv and dependencies
cd /home/g3ali_mohammadi/fpsos-bot/
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt

# Create systemd service
cat <<EOF | sudo tee /etc/systemd/system/fpsos-bot.service
[Unit]
Description=FPSOS Discord Bot
After=network.target

[Service]
Type=simple
User=g3ali_mohammadi
WorkingDirectory=/home/g3ali_mohammadi/fpsos-bot
Environment="PATH=/home/g3ali_mohammadi/fpsos-bot/venv/bin"
ExecStart=/home/g3ali_mohammadi/fpsos-bot/venv/bin/python bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Restart service
sudo systemctl daemon-reload
sudo systemctl enable fpsos-bot
sudo systemctl restart fpsos-bot
sudo systemctl status fpsos-bot
