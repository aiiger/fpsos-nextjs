$envPath = "y:\fpsos-nextjs\.env.local"
$lines = Get-Content $envPath
foreach ($line in $lines) {
    if ($line.Trim().StartsWith("#") -or $line.Trim() -eq "") { continue }
    $parts = $line -split "=", 2
    if ($parts.Count -eq 2) {
        $key = $parts[0].Trim()
        
        # Skip existing Turso vars to avoid interactive prompts
        if ($key -like "TURSO_*") { continue }
        
        $val = $parts[1].Trim().Trim('"')
        
        Write-Host "Adding $key..."
        # Use simple echo pipe logic which works in these terminals
        cmd /c "echo $val| vercel env add $key production"
    }
}
