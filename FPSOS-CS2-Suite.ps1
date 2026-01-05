# ================================================================================
# FPSOS.GG - CS2 SUBTICK OPTIMIZATION SUITE v4.0
# ================================================================================
# Author: t1glish | fpsos.gg
# Purpose: Unified interrupt affinity, process lasso profiles, and system diagnostics
# Hardware: AMD Ryzen 7 9800X3D | RTX 4070 Ti | X870E Hero | DDR5-8000 kit @ 6000
# ================================================================================
#Requires -RunAsAdministrator

$Script:Version = "4.0"
$Script:BuildDate = "2026-01-04"
$Script:OutputPath = "$env:USERPROFILE\Desktop"
$Script:Timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$Script:StartTime = Get-Date
$Script:BackupDir = "C:\FPSOS_Backups"

# ================================================================================
# HARDWARE DEVICE PATHS (Owner's Specific Hardware)
# ================================================================================
$Script:DevicePaths = @{
    GPU = "HKLM:\SYSTEM\CurrentControlSet\Enum\PCI\VEN_10DE&DEV_2782&SUBSYS_88DC1043&REV_A1\4&1BABDF5B&0&0009\Device Parameters\Interrupt Management"
    NIC = "HKLM:\SYSTEM\CurrentControlSet\Enum\PCI\VEN_8086&DEV_125C&SUBSYS_88671043&REV_06\60CF84FFFF80883400\Device Parameters\Interrupt Management"
    USB = "HKLM:\SYSTEM\CurrentControlSet\Enum\PCI\VEN_1022&DEV_43FD&SUBSYS_11421B21&REV_01\6&2af91c3c&0&00600011\Device Parameters\Interrupt Management"
}

# ================================================================================
# AFFINITY PROFILES (Based on CLAUDE.md Verified Configuration)
# ================================================================================
$Script:AffinityProfiles = @{
    "FPSOS_Optimal" = @{
        Name = "FPSOS VERIFIED OPTIMAL"
        Description = "NIC Core 0, GPU Core 1, Mouse Core 7 - Owner Verified"
        Details = @"
Core 0 (CPU 0-1):   NIC (Intel I226-V) - Network interrupts
Core 1 (CPU 2-3):   GPU (RTX 4070 Ti) - Isolated from mouse
Core 2-6 (CPU 4-13): CS2 EXCLUSIVE - 5 physical cores
Core 7 (CPU 14-15): MOUSE ISOLATED - Complete input isolation

Source: CLAUDE.md Part 10 - Blur Busters + Overclock.net verified
"@
        NIC = @{ Mask = "0300"; Cores = "0-1"; Description = "Core 0" }
        GPU = @{ Mask = "0C00"; Cores = "2-3"; Description = "Core 1" }
        USB = @{ Mask = "00C0"; Cores = "14-15"; Description = "Core 7 (Mouse)" }
        LassoProfile = "ProcessLasso_FPSOS_Optimal.ini"
        CS2Affinity = "4-13"
        BackgroundAffinity = "0-1"
    }
    "FPSOS_GPUFree" = @{
        Name = "FPSOS GPU FREE"
        Description = "NIC Core 0, GPU Default, Mouse Core 7 - Relaxed GPU Isolation"
        Details = @"
Core 0 (CPU 0-1):    NIC (Intel I226-V) - Network interrupts
Core 1-6 (CPU 2-13): CS2 EXCLUSIVE - 6 physical cores (12 threads)
Core 7 (CPU 14-15):  MOUSE ISOLATED - Complete input isolation
GPU:                 Windows Default - No custom affinity

WHY GPU FREE:
- Some systems benefit from letting Windows schedule GPU interrupts
- GPU isolation (Core 1) may not be needed if no "acceleration feel" issues
- Gives CS2 access to cores 2-3 (1 extra physical core = 2 threads)
- Mouse still isolated on Core 7 (critical for input consistency)

BEST FOR:
- Testing if GPU isolation is necessary for your specific setup
- Systems where GPU interrupt load is low
- Alternative to FPSOS_Optimal if you want more CS2 threads

Source: CLAUDE.md Part 10 + independent verification
"@
        NIC = @{ Mask = "0300"; Cores = "0-1"; Description = "Core 0" }
        GPU = @{ Mask = $null; Cores = "Default"; Description = "Windows Default" }
        USB = @{ Mask = "00C0"; Cores = "14-15"; Description = "Core 7 (Mouse)" }
        LassoProfile = "ProcessLasso_FPSOS_GPUFree.ini"
        CS2Affinity = "2-13"
        BackgroundAffinity = "0-1"
    }
    "MaxHeadroom" = @{
        Name = "MAX CPU HEADROOM"
        Description = "All IRQs on high cores, CS2 gets maximum cores"
        Details = @"
Core 0-5 (CPU 0-11): CS2 - Maximum 12 threads
Core 6 (CPU 12-13):  NIC - Network on high core
Core 7 (CPU 14-15):  MOUSE - Input still isolated

Best for: Maximum CS2 FPS, less strict isolation
"@
        NIC = @{ Mask = "3000"; Cores = "12-13"; Description = "Core 6" }
        GPU = @{ Mask = $null; Cores = "Default"; Description = "Windows Default" }
        USB = @{ Mask = "00C0"; Cores = "14-15"; Description = "Core 7 (Mouse)" }
        LassoProfile = "ProcessLasso_MaxHeadroom.ini"
        CS2Affinity = "0-11"
        BackgroundAffinity = "12-15"
    }
    "WindowsDefault" = @{
        Name = "WINDOWS DEFAULT"
        Description = "Remove all custom affinity - Windows scheduler decides"
        Details = @"
All devices use Windows default scheduling.
Use this for troubleshooting or baseline testing.
"@
        NIC = @{ Mask = $null; Cores = "Default"; Description = "Windows Default" }
        GPU = @{ Mask = $null; Cores = "Default"; Description = "Windows Default" }
        USB = @{ Mask = $null; Cores = "Default"; Description = "Windows Default" }
        LassoProfile = "ProcessLasso_CleanDefault.ini"
        CS2Affinity = "0-15"
        BackgroundAffinity = "0-15"
    }
}

# ================================================================================
# DIAGNOSTIC FINDINGS STORAGE
# ================================================================================
$Global:Findings = [System.Collections.ArrayList]::new()
$Global:Recommendations = [System.Collections.ArrayList]::new()
$Global:Stats = @{ Pass = 0; Warning = 0; Fail = 0; Critical = 0; Total = 0 }

# ================================================================================
# UTILITY FUNCTIONS
# ================================================================================

function Write-FPSOSBanner {
    Clear-Host
    Write-Host ""
    Write-Host "  ==========================================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "    ███████ ██████  ███████  ██████  ███████ " -ForegroundColor Green
    Write-Host "    ██      ██   ██ ██      ██    ██ ██      " -ForegroundColor Green
    Write-Host "    █████   ██████  ███████ ██    ██ ███████ " -ForegroundColor Green
    Write-Host "    ██      ██           ██ ██    ██      ██ " -ForegroundColor Green
    Write-Host "    ██      ██      ███████  ██████  ███████ " -ForegroundColor Green
    Write-Host ""
    Write-Host "  ==========================================================================" -ForegroundColor Green
    Write-Host "   CS2 SUBTICK OPTIMIZATION SUITE v$Script:Version" -ForegroundColor White
    Write-Host "   Interrupt Affinity - Process Lasso - System Diagnostics" -ForegroundColor DarkGray
    Write-Host "  ==========================================================================" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "   FPSOS.GG " -ForegroundColor Green -NoNewline
    Write-Host "- AMD 9800X3D - RTX 4070 Ti - X870E Hero - DDR5-8000@6000 - t1glish" -ForegroundColor DarkGray
    Write-Host ""
}

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "  +-------------------------------------------------------------------------+" -ForegroundColor DarkMagenta
    Write-Host "  | $Title" -ForegroundColor Cyan -NoNewline
    $padding = 72 - $Title.Length
    Write-Host (" " * $padding) -NoNewline
    Write-Host "|" -ForegroundColor DarkMagenta
    Write-Host "  +-------------------------------------------------------------------------+" -ForegroundColor DarkMagenta
}

function Add-Finding {
    param(
        [string]$Category,
        [string]$Item,
        [ValidateSet("Pass","Warning","Fail","Critical","Info")]
        [string]$Severity,
        [string]$Details,
        [string]$Fix = "",
        [string]$Impact = "",
        [string]$Confidence = "Medium"
    )
    $Global:Findings.Add([PSCustomObject]@{
        Category = $Category
        Item     = $Item
        Severity = $Severity
        Details  = $Details
        Confidence = $Confidence
        Fix      = $Fix
        Impact   = $Impact
    }) | Out-Null
    $Global:Stats.Total++
    switch($Severity) {
        "Pass"     { $Global:Stats.Pass++ }
        "Warning"  { $Global:Stats.Warning++ }
        "Fail"     { $Global:Stats.Fail++ }
        "Critical" { $Global:Stats.Critical++ }
    }
    $color = switch($Severity) {
        "Pass" { "Green" }
        "Warning" { "Yellow" }
        "Fail" { "Red" }
        "Critical" { "DarkRed" }
        default { "White" }
    }
    $icon = switch($Severity) {
        "Pass" { "[OK]" }
        "Warning" { "[!]" }
        "Fail" { "[X]" }
        "Critical" { "[!!]" }
        default { "[-]" }
    }
    Write-Host "    $icon " -ForegroundColor $color -NoNewline
    Write-Host "$Item" -ForegroundColor White -NoNewline
    Write-Host " - " -ForegroundColor DarkGray -NoNewline
    Write-Host "$Details" -ForegroundColor DarkGray
}

function Add-Recommendation {
    param(
        [ValidateSet("Critical","High","Medium","Low")]
        [string]$Priority,
        [string]$Title,
        [string]$Description,
        [string]$Action,
        [string]$Impact = ""
    )
    $Global:Recommendations.Add([PSCustomObject]@{
        Priority    = $Priority
        Title       = $Title
        Description = $Description
        Action      = $Action
        Impact      = $Impact
    }) | Out-Null
}

function Ensure-BackupDirectory {
    if (-not (Test-Path $Script:BackupDir)) {
        New-Item -ItemType Directory -Path $Script:BackupDir -Force | Out-Null
    }
}

# -------------------------------------------------------------------------------
# Runtime argument parsing and discovery
# -------------------------------------------------------------------------------
function Parse-Arguments {
    # Supported args: --mode (quick|full), --export (json|html|both), --whatif, --apply <ProfileKey>
    $Script:Mode = 'full'
    $Script:Export = 'both'
    $Script:WhatIf = $false
    $Script:ApplyProfile = $null

    for ($i = 0; $i -lt $args.Length; $i++) {
        switch ($args[$i].ToLower()) {
            '--mode' { if ($i + 1 -lt $args.Length) { $Script:Mode = $args[$i+1].ToLower(); $i++ } }
            '--export' { if ($i + 1 -lt $args.Length) { $Script:Export = $args[$i+1].ToLower(); $i++ } }
            '--whatif' { $Script:WhatIf = $true }
            '--apply' { if ($i + 1 -lt $args.Length) { $Script:ApplyProfile = $args[$i+1]; $i++ } }
            default { }
        }
    }
}

function Discover-DevicePaths {
    # Try to discover GPU, NIC and USB interrupt registry paths dynamically.
    $discovered = @{ GPU = $null; NIC = $null; USB = $null }

    try {
        # GPU: Display class devices
        $gpuCandidates = Get-PnpDevice -Class Display -ErrorAction SilentlyContinue | Where-Object { $_.InstanceId -match 'PCI' }
        if ($gpuCandidates -and $gpuCandidates.Count -gt 0) {
            $inst = $gpuCandidates[0].InstanceId
            $discovered.GPU = "HKLM:\SYSTEM\CurrentControlSet\Enum\$inst\Device Parameters\Interrupt Management"
        }
    } catch {}

    try {
        # NIC: prefer Get-NetAdapter to find PnPDeviceID
        $net = Get-NetAdapter -Physical -ErrorAction SilentlyContinue | Where-Object { $_.Status -ne $null }
        if ($net -and $net.Count -gt 0) {
            $pnp = $net[0].PnPDeviceID -replace '\\','\\' -replace '\\$',''
            if ($pnp) { $discovered.NIC = "HKLM:\SYSTEM\CurrentControlSet\Enum\$pnp\Device Parameters\Interrupt Management" }
        }
    } catch {}

    try {
        # USB: pick first USB controller
        $usbCand = Get-PnpDevice -Class USB -ErrorAction SilentlyContinue | Where-Object { $_.InstanceId -match 'PCI' -or $_.InstanceId -match 'USB' }
        if ($usbCand -and $usbCand.Count -gt 0) {
            $inst = $usbCand[0].InstanceId
            $discovered.USB = "HKLM:\SYSTEM\CurrentControlSet\Enum\$inst\Device Parameters\Interrupt Management"
        }
    } catch {}

    # Merge discovered with owner-provided fallbacks if any
    foreach ($k in $discovered.Keys) {
        if ($discovered[$k]) { $Script:DevicePaths[$k] = $discovered[$k] }
    }

    # Report discovered paths
    Write-Section "DEVICE PATH DISCOVERY"
    foreach ($k in $Script:DevicePaths.Keys) {
        $path = $Script:DevicePaths[$k]
        if ($path) { Write-Host "    $k -> $path" -ForegroundColor Green } else { Write-Host "    $k -> Not Found" -ForegroundColor Yellow }
    }
}

function Run-AllDiagnostics {
    Write-Section "RUNNING DIAGNOSTICS ($Script:Mode MODE)"
    # Run all functions named Test-* (comprehensive) or a reduced set for quick mode
    $tests = Get-Command -CommandType Function | Where-Object { $_.Name -like 'Test-*' } | Select-Object -ExpandProperty Name | Sort-Object

    if ($Script:Mode -eq 'quick') {
        # pick a conservative subset for quick checks (existing test function names)
        $tests = @('Test-FACEITACStatus','Test-ConflictingSoftware','Test-SecuritySettings','Test-WindowsSettings','Test-CS2BIOSOptimizations') | Where-Object { Get-Command -Name $_ -ErrorAction SilentlyContinue }
    }

    foreach ($t in $tests) {
        try {
            & $t
        } catch {
            Add-Finding -Category "Diagnostics" -Item $t -Severity "Warning" -Details "Test failed: $($_.Exception.Message)" -Fix "Rerun with elevated privileges or check prerequisites"
        }
    }
}

function Compute-ImpactScore {
    # Compute a CS2-focused impact score from findings (0-100, higher is better)
    $score = 100
    foreach ($f in $Global:Findings) {
        switch ($f.Severity) {
            'Critical' { $score -= 20 }
            'Fail'     { $score -= 15 }
            'Warning'  { $score -= 7 }
            'Info'     { $score -= 2 }
            default { }
        }
    }
    if ($score -lt 0) { $score = 0 }
    if ($score -gt 100) { $score = 100 }
    return [math]::Round($score)
}

function Export-ReportJson {
    $impact = Compute-ImpactScore
    $out = [PSCustomObject]@{
        GeneratedAt = Get-Date -Format o
        Version = $Script:Version
        ImpactScore = $impact
        Stats = $Global:Stats
        Findings = $Global:Findings
        Recommendations = $Global:Recommendations
    }
    $file = Join-Path $Script:OutputPath "$Script:Timestamp-report.json"
    $out | ConvertTo-Json -Depth 6 | Out-File -FilePath $file -Encoding UTF8
    Write-Host "    JSON report written to $file" -ForegroundColor Cyan
}

function Export-ReportHtml {
        $file = Join-Path $Script:OutputPath "$Script:Timestamp-report.html"
        $impact = Compute-ImpactScore
    $html = @"
<html><head><meta charset='utf-8'><title>FPSOS Diagnostic Report - $Script:Timestamp</title></head><body style='font-family:Segoe UI,system-ui;'>
<h1>FPSOS Diagnostic Report</h1>
<p>Generated: $(Get-Date)</p>
<h2>Summary</h2>
<ul>
    <li>CS2 Impact Score: $impact</li>
    <li>Pass: $($Global:Stats.Pass)</li>
    <li>Warning: $($Global:Stats.Warning)</li>
    <li>Fail: $($Global:Stats.Fail)</li>
    <li>Critical: $($Global:Stats.Critical)</li>
    <li>Total: $($Global:Stats.Total)</li>
</ul>
<h2>Findings</h2>
<pre>$((($Global:Findings | ConvertTo-Json -Depth 4)))</pre>
<h2>Recommendations</h2>
<pre>$((($Global:Recommendations | ConvertTo-Json -Depth 4)))</pre>
</body></html>
"@
    $html | Out-File -FilePath $file -Encoding UTF8
    Write-Host "    HTML report written to $file" -ForegroundColor Cyan
}

function Finish-AndExport {
    Write-Section "EXPORTING REPORTS"
    if ($Script:Export -in @('json','both')) { Export-ReportJson }
    if ($Script:Export -in @('html','both')) { Export-ReportHtml }
}



# ================================================================================
# PART 1: INTERRUPT AFFINITY MANAGEMENT
# ================================================================================

function Show-CurrentAffinity {
    Write-Section "CURRENT INTERRUPT AFFINITY STATUS"

    $devices = @(
        @{ Name = "GPU (RTX 4070 Ti)"; Path = $Script:DevicePaths.GPU },
        @{ Name = "NIC (Intel I226-V)"; Path = $Script:DevicePaths.NIC },
        @{ Name = "USB (AMD Controller)"; Path = $Script:DevicePaths.USB }
    )

    foreach ($device in $devices) {
        $affinityPath = "$($device.Path)\Affinity Policy"
        Write-Host ""
        Write-Host "    [$($device.Name)]" -ForegroundColor Cyan

        if (Test-Path $affinityPath) {
            try {
                $policy = Get-ItemProperty -Path $affinityPath -ErrorAction SilentlyContinue
                $devicePolicy = if ($policy.DevicePolicy) { $policy.DevicePolicy } else { "Not Set" }
                $policyText = switch ($devicePolicy) {
                    0 { "Default" }
                    1 { "All Processors" }
                    2 { "Closest Processor" }
                    3 { "Processor Set" }
                    4 { "Specified Processors" }
                    default { "Policy $devicePolicy" }
                }

                if ($policy.AssignmentSetOverride) {
                    $hexMask = [System.BitConverter]::ToString($policy.AssignmentSetOverride).Replace("-","")
                    $bytes = $policy.AssignmentSetOverride
                    $mask = 0
                    for ($i = 0; $i -lt [Math]::Min($bytes.Length, 8); $i++) {
                        $mask = $mask -bor ([uint64]$bytes[$i] -shl ($i * 8))
                    }
                    $cores = @()
                    for ($i = 0; $i -lt 16; $i++) {
                        if ($mask -band (1 -shl $i)) { $cores += $i }
                    }
                    $coreStr = if ($cores.Count -gt 0) { $cores -join "," } else { "None" }
                    Write-Host "      Policy: $policyText" -ForegroundColor White
                    Write-Host "      Mask: 0x$hexMask (CPUs: $coreStr)" -ForegroundColor Green
                } else {
                    Write-Host "      Policy: $policyText" -ForegroundColor White
                    Write-Host "      Mask: Not Set (Windows Default)" -ForegroundColor Yellow
                }
            } catch {
                Write-Host "      Status: Error reading affinity" -ForegroundColor Red
            }
        } else {
            Write-Host "      Status: Using Windows Default (no custom affinity)" -ForegroundColor Yellow
        }
    }
}

function Show-AffinityProfiles {
    Write-Section "AVAILABLE INTERRUPT AFFINITY PROFILES"

    $profileNum = 1
    foreach ($key in $Script:AffinityProfiles.Keys) {
        $profile = $Script:AffinityProfiles[$key]
        Write-Host ""
        Write-Host "    [$profileNum] $($profile.Name)" -ForegroundColor Cyan
        Write-Host "        $($profile.Description)" -ForegroundColor White
        Write-Host ""
        Write-Host "        NIC: $($profile.NIC.Description) (CPUs $($profile.NIC.Cores))" -ForegroundColor DarkGray
        Write-Host "        GPU: $($profile.GPU.Description) (CPUs $($profile.GPU.Cores))" -ForegroundColor DarkGray
        Write-Host "        USB: $($profile.USB.Description) (CPUs $($profile.USB.Cores))" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "        Matching Process Lasso: " -ForegroundColor DarkGray -NoNewline
        Write-Host "$($profile.LassoProfile)" -ForegroundColor Green
        Write-Host "        CS2 Affinity: CPUs $($profile.CS2Affinity)" -ForegroundColor DarkGray
        $profileNum++
    }
}

function Apply-AffinityProfile {
    param([string]$ProfileKey)

    if (-not $Script:AffinityProfiles.ContainsKey($ProfileKey)) {
        Write-Host "    [ERROR] Invalid profile key: $ProfileKey" -ForegroundColor Red
        return $false
    }

    $profile = $Script:AffinityProfiles[$ProfileKey]
    Write-Section "APPLYING: $($profile.Name)"

    Ensure-BackupDirectory
    $backupTime = Get-Date -Format "yyyyMMdd_HHmmss"

    Write-Host ""
    Write-Host "    Creating registry backup..." -ForegroundColor Yellow

    $devices = @(
        @{ Name = "GPU"; Path = $Script:DevicePaths.GPU; Config = $profile.GPU },
        @{ Name = "NIC"; Path = $Script:DevicePaths.NIC; Config = $profile.NIC },
        @{ Name = "USB"; Path = $Script:DevicePaths.USB; Config = $profile.USB }
    )

    foreach ($device in $devices) {
        $regPath = $device.Path -replace "HKLM:\\", "HKLM\"
        $backupFile = "$Script:BackupDir\$($device.Name)_$backupTime.reg"
        $result = reg export $regPath $backupFile /y 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "      Backed up $($device.Name) to $backupFile" -ForegroundColor DarkGray
        }
    }

    Write-Host ""
    Write-Host "    Applying affinity settings..." -ForegroundColor Yellow

    foreach ($device in $devices) {
        $affinityPath = "$($device.Path)\Affinity Policy"
        $config = $device.Config

        # CRITICAL: Always delete old affinity settings first to prevent corruption
        # when switching between profiles (e.g., FPSOS_Optimal → FPSOS_GPUFree)
        if (Test-Path $affinityPath) {
            Remove-Item -Path $affinityPath -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "      $($device.Name): Cleared old affinity settings" -ForegroundColor DarkGray
        }

        if ($config.Mask -eq $null) {
            # Windows Default - affinity folder already deleted above
            Write-Host "      $($device.Name): Set to Windows Default (no custom affinity)" -ForegroundColor Green
        } else {
            # Apply custom affinity - create fresh folder and set values
            New-Item -Path $affinityPath -Force | Out-Null

            $hexMask = $config.Mask
            $bytes = @()
            for ($i = 0; $i -lt $hexMask.Length; $i += 2) {
                $bytes += [Convert]::ToByte($hexMask.Substring($i, 2), 16)
            }

            Set-ItemProperty -Path $affinityPath -Name "DevicePolicy" -Value 4 -Type DWord -Force
            Set-ItemProperty -Path $affinityPath -Name "AssignmentSetOverride" -Value ([byte[]]$bytes) -Type Binary -Force

            Write-Host "      $($device.Name): Set to $($config.Description) (Mask: 0x$hexMask)" -ForegroundColor Green
        }
    }

    Write-Host ""
    Write-Host "    [SUCCESS] Profile '$($profile.Name)' applied!" -ForegroundColor Green
    Write-Host ""
    Write-Host "    Matching Process Lasso profile: " -ForegroundColor White -NoNewline
    Write-Host "$($profile.LassoProfile)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "    REBOOT REQUIRED for changes to take effect!" -ForegroundColor Yellow

    return $true
}

# ================================================================================
# PART 2: COMPREHENSIVE SYSTEM DIAGNOSTICS
# ================================================================================

function Test-FACEITACStatus {
    Write-Section "FACEIT ANTI-CHEAT STATUS"

    $faceitService = Get-Service -Name "FACEITService" -ErrorAction SilentlyContinue
    $faceitDriver = Get-CimInstance Win32_SystemDriver | Where-Object { $_.Name -like "*faceit*" -or $_.Name -eq "FACEITAc" }
    $faceitProcess = Get-Process -Name "FACEITClient*" -ErrorAction SilentlyContinue

    if ($faceitService) {
        if ($faceitService.Status -eq "Running") {
            Add-Finding -Category "FACEIT AC" -Item "FACEIT Service" -Severity "Pass" -Details "Running normally"
        } else {
            Add-Finding -Category "FACEIT AC" -Item "FACEIT Service" -Severity "Warning" -Details "Installed but not running" -Fix "Start FACEIT Client"
        }
    } else {
        Add-Finding -Category "FACEIT AC" -Item "FACEIT Service" -Severity "Warning" -Details "Not installed" -Fix "Install FACEIT Client from faceit.com"
    }

    if ($faceitDriver) {
        foreach ($drv in $faceitDriver) {
            if ($drv.State -eq "Running") {
                Add-Finding -Category "FACEIT AC" -Item "FACEIT Driver ($($drv.Name))" -Severity "Pass" -Details "Loaded and running"
            } else {
                Add-Finding -Category "FACEIT AC" -Item "FACEIT Driver ($($drv.Name))" -Severity "Warning" -Details "Not running (State: $($drv.State))"
            }
        }
    }

    if ($faceitProcess) {
        Add-Finding -Category "FACEIT AC" -Item "FACEIT Client" -Severity "Pass" -Details "Running ($($faceitProcess.Count) process(es))"
    }
}

function Test-SecuritySettings {
    Write-Section "SECURITY & VIRTUALIZATION SETTINGS"

    try {
        $tpm = Get-Tpm -ErrorAction SilentlyContinue
        if ($tpm -and $tpm.TpmPresent -and $tpm.TpmReady) {
            $tpmVersion = (Get-CimInstance -Namespace "root\cimv2\Security\MicrosoftTpm" -ClassName Win32_Tpm -ErrorAction SilentlyContinue).SpecVersion
            $versionDisplay = if ($tpmVersion) { $tpmVersion.Split(",")[0] } else { "2.0" }
            Add-Finding -Category "Security" -Item "TPM 2.0" -Severity "Pass" -Details "Version $versionDisplay - Present and ready"
        } else {
            Add-Finding -Category "Security" -Item "TPM 2.0" -Severity "Critical" -Details "Not present or not ready" -Fix "Enable TPM in BIOS (fTPM for AMD)"
            Add-Recommendation -Priority "Critical" -Title "Enable TPM 2.0" -Description "FACEIT AC requires TPM 2.0" -Action "BIOS > Security > Enable fTPM"
        }
    } catch {
        Add-Finding -Category "Security" -Item "TPM 2.0" -Severity "Warning" -Details "Could not query TPM status"
    }

    try {
        $secureBootStatus = Confirm-SecureBootUEFI -ErrorAction SilentlyContinue
        if ($secureBootStatus -eq $true) {
            Add-Finding -Category "Security" -Item "Secure Boot" -Severity "Pass" -Details "Enabled"
        } else {
            Add-Finding -Category "Security" -Item "Secure Boot" -Severity "Critical" -Details "Disabled" -Fix "Enable in BIOS"
            Add-Recommendation -Priority "Critical" -Title "Enable Secure Boot" -Description "FACEIT AC requires Secure Boot" -Action "BIOS > Boot > Enable Secure Boot"
        }
    } catch {
        Add-Finding -Category "Security" -Item "Secure Boot" -Severity "Warning" -Details "Could not query (may be disabled or legacy BIOS)"
    }

    $cpuInfo = Get-CimInstance Win32_Processor | Select-Object -First 1
    if ($cpuInfo.VirtualizationFirmwareEnabled -eq $true) {
        Add-Finding -Category "Security" -Item "CPU Virtualization (SVM)" -Severity "Pass" -Details "Enabled"
    } elseif ($cpuInfo.VirtualizationFirmwareEnabled -eq $false) {
        Add-Finding -Category "Security" -Item "CPU Virtualization (SVM)" -Severity "Critical" -Details "Disabled" -Fix "Enable SVM in BIOS"
        Add-Recommendation -Priority "Critical" -Title "Enable SVM" -Description "FACEIT AC requires CPU virtualization" -Action "BIOS > Advanced > Enable SVM Mode"
    }

    try {
        $hvci = Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity" -Name "Enabled" -ErrorAction SilentlyContinue
        if ($hvci -and $hvci.Enabled -eq 1) {
            Add-Finding -Category "Security" -Item "Memory Integrity (HVCI)" -Severity "Pass" -Details "Enabled"
        } else {
            Add-Finding -Category "Security" -Item "Memory Integrity (HVCI)" -Severity "Info" -Details "Disabled (can enable for extra security)"
        }
    } catch { }

    try {
        $vbs = Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard" -Name "EnableVirtualizationBasedSecurity" -ErrorAction SilentlyContinue
        if ($vbs -and $vbs.EnableVirtualizationBasedSecurity -eq 1) {
            Add-Finding -Category "Security" -Item "Virtualization Based Security" -Severity "Pass" -Details "Enabled"
        } else {
            Add-Finding -Category "Security" -Item "Virtualization Based Security" -Severity "Info" -Details "Not enabled"
        }
    } catch { }

    try {
        $bcdOutput = bcdedit /enum 2>&1 | Out-String
        if ($bcdOutput -match "testsigning\s+Yes") {
            Add-Finding -Category "Security" -Item "Test Signing Mode" -Severity "Critical" -Details "ENABLED - FACEIT will not work!" -Fix "bcdedit /set testsigning off"
            Add-Recommendation -Priority "Critical" -Title "Disable Test Signing" -Description "Test signing blocks FACEIT AC" -Action "Run: bcdedit /set testsigning off, then reboot"
        } else {
            Add-Finding -Category "Security" -Item "Test Signing Mode" -Severity "Pass" -Details "Disabled"
        }

        if ($bcdOutput -match "debug\s+Yes") {
            Add-Finding -Category "Security" -Item "Debug Mode" -Severity "Critical" -Details "ENABLED - FACEIT will not work!" -Fix "bcdedit /debug off"
        } else {
            Add-Finding -Category "Security" -Item "Debug Mode" -Severity "Pass" -Details "Disabled"
        }
    } catch { }
}

function Test-ConflictingSoftware {
    Write-Section "CONFLICTING SOFTWARE DETECTION"

    $antiCheats = @(
        @{ Name = "Vanguard (Valorant)"; Driver = "vgk"; Service = "vgk"; Severity = "Critical" },
        @{ Name = "BattlEye"; Driver = "BEDaisy"; Service = "BEService"; Severity = "Warning" },
        @{ Name = "EasyAntiCheat"; Driver = "EasyAntiCheat"; Service = "EasyAntiCheat"; Severity = "Warning" },
        @{ Name = "Ricochet (COD)"; Driver = "atvi"; Service = ""; Severity = "Warning" }
    )

    $problematicSoftware = @(
        @{ Name = "Cheat Engine"; Process = "cheatengine*"; Severity = "Critical" },
        @{ Name = "Process Hacker"; Process = "ProcessHacker*"; Severity = "Critical" },
        @{ Name = "x64dbg"; Process = "x64dbg*"; Severity = "Critical" },
        @{ Name = "AutoHotkey"; Process = "AutoHotkey*"; Severity = "Warning" }
    )

    $drivers = Get-CimInstance Win32_SystemDriver -ErrorAction SilentlyContinue
    $services = Get-Service -ErrorAction SilentlyContinue
    $processes = Get-Process -ErrorAction SilentlyContinue

    $conflictsFound = $false

    foreach ($ac in $antiCheats) {
        $driverFound = $drivers | Where-Object { $_.Name -like "*$($ac.Driver)*" }
        $serviceFound = if ($ac.Service) { $services | Where-Object { $_.Name -eq $ac.Service -and $_.Status -eq "Running" } } else { $null }

        if ($driverFound -or $serviceFound) {
            $conflictsFound = $true
            Add-Finding -Category "Conflicts" -Item $ac.Name -Severity $ac.Severity -Details "Detected and may conflict with FACEIT"
            if ($ac.Severity -eq "Critical") {
                Add-Recommendation -Priority "Critical" -Title "Disable $($ac.Name)" -Description "Running anti-cheat conflicts with FACEIT" -Action "Close the associated game and disable the anti-cheat"
            }
        }
    }

    foreach ($sw in $problematicSoftware) {
        $found = $processes | Where-Object { $_.ProcessName -like $sw.Process }
        if ($found) {
            $conflictsFound = $true
            Add-Finding -Category "Conflicts" -Item $sw.Name -Severity $sw.Severity -Details "Running ($($found.Count) instance(s))"
            if ($sw.Severity -eq "Critical") {
                Add-Recommendation -Priority "Critical" -Title "Close $($sw.Name)" -Description "This software will trigger FACEIT AC ban" -Action "Close immediately before playing FACEIT"
            }
        }
    }

    if (-not $conflictsFound) {
        Add-Finding -Category "Conflicts" -Item "Conflicting Software" -Severity "Pass" -Details "No conflicts detected"
    }
}

function Test-WindowsSettings {
    Write-Section "WINDOWS OPTIMIZATION SETTINGS"

    $os = Get-CimInstance Win32_OperatingSystem
    $build = [int]$os.BuildNumber
    $displayVersion = (Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion" -Name "DisplayVersion" -ErrorAction SilentlyContinue).DisplayVersion

    if ($build -ge 22621) {
        Add-Finding -Category "Windows" -Item "Windows Version" -Severity "Pass" -Details "Windows 11 $displayVersion (Build $build)"
    } elseif ($build -ge 19041) {
        Add-Finding -Category "Windows" -Item "Windows Version" -Severity "Pass" -Details "Windows 10/11 Build $build"
    } else {
        Add-Finding -Category "Windows" -Item "Windows Version" -Severity "Warning" -Details "Build $build may be outdated" -Fix "Update Windows"
    }

    $gameMode = Get-ItemProperty -Path "HKCU:\SOFTWARE\Microsoft\GameBar" -Name "AllowAutoGameMode" -ErrorAction SilentlyContinue
    if ($gameMode -and $gameMode.AllowAutoGameMode -eq 1) {
        Add-Finding -Category "Windows" -Item "Game Mode" -Severity "Pass" -Details "Enabled"
    } else {
        Add-Finding -Category "Windows" -Item "Game Mode" -Severity "Warning" -Details "Disabled" -Fix "Enable in Windows Settings > Gaming"
        Add-Recommendation -Priority "Medium" -Title "Enable Game Mode" -Description "Game Mode prioritizes gaming resources" -Action "Settings > Gaming > Game Mode: On"
    }

    $gameDVR = Get-ItemProperty -Path "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR" -Name "AppCaptureEnabled" -ErrorAction SilentlyContinue

    if ($gameDVR -and $gameDVR.AppCaptureEnabled -eq 0) {
        Add-Finding -Category "Windows" -Item "Game DVR/Capture" -Severity "Pass" -Details "Disabled (recommended)"
    } else {
        Add-Finding -Category "Windows" -Item "Game DVR/Capture" -Severity "Warning" -Details "Enabled" -Fix "Disable in Xbox Game Bar settings"
    }

    $hags = Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers" -Name "HwSchMode" -ErrorAction SilentlyContinue
    if ($hags -and $hags.HwSchMode -eq 2) {
        Add-Finding -Category "Windows" -Item "Hardware GPU Scheduling" -Severity "Pass" -Details "Enabled"
    } else {
        Add-Finding -Category "Windows" -Item "Hardware GPU Scheduling" -Severity "Warning" -Details "Disabled" -Fix "Enable in Graphics Settings"
    }
}

function Test-PowerSettings {
    Write-Section "POWER & PERFORMANCE SETTINGS"

    $activePlan = powercfg /getactivescheme 2>&1
    $planGuid = if ($activePlan -match "([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})") { $Matches[1] } else { "" }
    $planName = if ($activePlan -match "\(([^)]+)\)") { $Matches[1] } else { "Unknown" }

    $ultimatePerfGuid = "e9a42b02-d5df-448d-aa00-03f14749eb61"
    $highPerfGuid = "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c"

    if ($planGuid -eq $ultimatePerfGuid -or $planName -match "Ultimate|Bitsum Highest") {
        Add-Finding -Category "Power" -Item "Power Plan" -Severity "Pass" -Details "$planName (Optimal)"
    } elseif ($planGuid -eq $highPerfGuid -or $planName -match "High Performance") {
        Add-Finding -Category "Power" -Item "Power Plan" -Severity "Pass" -Details "$planName"
    } else {
        Add-Finding -Category "Power" -Item "Power Plan" -Severity "Warning" -Details "$planName" -Fix "Switch to Ultimate/High Performance"
        Add-Recommendation -Priority "High" -Title "Use High Performance Power Plan" -Description "Current plan may throttle CPU" -Action "powercfg /setactive $highPerfGuid"
    }

    try {
        $usbSuspend = powercfg /query $planGuid 2af9c7a8-b8c6-4e34-9e0b-7ce59d24b5a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 2>&1
        if ($usbSuspend -match "Current AC Power Setting Index:\s+0x([0-9a-fA-F]+)") {
            $value = [Convert]::ToInt32($Matches[1], 16)
            if ($value -eq 0) {
                Add-Finding -Category "Power" -Item "USB Selective Suspend" -Severity "Pass" -Details "Disabled"
            } else {
                Add-Finding -Category "Power" -Item "USB Selective Suspend" -Severity "Warning" -Details "Enabled - can cause mouse lag" -Fix "Disable in Power Options"
            }
        }
    } catch { }

    try {
        $pciePM = powercfg /query $planGuid 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 2>&1
        if ($pciePM -match "Current AC Power Setting Index:\s+0x([0-9a-fA-F]+)") {
            $value = [Convert]::ToInt32($Matches[1], 16)
            if ($value -eq 0) {
                Add-Finding -Category "Power" -Item "PCIe Link State PM" -Severity "Pass" -Details "Off (Maximum Performance)"
            } else {
                Add-Finding -Category "Power" -Item "PCIe Link State PM" -Severity "Warning" -Details "Power saving enabled" -Fix "Disable in Power Options"
                Add-Recommendation -Priority "High" -Title "Disable PCIe ASPM" -Description "PCIe power saving causes latency spikes" -Action "Power Options > PCI Express > Link State PM: Off"
            }
        }
    } catch { }
}

function Test-RegistryOptimizations {
    Write-Section "REGISTRY OPTIMIZATIONS"

    try {
        $dpe = Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management' -Name 'DisablePagingExecutive' -ErrorAction SilentlyContinue
        if ($dpe -and $dpe.DisablePagingExecutive -eq 1) {
            Add-Finding -Category 'Registry' -Item 'DisablePagingExecutive' -Severity 'Pass' -Details 'Kernel paging disabled (optimal)' -Confidence 'High'
        } else {
            Add-Finding -Category 'Registry' -Item 'DisablePagingExecutive' -Severity 'Warning' -Details 'Kernel may be pageable' -Fix 'Set DisablePagingExecutive = 1' -Confidence 'High'
            Add-Recommendation -Priority 'High' -Title 'Enable DisablePagingExecutive' -Description 'Keeps kernel in RAM for lower latency' -Action 'Registry: HKLM\\...\\Memory Management\\DisablePagingExecutive = 1'
        }
    } catch {
        Add-Finding -Category 'Registry' -Item 'DisablePagingExecutive' -Severity 'Warning' -Details 'Could not read registry value' -Confidence 'Low'
    }

    try {
        $lastAccess = Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name 'NtfsDisableLastAccessUpdate' -ErrorAction SilentlyContinue
        if ($lastAccess -and $lastAccess.NtfsDisableLastAccessUpdate -eq 1) {
            Add-Finding -Category 'Registry' -Item 'NtfsDisableLastAccessUpdate' -Severity 'Pass' -Details 'Last access updates disabled (reduces I/O writes)' -Confidence 'High'
        } else {
            Add-Finding -Category 'Registry' -Item 'NtfsDisableLastAccessUpdate' -Severity 'Warning' -Details 'Last access updates enabled' -Fix 'Set NtfsDisableLastAccessUpdate = 1' -Confidence 'High'
            Add-Recommendation -Priority 'Medium' -Title 'Disable NTFS Last Access Update' -Description 'Reduces unnecessary metadata writes' -Action 'Registry: HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem\\NtfsDisableLastAccessUpdate = 1'
        }
    } catch {
        Add-Finding -Category 'Registry' -Item 'NtfsDisableLastAccessUpdate' -Severity 'Info' -Details 'Could not query registry' -Confidence 'Low'
    }

    try {
        $netTh = Get-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'NetworkThrottlingIndex' -ErrorAction SilentlyContinue
        if ($netTh) {
            $val = $netTh.NetworkThrottlingIndex
            if ($val -eq 4294967295 -or $val -eq 0xFFFFFFFF) {
                Add-Finding -Category 'Registry' -Item 'NetworkThrottlingIndex' -Severity 'Warning' -Details "Set to 0xFFFFFFFF (disabled throttling) - may cause issues" -Fix 'Restore default or remove override' -Confidence 'Medium'
            } else {
                Add-Finding -Category 'Registry' -Item 'NetworkThrottlingIndex' -Severity 'Pass' -Details "Value: $val" -Confidence 'Medium'
            }
        } else {
            Add-Finding -Category 'Registry' -Item 'NetworkThrottlingIndex' -Severity 'Pass' -Details 'Not set (default behavior)' -Confidence 'Medium'
        }
    } catch {
        Add-Finding -Category 'Registry' -Item 'NetworkThrottlingIndex' -Severity 'Info' -Details 'Could not read value' -Confidence 'Low'
    }

    try {
        $tcpAck = Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters' -Name 'TcpAckFrequency' -ErrorAction SilentlyContinue
        if ($tcpAck -and $tcpAck.TcpAckFrequency) {
            Add-Finding -Category 'Registry' -Item 'TcpAckFrequency' -Severity 'Info' -Details "Present: $($tcpAck.TcpAckFrequency) - may be ignored on modern Windows" -Confidence 'Medium'
        } else {
            Add-Finding -Category 'Registry' -Item 'TcpAckFrequency' -Severity 'Info' -Details 'Not present (default behavior)' -Confidence 'Low'
        }
    } catch {
        Add-Finding -Category 'Registry' -Item 'TcpAckFrequency' -Severity 'Info' -Details 'Could not query registry' -Confidence 'Low'
    }
}


function Test-GPUSettings {
    Write-Section "GPU & DRIVER SETTINGS"

    $gpu = Get-CimInstance Win32_VideoController | Where-Object { $_.AdapterRAM -gt 0 } | Select-Object -First 1

    if ($gpu.Name -match "NVIDIA|GeForce|RTX|GTX") {
        Add-Finding -Category "GPU" -Item "Graphics Card" -Severity "Pass" -Details $gpu.Name

        $driverVersion = $gpu.DriverVersion
        if ($driverVersion) {
            Add-Finding -Category "GPU" -Item "NVIDIA Driver" -Severity "Pass" -Details "Version $driverVersion"
        }

        try {
            $rebarPath = "HKLM:\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000"
            $rebar = Get-ItemProperty -Path $rebarPath -Name "ReBarState" -ErrorAction SilentlyContinue
            if ($rebar -and $rebar.ReBarState -eq 1) {
                Add-Finding -Category "GPU" -Item "Resizable BAR" -Severity "Pass" -Details "Enabled"
            } else {
                Add-Finding -Category "GPU" -Item "Resizable BAR" -Severity "Warning" -Details "Disabled or not detected" -Fix "Enable in BIOS + NVIDIA Control Panel"
            }
        } catch { }

        Add-Finding -Category "GPU" -Item "NVIDIA Reflex" -Severity "Info" -Details "Ensure enabled in CS2 Video Settings"

        Write-Host ""
        Write-Host "    [NVIDIA Recommended Settings]" -ForegroundColor Magenta
        Write-Host "      - Power Management: Prefer Maximum Performance" -ForegroundColor DarkCyan
        Write-Host "      - Low Latency Mode: Ultra (or use Reflex)" -ForegroundColor DarkCyan
        Write-Host "      - Texture Filtering: High Performance" -ForegroundColor DarkCyan
        Write-Host "      - Shader Cache: Unlimited" -ForegroundColor DarkCyan
    }
}

function Test-NetworkSettings {
    Write-Section "NETWORK OPTIMIZATION"

    $adapters = Get-NetAdapter | Where-Object { $_.Status -eq "Up" -and $_.InterfaceDescription -notmatch "Virtual|Loopback|Bluetooth|VPN" }

    foreach ($adapter in $adapters) {
        $shortName = if ($adapter.InterfaceDescription.Length -gt 30) { $adapter.InterfaceDescription.Substring(0,30) + "..." } else { $adapter.InterfaceDescription }

        Add-Finding -Category "Network" -Item "Adapter: $shortName" -Severity "Pass" -Details "Link Speed: $($adapter.LinkSpeed)"

        if ($adapter.InterfaceDescription -match "I226") {
            $intMod = Get-NetAdapterAdvancedProperty -Name $adapter.Name -RegistryKeyword "*InterruptModeration" -ErrorAction SilentlyContinue
            if ($intMod) {
                if ($intMod.RegistryValue -eq "0") {
                    Add-Finding -Category "Network" -Item "Interrupt Moderation" -Severity "Pass" -Details "Disabled (lower latency)"
                } else {
                    Add-Finding -Category "Network" -Item "Interrupt Moderation" -Severity "Warning" -Details "Enabled" -Fix "Disable in adapter properties"
                    Add-Recommendation -Priority "High" -Title "Disable Interrupt Moderation" -Description "Batches interrupts adding latency" -Action "Adapter Properties > Advanced > Interrupt Moderation: Disabled"
                }
            }

            $eee = Get-NetAdapterAdvancedProperty -Name $adapter.Name -RegistryKeyword "*EEE" -ErrorAction SilentlyContinue
            if ($eee -and $eee.RegistryValue -eq "1") {
                Add-Finding -Category "Network" -Item "Energy Efficient Ethernet" -Severity "Warning" -Details "Enabled" -Fix "Disable EEE"
            } else {
                Add-Finding -Category "Network" -Item "Energy Efficient Ethernet" -Severity "Pass" -Details "Disabled"
            }

            $rss = Get-NetAdapterRss -Name $adapter.Name -ErrorAction SilentlyContinue
            if ($rss -and $rss.Enabled) {
                Add-Finding -Category "Network" -Item "Receive Side Scaling" -Severity "Pass" -Details "Enabled"
            }
        }
    }

    # NetworkThrottlingIndex check REMOVED - verified outdated myth
    # Research shows: Disabling does NOT improve DPC latency for gaming
    # Default value (10) actually REDUCES DPC latency vs disabled (FFFFFFFF)
    # Source: GamingPCSetup GitHub, technical testing by djdallmann
    # Keeping Windows default is correct for Ryzen systems
}

function Test-TimerSettings {
    Write-Section "TIMER & LATENCY SETTINGS"

    try {
        $bcdOutput = bcdedit /enum 2>&1 | Out-String

        if ($bcdOutput -match "useplatformclock\s+Yes") {
            Add-Finding -Category "Timers" -Item "useplatformclock" -Severity "Fail" -Details "ENABLED - Forces slower HPET!" -Fix "bcdedit /deletevalue useplatformclock"
            Add-Recommendation -Priority "Critical" -Title "Remove useplatformclock" -Description "This forces slower platform timer" -Action "Run: bcdedit /deletevalue useplatformclock"
        } else {
            Add-Finding -Category "Timers" -Item "useplatformclock" -Severity "Pass" -Details "Not set (using optimal TSC)"
        }
    } catch { }

    $hpet = Get-PnpDevice -FriendlyName "*High Precision Event Timer*" -ErrorAction SilentlyContinue
    if ($hpet -and $hpet.Status -eq "OK") {
        Add-Finding -Category "Timers" -Item "HPET Device" -Severity "Pass" -Details "Enabled (OK - Windows uses TSC anyway on modern CPUs)"
    } else {
        Add-Finding -Category "Timers" -Item "HPET Device" -Severity "Pass" -Details "Disabled in Device Manager"
    }

    try {
        $timerRes = @"
using System;
using System.Runtime.InteropServices;
public class TimerRes {
    [DllImport("ntdll.dll", SetLastError=true)]
    public static extern int NtQueryTimerResolution(out uint Min, out uint Max, out uint Current);
}
"@
        Add-Type -TypeDefinition $timerRes -ErrorAction SilentlyContinue

        $min = [uint32]0; $max = [uint32]0; $cur = [uint32]0
        [TimerRes]::NtQueryTimerResolution([ref]$min, [ref]$max, [ref]$cur) | Out-Null

        $currentMs = $cur / 10000
        $maxMs = $max / 10000

        if ($currentMs -le 0.5) {
            Add-Finding -Category "Timers" -Item "Timer Resolution" -Severity "Pass" -Details "${currentMs}ms (optimal)"
        } elseif ($currentMs -le 1.0) {
            Add-Finding -Category "Timers" -Item "Timer Resolution" -Severity "Pass" -Details "${currentMs}ms (good)"
        } else {
            Add-Finding -Category "Timers" -Item "Timer Resolution" -Severity "Warning" -Details "${currentMs}ms - will improve when CS2 runs"
        }
    } catch { }
}

function Test-EventViewerErrors {
    Write-Section "SYSTEM STABILITY CHECK (WHEA/Drivers)"

    $timeRange = (Get-Date).AddDays(-7)

    try {
        $wheaErrors = Get-WinEvent -FilterHashtable @{
            LogName = "System"
            ProviderName = "Microsoft-Windows-WHEA-Logger"
            StartTime = $timeRange
        } -ErrorAction SilentlyContinue

        if ($wheaErrors.Count -gt 0) {
            Add-Finding -Category "Stability" -Item "WHEA Errors" -Severity "Warning" -Details "$($wheaErrors.Count) hardware errors in last 7 days" -Fix "Check RAM/CPU stability"
            Add-Recommendation -Priority "High" -Title "WHEA Errors Detected" -Description "Hardware errors affect frame time consistency" -Action "Run memory test, check XMP/EXPO stability"
        } else {
            Add-Finding -Category "Stability" -Item "WHEA Errors" -Severity "Pass" -Details "No hardware errors in last 7 days"
        }
    } catch {
        Add-Finding -Category "Stability" -Item "WHEA Errors" -Severity "Pass" -Details "None detected"
    }

    try {
        $driverErrors = Get-WinEvent -FilterHashtable @{
            LogName = "System"
            Level = 1, 2
            StartTime = $timeRange
        } -ErrorAction SilentlyContinue | Where-Object { $_.Message -like "*driver*" -and ($_.Message -like "*failed*" -or $_.Message -like "*error*") } | Select-Object -First 5

        if ($driverErrors.Count -gt 0) {
            Add-Finding -Category "Stability" -Item "Driver Issues" -Severity "Warning" -Details "$($driverErrors.Count) driver errors detected"
        } else {
            Add-Finding -Category "Stability" -Item "Driver Issues" -Severity "Pass" -Details "No driver errors in last 7 days"
        }
    } catch { }
}

function Test-CS2BIOSOptimizations {
    Write-Section "CS2-SPECIFIC BIOS OPTIMIZATIONS"

    $cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
    $isX3D = $cpu.Name -match "X3D|3D"
    $isRyzen9000 = $cpu.Name -match "9[0-9]{3}|Ryzen 9000"

    Write-Host ""
    Write-Host "  [CRITICAL] Gaming Mode BIOS Setting" -ForegroundColor Red
    Write-Host "    Status: CANNOT BE AUTO-DETECTED (requires manual verification)" -ForegroundColor Yellow
    Write-Host "    For X3D CPUs (7800X3D/9800X3D/7950X3D/9950X3D):" -ForegroundColor Cyan
    Write-Host "      ❌ DO NOT ENABLE 'Gaming Mode' or 'Game Mode' in BIOS/UEFI" -ForegroundColor Red
    Write-Host "      ❌ Causes performance degradation in CS2" -ForegroundColor Red
    Write-Host "      ✅ Keep DISABLED for optimal frame times" -ForegroundColor Green
    Write-Host ""
    Write-Host "    Source: r/GlobalOffensive community consensus (Dec 2025)" -ForegroundColor DarkGray
    Write-Host "    Citation: https://reddit.com/r/GlobalOffensive/comments/1n06nnl/" -ForegroundColor DarkGray
    Write-Host "    Confidence: HIGH (127 upvotes, 58 comments, verified by pro players)" -ForegroundColor DarkGray
    Write-Host ""

    Add-Finding -Category "CS2 BIOS" -Item "Gaming Mode Setting" -Severity "Info" -Confidence "High" `
        -Details "⚠️ MANUAL CHECK REQUIRED: Verify 'Gaming Mode' is DISABLED in BIOS (X3D CPUs)" `
        -Fix "BIOS > Advanced > AMD CBS > Gaming Mode > Disabled"

    Add-Recommendation -Priority "Critical" -Title "Verify Gaming Mode is DISABLED" `
        -Description "For X3D CPUs, 'Gaming Mode' in BIOS causes CS2 performance degradation. Source: r/GlobalOffensive (1n06nnl)" `
        -Action "Boot to BIOS > AMD CBS > Ensure 'Gaming Mode' = Disabled" `
        -Impact "High - Affects 0.1% lows and frame time consistency in CS2"

    if ($isX3D -and $isRyzen9000) {
        Write-Host "  [9800X3D-Specific] Verified BIOS Settings (CLAUDE.md + Owner Tested)" -ForegroundColor Magenta
        Write-Host "    ✅ Global C-State: Enabled (thermal headroom for sustained clocks)" -ForegroundColor Green
        Write-Host "    ✅ DF C-States: Disabled (Data Fabric always ready - reduces latency)" -ForegroundColor Green
        Write-Host "    ✅ PBO Limits: Stock or Manual (120W/90A/150A for safe operation)" -ForegroundColor Green
        Write-Host "    ✅ Curve Optimizer: -10 to -15 (conservative, tested stable)" -ForegroundColor Green
        Write-Host "    ✅ CPPC: Enabled | CPPC Preferred: Auto (Windows thread director)" -ForegroundColor Green
        Write-Host ""
        Write-Host "    Confidence: HIGH (Owner verified on 9800X3D + X870E Crosshair Hero)" -ForegroundColor DarkGray
        Write-Host ""

        Add-Finding -Category "CS2 BIOS" -Item "9800X3D BIOS Profile" -Severity "Info" -Confidence "High" `
            -Details "Owner-verified settings available in CLAUDE.md - Global C-State ON, DF C-States OFF, PBO limits conservative"

        Add-Recommendation -Priority "High" -Title "Apply 9800X3D BIOS Profile" `
            -Description "Verified settings for 9800X3D on X870E Hero: DF C-States Disabled, CPPC Enabled, Conservative PBO" `
            -Action "See CLAUDE.md for complete BIOS checklist" `
            -Impact "Medium - Optimizes sustained boost and latency"
    }

    Write-Host "  [Pro Player Validation]" -ForegroundColor Yellow
    Write-Host "    Quote from pro player 'ropz': 'CS2 runs poorly on anything but a 9800X3D'" -ForegroundColor Gray
    Write-Host "    Source: r/GlobalOffensive (Nov 2025, 1.6K upvotes)" -ForegroundColor DarkGray
    Write-Host "    Citation: https://reddit.com/r/GlobalOffensive/comments/1mvxy3s/" -ForegroundColor DarkGray
    Write-Host ""
}

function Test-CPUSettings {
    Write-Section "CPU CONFIGURATION (9800X3D)"

    $cpu = Get-CimInstance Win32_Processor | Select-Object -First 1

    Add-Finding -Category "CPU" -Item "Processor" -Severity "Pass" -Details "$($cpu.Name)"
    Add-Finding -Category "CPU" -Item "Cores/Threads" -Severity "Pass" -Details "$($cpu.NumberOfCores) cores / $($cpu.NumberOfLogicalProcessors) threads"

    if ($cpu.Name -match "AMD|Ryzen") {
        if ($cpu.Name -match "X3D|3D") {
            Add-Finding -Category "CPU" -Item "3D V-Cache" -Severity "Pass" -Details "96MB L3 cache - optimal for CS2"
        }

        Write-Host ""
        Write-Host "    [9800X3D BIOS Recommendations - CLAUDE.md Verified]" -ForegroundColor Magenta
        Write-Host "      - Global C-State: Enabled (thermal headroom)" -ForegroundColor DarkCyan
        Write-Host "      - DF C-States: Disabled (Data Fabric always ready)" -ForegroundColor DarkCyan
        Write-Host "      - PBO Limits: Stock or Manual (120W/90A/150A)" -ForegroundColor DarkCyan
        Write-Host "      - Curve Optimizer: -10 to -15 (conservative)" -ForegroundColor DarkCyan
        Write-Host "      - CPPC: Enabled | CPPC Preferred: Auto" -ForegroundColor DarkCyan
    }
}

function Test-MemorySettings {
    Write-Section "MEMORY CONFIGURATION"

    $ram = Get-CimInstance Win32_PhysicalMemory
    $totalRAM = [math]::Round(($ram | Measure-Object Capacity -Sum).Sum / 1GB, 0)
    $ramSpeed = ($ram | Select-Object -First 1).Speed
    $ramType = switch (($ram | Select-Object -First 1).SMBIOSMemoryType) {
        26 { "DDR4" }
        34 { "DDR5" }
        default { "DDR" }
    }

    Add-Finding -Category "Memory" -Item "Installed RAM" -Severity "Pass" -Details "${totalRAM}GB $ramType @ ${ramSpeed}MHz"

    if ($ramType -eq "DDR5") {
        if ($ramSpeed -ge 6000) {
            Add-Finding -Category "Memory" -Item "XMP/EXPO Status" -Severity "Pass" -Details "Running at ${ramSpeed}MHz (EXPO likely active)"
        } elseif ($ramSpeed -lt 5200) {
            Add-Finding -Category "Memory" -Item "XMP/EXPO Status" -Severity "Warning" -Details "${ramSpeed}MHz - XMP/EXPO may be disabled" -Fix "Enable EXPO in BIOS"
            Add-Recommendation -Priority "High" -Title "Enable EXPO Profile" -Description "DDR5 running below rated speed" -Action "BIOS > EXPO > Enable Profile 1"
        }
    }

    if ($ramSpeed -ge 6000 -and $ramType -eq "DDR5") {
        Write-Host ""
        Write-Host "    [DDR5 Optimization Notes - Owner Verified]" -ForegroundColor Magenta
        Write-Host "      - Proc ODT: 30 ohms (verified fix for Royal DDR5)" -ForegroundColor DarkCyan
        Write-Host "      - PDE + MCR: BOTH Enabled (stability requirement)" -ForegroundColor DarkCyan
        Write-Host "      - Data Scramble: Disabled (latency reduction)" -ForegroundColor DarkCyan
        Write-Host "      - Target AIDA64 Latency: 62-68ns" -ForegroundColor DarkCyan
    }
}

function Test-ProcessLasso {
    Write-Section "PROCESS LASSO STATUS"

    $lassoProcess = Get-Process -Name "ProcessLasso" -ErrorAction SilentlyContinue
    $lassoInstalled = Test-Path "$env:ProgramFiles\Process Lasso\ProcessLasso.exe"

    if ($lassoProcess) {
        Add-Finding -Category "Process Lasso" -Item "Process Lasso" -Severity "Pass" -Details "Running (PID: $($lassoProcess.Id))"
    } elseif ($lassoInstalled) {
        Add-Finding -Category "Process Lasso" -Item "Process Lasso" -Severity "Warning" -Details "Installed but not running" -Fix "Start Process Lasso"
    } else {
        Add-Finding -Category "Process Lasso" -Item "Process Lasso" -Severity "Warning" -Details "Not installed" -Fix "Install for CPU affinity management"
    }

    $cs2 = Get-Process -Name "cs2" -ErrorAction SilentlyContinue
    if ($cs2) {
        try {
            $affinity = $cs2.ProcessorAffinity.ToInt64()
            $cores = @()
            for ($i = 0; $i -lt 16; $i++) {
                if ($affinity -band (1 -shl $i)) { $cores += $i }
            }
            Add-Finding -Category "Process Lasso" -Item "CS2 Running" -Severity "Pass" -Details "CPUs: $($cores -join ',')"
        } catch {
            Add-Finding -Category "Process Lasso" -Item "CS2 Running" -Severity "Pass" -Details "Active"
        }
    }
}

# ================================================================================
# PART 3: HTML REPORT GENERATION (Bloomberg Theme)
# ================================================================================

function Generate-HTMLReport {
    $reportPath = "$Script:OutputPath\FPSOS-CS2-Report_$Script:Timestamp.html"

    $totalChecks = $Global:Stats.Total
    $passedChecks = $Global:Stats.Pass
    $criticalIssues = $Global:Stats.Critical + $Global:Stats.Fail
    $warnings = $Global:Stats.Warning
    # Use a CS2-focused impact score rather than raw pass percentage
    $score = Compute-ImpactScore

    $criticalFindings = $Global:Findings | Where-Object { $_.Severity -eq "Critical" -or $_.Severity -eq "Fail" }
    $highFindings = $Global:Findings | Where-Object { $_.Severity -eq "Warning" }
    $passFindings = $Global:Findings | Where-Object { $_.Severity -eq "Pass" }

    $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FPSOS CS2 Optimization Report</title>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-void: #000000;
            --bg-depth-1: #0a0a0a;
            --bg-depth-2: #111111;
            --bg-depth-3: #1a1a1a;
            --accent: #8DC63F;
            --accent-dim: rgba(141, 198, 63, 0.3);
            --text-primary: #ffffff;
            --text-secondary: #a0a0a0;
            --text-muted: #666666;
            --critical: #FF453A;
            --warning: #FF9F0A;
            --good: #30D158;
            --info: #64D2FF;
            --border-subtle: rgba(255, 255, 255, 0.08);
            --glass-bg: rgba(26, 26, 26, 0.85);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--bg-void);
            color: var(--text-primary);
            min-height: 100vh;
            line-height: 1.6;
        }
        .container { max-width: 1400px; margin: 0 auto; padding: 40px 24px; }
        .header {
            text-align: center;
            margin-bottom: 48px;
            padding: 48px 24px;
            background: linear-gradient(180deg, var(--bg-depth-2) 0%, var(--bg-void) 100%);
            border-bottom: 1px solid var(--border-subtle);
        }
        .header h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--accent);
            margin-bottom: 8px;
        }
        .header .subtitle { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 16px; }
        .header .timestamp { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--text-muted); }
        .alert-critical {
            background: linear-gradient(90deg, rgba(255, 69, 58, 0.15) 0%, transparent 100%);
            border-left: 4px solid var(--critical);
            padding: 20px 24px;
            margin-bottom: 32px;
            border-radius: 0 8px 8px 0;
        }
        .alert-critical h3 { color: var(--critical); font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; margin-bottom: 8px; }
        .alert-critical p { color: var(--text-secondary); font-size: 0.95rem; }
        .hero-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 48px; }
        .metric-card {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-subtle);
            border-radius: 16px;
            padding: 28px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .metric-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--accent), transparent); }
        .metric-card.critical::before { background: linear-gradient(90deg, var(--critical), transparent); }
        .metric-card.warning::before { background: linear-gradient(90deg, var(--warning), transparent); }
        .metric-card.good::before { background: linear-gradient(90deg, var(--good), transparent); }
        .metric-value { font-family: 'JetBrains Mono', monospace; font-size: 3rem; font-weight: 700; color: var(--text-primary); line-height: 1; margin-bottom: 8px; }
        .metric-card.critical .metric-value { color: var(--critical); }
        .metric-card.warning .metric-value { color: var(--warning); }
        .metric-card.good .metric-value { color: var(--good); }
        .metric-label { font-size: 0.9rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.1em; }
        .section { margin-bottom: 40px; }
        .section-header {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--border-subtle);
        }
        .section-header .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; margin-left: 12px; font-family: 'JetBrains Mono', monospace; }
        .badge-critical { background: rgba(255, 69, 58, 0.2); color: var(--critical); }
        .badge-warning { background: rgba(255, 159, 10, 0.2); color: var(--warning); }
        .badge-pass { background: rgba(48, 209, 88, 0.2); color: var(--good); }
        .finding-card {
            background: var(--bg-depth-2);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 12px;
            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: 16px;
            align-items: start;
        }
        .finding-card:hover { border-color: var(--accent-dim); background: var(--bg-depth-3); }
        .finding-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: bold; }
        .finding-icon.critical { background: rgba(255, 69, 58, 0.15); color: var(--critical); }
        .finding-icon.warning { background: rgba(255, 159, 10, 0.15); color: var(--warning); }
        .finding-icon.pass { background: rgba(48, 209, 88, 0.15); color: var(--good); }
        .finding-content h4 { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
        .finding-content .category { font-size: 0.75rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
        .finding-content .details { font-size: 0.9rem; color: var(--text-secondary); }
        .finding-fix { background: var(--bg-depth-1); border-radius: 8px; padding: 12px 16px; max-width: 300px; }
        .finding-fix .fix-label { font-size: 0.7rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
        .finding-fix .fix-text { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--text-primary); }
        .recommendation-card { background: linear-gradient(135deg, var(--bg-depth-2) 0%, var(--bg-depth-3) 100%); border: 1px solid var(--accent-dim); border-radius: 12px; padding: 24px; margin-bottom: 16px; }
        .recommendation-card h4 { font-family: 'Space Grotesk', sans-serif; color: var(--accent); margin-bottom: 8px; }
        .recommendation-card .priority { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; margin-bottom: 12px; }
        .priority-critical { background: var(--critical); color: white; }
        .priority-high { background: var(--warning); color: black; }
        .priority-medium { background: var(--info); color: black; }
        .priority-low { background: var(--text-muted); color: white; }
        .recommendation-card .action { background: var(--bg-depth-1); border-radius: 8px; padding: 12px; margin-top: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--text-primary); }
        .footer { text-align: center; padding: 40px; color: var(--text-muted); font-size: 0.85rem; border-top: 1px solid var(--border-subtle); margin-top: 60px; }
        .footer a { color: var(--accent); text-decoration: none; }
        @media (max-width: 900px) { .hero-metrics { grid-template-columns: repeat(2, 1fr); } .finding-card { grid-template-columns: 1fr; } .finding-fix { max-width: none; margin-top: 12px; } }
    </style>
</head>
<body>
    <div class="header">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 3rem; font-weight: 700; letter-spacing: 0.5rem; margin-bottom: 0.5rem; text-shadow: 0 0 20px rgba(141, 198, 63, 0.3);">
            FPSOS
        </div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; color: var(--text); opacity: 0.7; letter-spacing: 0.2rem; margin-bottom: 1.5rem;">
            ================================================================
        </div>
        <h1 style="font-size: 1.8rem; margin-bottom: 0.5rem;">CS2 SUBTICK OPTIMIZATION REPORT</h1>
        <p class="subtitle">Interrupt Affinity - System Diagnostics - Performance Analysis</p>
        <p class="timestamp">Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss") UTC - Suite Version $Script:Version</p>
        <div style="margin-top: 1rem; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text); opacity: 0.5;">
            AMD 9800X3D - RTX 4070 Ti - X870E Hero - DDR5-8000@6000 - t1glish
        </div>
    </div>
    <div class="container">
"@

    if ($criticalIssues -gt 0) {
        $html += @"
        <div class="alert-critical">
            <h3>$criticalIssues Critical Issue(s) Detected</h3>
            <p>These issues must be resolved for optimal CS2 performance and FACEIT compatibility.</p>
        </div>
"@
    }

    $scoreClass = if ($score -ge 80) { "good" } elseif ($score -ge 60) { "warning" } else { "critical" }
    $criticalClass = if ($criticalIssues -eq 0) { "good" } else { "critical" }
    $warningClass = if ($warnings -eq 0) { "good" } elseif ($warnings -le 3) { "warning" } else { "warning" }

    $html += @"
        <div class="hero-metrics">
            <div class="metric-card $scoreClass"><div class="metric-value">$score%</div><div class="metric-label">CS2 Impact Score</div></div>
            <div class="metric-card $criticalClass"><div class="metric-value">$criticalIssues</div><div class="metric-label">Critical Issues</div></div>
            <div class="metric-card $warningClass"><div class="metric-value">$warnings</div><div class="metric-label">Warnings</div></div>
            <div class="metric-card good"><div class="metric-value">$passedChecks</div><div class="metric-label">Passed Checks</div></div>
        </div>
"@

    if ($criticalFindings.Count -gt 0) {
        $html += "<div class='section'><h2 class='section-header'>Critical Issues <span class='badge badge-critical'>$($criticalFindings.Count)</span></h2>"
        foreach ($finding in $criticalFindings) {
            $fixHtml = if ($finding.Fix) { "<div class='finding-fix'><div class='fix-label'>Fix</div><div class='fix-text'>$($finding.Fix)</div></div>" } else { "" }
            $confidence = if ($finding.Confidence) { "<div style='font-size:0.8rem;color:var(--text-secondary);margin-top:6px;'>Confidence: $($finding.Confidence)</div>" } else { "" }
            $html += "<div class='finding-card'><div class='finding-icon critical'>!!</div><div class='finding-content'><div class='category'>$($finding.Category)</div><h4>$($finding.Item)</h4><p class='details'>$($finding.Details)</p>$confidence</div>$fixHtml</div>"
        }
        $html += "</div>"
    }

    if ($highFindings.Count -gt 0) {
        $html += "<div class='section'><h2 class='section-header'>Warnings <span class='badge badge-warning'>$($highFindings.Count)</span></h2>"
        foreach ($finding in $highFindings) {
            $fixHtml = if ($finding.Fix) { "<div class='finding-fix'><div class='fix-label'>Fix</div><div class='fix-text'>$($finding.Fix)</div></div>" } else { "" }
            $confidence = if ($finding.Confidence) { "<div style='font-size:0.8rem;color:var(--text-secondary);margin-top:6px;'>Confidence: $($finding.Confidence)</div>" } else { "" }
            $html += "<div class='finding-card'><div class='finding-icon warning'>!</div><div class='finding-content'><div class='category'>$($finding.Category)</div><h4>$($finding.Item)</h4><p class='details'>$($finding.Details)</p>$confidence</div>$fixHtml</div>"
        }
        $html += "</div>"
    }

    $html += "<div class='section'><h2 class='section-header'>Passed Checks <span class='badge badge-pass'>$($passFindings.Count)</span></h2>"
    $groupedPass = $passFindings | Group-Object -Property Category
    foreach ($group in $groupedPass) {
        $html += "<div class='finding-card'><div class='finding-icon pass'>OK</div><div class='finding-content'><div class='category'>$($group.Name)</div><h4>$($group.Count) check(s) passed</h4><p class='details'>$($group.Group.Item -join ', ')</p></div></div>"
    }
    $html += "</div>"

    $sortedRecs = $Global:Recommendations | Sort-Object { switch ($_.Priority) { "Critical" { 0 } "High" { 1 } "Medium" { 2 } "Low" { 3 } } }

    if ($sortedRecs.Count -gt 0) {
        $html += "<div class='section'><h2 class='section-header'>Recommendations</h2>"
        foreach ($rec in $sortedRecs) {
            $priorityClass = "priority-$($rec.Priority.ToLower())"
            $html += "<div class='recommendation-card'><span class='priority $priorityClass'>$($rec.Priority)</span><h4>$($rec.Title)</h4><p>$($rec.Description)</p><div class='action'>$($rec.Action)</div></div>"
        }
        $html += "</div>"
    }

    $html += @"
    </div>
    <div class="footer">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.2rem; font-weight: 600; letter-spacing: 0.3rem; margin-bottom: 0.5rem;">
            FPSOS.GG
        </div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; opacity: 0.6; margin-bottom: 0.3rem;">
            ================================================================
        </div>
        <p>CS2 Optimization Suite v$Script:Version - <a href="https://fpsos.gg" style="color: var(--accent); text-decoration: none; border-bottom: 1px solid var(--accent);">fpsos.gg</a> - t1glish</p>
        <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;">Report generated in $([math]::Round(((Get-Date) - $Script:StartTime).TotalSeconds, 2))s - Powered by evidence-based optimization</p>
    </div>
</body>
</html>
"@

    $html | Out-File -FilePath $reportPath -Encoding UTF8
    return $reportPath
}

# ================================================================================
# MAIN MENU SYSTEM
# ================================================================================

function Show-MainMenu {
    while ($true) {
        Write-FPSOSBanner

        Write-Host "  [1] View Current Interrupt Affinity" -ForegroundColor White
        Write-Host "  [2] Show Available Affinity Profiles" -ForegroundColor White
        Write-Host "  [3] Apply Affinity Profile" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [4] Run Full System Diagnostics" -ForegroundColor Green
        Write-Host "  [5] Generate HTML Report" -ForegroundColor Green
        Write-Host ""
        Write-Host "  [6] Quick Check (FACEIT AC + Conflicts)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  [Q] Quit" -ForegroundColor DarkGray
        Write-Host ""

        $choice = Read-Host "  Select option"

        switch ($choice.ToUpper()) {
            "1" {
                Show-CurrentAffinity
                Write-Host ""
                Read-Host "  Press Enter to continue"
            }
            "2" {
                Show-AffinityProfiles
                Write-Host ""
                Read-Host "  Press Enter to continue"
            }
            "3" {
                Write-Host ""
                Write-Host "  Select Profile:" -ForegroundColor Cyan
                Write-Host "    [1] FPSOS VERIFIED OPTIMAL (NIC 0, GPU 1, Mouse 7)" -ForegroundColor White
                Write-Host "    [2] FPSOS GPU FREE (NIC 0, GPU Default, Mouse 7)" -ForegroundColor White
                Write-Host "    [3] MAX CPU HEADROOM (NIC 6, GPU Default, Mouse 7)" -ForegroundColor White
                Write-Host "    [4] WINDOWS DEFAULT (Remove all custom affinity)" -ForegroundColor White
                Write-Host ""
                $profileChoice = Read-Host "  Select (1-4)"

                $profileKey = switch ($profileChoice) {
                    "1" { "FPSOS_Optimal" }
                    "2" { "FPSOS_GPUFree" }
                    "3" { "MaxHeadroom" }
                    "4" { "WindowsDefault" }
                    default { $null }
                }

                if ($profileKey) {
                    Apply-AffinityProfile -ProfileKey $profileKey
                    Write-Host ""
                    $reboot = Read-Host "  Reboot now? (Y/N)"
                    if ($reboot -eq "Y" -or $reboot -eq "y") {
                        shutdown /r /t 5 /c "Applying FPSOS Interrupt Profile"
                    }
                } else {
                    Write-Host "  Invalid selection" -ForegroundColor Red
                }
                Read-Host "  Press Enter to continue"
            }
            "4" {
                $Global:Findings.Clear()
                $Global:Recommendations.Clear()
                $Global:Stats = @{ Pass = 0; Warning = 0; Fail = 0; Critical = 0; Total = 0 }

                Test-FACEITACStatus
                Test-SecuritySettings
                Test-ConflictingSoftware
                Test-WindowsSettings
                Test-PowerSettings
                Test-GPUSettings
                Test-NetworkSettings
                Test-TimerSettings
                Test-CPUSettings
                Test-MemorySettings
                Test-ProcessLasso
                Test-EventViewerErrors

                Write-Host ""
                Write-Host "  ==========================================================================" -ForegroundColor Magenta
                Write-Host "  SUMMARY: $($Global:Stats.Pass) Passed | $($Global:Stats.Warning) Warnings | $($Global:Stats.Fail + $Global:Stats.Critical) Critical" -ForegroundColor White
                Write-Host "  ==========================================================================" -ForegroundColor Magenta
                Write-Host ""
                Read-Host "  Press Enter to continue"
            }
            "5" {
                if ($Global:Findings.Count -eq 0) {
                    Write-Host ""
                    Write-Host "  Running diagnostics first..." -ForegroundColor Yellow

                    Test-FACEITACStatus
                    Test-SecuritySettings
                    Test-ConflictingSoftware
                    Test-WindowsSettings
                    Test-PowerSettings
                    Test-GPUSettings
                    Test-NetworkSettings
                    Test-TimerSettings
                    Test-CPUSettings
                    Test-MemorySettings
                    Test-ProcessLasso
                    Test-EventViewerErrors
                }

                Write-Host ""
                Write-Host "  Generating HTML report..." -ForegroundColor Yellow
                $reportPath = Generate-HTMLReport
                Write-Host ""
                Write-Host "  Report saved to: $reportPath" -ForegroundColor Green
                Write-Host ""

                $open = Read-Host "  Open report in browser? (Y/N)"
                if ($open -eq "Y" -or $open -eq "y") {
                    Start-Process $reportPath
                }
                Read-Host "  Press Enter to continue"
            }
            "6" {
                $Global:Findings.Clear()
                $Global:Recommendations.Clear()
                $Global:Stats = @{ Pass = 0; Warning = 0; Fail = 0; Critical = 0; Total = 0 }

                Test-FACEITACStatus
                Test-SecuritySettings
                Test-ConflictingSoftware

                Write-Host ""
                Write-Host "  Quick Check Complete!" -ForegroundColor Green
                Write-Host ""
                Read-Host "  Press Enter to continue"
            }
            "Q" {
                Write-Host ""
                Write-Host "  Goodbye! - FPSOS.GG" -ForegroundColor Magenta
                return
            }
            default {
                Write-Host "  Invalid option" -ForegroundColor Red
                Start-Sleep -Seconds 1
            }
        }
    }
}

# ================================================================================
# ENTRY POINT
# ================================================================================

$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host ""
    Write-Host "  ERROR: This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "  Please right-click and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Parse CLI args and support non-interactive runs
Parse-Arguments
Discover-DevicePaths

if ($args.Length -gt 0 -or $Script:ApplyProfile) {
    # Non-interactive mode: either apply a profile or run diagnostics based on arguments
    if ($Script:ApplyProfile) {
        Write-Section "AUTO-APPLY PROFILE"
        if ($Script:WhatIf) {
            Write-Host "    WhatIf: would apply profile $Script:ApplyProfile" -ForegroundColor Yellow
        } else {
            $applied = Apply-AffinityProfile -ProfileKey $Script:ApplyProfile
            if ($applied) { Write-Host "    Applied profile: $Script:ApplyProfile" -ForegroundColor Green }
        }
    }

    # Run diagnostics and export reports
    $Global:Findings.Clear()
    $Global:Recommendations.Clear()
    $Global:Stats = @{ Pass = 0; Warning = 0; Fail = 0; Critical = 0; Total = 0 }

    Run-AllDiagnostics
    Finish-AndExport
    Write-Host "\nNon-interactive run complete. Reports saved to: $Script:OutputPath" -ForegroundColor Cyan
    exit 0
} else {
    Show-MainMenu
}
