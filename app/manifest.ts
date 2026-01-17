import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'FPS Optimization Station',
        short_name: 'FPSOS',
        description: 'Elite PC Tuning & Optimization Services',
        start_url: '/',
        display: 'standalone',
        background_color: '#050505',
        theme_color: '#06b6d4',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
