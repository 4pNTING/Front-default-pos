import { NextRequest, NextResponse } from "next/server";
import net from "net";
import {
  buildReceiptESC,
  buildKitchenTicketESC,
  buildTestPrintESC,
  COMMANDS,
  PrintableReceiptData,
  PrintableKitchenData,
  ESCPOSOptions,
} from "@/utils/escpos";

export const runtime = "nodejs";

/**
 * Helper to send buffer or string over TCP socket
 */
function sendToPrinter(
  ip: string,
  port: number,
  data: string | Buffer,
  timeoutMs: number = 5000
): Promise<{ success: boolean; latencyMs: number; error?: string }> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const client = new net.Socket();

    let isResolved = false;

    const cleanup = () => {
      client.removeAllListeners();
      client.destroy();
    };

    client.setTimeout(timeoutMs);

    client.on("connect", () => {
      const buffer = typeof data === "string" ? Buffer.from(data, "latin1") : data;

      client.write(buffer, (err) => {
        const latencyMs = Date.now() - startTime;
        if (err) {
          cleanup();
          if (!isResolved) {
            isResolved = true;
            resolve({ success: false, latencyMs, error: err.message });
          }
          return;
        }

        // Give a short delay for printer buffer
        setTimeout(() => {
          cleanup();
          if (!isResolved) {
            isResolved = true;
            resolve({ success: true, latencyMs });
          }
        }, 150);
      });
    });

    client.on("timeout", () => {
      cleanup();
      if (!isResolved) {
        isResolved = true;
        resolve({
          success: false,
          latencyMs: Date.now() - startTime,
          error: `Connection to printer at ${ip}:${port} timed out after ${timeoutMs}ms`,
        });
      }
    });

    client.on("error", (err) => {
      cleanup();
      if (!isResolved) {
        isResolved = true;
        resolve({
          success: false,
          latencyMs: Date.now() - startTime,
          error: `Network printer error (${ip}:${port}): ${err.message}`,
        });
      }
    });

    try {
      client.connect(port, ip);
    } catch (err: any) {
      cleanup();
      if (!isResolved) {
        isResolved = true;
        resolve({
          success: false,
          latencyMs: Date.now() - startTime,
          error: err.message || "Failed to initiate printer connection",
        });
      }
    }
  });
}

/**
 * Helper to test connection (ping TCP port)
 */
function testConnection(
  ip: string,
  port: number,
  timeoutMs: number = 3000
): Promise<{ success: boolean; latencyMs: number; error?: string }> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const client = new net.Socket();

    let isResolved = false;

    const cleanup = () => {
      client.removeAllListeners();
      client.destroy();
    };

    client.setTimeout(timeoutMs);

    client.on("connect", () => {
      const latencyMs = Date.now() - startTime;
      cleanup();
      if (!isResolved) {
        isResolved = true;
        resolve({ success: true, latencyMs });
      }
    });

    client.on("timeout", () => {
      cleanup();
      if (!isResolved) {
        isResolved = true;
        resolve({
          success: false,
          latencyMs: Date.now() - startTime,
          error: `Host ${ip}:${port} unreachable (timeout)`,
        });
      }
    });

    client.on("error", (err) => {
      cleanup();
      if (!isResolved) {
        isResolved = true;
        resolve({
          success: false,
          latencyMs: Date.now() - startTime,
          error: err.message,
        });
      }
    });

    try {
      client.connect(port, ip);
    } catch (err: any) {
      cleanup();
      if (!isResolved) {
        isResolved = true;
        resolve({
          success: false,
          latencyMs: Date.now() - startTime,
          error: err.message,
        });
      }
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ip, port = 9100, data, options = {} } = body;

    if (!ip) {
      return NextResponse.json(
        { success: false, error: "Printer IP address is required" },
        { status: 400 }
      );
    }

    const printerPort = Number(port) || 9100;

    // 1. Test Connection
    if (action === "test") {
      const result = await testConnection(ip, printerPort, 3000);
      return NextResponse.json(result);
    }

    // 2. Open Cash Drawer Kick
    if (action === "open-drawer") {
      const result = await sendToPrinter(ip, printerPort, COMMANDS.OPEN_DRAWER, 4000);
      return NextResponse.json(result);
    }

    // 3. Print Test Slip
    if (action === "print-test") {
      const esc = buildTestPrintESC(options);
      const result = await sendToPrinter(ip, printerPort, esc, 6000);
      return NextResponse.json(result);
    }

    // 4. Print Receipt / Bill
    if (action === "print-receipt") {
      if (!data) {
        return NextResponse.json(
          { success: false, error: "Receipt data is required" },
          { status: 400 }
        );
      }
      const esc = buildReceiptESC(data as PrintableReceiptData, options as ESCPOSOptions);
      const result = await sendToPrinter(ip, printerPort, esc, 7000);
      return NextResponse.json(result);
    }

    // 5. Print Kitchen Order Ticket
    if (action === "print-kitchen") {
      if (!data) {
        return NextResponse.json(
          { success: false, error: "Kitchen ticket data is required" },
          { status: 400 }
        );
      }
      const esc = buildKitchenTicketESC(data as PrintableKitchenData, options as ESCPOSOptions);
      const result = await sendToPrinter(ip, printerPort, esc, 7000);
      return NextResponse.json(result);
    }

    // 6. Raw ESC/POS Payload
    if (action === "raw") {
      if (!data) {
        return NextResponse.json(
          { success: false, error: "Raw print payload is required" },
          { status: 400 }
        );
      }
      const result = await sendToPrinter(ip, printerPort, data, 6000);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: `Unknown print action: ${action}` },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process print request" },
      { status: 500 }
    );
  }
}
