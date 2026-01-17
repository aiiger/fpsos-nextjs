export type LatencyGrade = 'S' | 'A' | 'B' | 'F';

export interface HardwarePart {
    id: string;
    brand: string;
    model: string;
    category: 'CPU' | 'Motherboard' | 'RAM' | 'GPU' | 'Mouse' | 'Mousepad' | 'Skate' | 'Module' | 'Maintenance' | 'Monitor' | 'Service' | 'Case' | 'Cooler' | 'Package';
    latencyGrade: LatencyGrade;
    inputZeroCertified: boolean;
    stockStatus: 'In Stock' | 'Rare/Pre-order' | 'Backordered';
    price: number; // Final price including margin
    marketLowest?: number; // Lowest found price in GCC
    sourcedFrom?: 'Amazon' | 'Noon' | 'GCC Gamers' | 'YallaGamers' | 'Direct';
    retailerLinks?: {
        amazon?: string;
        noon?: string;
        gccgamers?: string;
        yallagamers?: string;
    };
    technicalAlerts: string[];
    specs: Record<string, string | boolean>;
}

export const INPUT_ZERO_REGISTRY: HardwarePart[] = [
    // --- SPECIALIZED MODULES ---
    {
        id: 'asus-tpm-l-r2-0',
        brand: 'ASUS',
        model: 'TPM-L R2.0 (14-1 Pin)',
        category: 'Module',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'Rare/Pre-order',
        price: 149,
        technicalAlerts: [
            'CRITICAL: Required to bypass fTPM stutter on compatible ASUS boards.',
            'Warning: Verify physical header presence before purchase.'
        ],
        specs: {
            pinCount: '14-1',
            type: 'Infineon SLB 9665'
        }
    },

    // --- MAINTENANCE & HYGIENE (MILK-ABLE) ---
    {
        id: 'electric-dust-blower-pro',
        brand: 'InputZero',
        model: 'Hurricane Pro Dust Blower',
        category: 'Maintenance',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 249, // User acquired for 70 AED, we sell for premium
        technicalAlerts: [
            'High-torque motor prevents thermal throttling through dust-free maintenance.',
            'Required for long-term consistency of high-airflow mesh cases.'
        ],
        specs: { motor: '90000 RPM', type: 'Cordless' }
    },
    {
        id: 'detailing-kit',
        brand: 'InputZero',
        model: 'Sensor & Surface Detailing Kit',
        category: 'Maintenance',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 129,
        technicalAlerts: [
            'Maintains sensor precision on glass pads.',
            'Anti-static formulation for internal component cleaning.'
        ],
        specs: { contents: 'Sensor Swabs, Anti-static wipes' }
    },

    // --- MOTHERBOARDS ---
    {
        id: 'asus-x870e-hero',
        brand: 'ASUS',
        model: 'ROG Crosshair X870E Hero',
        category: 'Motherboard',
        latencyGrade: 'F',
        inputZeroCertified: false,
        stockStatus: 'In Stock',
        price: 3200,
        technicalAlerts: [
            'LATENCY TRAP: No physical TPM header. Forces fTPM (firmware) usage.',
            'Documented fTPM-stutter issues in CS2/Faceit.',
            'NOT RECOMMENDED FOR INPUTZERO BUILDS.'
        ],
        specs: {
            tpmHeader: false,
            nic: 'Intel 2.5Gb',
            wifi: 'WiFi 7'
        }
    },
    {
        id: 'asrock-x670e-taichi-lite',
        brand: 'ASRock',
        model: 'X670E Taichi Lite',
        category: 'Motherboard',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 2070,
        marketLowest: 1800,
        sourcedFrom: 'GCC Gamers',
        retailerLinks: {
            amazon: 'https://www.amazon.ae/s?k=X670E+Taichi+Lite',
            gccgamers: 'https://gccgamers.com/asrock-x670e-taichi-lite.html'
        },
        technicalAlerts: [
            'THE GOLD STANDARD. Minimalist VRM routing for ultra-low DPC latency.',
            'Retains physical TPM header.',
            'Best-in-class interrupt isolation.'
        ],
        specs: {
            tpmHeader: true,
            nic: 'Intel 2.5Gb',
            wifi: 'WiFi 6E'
        }
    },
    {
        id: 'msi-mag-b650-tomahawk',
        brand: 'MSI',
        model: 'MAG B650 Tomahawk WiFi',
        category: 'Motherboard',
        latencyGrade: 'A',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 1100,
        technicalAlerts: [
            'High reliability, logical PCB layout.',
            'Lower DPC latency than many X670E counterparts.',
            'Physical TPM header present.'
        ],
        specs: {
            tpmHeader: true,
            nic: 'Realtek 2.5Gb',
            wifi: 'WiFi 6E'
        }
    },
    {
        id: 'msi-meg-b550-unify-x',
        brand: 'MSI',
        model: 'MEG B550 UNIFY-X',
        category: 'Motherboard',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'Rare/Pre-order',
        price: 1400,
        technicalAlerts: [
            'DDR4 KING. 2-DIMM config for superior signal integrity.',
            'Lowest DPC latency floor on mature AM4 platform.',
            'Physical TPM header present.'
        ],
        specs: {
            tpmHeader: true,
            nic: 'Realtek 2.5Gb',
            wifi: 'WiFi 6'
        }
    },
    {
        id: 'asrock-x870e-taichi',
        brand: 'ASRock',
        model: 'X870E Taichi',
        category: 'Motherboard',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 2400,
        technicalAlerts: [
            'Excellent DPC latency isolation.',
            'Retains physical TPM header for dedicated hardware modules.'
        ],
        specs: {
            tpmHeader: true,
            nic: 'Realtek 5Gb (Lower DPC)',
            wifi: 'WiFi 7'
        }
    },
    {
        id: 'msi-meg-x870e-godlike',
        brand: 'MSI',
        model: 'MEG X870E GODLIKE',
        category: 'Motherboard',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 5200,
        technicalAlerts: [
            'Server-grade PCB signal integrity.',
            'Dedicated physical TPM module support.'
        ],
        specs: {
            tpmHeader: true,
            nic: 'Marvell 10Gb',
            wifi: 'WiFi 7'
        }
    },

    // --- CPUs ---
    {
        id: 'amd-9800x3d',
        brand: 'AMD',
        model: 'Ryzen 7 9800X3D',
        category: 'CPU',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'Rare/Pre-order',
        price: 2150, // Adjusted with margin
        marketLowest: 1850,
        sourcedFrom: 'GCC Gamers',
        retailerLinks: {
            amazon: 'https://www.amazon.ae/s?k=AMD+Ryzen+7+9800X3D',
            gccgamers: 'https://gccgamers.com/amd-ryzen-7-9800x3d.html',
            noon: 'https://www.noon.com/uae-en/search?q=9800X3D'
        },
        technicalAlerts: [
            'Next-gen cache architecture.',
            'Requires specific AGESA updates for latency stability.'
        ],
        specs: { cores: '8', cache: '96MB L3' }
    },
    {
        id: 'amd-7800x3d',
        brand: 'AMD',
        model: 'Ryzen 7 7800X3D',
        category: 'CPU',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 1890,
        marketLowest: 1650,
        sourcedFrom: 'Amazon',
        retailerLinks: {
            amazon: 'https://www.amazon.ae/s?k=7800X3D',
            gccgamers: 'https://gccgamers.com/amd-ryzen-7-7800x3d.html'
        },
        technicalAlerts: [
            'The reigning stability champion.',
            'Lower power-to-performance jitter than 9000 series (current AGESA).'
        ],
        specs: { cores: '8', cache: '96MB' }
    },
    {
        id: 'amd-5800x3d',
        brand: 'AMD',
        model: 'Ryzen 7 5800X3D',
        category: 'CPU',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 1450,
        technicalAlerts: [
            'THE LEGACY KING. Ultra-low floor DPC latency on mature AM4 platform.',
            'Best pairing with high-frequency DDR4 B-Die.'
        ],
        specs: { cores: '8', cache: '96MB L3' }
    },
    {
        id: 'gskill-trident-z-neo-ddr4',
        brand: 'G.Skill',
        model: 'Trident Z Neo (B-Die) 3600 CL14',
        category: 'RAM',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 950,
        technicalAlerts: [
            'Samsung B-Die. The lowest CAS latency floor for DDR4.',
            'Must be manually tuned for "InputZero" specs.'
        ],
        specs: { type: 'DDR4', speed: '3600MT/s', cl: '14' }
    },
    {
        id: 'amd-7600',
        brand: 'AMD',
        model: 'Ryzen 5 7600',
        category: 'CPU',
        latencyGrade: 'A',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 850,
        technicalAlerts: [
            'Best value for entry-level competitive throughput.',
            'Minimal heat; maintains consistent clock speeds.'
        ],
        specs: { cores: '6', cache: '32MB' }
    },

    // --- GPUs ---
    {
        id: 'rtx-4090',
        brand: 'NVIDIA',
        model: 'RTX 4090 Founders Edition',
        category: 'GPU',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 8970,
        marketLowest: 7800,
        sourcedFrom: 'Amazon',
        retailerLinks: {
            amazon: 'https://www.amazon.ae/s?k=RTX+4090',
            noon: 'https://www.noon.com/uae-en/search?q=RTX+4090'
        },
        technicalAlerts: [
            'Maximum frame throughput.',
            'Minimal V-BIOS latency jitter.'
        ],
        specs: { vram: '24GB' }
    },
    {
        id: 'rtx-4080-super',
        brand: 'NVIDIA',
        model: 'RTX 4080 Super',
        category: 'GPU',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 4830,
        marketLowest: 4200,
        sourcedFrom: 'Noon',
        retailerLinks: {
            amazon: 'https://www.amazon.ae/s?k=RTX+4080+Super',
            noon: 'https://www.noon.com/uae-en/search?q=RTX+4080+Super'
        },
        technicalAlerts: [
            'Optimal balance of throughput and motion-to-photon delay.'
        ],
        specs: { vram: '16GB' }
    },
    {
        id: 'rtx-4070-super',
        brand: 'NVIDIA',
        model: 'RTX 4070 Super',
        category: 'GPU',
        latencyGrade: 'A',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 2500,
        technicalAlerts: [
            'Entry-level elite performance.'
        ],
        specs: { vram: '12GB' }
    },

    // --- MICE ---
    {
        id: 'razer-viper-v3-pro',
        brand: 'Razer',
        model: 'Viper V3 Pro',
        category: 'Mouse',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 650,
        technicalAlerts: [
            '8000Hz Polling stability verified.',
            'Lowest motion-to-photon click latency recorded in 2024.'
        ],
        specs: {
            polling: '8000Hz',
            weight: '54g'
        }
    },
    {
        id: 'logitech-g-pro-x-superlight-2',
        brand: 'Logitech',
        model: 'G Pro X Superlight 2',
        category: 'Mouse',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 590,
        technicalAlerts: [
            'Rock-solid sensor tracking.',
            'Hybrid switches eliminate double-click delay.'
        ],
        specs: {
            polling: '4000Hz',
            weight: '60g'
        }
    },

    // --- SKATES ---
    {
        id: 'xraypad-obsidian',
        brand: 'X-RayPad',
        model: 'Obsidian Skates',
        category: 'Skate',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 85,
        technicalAlerts: [
            'Optimized for glass/hard surfaces.',
            'Hardened PTFE reduces "static friction lock" for pixel-perfect micro-adjustments.'
        ],
        specs: {
            material: 'Hardened PTFE',
            texture: 'Textured Control'
        }
    },
    {
        id: 'wallhack-glass-skates',
        brand: 'Wallhack',
        model: 'Superglide / Glass Skates',
        category: 'Skate',
        latencyGrade: 'A',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 120,
        technicalAlerts: [
            'Lowest static friction available.',
            'Note: Requires humidity-controlled environment to prevent "muddy" feel.'
        ],
        specs: {
            material: 'Aluminosilicate Glass',
            texture: 'Ultra Smooth'
        }
    },

    // --- MOUSEPADS ---
    {
        id: 'artisan-hien-soft',
        brand: 'Artisan',
        model: 'Hien Soft XL (Wine Red)',
        category: 'Mousepad',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 280,
        technicalAlerts: [
            'The "Stability" Base. Hybrid surface for consistent micro-flicks.',
            'Independent of humidity; maintains surface speed 24/7.'
        ],
        specs: {
            surface: 'Amundsen Fabric',
            speed: 'Mid-Fast'
        }
    },
    {
        id: 'wallhack-sp-004',
        brand: 'Wallhack',
        model: 'SP-004 Glass Pad',
        category: 'Mousepad',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 450,
        technicalAlerts: [
            'Theoretical limit of low dynamic friction.',
            'Pairs exclusively with Obsidian PTFE skates for "InputZero" feel.'
        ],
        specs: {
            surface: 'Glass',
            speed: 'Ultra Fast'
        }
    },

    // --- MONITORS (LATENCY VETTED) ---
    {
        id: 'benq-xl2586x',
        brand: 'Zowie',
        model: 'XL2586X 540Hz',
        category: 'Monitor',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'Rare/Pre-order',
        price: 4800,
        technicalAlerts: [
            'The ultimate motion clarity tool. DyAc™ 2 technology.',
            'Requires 540FPS minimum for optimal perceived latency.'
        ],
        specs: { refresh: '540Hz', panel: 'TN' }
    },
    {
        id: 'asus-pg27aqn',
        brand: 'ASUS',
        model: 'ROG Swift 360Hz PG27AQN',
        category: 'Monitor',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 3600,
        technicalAlerts: [
            'G-Sync Reflex Analyzer integrated for real-time latency audits.',
            '1440p resolution for higher visual fidelity without major latency trade-off.'
        ],
        specs: { refresh: '360Hz', resolution: '1440p' }
    },

    // --- CASES (AIRFLOW & ISOLATION) ---
    {
        id: 'fractal-north-xl',
        brand: 'Fractal Design',
        model: 'North XL (Mesh)',
        category: 'Case',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 850,
        technicalAlerts: [
            'Maximum airflow for thermal stability.',
            'Mesh side panel prevents heat-trap jitter in long sessions.'
        ],
        specs: { material: 'Wood/Mesh', format: 'E-ATX' }
    },
    {
        id: 'lian-li-o11d-evo',
        brand: 'Lian Li',
        model: 'O11 Dynamic EVO RGB',
        category: 'Case',
        latencyGrade: 'A',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 790,
        technicalAlerts: [
            'Premium aesthetics with verified spacing for E-ATX boards.',
            'Supports dual-chamber isolation for component heat separation.'
        ],
        specs: { orientation: 'Reversible', glass: 'Tempered' }
    },

    // --- COOLING ---
    {
        id: 'noctua-nh-d15-g2',
        brand: 'Noctua',
        model: 'NH-D15 G2',
        category: 'Cooler',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 650,
        technicalAlerts: [
            'ZERO PUMP JITTER. Air cooling eliminates hydraulic pump noise floor.',
            'Tested for 0% thermal-induced clock fluctuation on 7800X3D.'
        ],
        specs: { type: 'Air', noise: 'Ultra-low' }
    },
    {
        id: 'arctic-liquid-freezer-iii-360',
        brand: 'Arctic',
        model: 'Liquid Freezer III 360',
        category: 'Cooler',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 520,
        technicalAlerts: [
            'Best-in-class VRM cooling fan reduces motherboard thermal DPC spikes.',
            'Offset mounting for AM5 hotspots.'
        ],
        specs: { type: 'AIO', radiant: '360mm' }
    },

    // --- ELITE PACKAGING (THE EXPERIENCE) ---
    {
        id: 'archive-box-pro',
        brand: 'InputZero',
        model: 'The Artifact Case',
        category: 'Package',
        latencyGrade: 'S',
        inputZeroCertified: true,
        stockStatus: 'In Stock',
        price: 450,
        technicalAlerts: [
            'Industrial-grade flight case for zero-damage transit.',
            'Contains physical DPC Latency Verification Card.'
        ],
        specs: { material: 'Reinforced Aluminum', inserts: 'Laser-cut foam' }
    }
];

export type BuildTier = 'ABSOLUTE' | 'APEX' | 'EFFICIENT' | 'COMPACT' | 'COMPETITIVE' | 'LEGACY';

export function getCertifiedBuild(tier: BuildTier) {
    const registry = INPUT_ZERO_REGISTRY;

    const base = {
        absolute: {
            cpu: 'amd-9800x3d',
            gpu: 'rtx-4090',
            mobo: 'msi-meg-x870e-godlike',
            case: 'fractal-north-xl',
            cooler: 'arctic-liquid-freezer-iii-360',
            mouse: 'razer-viper-v3-pro',
            pad: 'wallhack-sp-004',
            skate: 'xraypad-obsidian'
        },
        apex: {
            cpu: 'amd-7800x3d',
            gpu: 'rtx-4080-super',
            mobo: 'asrock-x670e-taichi-lite',
            case: 'lian-li-o11d-evo',
            cooler: 'noctua-nh-d15-g2',
            mouse: 'logitech-g-pro-x-superlight-2',
            pad: 'artisan-hien-soft',
            skate: 'xraypad-obsidian'
        },
        legacy: {
            cpu: 'amd-5800x3d',
            gpu: 'rtx-4070-super',
            mobo: 'msi-meg-b550-unify-x',
            case: 'fractal-north-xl',
            cooler: 'noctua-nh-d15-g2',
            mouse: 'razer-viper-v3-pro',
            pad: 'artisan-hien-soft',
            skate: 'xraypad-obsidian'
        },
        compact: {
            cpu: 'amd-7600',
            gpu: 'rtx-4070-super',
            mobo: 'msi-mag-b650-tomahawk',
            case: 'lian-li-o11d-evo',
            cooler: 'arctic-liquid-freezer-iii-360',
            mouse: 'razer-viper-v3-pro',
            pad: 'artisan-hien-soft',
            skate: 'xraypad-obsidian'
        },
        efficient: {
            cpu: 'amd-7800x3d',
            gpu: 'rtx-4070-super',
            mobo: 'msi-mag-b650-tomahawk',
            case: 'fractal-north-xl',
            cooler: 'noctua-nh-d15-g2',
            mouse: 'logitech-g-pro-x-superlight-2',
            pad: 'artisan-hien-soft',
            skate: 'xraypad-obsidian'
        },
        competitive: {
            cpu: 'amd-7600',
            gpu: 'rtx-4070-super',
            mobo: 'msi-mag-b650-tomahawk',
            case: 'lian-li-o11d-evo',
            cooler: 'noctua-nh-d15-g2',
            mouse: 'razer-viper-v3-pro',
            pad: 'artisan-hien-soft',
            skate: 'xraypad-obsidian'
        }
    };

    const config = base[tier.toLowerCase() as keyof typeof base] || base.apex;

    return {
        cpu: registry.find(p => p.id === config.cpu),
        gpu: registry.find(p => p.id === config.gpu),
        mobo: registry.find(p => p.id === config.mobo),
        case: registry.find(p => p.id === config.case),
        cooler: registry.find(p => p.id === config.cooler),
        peripherals: {
            mouse: registry.find(p => p.id === config.mouse),
            pad: registry.find(p => p.id === config.pad),
            skate: registry.find(p => p.id === config.skate)
        }
    };
}
