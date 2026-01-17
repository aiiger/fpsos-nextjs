# Deploy FPSOS Booking System & Update Bot

Write-Host "🚀 Starting Deployment Process..." -ForegroundColor Cyan

# 1. Handle Ghost File (Common Windows Issue)
if (Test-Path "app\nul") {
    Write-Host "👻 Ghost file detected. Attempting removal..." -ForegroundColor Yellow
    cmd /c "del \\?\Y:\fpsos-nextjs\app\nul"
}

# 2. Add files to Git
Write-Host "📦 Staging files..." -ForegroundColor Cyan
git add -A

# 3. Commit
Write-Host "💾 Committing changes..." -ForegroundColor Cyan
git commit -m "feat: COMPLETE booking system (PayPal + Discord + Maintenance)"

# 4. Push to GitHub
Write-Host "aaS Pushing to GitHub..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git push failed. Please authenticate if requested." -ForegroundColor Red
    Write-Host "Try running: git push origin main" -ForegroundColor Yellow
    exit
}

# 5. SSH and Update Bot
Write-Host "🤖 Connecting to Google Cloud to update bot..." -ForegroundColor Cyan
Write-Host "NOTE: If this asks for a password, just press Enter." -ForegroundColor Yellow

# SSH command to pull and restart
# Upload bot files (Bypassing git to fix "dirty repo" issues)
Write-Host "📤 Uploading bot files via SCP..." -ForegroundColor Cyan
gcloud compute scp --recurse fpsos-bot fpsos-bot:~/ --zone=us-central1-a

# Restart service
Write-Host "🔄 Restarting bot service..." -ForegroundColor Cyan
$remoteCommand = "cd fpsos-bot && source venv/bin/activate 2>/dev/null || (python3 -m venv venv && source venv/bin/activate) && pip install -r requirements.txt && sudo systemctl restart fpsos-bot"

gcloud compute ssh fpsos-bot --zone=us-central1-a --command="$remoteCommand"

Write-Host "✨ Deployment Complete! Check https://fpsos.gg" -ForegroundColor Green
