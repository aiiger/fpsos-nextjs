# CS2 Optimization Quick Reference

## Evidence-Based CS2 Performance Guidelines

This reference contains the technical knowledge embedded in the diagnostic tool, sourced from competitive gaming research, hardware benchmarking, and CS2-specific optimization principles.

---

## GPU Performance Tiers (CS2 @ 1080p Competitive Settings)

### High-End (360+ fps capable)
- NVIDIA: RTX 4090, 4080, 4070 Ti, 4070, RTX 3090, 3080, 3070
- AMD: RX 7900 XTX/XT, RX 7800 XT, RX 6900 XT, RX 6800 XT

**Optimization Focus:**
- Driver settings (NVIDIA Reflex, power management)
- Frame rate capping strategy (unlimited vs 2x refresh)
- GPU temperature management

### Mid-Range (240+ fps capable)
- NVIDIA: RTX 4060 Ti/4060, RTX 3060 Ti/3060, RTX 2070/2060, GTX 1660 Ti/Super, GTX 1070
- AMD: RX 7700 XT, RX 7600, RX 6700 XT, RX 6650/6600 XT, RX 5700 XT, RX 5600 XT

**Optimization Focus:**
- Competitive settings (medium shadows, low effects)
- Disable anti-aliasing for higher fps
- 1080p native resolution recommended

### Entry-Level (144+ fps @ low settings)
- NVIDIA: GTX 1650, GTX 1050 Ti
- AMD: RX 6500 XT, RX 5500 XT
- Intel: Arc A380, A750

**Optimization Focus:**
- Low settings, disable anti-aliasing
- 1080p only (avoid 1440p)
- May need to disable shadows for consistent fps

### Integrated GPUs (NOT RECOMMENDED)
- Intel UHD Graphics, Iris Xe (non-Arc)
- AMD Vega Graphics (APU integrated)

**Reality Check:**
- Expect <60 fps even on lowest settings
- CS2 requires dedicated GPU for playable framerates
- Minimum recommendation: GTX 1660 / RX 6600

---

## Display Configuration (Competitive CS2)

### Elite Tier: 1080p @ 360Hz
**Monitors:** BenQ XL2566K, ZOWIE XL2586X, ASUS PG259QN
- Optimal for competitive CS2
- Target fps: 720+ (2x refresh) or unlimited
- Disable G-SYNC/FreeSync (adds latency)
- Most responsive setup available

### Excellent Tier: 1080p @ 240Hz
**Monitors:** Common 240Hz TN/IPS panels
- Preferred by most CS2 pros
- Target fps: 480+ for optimal frame pacing
- Sweet spot of price/performance
- Industry standard for competitive play

### Solid Tier: 1080p @ 144-165Hz
**Monitors:** Entry competitive monitors
- Minimum for serious competitive play
- Target fps: 300+ for smooth gameplay
- Good starting point for competitive

### Warning: 1440p High Refresh
- 77% more pixels than 1080p = 20-30% fps penalty
- Even with high-end GPU, harder to maintain high framerates
- Pros overwhelmingly prefer 1080p for performance
- Consider if you prioritize visibility over max fps

### Not Recommended: 4K
- 4x pixels of 1080p = severe fps penalty
- Even RTX 4090 struggles to maintain 360+ fps @ 4K
- **Strong recommendation:** Play at 1080p native or scaled
- No competitive advantage, significant performance cost

### Critical Settings:
- **DPI Scaling:** Set Windows to 100% (not 125%, 150%, etc.)
  - Causes blurry rendering and input lag in CS2
- **G-SYNC/FreeSync:** Disable for competitive (adds latency)
- **Ultrawide:** Limited benefit in CS2, stretched FOV reduces target size

---

## Network Requirements (Competitive CS2)

### Jitter Thresholds (Standard Deviation)
- **<3ms:** Elite - competitive-ready, very low jitter
- **<8ms:** Good - sufficient for competitive CS2
- **<15ms:** Warning - affects hit registration consistency
- **>15ms:** Critical - causes shots to miss, enemy teleporting

### Packet Loss Tolerance
- **0%:** Ideal - zero tolerance for competitive
- **<1%:** Acceptable - minor impact
- **1-2%:** Warning - noticeable hit registration issues
- **>2%:** Critical - severe rubberbanding, shots not registering

### Why Jitter Matters in CS2
- Directly affects hitbox registration accuracy
- Impacts peeker's advantage consistency
- Causes "shots that should hit" to miss
- More important than static ping for consistency

### Network Optimization Priority
1. **Wired Ethernet** (not WiFi) - single biggest improvement
2. **Router QoS** - prioritize game traffic (CAKE QoS on ASUS routers)
3. **Close Background Apps** - stop downloads, streaming during play
4. **ISP Quality** - contact ISP if consistent packet loss >1%
5. **ExitLag/VPN** - for geographic routing (Dubai→EU scenario)

---

## Frame Timing (CS2 Subtick System)

### CS2 vs Browser Testing
- CS2 uses **Source 2 subtick system** (NOT Source 1 tick-based)
- Browser RAF testing ≠ in-game performance
- Use in-game commands for accurate testing:
  - `fps_max 0` - unlimited fps
  - `cl_showfps 1` - show fps counter
  - `net_graph 1` - show network stats

### Frame Time Consistency
- **<2ms stddev:** Excellent - very stable system
- **<5ms stddev:** Good - should translate well in-game
- **<10ms stddev:** Warning - manifests as microstutters
- **>10ms stddev:** Critical - will cause stuttering

### Frame Pacing Strategy
- **High refresh (360Hz):** Cap at 2x refresh (720) or unlimited
- **240Hz:** Target 480+ fps
- **144Hz:** Target 300+ fps minimum

### Why Consistency > Peak FPS
- 1% low fps more important than average
- Frame time variance causes input lag perception
- Stutters disrupt aim tracking and spray control

---

## CS2 Launch Options (Steam)

### Recommended:
```
-high -novid -nojoy +fps_max 0 +cl_forcepreload 1
```

### Explanation:
- `-high` - High CPU priority (more CPU time for CS2)
- `-novid` - Skip Valve intro video (faster startup)
- `-nojoy` - Disable joystick support (slight performance gain)
- `+fps_max 0` - Unlimited fps (or set to 2x refresh rate)
- `+cl_forcepreload 1` - Preload map assets (may reduce stuttering)

### AVOID (Outdated from CS:GO):
- `-threads` - CS2 handles threading automatically
- `-processheap` - Not applicable to Source 2
- `-tickrate` - Server-side only, no client effect
- `-lv` - Low violence mode, no performance benefit

---

## GPU-Specific Settings

### NVIDIA (RTX/GTX)

#### NVIDIA Control Panel Settings:
1. **Power Management Mode:** Prefer Maximum Performance
2. **Low Latency Mode:** Ultra (if no Reflex) or Off (if using Reflex)
3. **Texture Filtering - Quality:** High Performance
4. **V-SYNC:** Off (globally)
5. **Max Frame Rate:** Off (use in-game fps_max)

#### In-Game (CS2 Video Settings):
- **NVIDIA Reflex Low Latency:** Enabled + Boost
  - Reduces input lag by 10-30ms (verified by NVIDIA)
  - More effective than Low Latency Mode in Control Panel
- **V-SYNC:** Disabled

#### Driver Management:
- Use latest Game Ready driver from nvidia.com/drivers
- Clean install with DDU if multiple driver versions detected
- Check DriverStore for old driver remnants

### AMD (Radeon)

#### CRITICAL WARNING:
**Disable AMD Anti-Lag+ for CS2 - it triggers VAC bans (confirmed by Valve)**

#### AMD Radeon Software Settings:
1. **Anti-Lag:** Enabled (NOT Anti-Lag+)
2. **Radeon Chill:** Disabled (limits fps, adds latency)
3. **FreeSync/Enhanced Sync:** Disabled (adds latency)
4. **Texture Filtering Quality:** Performance
5. **V-SYNC:** Disabled

#### In-Game Settings:
- No Reflex equivalent (AMD-specific)
- Use Radeon Anti-Lag (the original, not +)

---

## Windows Optimization (CS2-Specific)

### Power Plan
- **AMD Ryzen (especially X3D):** AMD Ryzen Balanced or High Performance
- **Intel:** High Performance or Ultimate Performance
- **Avoid:** Balanced or Power Saver (limits CPU clocks)

### Game Mode
- **Enable:** Windows Game Mode (improves resource allocation)
- **Disable:** Xbox Game Bar overlay (press Win+G to access settings)
- **Disable:** Game DVR (causes performance overhead)

### Fullscreen Optimizations
- **Recommendation:** Disable for CS2 executable
  - May reduce input lag in some systems
  - Test both enabled/disabled for your setup

### Windows Defender Exclusions
- Add CS2 installation folder to exclusions
- Reduces real-time scanning overhead during gameplay
- Path: `Steam\steamapps\common\Counter-Strike Global Offensive`

### Background Processes
- **Disable Overlays:**
  - Discord overlay (User Settings > Overlay)
  - NVIDIA GeForce Experience overlay
  - MSI Afterburner / RivaTuner on-screen display
  - Steam overlay (if not needed)
- **Close Resource-Heavy Apps:**
  - Chrome (high CPU usage)
  - Spotify (use web player or phone)
  - OBS / Streamlabs (if not streaming)

### HPET (High Precision Event Timer)
- **Recommendation:** Disabled (may reduce input latency)
- Check with: `bcdedit /enum | findstr useplatformclock`
- Disable with: `bcdedit /deletevalue useplatformclock`
- Test both states (system-dependent)

---

## DPI Scaling (Critical for CS2)

### The Problem:
- Windows DPI scaling (125%, 150%, 200%) causes:
  - Blurry rendering in CS2
  - Input lag / mouse feel issues
  - Inconsistent pixel mapping

### The Fix:
1. Set Windows scaling to **100%** (Settings > Display > Scale)
2. If text too small, increase monitor size or sit closer
3. Verify in-game resolution matches native monitor resolution

### Why This Matters:
- CS2 expects 1:1 pixel mapping
- Scaling introduces rendering overhead and latency
- Competitive players universally use 100% scaling

---

## Hardware Configuration Notes

### RAM
- **Minimum:** 16GB
- **Recommended:** 32GB for multitasking
- **Speed:** 3200MHz+ (especially important for AMD Ryzen)
- **Configuration:** Dual-channel REQUIRED (2 sticks, not 1)
  - Single-channel causes significant fps drops

### Storage
- **Requirement:** SSD (not HDD)
- **Impact:** Reduces load times and stuttering from asset streaming
- **Recommended:** NVMe SSD for CS2 installation

### CPU
- **Minimum:** 6 cores / 12 threads
- **Recommended:** 8+ cores for competitive + streaming
- **AMD X3D:** SMT disabled often better for CS2 (less latency)
- **Intel:** High single-thread performance important

### Network Adapter
- **Requirement:** Gigabit Ethernet (not WiFi)
- **Driver:** Update from motherboard manufacturer website
- **Settings:** Disable power saving on network adapter

---

## In-Game Settings Reference

### Video Settings (Competitive)
- **Resolution:** 1920x1080 (native)
- **Aspect Ratio:** 16:9 (do not use stretched)
- **Display Mode:** Fullscreen
- **V-SYNC:** Disabled
- **NVIDIA Reflex:** Enabled + Boost (NVIDIA only)
- **FPS Max:** 0 (unlimited) or 2x refresh rate

### Graphics Quality (Competitive)
- **Global Shadow Quality:** Low or Medium (visibility vs performance)
- **Model/Texture Detail:** Low or Medium
- **Effect Detail:** Low (reduces visual clutter)
- **Shader Detail:** Low
- **Boost Player Contrast:** Enabled (improves player visibility)
- **Anti-Aliasing:** MSAA 2x or Off (performance priority)
- **FXAA:** Disabled

### Console Commands (Essential)
```
fps_max 0                  // Unlimited fps (or 720 for 360Hz, 480 for 240Hz)
cl_showfps 1               // Show fps counter
net_graph 1                // Show network stats (ping, loss, choke)
cl_net_buffer_ticks 0      // Interpolation (0 for <30ms ping, 1-2 for higher latency)
rate 786432                // Max data rate (default is optimal)
```

### Network Settings (Dubai → EU Context)
- **Matchmaking Region:** EU West / EU East
- **Max Ping:** Set to acceptable value (e.g., 100-150 for Dubai→EU)
- **Use ExitLag or similar:** For optimized routing Dubai→EU
- **CAKE QoS on router:** Prioritize game traffic

---

## Diagnostic Tool Interpretation

### Browser Test Limitations
- **GPU Detection:** WebGL-based, less accurate than native queries
- **Network Test:** To Cloudflare, not CS2 servers
- **Frame Timing:** Browser RAF, not CS2 subtick
- **Recommendation:** Use PowerShell tool for system-level analysis

### PowerShell Tool (v3.0)
- Provides BIOS-level diagnostics
- Checks registry settings affecting gaming
- Analyzes driver versions and optimization state
- Detects CS2 installation and configuration
- Generates actionable report with categorized recommendations

---

## Common Myths Debunked

### Placebo Optimizations (NOT Recommended):
- ❌ Registry "magic tweaks" without technical basis
- ❌ CS:GO launch options in CS2 (different engine)
- ❌ Disabling random Windows services (can cause instability)
- ❌ "Gaming" network adapters (marginal if any benefit)

### Proven Optimizations (Evidence-Based):
- ✅ NVIDIA Reflex (10-30ms latency reduction, measured)
- ✅ Ethernet vs WiFi (consistent jitter reduction)
- ✅ Dual-channel RAM (measurable fps improvement)
- ✅ SSD vs HDD (I/O wait reduction, less stuttering)
- ✅ High Performance power plan (prevents CPU downclocking)
- ✅ DPI scaling to 100% (eliminates rendering overhead)

---

## Performance Troubleshooting Checklist

### Low FPS (<200 on capable hardware):
1. Update GPU drivers (manufacturer website)
2. Check Windows power plan (High Performance)
3. Verify in-game settings (not Ultra)
4. Check GPU temps (thermal throttling?)
5. Close background apps (Chrome, Discord, etc.)
6. Verify GPU is set as default in Windows Graphics Settings

### Stuttering / Microstutters:
1. Check frame time consistency (net_graph 1)
2. Verify SSD (not HDD) for CS2 installation
3. Add CS2 to Windows Defender exclusions
4. Disable overlays (Discord, GeForce Experience)
5. Check for thermal throttling (CPU/GPU temps)
6. Verify dual-channel RAM configuration

### High Ping / Lag:
1. Use Ethernet cable (not WiFi)
2. Check net_graph for packet loss (choke/loss)
3. Close background downloads/streaming
4. Enable router QoS (prioritize CS2 traffic)
5. Contact ISP if consistent packet loss >1%
6. Consider ExitLag for geographic routing

### Input Lag / Mouse Feel:
1. Disable DPI scaling (set to 100%)
2. Enable NVIDIA Reflex (if NVIDIA GPU)
3. Disable V-SYNC (in-game and control panel)
4. Check polling rate (1000Hz recommended)
5. Disable overlays and background apps
6. Verify fullscreen mode (not borderless)

---

## Professional Service Context

### When DIY is Sufficient:
- Driver updates and Windows settings
- In-game configuration optimization
- Basic network troubleshooting
- Overlay and background app management

### When Professional Help Makes Sense:
- **BIOS Optimization:** Complex settings (curve optimizer, memory timings, etc.)
- **Interrupt Affinity:** Requires registry expertise
- **Network Configuration:** Advanced QoS, routing, adapter tuning
- **System-Level Diagnostics:** Hardware issues, thermal problems
- **Time Constraints:** Systematic optimization vs. trial-and-error

### Service Tiers (Honest Context):
- **Quick Fix:** Single-issue resolution, in-game settings, basic Windows
- **Full Tune-Up:** Comprehensive optimization (drivers, Windows, in-game)
- **Extreme BIOSPRIME:** Deep system-level (BIOS, registry, network, hardware)

---

## References & Further Reading

### Technical Sources:
- NVIDIA Reflex latency analysis (nvidia.com/reflex)
- CS2 Source 2 engine documentation (developer.valvesoftware.com)
- AMD Anti-Lag+ VAC ban advisory (confirmed by Valve/AMD)
- Competitive gaming display analysis (blurbusters.com)

### Tools Mentioned:
- **DDU (Display Driver Uninstaller):** Clean GPU driver installs
- **HWiNFO64:** Temperature and sensor monitoring
- **MSI Afterburner:** GPU monitoring (disable overlay for CS2)
- **ExitLag:** Geographic routing optimization
- **net_graph 1:** In-game network diagnostics

---

## Conclusion

The diagnostic tool embodies these principles:
- **Evidence-based recommendations only**
- **CS2-specific context for every setting**
- **Transparent about limitations and uncertainties**
- **Educational approach that empowers users**
- **Professional services positioned honestly**

Users should feel **educated and empowered**, not pressured or confused.

Performance optimization is a systematic process - start with free fixes, measure results, iterate. Professional help is for complex system-level work beyond DIY scope, not basic driver updates and Windows settings.

**Good luck, and may your fps be high and your ping be low.**
