# FPSOS Bot Infinite Keep-Alive Watcher
# Purpose: Ensure 24/7 uptime by monitoring the bot process and restarting on crash.

$botScript = "bot.py"
$logFile = "bot.log"
$env:PYTHONIOENCODING = "utf-8"

Write-Host "🛡️ Starting FPSOS Bot Watcher..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C and then 'Y' to stop the watcher and the bot." -ForegroundColor Yellow

while ($true) {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 🚀 Launching InputZero Bot..." -ForegroundColor Green
    
    # Kill any zombie instances before starting
    taskkill /F /IM python.exe /FI "WINDOWTITLE eq FPSOS*" 2>$null
    
    # Run the bot and wait for it to exit
    python $botScript 2>&1 | Out-File -FilePath $logFile -Encoding UTF8
    
    $exitCode = $LASTEXITCODE
    
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ⚠️ Bot exited with code $exitCode." -ForegroundColor Red
    
    if ($exitCode -eq 0) {
        Write-Host "Bot closed normally. Restarting in 5 seconds..." -ForegroundColor Gray
    }
    else {
        Write-Host "CRASH DETECTED. Restarting in 5 seconds..." -ForegroundColor Yellow
    }
    
    Start-Sleep -Seconds 5
}
