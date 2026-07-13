/**
 * Payment Type Enums for Leasing System
 * จำแนกประเภทการชำระเงินในระบบเช่า
 */

export enum PaymentTypeId {
  MONTHLY = '1', // ชำระรายเดือน
  PERIOD = '2'   // ชำระเป็นงวด
}

export enum PaymentTypeCode {
  MONTHLY = 'MONTHLY',
  PERIOD = 'PERIOD'
}

export enum PaymentTypeName {
  MONTHLY = 'ຊຳລະລາຍເດືອນ',
  PERIOD = 'ຊຳລະເປັນງວດ'
}

/**
 * Payment Type Constants for easy access
 */
export const PAYMENT_TYPES = {
  MONTHLY: {
    id: PaymentTypeId.MONTHLY,
    code: PaymentTypeCode.MONTHLY,
    name: PaymentTypeName.MONTHLY,
    description: 'ການຊຳລະເປັນລາຍເດືອນ'
  },
  PERIOD: {
    id: PaymentTypeId.PERIOD,
    code: PaymentTypeCode.PERIOD, 
    name: PaymentTypeName.PERIOD,
    description: 'ການຊຳລະເປັນງວດຕາມກຳນົດ'
  }
} as const;

/**
 * Type guard functions
 */
export const isMonthlyPayment = (paymentTypeId: string): boolean => {
  return paymentTypeId === PaymentTypeId.MONTHLY;
};

export const isPeriodPayment = (paymentTypeId: string): boolean => {
  return paymentTypeId === PaymentTypeId.PERIOD;
};
