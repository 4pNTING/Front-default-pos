// toastService.ts - Centralized Toast Management with Vuexy Integration
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
 * Toast Service for Vuexy Admin Template
 * Provides centralized toast notifications with consistent styling
 */
export class ToastService {
  static validationError(message: string) {
    toast.error(message, { ...errorConfig });
  }
  
  /**
   * Show success toast
   */
  static success(message: string, options?: Partial<ToastOptions>) {
    toast.success(message, { ...successConfig, ...options });
  }
  
  /**
   * Show error toast
   */
  static error(message: string, options?: Partial<ToastOptions>) {
    toast.error(message, { ...errorConfig, ...options });
  }
  
  /**
   * Show warning toast
   */
  static warning(message: string, options?: Partial<ToastOptions>) {
    toast.warning(message, { ...warningConfig, ...options });
  }
  
  /**
   * Show info toast
   */
  static info(message: string, options?: Partial<ToastOptions>) {
    toast.info(message, { ...infoConfig, ...options });
  }
  
  /**
   * Show default toast
   */
  static default(message: string, options?: Partial<ToastOptions>) {
    toast(message, { ...defaultConfig, ...options });
  }
  
  /**
   * Remove all toasts
   */
  static dismissAll() {
    toast.dismiss();
  }
  
  /**
   * Remove specific toast by ID
   */
  static dismiss(toastId: string | number) {
    toast.dismiss(toastId);
  }
}

/**
 * Leasing-specific toast messages
 * Centralized location for all leasing form notifications
 */
export class ToastMessages {
  
  /**
   * Currency validation error for room selection
   */
  static currencyMismatchError() {
    const message = ` ກະລຸນາເລືອກຫ້ອງສະກຸນເງິນດຽວກັນ!`;
    ToastService.error(message, { 
      autoClose: 6000,
      style: { whiteSpace: 'nowrap' }
    });
  }
  
  static customerError() {
    const message = ` ກະລຸນາເລືອກລູກຄ້າ!`;
    ToastService.error(message, { 
      autoClose: 6000,
      style: { whiteSpace: 'nowrap' }
    });
  }
  
  static roomError() {
    const message = ` ຫ້ອງນີ້ຖືກເລືອກແລ້ວ!`;
    ToastService.error(message, { 
      autoClose: 6000,
      style: { whiteSpace: 'nowrap' }
    });
  }

  static selectError() {
    const message = ` ກະລຸນາເລືອກຂໍ້ມູນໃຫ້ຄົບ!`;
    ToastService.error(message, { 
      autoClose: 6000,
      style: { whiteSpace: 'nowrap' }
    });
  }

  // Leasing Form Validation Errors
  static customerRequired() {
    const message = `ກະລຸນາເລືອກລູກຄ້າກ່ອນບັນທຶກ`;
    ToastService.error(message, { autoClose: 5000 });
  }

  static contractNumberRequired() {
    const message = `ກະລຸນາໃສ່ເລກສັນຍາກ່ອນບັນທຶກ`;
    ToastService.error(message, { autoClose: 5000 });
  }

  static shopNameRequired() {
    const message = `ກະລຸນາໃສ່ຊື່ຮ້ານກ່ອນບັນທຶກ`;
    ToastService.error(message, { autoClose: 5000 });
  }

  static roomRequired() {
    const message = `ກະລຸນາເລືອກຫ້ອງຢ່າງໜ້ອຍ 1 ຫ້ອງ`;
    ToastService.error(message, { autoClose: 5000 });
  }


  /**
   * Form validation error
   */
  static validationError(fieldName: string) {
    const message = `ກະລຸນາກຳນົດຂໍ້ມູນໃຫ້ຄົບ: ${fieldName}`;
    ToastService.warning(message);
  }
  
  /**
   * Data loading error
   */
  static loadingError(dataType?: string) {
    const message = dataType 
      ? `ລົ້ມເຫລວໃນການໂຫຼດຂໍ້ມູນ: ${dataType}`
      : 'ລົ້ມເຫລວໃນການໂຫຼດຂໍ້ມູນ';
    ToastService.error(message);
  }
  
  /**
   * Successful form submission
   */
  static submitSuccess() {
    const message = 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ!';
    ToastService.success(message);
  }

  static updateSuccess() {
    const message = 'ອັບເດດສຳເລັດແລ້ວ!';
    ToastService.success(message);
  }
  
  /**
   * Form submission error
   */
  static submitError(error?: string) {
    const message = error 
      ? `ລົ້ມເຫລວໃນການບັນທຶກ: ${error}`
      : 'ລົ້ມເຫລວໃນການບັນທຶກຂໍ້ມູນ';
    ToastService.error(message);
  }
  
  /**
   * Room added successfully
   */
  static roomAddedSuccess(roomCode: string) {
    const message = `ເພີ່ມຫ້ອງ ${roomCode} ສຳເລັດແລ້ວ`;
    ToastService.success(message);
  }
  
  /**
   * Room removed successfully
   */
  static roomRemovedSuccess(roomCode: string) {
    const message = `ລຶບຫ້ອງ ${roomCode} ແລ້ວ`;
    ToastService.info(message);
  }
  
  /**
   * Contract file uploaded successfully
   */
  static fileUploadSuccess(fileName: string) {
    const message = `ອັບໂຫຼດໄຟລ໌ ${fileName} ສຳເລັດແລ້ວ`;
    ToastService.success(message);
  }
  
  /**
   * Contract file upload error
   */
  static fileUploadError(fileName: string, error?: string) {
    const message = error 
      ? `ລົ້ມເຫລວໃນການອັບໂຫຼດ ${fileName}: ${error}`
      : `ລົ້ມເຫລວໃນການອັບໂຫຼດ ${fileName}`;
    ToastService.error(message);
  }
}

/**
 * Common toast messages for reuse across the application
 */
export class CommonToastMessages {
  
  static save_success = () => ToastService.success('ບັນທຶກສຳເລັດແລ້ວ!');
  static save_error = () => ToastService.error('ລົ້ມເຫລວໃນການບັນທຶກ');
  static delete_success = () => ToastService.success('ລຶບສຳເລັດແລ້ວ!');
  static delete_error = () => ToastService.error('ລົ້ມເຫລວໃນການລຶບ');
  static load_error = () => ToastService.error('ລົ້ມເຫລວໃນການໂຫຼດຂໍ້ມູນ');
  static network_error = () => ToastService.error('ບັນຫາການເຊື່ອມຕໍ່ເນັດເວີກ');
  static unauthorized = () => ToastService.error('ບໍ່ມີສິດເຂົ້າເຖິງ');
  static form_invalid = () => ToastService.warning('ກະລຸນາກຳນອດຂໍ້ມູນໃຫ້ຄົບຖ້ວນ');
}
