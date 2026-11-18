/**
 * ESC/POS Command Generator for Thermal Printers (80mm / 58mm)
 * Direct TCP Socket (Port 9100) compatible
 */

export interface ESCPOSOptions {
  paperWidth?: "80mm" | "58mm";
  openDrawer?: boolean;
  cutPaper?: boolean;
  beep?: boolean;
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  note?: string;
}

export interface PrintableReceiptData {
  type: "receipt" | "bill";
  orderNumber: string;
  tableNumber: string;
  zoneName?: string;
  date: string;
  staffName?: string;
  customerName?: string;
  customerPhone?: string;
  items: ReceiptItem[];
  subTotal: number;
  discount: number;
  total: number;
  paymentMethod?: string;
  amountReceived?: number;
  change?: number;
}

export interface PrintableKitchenData {
  orderNumber: string;
  tableNumber: string;
  zoneName?: string;
  orderType?: string;
  date: string;
  staffName?: string;
  note?: string;
  items: {
    name: string;
    quantity: number;
    note?: string;
    options?: string[];
  }[];
}

// ESC/POS Command Constants
const ESC = "\x1B";
const GS = "\x1D";

export const COMMANDS = {
  // Initialize
  INIT: `${ESC}@`,

  // Alignment
  ALIGN_LEFT: `${ESC}a\x00`,
  ALIGN_CENTER: `${ESC}a\x01`,
  ALIGN_RIGHT: `${ESC}a\x02`,

  // Font style
  BOLD_ON: `${ESC}E\x01`,
  BOLD_OFF: `${ESC}E\x00`,
  UNDERLINE_ON: `${ESC}-\x01`,
  UNDERLINE_OFF: `${ESC}-\x00`,

  // Text Sizing (GS ! n)
  // Normal: 0x00, Double Width: 0x20, Double Height: 0x10, Double Width & Height: 0x30
  SIZE_NORMAL: `${GS}!\x00`,
  SIZE_DOUBLE_HEIGHT: `${GS}!\x10`,
  SIZE_DOUBLE_WIDTH: `${GS}!\x20`,
  SIZE_DOUBLE: `${GS}!\x30`,

  // Feed & Cut
  FEED_LINE: (lines: number = 1) => `${ESC}d${String.fromCharCode(lines)}`,
  CUT_FULL: `${GS}V\x00`,
  CUT_PARTIAL: `${GS}V\x01`,
  CUT_FEED: `${GS}VA\x03`, // Feed 3 lines and cut

  // Hardware
  OPEN_DRAWER: `${ESC}p\x00\x19\xFA`, // Pulse to pin 2 (standard RJ11 cash drawer)
  BEEP: `${ESC}B\x02\x02`, // Beep 2 times, 200ms
};

/**
 * Pad a string to a specific width
 */
function padRight(str: string, width: number): string {
  if (str.length >= width) {
    return str.substring(0, width);
  }
  return str + " ".repeat(width - str.length);
}

function padLeft(str: string, width: number): string {
  if (str.length >= width) {
    return str.substring(0, width);
  }
  return " ".repeat(width - str.length) + str;
}

/**
 * Format a two-column row (e.g. Label: Value)
 */
function formatTwoColumns(left: string, right: string, maxChars: number): string {
  const rightWidth = right.length;
  const leftWidth = maxChars - rightWidth;
  if (leftWidth <= 0) {
    return left.substring(0, maxChars - rightWidth - 1) + " " + right;
  }
  return padRight(left, leftWidth) + right;
}

/**
 * Generate ESC/POS commands for a Test Receipt
 */
export function buildTestPrintESC(options: ESCPOSOptions = {}): string {
  const is58 = options.paperWidth === "58mm";
  let maxChars = 48;
  if (is58) {
    maxChars = 32;
  }

  let esc = "";
  esc += COMMANDS.INIT;

  // Header
  esc += COMMANDS.ALIGN_CENTER;
  esc += COMMANDS.SIZE_DOUBLE;
  esc += COMMANDS.BOLD_ON;
  esc += "POS PRINTER TEST\n";
  esc += COMMANDS.SIZE_NORMAL;
  esc += COMMANDS.BOLD_OFF;

  esc += "Thermal ESC/POS Network Driver\n";
  esc += "------------------------------------------------".substring(0, maxChars) + "\n";

  // Body
  esc += COMMANDS.ALIGN_LEFT;
  esc += `Date: ${new Date().toLocaleString()}\n`;
  esc += `Width: ${is58 ? "58mm (32 cols)" : "80mm (48 cols)"}\n`;
  esc += `Port: 9100 Direct Socket\n`;
  esc += `Status: Connected & Ready\n`;

  esc += "------------------------------------------------".substring(0, maxChars) + "\n";
  esc += COMMANDS.ALIGN_CENTER;
  esc += COMMANDS.BOLD_ON;
  esc += "TEST PRINT SUCCESSFUL!\n";
  esc += COMMANDS.BOLD_OFF;
  esc += "System ready for POS receipts & kitchen\n";

  // Feed and cut
  esc += COMMANDS.FEED_LINE(3);
  esc += COMMANDS.CUT_FEED;

  if (options.openDrawer) {
    esc += COMMANDS.OPEN_DRAWER;
  }

  return esc;
}

/**
 * Generate ESC/POS commands for a Customer Bill or Receipt
 */
export function buildReceiptESC(
  data: PrintableReceiptData,
  options: ESCPOSOptions = {}
): string {
  const is58 = options.paperWidth === "58mm";
  let maxChars = 48;
  if (is58) {
    maxChars = 32;
  }

  let esc = "";
  esc += COMMANDS.INIT;

  // Header
  esc += COMMANDS.ALIGN_CENTER;
  esc += COMMANDS.SIZE_DOUBLE_HEIGHT;
  esc += COMMANDS.BOLD_ON;
  esc += "LAO WORLD RESTAURANT\n";
  esc += COMMANDS.SIZE_NORMAL;
  esc += COMMANDS.BOLD_OFF;
  esc += "Vientiane, Lao PDR • Tel: (+856) 20 5555 5555\n";

  let titleBadge = "CHECK BILL";
  if (data.type === "receipt") {
    titleBadge = "OFFICIAL RECEIPT";
  }

  esc += COMMANDS.BOLD_ON;
  esc += `[ ${titleBadge} ]\n`;
  esc += COMMANDS.BOLD_OFF;
  esc += "-".repeat(maxChars) + "\n";

  // Order Meta
  esc += COMMANDS.ALIGN_LEFT;
  let tableStr = data.tableNumber;
  if (data.zoneName) {
    tableStr += ` (${data.zoneName})`;
  }
  esc += formatTwoColumns("Table:", tableStr, maxChars) + "\n";
  esc += formatTwoColumns("Order #:", data.orderNumber, maxChars) + "\n";
  esc += formatTwoColumns("Date:", data.date, maxChars) + "\n";

  if (data.staffName) {
    esc += formatTwoColumns("Cashier:", data.staffName, maxChars) + "\n";
  }

  if (data.customerName) {
    let custInfo = data.customerName;
    if (data.customerPhone) {
      custInfo += ` (${data.customerPhone})`;
    }
    esc += formatTwoColumns("Customer:", custInfo, maxChars) + "\n";
  }

  esc += "-".repeat(maxChars) + "\n";

  // Table Column Headers
  // 80mm (48 chars): ITEM (24) | QTY (6) | PRICE (9) | TOTAL (9)
  // 58mm (32 chars): ITEM (16) | QTY (4) | TOTAL (12)
  if (is58) {
    const itemH = padRight("ITEM", 16);
    const qtyH = padLeft("QTY", 4);
    const totalH = padLeft("TOTAL", 12);
    esc += `${itemH}${qtyH}${totalH}\n`;
  } else {
    const itemH = padRight("ITEM", 24);
    const qtyH = padLeft("QTY", 6);
    const priceH = padLeft("PRICE", 9);
    const totalH = padLeft("TOTAL", 9);
    esc += `${itemH}${qtyH}${priceH}${totalH}\n`;
  }
  esc += "-".repeat(maxChars) + "\n";

  // Items
  for (const item of data.items) {
    const totalFormatted = item.totalPrice.toLocaleString();
    const qtyFormatted = `x${item.quantity}`;

    if (is58) {
      const itemCol = padRight(item.name.substring(0, 15), 16);
      const qtyCol = padLeft(qtyFormatted, 4);
      const totalCol = padLeft(totalFormatted, 12);
      esc += `${itemCol}${qtyCol}${totalCol}\n`;
    } else {
      const priceFormatted = item.unitPrice.toLocaleString();
      const itemCol = padRight(item.name.substring(0, 23), 24);
      const qtyCol = padLeft(qtyFormatted, 6);
      const priceCol = padLeft(priceFormatted, 9);
      const totalCol = padLeft(totalFormatted, 9);
      esc += `${itemCol}${qtyCol}${priceCol}${totalCol}\n`;
    }

    if (item.note) {
      esc += `  * ${item.note}\n`;
    }
  }

  esc += "-".repeat(maxChars) + "\n";

  // Totals
  esc += formatTwoColumns("Subtotal:", `${data.subTotal.toLocaleString()} LAK`, maxChars) + "\n";

  if (data.discount > 0) {
    esc += formatTwoColumns("Discount:", `-${data.discount.toLocaleString()} LAK`, maxChars) + "\n";
  }

  esc += COMMANDS.BOLD_ON;
  esc += COMMANDS.SIZE_DOUBLE_HEIGHT;
  esc += formatTwoColumns("TOTAL:", `${data.total.toLocaleString()} LAK`, maxChars) + "\n";
  esc += COMMANDS.SIZE_NORMAL;
  esc += COMMANDS.BOLD_OFF;

  // Payment Details (if official receipt)
  if (data.type === "receipt") {
    esc += "-".repeat(maxChars) + "\n";
    const methodStr = data.paymentMethod ? data.paymentMethod.toUpperCase() : "CASH";
    esc += formatTwoColumns("Payment Method:", methodStr, maxChars) + "\n";

    if (data.amountReceived !== undefined) {
      esc += formatTwoColumns("Received:", `${data.amountReceived.toLocaleString()} LAK`, maxChars) + "\n";
    }

    if (data.change !== undefined) {
      esc += COMMANDS.BOLD_ON;
      esc += formatTwoColumns("Change:", `${data.change.toLocaleString()} LAK`, maxChars) + "\n";
      esc += COMMANDS.BOLD_OFF;
    }
  }

  esc += "-".repeat(maxChars) + "\n";

  // Footer
  esc += COMMANDS.ALIGN_CENTER;
  esc += COMMANDS.BOLD_ON;
  esc += "Thank you for your visit!\n";
  esc += COMMANDS.BOLD_OFF;
  esc += "Please keep this receipt for verification\n";

  // Feed and cut
  esc += COMMANDS.FEED_LINE(4);
  esc += COMMANDS.CUT_FEED;

  // Open Cash Drawer if option enabled and is official receipt
  if (options.openDrawer && data.type === "receipt") {
    esc += COMMANDS.OPEN_DRAWER;
  }

  return esc;
}

/**
 * Generate ESC/POS commands for a Kitchen Ticket (KDS / Order Slip)
 */
export function buildKitchenTicketESC(
  data: PrintableKitchenData,
  options: ESCPOSOptions = {}
): string {
  const is58 = options.paperWidth === "58mm";
  let maxChars = 48;
  if (is58) {
    maxChars = 32;
  }

  let esc = "";
  esc += COMMANDS.INIT;

  // Optional Beeper to alert kitchen chef
  if (options.beep) {
    esc += COMMANDS.BEEP;
  }

  // Kitchen Header
  esc += COMMANDS.ALIGN_CENTER;
  esc += COMMANDS.SIZE_DOUBLE;
  esc += COMMANDS.BOLD_ON;
  esc += "== KITCHEN ORDER ==\n";
  esc += COMMANDS.SIZE_NORMAL;
  esc += COMMANDS.BOLD_OFF;

  // Table number in large bold text
  esc += COMMANDS.SIZE_DOUBLE_HEIGHT;
  esc += COMMANDS.BOLD_ON;
  let tableHeader = `TABLE: ${data.tableNumber}`;
  if (data.zoneName) {
    tableHeader += ` (${data.zoneName})`;
  }
  esc += `${tableHeader}\n`;
  esc += COMMANDS.SIZE_NORMAL;
  esc += COMMANDS.BOLD_OFF;

  esc += "=".repeat(maxChars) + "\n";

  // Order Info
  esc += COMMANDS.ALIGN_LEFT;
  esc += formatTwoColumns("Order #:", data.orderNumber, maxChars) + "\n";
  esc += formatTwoColumns("Time:", data.date, maxChars) + "\n";

  if (data.orderType) {
    esc += formatTwoColumns("Type:", data.orderType.toUpperCase(), maxChars) + "\n";
  }

  if (data.staffName) {
    esc += formatTwoColumns("Server:", data.staffName, maxChars) + "\n";
  }

  if (data.note) {
    esc += COMMANDS.BOLD_ON;
    esc += `Note: ${data.note}\n`;
    esc += COMMANDS.BOLD_OFF;
  }

  esc += "=".repeat(maxChars) + "\n";

  // Kitchen Items List
  esc += COMMANDS.BOLD_ON;
  esc += padRight("QTY", 6) + padRight("ITEM DESCRIPTION", maxChars - 6) + "\n";
  esc += COMMANDS.BOLD_OFF;
  esc += "-".repeat(maxChars) + "\n";

  for (const item of data.items) {
    esc += COMMANDS.SIZE_DOUBLE_HEIGHT;
    esc += COMMANDS.BOLD_ON;
    const qtyCol = padRight(`[ ${item.quantity} ]`, 6);
    esc += `${qtyCol}${item.name}\n`;
    esc += COMMANDS.SIZE_NORMAL;
    esc += COMMANDS.BOLD_OFF;

    // Special options / toppings
    if (item.options && item.options.length > 0) {
      for (const opt of item.options) {
        esc += `      + ${opt}\n`;
      }
    }

    // Item note
    if (item.note) {
      esc += COMMANDS.BOLD_ON;
      esc += `      ** NOTE: ${item.note} **\n`;
      esc += COMMANDS.BOLD_OFF;
    }

    esc += "\n";
  }

  esc += "=".repeat(maxChars) + "\n";

  // Feed and cut
  esc += COMMANDS.FEED_LINE(4);
  esc += COMMANDS.CUT_FEED;

  return esc;
}
