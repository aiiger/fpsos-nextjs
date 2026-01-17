import crypto from 'crypto';

interface PayPalWebhookHeaders {
    'paypal-transmission-id': string;
    'paypal-transmission-time': string;
    'paypal-transmission-sig': string;
    'paypal-cert-url': string;
    'paypal-auth-algo': string;
}

/**
 * Verify PayPal webhook signature
 * Documentation: https://developer.paypal.com/api/rest/webhooks/rest/
 */
export async function verifyPayPalWebhook(
    webhookId: string,
    headers: Record<string, string | null>,
    body: any
): Promise<boolean> {
    const transmissionId = headers['paypal-transmission-id'];
    const transmissionTime = headers['paypal-transmission-time'];
    const transmissionSig = headers['paypal-transmission-sig'];
    const certUrl = headers['paypal-cert-url'];
    const authAlgo = headers['paypal-auth-algo'];

    if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl || !authAlgo) {
        console.error('Missing PayPal webhook headers');
        return false;
    }

    // For development: Allow bypass if PAYPAL_WEBHOOK_SKIP_VERIFY is set
    if (process.env.PAYPAL_WEBHOOK_SKIP_VERIFY === 'true' && process.env.NODE_ENV === 'development') {
        console.warn('⚠️ PayPal webhook verification SKIPPED (dev mode)');
        return true;
    }

    try {
        // Construct expected signature payload
        const expectedSig = `${transmissionId}|${transmissionTime}|${webhookId}|${crc32(JSON.stringify(body))}`;

        // Download PayPal cert from certUrl
        const certResponse = await fetch(certUrl);
        if (!certResponse.ok) {
            console.error('Failed to fetch PayPal cert');
            return false;
        }

        const cert = await certResponse.text();

        // Verify signature
        const verifier = crypto.createVerify(authAlgo);
        verifier.update(expectedSig);

        const isValid = verifier.verify(cert, transmissionSig, 'base64');

        if (!isValid) {
            console.error('PayPal webhook signature verification failed');
        }

        return isValid;
    } catch (error) {
        console.error('PayPal webhook verification error:', error);
        return false;
    }
}

/**
 * CRC32 checksum for webhook signature
 */
function crc32(str: string): number {
    const table = makeCRCTable();
    let crc = 0 ^ (-1);

    for (let i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
}

function makeCRCTable(): number[] {
    let c: number;
    const crcTable: number[] = [];

    for (let n = 0; n < 256; n++) {
        c = n;
        for (let k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }

    return crcTable;
}
