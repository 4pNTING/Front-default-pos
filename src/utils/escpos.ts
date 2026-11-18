/**
 * ESC/POS Command Generator for Thermal Printers (80mm & 58mm)
 * Direct TCP Socket (Port 9100) compatible
 * 
 * Supports text styling, column formatting, line wrapping,
 * native 2D QR codes, hardware buzzers, and cash drawer kick pulses.
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
  currencySymbol?: string;
  shopName?: string;
  shopAddress?: string;
  shopPhone?: string;
  headerText?: string;
  footerText?: string;
  qrCodeUrl?: string;
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

// ESC/POS Command Byte Constants
const ESC = "\x1B";
const GS = "\x1D";

export const COMMANDS = {
  // Initialize printer
  INIT: `${ESC}@`,

  // Text Alignment
  ALIGN_LEFT: `${ESC}a\x00`,
  ALIGN_CENTER: `${ESC}a\x01`,
  ALIGN_RIGHT: `${ESC}a\x02`,

  // Font Styles
  BOLD_ON: `${ESC}E\x01`,
  BOLD_OFF: `${ESC}E\x00`,
  UNDERLINE_ON: `${ESC}-\x01`,
  UNDERLINE_OFF: `${ESC}-\x00`,
  INVERT_ON: `${GS}B\x01`,
  INVERT_OFF: `${GS}B\x00`,

  // Text Sizing (GS ! n)
  SIZE_NORMAL: `${GS}!\x00`,
  SIZE_DOUBLE_HEIGHT: `${GS}!\x10`,
  SIZE_DOUBLE_WIDTH: `${GS}!\x20`,
  SIZE_DOUBLE: `${GS}!\x30`,
  SIZE_QUAD: `${GS}!\x31`,

  // Paper Feeding and Cutting
  FEED_LINE: (lines: number = 1) => `${ESC}d${String.fromCharCode(lines)}`,
  CUT_FULL: `${GS}V\x00`,
  CUT_PARTIAL: `${GS}V\x01`,
  CUT_FEED: `${GS}V\x42\x03`, // Feed 3 lines and partial cut

  // Cash Drawer Pulse (RJ11)
  OPEN_DRAWER_PIN2: `${ESC}p\x00\x19\xFA`, // Pulse to pin 2 (t1=50ms, t2=500ms)
  OPEN_DRAWER_PIN5: `${ESC}p\x01\x19\xFA`, // Pulse to pin 5

  // Hardware Audio Buzzer
  BEEP: `${ESC}B\x02\x02`, // Beep 2 times, 200ms
  BEEP_KITCHEN: `${ESC}B\x03\x03`, // Beep 3 times, 300ms for kitchen
};

/**
 * Text layout helper: Calculate printable column width based on paper size
 */
export function getLineWidth(paperWidth: "80mm" | "58mm" = "80mm"): number {
  if (paperWidth === "58mm") {
    return 32;
  }
  return 48;
}

/**
 * Clean & truncate or pad text to an exact width
 */
export function padRight(str: string, width: number): string {
  if (str.length >= width) {
    return str.substring(0, width);
  }
  return str + " ".repeat(width - str.length);
}

export function padLeft(str: string, width: number): string {
  if (str.length >= width) {
    return str.substring(0, width);
  }
  return " ".repeat(width - str.length) + str;
}

/**
 * Create a 2-column row: Left aligned text and Right aligned text
 * Example: "Subtotal: ................. 50,000"
 */
export function formatTwoColumns(
  left: string,
  right: string,
  width: number = 48,
  fillChar: string = " "
): string {
  const combinedLen = left.length + right.length;
  if (combinedLen >= width) {
    const spaceForLeft = Math.max(0, width - right.length - 1);
    return left.substring(0, spaceForLeft) + " " + right;
  }
  const fillCount = width - combinedLen;
  return left + fillChar.repeat(fillCount) + right;
}

/**
 * Generate native ESC/POS QR Code commands (GS ( k)
 */
export function buildQrCodeCommand(content: string): string {
  if (!content) return "";
  const len = content.length + 3;
  const pL = String.fromCharCode(len % 256);
  const pH = String.fromCharCode(Math.floor(len / 256));

  let out = "";
  // Model 2
  out += `${GS}(k\x04\x00\x31\x41\x32\x00`;
  // Module size (size 6)
  out += `${GS}(k\x03\x00\x31\x43\x06`;
  // Error correction level M (approx 15%)
  out += `${GS}(k\x03\x00\x31\x45\x31`;
  // Store the data in symbol storage area
  out += `${GS}(k${pL}${pH}\x31\x50\x30${content}`;
  // Print symbol data in symbol storage area
  out += `${GS}(k\x03\x00\x31\x51\x30`;

  return out;
}

/**
 * Builder class for creating ESC/POS command sequences fluently
 */
export class EscPosBuilder {
  private buffer: string[] = [];
  private width: number;

  constructor(paperWidth: "80mm" | "58mm" = "80mm") {
    this.width = getLineWidth(paperWidth);
    this.init();
  }

  public init(): EscPosBuilder {
    this.buffer.push(COMMANDS.INIT);
    return this;
  }

  public alignLeft(): EscPosBuilder {
    this.buffer.push(COMMANDS.ALIGN_LEFT);
    return this;
  }

  public alignCenter(): EscPosBuilder {
    this.buffer.push(COMMANDS.ALIGN_CENTER);
    return this;
  }

  public alignRight(): EscPosBuilder {
    this.buffer.push(COMMANDS.ALIGN_RIGHT);
    return this;
  }

  public bold(enable: boolean = true): EscPosBuilder {
    if (enable) {
      this.buffer.push(COMMANDS.BOLD_ON);
    } else {
      this.buffer.push(COMMANDS.BOLD_OFF);
    }
    return this;
  }

  public underline(enable: boolean = true): EscPosBuilder {
    if (enable) {
      this.buffer.push(COMMANDS.UNDERLINE_ON);
    } else {
      this.buffer.push(COMMANDS.UNDERLINE_OFF);
    }
    return this;
  }

  public invert(enable: boolean = true): EscPosBuilder {
    if (enable) {
      this.buffer.push(COMMANDS.INVERT_ON);
    } else {
      this.buffer.push(COMMANDS.INVERT_OFF);
    }
    return this;
  }

  public sizeNormal(): EscPosBuilder {
    this.buffer.push(COMMANDS.SIZE_NORMAL);
    return this;
  }

  public sizeDoubleHeight(): EscPosBuilder {
    this.buffer.push(COMMANDS.SIZE_DOUBLE_HEIGHT);
    return this;
  }

  public sizeDoubleWidth(): EscPosBuilder {
    this.buffer.push(COMMANDS.SIZE_DOUBLE_WIDTH);
    return this;
  }

  public sizeDouble(): EscPosBuilder {
    this.buffer.push(COMMANDS.SIZE_DOUBLE);
    return this;
  }

  public line(text: string = ""): EscPosBuilder {
    this.buffer.push(text + "\n");
    return this;
  }

  public feed(lines: number = 1): EscPosBuilder {
    this.buffer.push(COMMANDS.FEED_LINE(lines));
    return this;
  }

  public divider(char: string = "-"): EscPosBuilder {
    this.buffer.push(char.repeat(this.width) + "\n");
    return this;
  }

  public doubleDivider(): EscPosBuilder {
    this.buffer.push("=".repeat(this.width) + "\n");
    return this;
  }

  public twoColumns(left: string, right: string, fillChar: string = " "): EscPosBuilder {
    this.buffer.push(formatTwoColumns(left, right, this.width, fillChar) + "\n");
    return this;
  }

  public qrCode(content: string): EscPosBuilder {
    if (content) {
      this.alignCenter();
      this.buffer.push(buildQrCodeCommand(content));
      this.feed(1);
      this.alignLeft();
    }
    return this;
  }

  public cut(): EscPosBuilder {
    this.buffer.push(COMMANDS.CUT_FEED);
    return this;
  }

  public openDrawer(): EscPosBuilder {
    this.buffer.push(COMMANDS.OPEN_DRAWER_PIN2);
    this.buffer.push(COMMANDS.OPEN_DRAWER_PIN5);
    return this;
  }

  public beep(kitchen: boolean = false): EscPosBuilder {
    if (kitchen) {
      this.buffer.push(COMMANDS.BEEP_KITCHEN);
    } else {
      this.buffer.push(COMMANDS.BEEP);
    }
    return this;
  }

  public build(): string {
    return this.buffer.join("");
  }
}

/**
 * Format currency with thousands separators
 */
function formatMoney(amount: number, symbol: string = "₭"): string {
  const formatted = Math.round(amount).toLocaleString();
  return `${formatted} ${symbol}`;
}

/**
 * Build ESC/POS command string for customer receipt or pre-settlement bill
 */
export function buildReceiptESC(
  data: PrintableReceiptData,
  options: ESCPOSOptions = {}
): string {
  const paperWidth = options.paperWidth || "80mm";
  const lineWidth = getLineWidth(paperWidth);
  const is58mm = paperWidth === "58mm";
  const builder = new EscPosBuilder(paperWidth);

  // Kick drawer at start if requested
  if (options.openDrawer) {
    builder.openDrawer();
  }

  // Header - Store Name
  builder.alignCenter();
  builder.bold(true);
  builder.sizeDouble();
  const shopName = data.shopName || "LAO WORLD RESTAURANT";
  builder.line(shopName);

  builder.sizeNormal();
  builder.bold(false);

  if (data.shopAddress) {
    builder.line(data.shopAddress);
  }
  if (data.shopPhone) {
    builder.line(`Tel: ${data.shopPhone}`);
  }
  if (data.headerText) {
    builder.line(data.headerText);
  }

  builder.feed(1);

  // Title Badge: RECEIPT or BILL
  builder.bold(true);
  const isReceipt = data.type === "receipt";
  if (isReceipt) {
    builder.invert(true);
    builder.line(" *** RECEIPT / ໃບບິນຮັບເງິນ *** ");
    builder.invert(false);
  } else {
    builder.line(" *** ORDER BILL / ໃບແຈ້ງລາຄາ *** ");
  }
  builder.bold(false);
  builder.feed(1);

  // Metadata block
  builder.alignLeft();
  builder.twoColumns("Order No:", data.orderNumber || "-");
  
  let tableInfo = data.tableNumber ? `Table ${data.tableNumber}` : "-";
  if (data.zoneName) {
    tableInfo += ` (${data.zoneName})`;
  }
  builder.twoColumns("Table / ໂຕະ:", tableInfo);

  builder.twoColumns("Date / ເວລາ:", data.date || new Date().toLocaleString());

  if (data.staffName) {
    builder.twoColumns("Staff / ພະນັກງານ:", data.staffName);
  }

  if (data.customerName) {
    let customerInfo = data.customerName;
    if (data.customerPhone) {
      customerInfo += ` (${data.customerPhone})`;
    }
    builder.twoColumns("Customer / ລູກຄ້າ:", customerInfo);
  }

  // Items Table Header
  builder.divider("-");
  builder.bold(true);
  if (is58mm) {
    // 32-column format: Qty Item [right] Total
    builder.twoColumns("Qty Item", "Total");
  } else {
    // 48-column format: Item [center] Qty [right] Amount
    const colItem = padRight("Item", 24);
    const colQty = padLeft("Qty", 6);
    const colPrice = padLeft("Price", 8);
    const colTotal = padLeft("Total", 10);
    builder.line(`${colItem}${colQty}${colPrice}${colTotal}`);
  }
  builder.bold(false);
  builder.divider("-");

  // Items List
  data.items.forEach((item) => {
    const totalStr = Math.round(item.totalPrice).toLocaleString();

    if (is58mm) {
      const itemTitle = `${item.quantity}x ${item.name}`;
      builder.twoColumns(itemTitle, totalStr);
    } else {
      const namePart = padRight(item.name.substring(0, 23), 24);
      const qtyPart = padLeft(item.quantity.toString(), 6);
      const pricePart = padLeft(Math.round(item.unitPrice).toLocaleString(), 8);
      const totalPart = padLeft(totalStr, 10);
      builder.line(`${namePart}${qtyPart}${pricePart}${totalPart}`);
    }

    // Item note / modifiers
    if (item.note) {
      builder.line(`  * ${item.note}`);
    }
  });

  // Financial Summary
  builder.divider("-");
  builder.twoColumns("Subtotal / ລວມເງິນ:", formatMoney(data.subTotal, data.currencySymbol));

  if (data.discount > 0) {
    builder.twoColumns("Discount / ສ່ວນຫຼຸດ:", `-${formatMoney(data.discount, data.currencySymbol)}`);
  }

  builder.doubleDivider();
  builder.bold(true);
  builder.sizeDouble();
  builder.twoColumns("TOTAL:", formatMoney(data.total, data.currencySymbol));
  builder.sizeNormal();
  builder.bold(false);
  builder.doubleDivider();

  // Payment Breakdown for Receipts
  if (isReceipt && data.paymentMethod) {
    builder.twoColumns("Payment Method:", data.paymentMethod.toUpperCase());
    if (data.amountReceived !== undefined) {
      builder.twoColumns("Received / ຮັບເງິນ:", formatMoney(data.amountReceived, data.currencySymbol));
    }
    if (data.change !== undefined) {
      builder.bold(true);
      builder.twoColumns("Change / ເງິນທອນ:", formatMoney(data.change, data.currencySymbol));
      builder.bold(false);
    }
    builder.divider("-");
  }

  // QR Code for e-receipt or payment verification if provided
  if (data.qrCodeUrl) {
    builder.feed(1);
    builder.alignCenter();
    builder.line("Scan QR Code to view e-Receipt:");
    builder.qrCode(data.qrCodeUrl);
  }

  // Footer Message
  builder.feed(1);
  builder.alignCenter();
  builder.bold(true);
  const footerMessage = data.footerText || "THANK YOU / ຂໍຂອບໃຈທີ່ມາໃຊບໍລິການ";
  builder.line(footerMessage);
  builder.bold(false);
  builder.line("Please come again!");
  builder.line(`*** Powered by POS System ***`);

  builder.feed(3);

  // Cut Paper
  if (options.cutPaper !== false) {
    builder.cut();
  }

  return builder.build();
}

/**
 * Build ESC/POS command string for Kitchen Order Ticket
 */
export function buildKitchenTicketESC(
  data: PrintableKitchenData,
  options: ESCPOSOptions = {}
): string {
  const paperWidth = options.paperWidth || "80mm";
  const builder = new EscPosBuilder(paperWidth);

  // Beep kitchen buzzer to alert cooks
  if (options.beep !== false) {
    builder.beep(true);
  }

  // Kitchen Ticket Banner
  builder.alignCenter();
  builder.bold(true);
  builder.sizeDouble();
  builder.invert(true);
  builder.line(" *** KITCHEN ORDER *** ");
  builder.invert(false);

  // HUGE Table Number
  builder.feed(1);
  builder.sizeDouble();
  let tableHeading = `TABLE ${data.tableNumber || "-"}`;
  if (data.zoneName) {
    tableHeading += ` [${data.zoneName}]`;
  }
  builder.line(tableHeading);

  // Order Type (DINE-IN / TAKE-AWAY)
  if (data.orderType) {
    builder.sizeNormal();
    builder.bold(true);
    builder.line(`Type: ${data.orderType.toUpperCase()}`);
  }

  builder.sizeNormal();
  builder.bold(false);
  builder.feed(1);

  // Meta Information
  builder.alignLeft();
  builder.twoColumns("Ticket #:", data.orderNumber || "NEW");
  builder.twoColumns("Time / ເວລາ:", data.date || new Date().toLocaleTimeString());
  if (data.staffName) {
    builder.twoColumns("Server / ພະນັກງານ:", data.staffName);
  }

  if (data.note) {
    builder.divider("-");
    builder.bold(true);
    builder.line(`ORDER NOTE: ${data.note}`);
    builder.bold(false);
  }

  // Items List for Kitchen (Focus on QTY and Special Notes)
  builder.doubleDivider();
  builder.bold(true);
  builder.twoColumns("QTY  ITEM DESCRIPTION", "CHECK");
  builder.bold(false);
  builder.doubleDivider();

  data.items.forEach((item) => {
    builder.bold(true);
    builder.sizeDouble();
    // E.g. "[ 2x ] Pad Thai"
    builder.line(`[ ${item.quantity}x ] ${item.name}`);
    builder.sizeNormal();
    builder.bold(false);

    // Modifier options
    if (item.options && item.options.length > 0) {
      item.options.forEach((opt) => {
        builder.line(`   + ${opt}`);
      });
    }

    // Cooking instructions / notes
    if (item.note) {
      builder.bold(true);
      builder.line(`   >> NOTE: ${item.note}`);
      builder.bold(false);
    }

    builder.divider("-");
  });

  builder.feed(3);

  // Cut Paper
  if (options.cutPaper !== false) {
    builder.cut();
  }

  return builder.build();
}

/**
 * Build ESC/POS Diagnostic Test Slip
 */
export function buildTestPrintESC(
  options: ESCPOSOptions & { targetName?: string; ip?: string; port?: number } = {}
): string {
  const paperWidth = options.paperWidth || "80mm";
  const builder = new EscPosBuilder(paperWidth);

  if (options.beep) {
    builder.beep();
  }

  builder.alignCenter();
  builder.bold(true);
  builder.sizeDouble();
  builder.line("PRINTER TEST SLIP");

  builder.sizeNormal();
  builder.bold(false);
  builder.line("POS Hardware Diagnostic Tool");
  builder.line(`Timestamp: ${new Date().toLocaleString()}`);
  builder.feed(1);

  builder.alignLeft();
  builder.divider("=");
  builder.twoColumns("Target:", options.targetName || "Thermal Receipt Printer");
  if (options.ip) {
    builder.twoColumns("IP Address:", options.ip);
  }
  if (options.port) {
    builder.twoColumns("TCP Port:", options.port.toString());
  }
  builder.twoColumns("Paper Width:", paperWidth);
  builder.twoColumns("Status:", "OK - Connected");
  builder.divider("=");

  builder.feed(1);
  builder.line("Typography Verification:");
  builder.line("Normal text: 0123456789 ABCDEFGHIJKLMNOP");
  builder.bold(true);
  builder.line("Bold text: 0123456789 ABCDEFGHIJKLMNOP");
  builder.bold(false);
  builder.underline(true);
  builder.line("Underlined text verification");
  builder.underline(false);

  builder.feed(1);
  builder.alignCenter();
  builder.line("2D Barcode Test (QR Code):");
  builder.qrCode("https://github.com/4pN/Front-default-pos");

  builder.feed(1);
  builder.line("If this slip printed cleanly,");
  builder.line("your network printer is configured properly!");

  builder.feed(3);
  builder.cut();

  return builder.build();
}

/**
 * Pure cash drawer kick pulse command
 */
export function buildCashDrawerESC(): string {
  return `${COMMANDS.INIT}${COMMANDS.OPEN_DRAWER_PIN2}${COMMANDS.OPEN_DRAWER_PIN5}`;
}
