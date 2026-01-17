import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  // Mock Data - Simulating a real report from the Discord Bot script
  const mockDiagnosis = {
    id: id,
    discordId: "User_" + Math.floor(Math.random() * 10000), 
    systemScore: 68, // Low score to trigger the "Fix Now" urgency
    metrics: {
      dpcLatency: { value: "450µs", status: "CRITICAL", target: "<250µs" },
      kernelTimer: { value: "15.6ms", status: "WARNING", target: "0.5ms" },
      threadPriority: { value: "Normal", status: "SUBOPTIMAL", target: "Realtime" },
      interrupts: { value: "4000/s", status: "HIGH_NOISE", target: "<500/s" }
    },
    issues: [
      "154 Telemetry Nodes Active",
      "HPET Enabled (Legacy Timing)",
      "Network Throttling Detected"
    ],
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(mockDiagnosis);
}