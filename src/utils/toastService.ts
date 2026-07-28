// toastService.ts - Centralized & Unified Toast Management Service
import { toast, ToastOptions } from 'react-toastify';

// Default toast configuration
const defaultConfig: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
};

// Success toast configuration
const successConfig: ToastOptions = {
  ...defaultConfig,
  autoClose: 3000,
};

// Error toast configuration  
const errorConfig: ToastOptions = {
  ...defaultConfig,
  autoClose: 7000,
};

// Warning toast configuration
const warningConfig: ToastOptions = {
  ...defaultConfig,
  autoClose: 6000,
};

// Info toast configuration
const infoConfig: ToastOptions = {
  ...defaultConfig,
  autoClose: 4000,
};

/**
 * 🔔 Core Unified Toast Service for all modules across the application
 */
export class ToastService {
  // --- Core Toast Helpers ---
  static validationError(message: string) {
    toast.error(message, { ...errorConfig });
  }

  static success(message: string, options?: Partial<ToastOptions>) {
    toast.success(message, { ...successConfig, ...options });
  }

  static error(message: string, options?: Partial<ToastOptions>) {
    toast.error(message, { ...errorConfig, ...options });
  }

  static warning(message: string, options?: Partial<ToastOptions>) {
    toast.warning(message, { ...warningConfig, ...options });
  }

  static info(message: string, options?: Partial<ToastOptions>) {
    toast.info(message, { ...infoConfig, ...options });
  }

  static default(message: string, options?: Partial<ToastOptions>) {
    toast(message, { ...defaultConfig, ...options });
  }

  static dismissAll() {
    toast.dismiss();
  }

  static dismiss(toastId: string | number) {
    toast.dismiss(toastId);
  }

  // --- Common Pre-formatted Multilingual Notifications ---
  static createSuccess(dicOrName?: any, dic?: any) {
    const dictionary = typeof dicOrName === 'object' && dicOrName !== null ? dicOrName : dic;
    const message = dictionary?.createSuccess || dictionary?.savedSuccessfully || 'ເພີ່ມຂໍ້ມູນສຳເລັດແລ້ວ!';
    ToastService.success(message);
  }

  static updateSuccess(dicOrName?: any, dic?: any) {
    const dictionary = typeof dicOrName === 'object' && dicOrName !== null ? dicOrName : dic;
    const message = dictionary?.updateSuccess || dictionary?.savedSuccessfully || 'ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ!';
    ToastService.success(message);
  }

  static deleteSuccess(dicOrName?: any, dic?: any) {
    const dictionary = typeof dicOrName === 'object' && dicOrName !== null ? dicOrName : dic;
    const message = dictionary?.deleteSuccess || 'ລຶບຂໍ້ມູນສຳເລັດແລ້ວ!';
    ToastService.success(message);
  }

  static restoreSuccess(dicOrName?: any, dic?: any) {
    const dictionary = typeof dicOrName === 'object' && dicOrName !== null ? dicOrName : dic;
    const message = dictionary?.restoreSuccess || 'ກູ້ຄືນຂໍ້ມູນສຳເລັດແລ້ວ!';
    ToastService.info(message);
  }

  static saveSuccess(dic?: any) {
    const msg = dic?.savedSuccessfully || dic?.saveSuccess || 'ບັນທຶກສຳເລັດແລ້ວ!';
    ToastService.success(msg);
  }

  static saveError(dic?: any, error?: string) {
    const defaultMsg = dic?.saveError || 'ລົ້ມເຫລວໃນການບັນທຶກ';
    const msg = error ? `${defaultMsg}: ${error}` : defaultMsg;
    ToastService.error(msg);
  }

  static updateError(dic?: any, error?: string) {
    const defaultMsg = dic?.updateError || 'ລົ້ມເຫລວໃນການອັບເດດ';
    const msg = error ? `${defaultMsg}: ${error}` : defaultMsg;
    ToastService.error(msg);
  }

  static deleteError(dic?: any, error?: string) {
    const defaultMsg = dic?.deleteError || 'ລົ້ມເຫລວໃນການລຶບ';
    const msg = error ? `${defaultMsg}: ${error}` : defaultMsg;
    ToastService.error(msg);
  }

  static restoreError(dic?: any, error?: string) {
    const defaultMsg = dic?.restoreError || 'ລົ້ມເຫລວໃນການກູ້ຄືນ';
    const msg = error ? `${defaultMsg}: ${error}` : defaultMsg;
    ToastService.error(msg);
  }

  static loadError(dic?: any, error?: string) {
    const defaultMsg = dic?.loadError || 'ລົ້ມເຫລວໃນການໂຫຼດຂໍ້ມູນ';
    const msg = error ? `${defaultMsg}: ${error}` : defaultMsg;
    ToastService.error(msg);
  }

  static networkError(dic?: any) {
    const msg = dic?.networkError || 'ບັນຫາການເຊື່ອມຕໍ່ເນັດເວີກ';
    ToastService.error(msg);
  }

  static unauthorized(dic?: any) {
    const msg = dic?.unauthorized || 'ບໍ່ມີສິດເຂົ້າເຖິງ';
    ToastService.error(msg);
  }

  static formInvalid(dic?: any) {
    const msg = dic?.pleaseFilledAllInformation || dic?.formInvalid || 'ກະລຸນາກຳນົດຂໍ້ມູນໃຫ້ຄົບຖ້ວນ';
    ToastService.warning(msg);
  }

  static nameRequired(dic?: any) {
    const message = dic?.pleaseEnterName || 'ກະລຸນາໃສ່ຊື່ກ່ອນບັນທຶກ';
    ToastService.warning(message);
  }

  static actionError(action: string, error?: string, dic?: any) {
    const defaultFail = dic?.reject || 'ລົ້ມເຫລວໃນການ';
    const message = error 
      ? `${defaultFail}${action}: ${error}`
      : `${defaultFail}${action}`;
    ToastService.error(message);
  }

  // Alias for actionError for flexible syntax
  static action_error(action: string, error?: string, dic?: any) {
    ToastService.actionError(action, error, dic);
  }
}

// CommonToastMessages alias for backward compatibility
export const CommonToastMessages = ToastService;

export default ToastService;
