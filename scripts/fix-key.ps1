$envPath = "y:\fpsos-nextjs\.env.local"
$lines = Get-Content $envPath
foreach ($line in $lines) {
    if ($line -match "^FIREBASE_PRIVATE_KEY=") {
        $parts = $line -split "=", 2
        $val = $parts[1].Trim().Trim('"')
        Write-Host "Re-adding FIREBASE_PRIVATE_KEY..."
        # Using pure PowerShell pipe to preserve backslashes/newlines
        $val | vercel env add FIREBASE_PRIVATE_KEY production
        break
    }
}
