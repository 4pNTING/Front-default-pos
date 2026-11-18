import { NextRequest, NextResponse } from "next/server";
import net from "net";
import {
  buildReceiptESC,
  buildKitchenTicketESC,
  buildTestPrintESC,
  buildCashDrawerESC,
  PrintableReceiptData,
  PrintableKitchenData,
  ESCPOSOptions,
} from "@/utils/escpos";

export const runtime = "nodejs";

interface SendResult {
  success: boolean;
  latencyMs: number;
  error?: string;
}

/**
 * Socket Helper: Open TCP connection to thermal printer on Port 9100,
 * write byte payload, and close cleanly.
 */
function transmitSocketData(
  ip: string,
  port: number,
  payload: string | Buffer,
  timeoutMs: number = 4000
): Promise<SendResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const client = new net.Socket();
    let isFinished = false;

    const finalize = (result: SendResult) => {
      if (isFinished) return;
      isFinished = true;
      try {
        client.removeAllListeners();
        client.destroy();
      } catch (e) {
        // ignore socket destroy error
      }
      resolve(result);
    };

    client.setTimeout(timeoutMs);

    client.on("connect", () => {
      // If payload is empty (e.g. ping/test connection only), resolve immediately
      if (!payload || payload.length === 0) {
        const latencyMs = Date.now() - startTime;
        finalize({ success: true, latencyMs });
        return;
      }

      // Convert string payload into Buffer with binary/latin1 encoding
      let buffer: Buffer;
      if (Buffer.isBuffer(payload)) {
        buffer = payload;
      } else {
        buffer = Buffer.from(payload, "binary");
      }

      client.write(buffer, (err) => {
        const latencyMs = Date.now() - startTime;
        if (err) {
          finalize({
            success: false,
            latencyMs,
            error: `Failed to write data to printer: ${err.message}`,
          });
          return;
        }

        // Allow 100ms for hardware buffer to flush before closing socket
        setTimeout(() => {
          finalize({ success: true, latencyMs });
        }, 120);
      });
    });

    client.on("timeout", () => {
      finalize({
        success: false,
        latencyMs: Date.now() - startTime,
        error: `Printer connection timed out after ${timeoutMs}ms (${ip}:${port}). Verify that the printer is powered on and connected to the local network.`,
      });
    });

    client.on("error", (err: any) => {
      const latencyMs = Date.now() - startTime;
      let errorMsg = `Socket error (${ip}:${port}): ${err.message}`;

      if (err.code === "ECONNREFUSED") {
        errorMsg = `Connection refused at ${ip}:${port}. The printer was reached, but port ${port} is closed or currently busy.`;
      } else if (err.code === "EHOSTUNREACH" || err.code === "ENETUNREACH") {
        errorMsg = `Host unreachable (${ip}:${port}). Make sure your computer is on the same Wi-Fi / LAN subnet as the printer.`;
      } else if (err.code === "ETIMEDOUT") {
        errorMsg = `Connection timed out (${ip}:${port}). Printer did not respond.`;
      }

      finalize({
        success: false,
        latencyMs,
        error: errorMsg,
      });
    });

    try {
      client.connect(port, ip);
    } catch (err: any) {
      finalize({
        success: false,
        latencyMs: Date.now() - startTime,
        error: `Could not initiate socket connection: ${err?.message || "Unknown error"}`,
      });
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ip, port = 9100, data, options = {} } = body;

    // Validate IP address
    if (!ip || typeof ip !== "string") {
      return NextResponse.json(
        { success: false, error: "Printer IP address is required." },
        { status: 400 }
      );
    }

    const targetPort = Number(port) || 9100;

    // Action 1: Ping / Test Connection (no paper feed)
    if (action === "ping" || action === "test") {
      const result = await transmitSocketData(ip, targetPort, "", 3000);
      return NextResponse.json(result);
    }

    // Action 2: Diagnostic Test Print Slip
    if (action === "print-test") {
      const commands = buildTestPrintESC({
        paperWidth: options.paperWidth || "80mm",
        beep: options.beep !== false,
        targetName: options.targetName || "Thermal Receipt Printer",
        ip,
        port: targetPort,
      });
      const result = await transmitSocketData(ip, targetPort, commands, 5000);
      return NextResponse.json(result);
    }

    // Action 3: Print Receipt / Bill
    if (action === "print-receipt") {
      if (!data) {
        return NextResponse.json(
          { success: false, error: "Receipt data is missing." },
          { status: 400 }
        );
      }
      const commands = buildReceiptESC(data as PrintableReceiptData, options as ESCPOSOptions);
      const result = await transmitSocketData(ip, targetPort, commands, 6000);
      return NextResponse.json(result);
    }

    // Action 4: Print Kitchen Order Ticket
    if (action === "print-kitchen") {
      if (!data) {
        return NextResponse.json(
          { success: false, error: "Kitchen ticket data is missing." },
          { status: 400 }
        );
      }
      const commands = buildKitchenTicketESC(data as PrintableKitchenData, options as ESCPOSOptions);
      const result = await transmitSocketData(ip, targetPort, commands, 6000);
      return NextResponse.json(result);
    }

    // Action 5: Kick Cash Drawer Open
    if (action === "open-drawer") {
      const commands = buildCashDrawerESC();
      const result = await transmitSocketData(ip, targetPort, commands, 3000);
      return NextResponse.json(result);
    }

    // Action 6: Raw Commands
    if (action === "raw") {
      if (!data) {
        return NextResponse.json(
          { success: false, error: "Raw print payload is missing." },
          { status: 400 }
        );
      }
      const result = await transmitSocketData(ip, targetPort, data, 5000);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: `Unsupported print action: '${action}'` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("API /api/print error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error occurred while printing.",
      },
      { status: 500 }
    );
  }
}
