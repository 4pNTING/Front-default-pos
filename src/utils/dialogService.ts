import Swal from 'sweetalert2';

/**
 * Centralized Dialog Service for consistent confirmation dialogs across the application
 * Similar to toastService.ts but for confirmation dialogs
 */

interface DialogOptions {
  title?: string;
  text?: string;
  btnOKText?: string;
  btnCancelText?: string;
  btnOKColor?: string;
  btnCancelColor?: string;
  icon?: 'question' | 'warning' | 'info' | 'success' | 'error';
}

interface MessageOptions {
  title?: string;
  text?: string;
  btnOKText?: string;
  btnOKColor?: string;
}

/**
 * Core Dialog Service with consistent configuration
 */
export class DialogService {
  private static defaultOptions: DialogOptions = {
    btnOKText: 'ຕົກລົງ',
    btnCancelText: 'ຍົກເລີກ',
    btnOKColor: '#d33',
    btnCancelColor: '#3085d6',
    icon: 'question'
  };

  private static defaultMessageOptions: MessageOptions = {
    btnOKText: 'ຕົກລົງ',
    btnOKColor: '#3085d6'
  };

  /**
   * Show confirmation dialog
   */
  static async confirm(options: DialogOptions): Promise<boolean> {
    const config = { ...this.defaultOptions, ...options };
    
    const result = await Swal.fire({
      icon: config.icon,
      title: config.title,
      text: config.text,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: config.btnOKText,
      cancelButtonText: config.btnCancelText,
      confirmButtonColor: config.btnOKColor,
      cancelButtonColor: config.btnCancelColor,
      customClass: {
        popup: 'swal-small-popup',
      },
    });

    return result.isConfirmed;
  }

  /**
   * Show success message
   */
  static async success(options: MessageOptions): Promise<void> {
    const config = { ...this.defaultMessageOptions, ...options };
    
    await Swal.fire({
      icon: 'success',
      title: config.title,
      text: config.text,
      showConfirmButton: true,
      confirmButtonText: config.btnOKText,
      confirmButtonColor: config.btnOKColor,
      customClass: {
        popup: 'swal-small-popup',
      },
    });
  }

  /**
   * Show error message
   */
  static async error(options: MessageOptions): Promise<void> {
    const config = { ...this.defaultMessageOptions, ...options };
    
    await Swal.fire({
      icon: 'error',
      title: config.title,
      text: config.text,
      showConfirmButton: true,
      confirmButtonText: config.btnOKText,
      confirmButtonColor: config.btnOKColor,
      customClass: {
        popup: 'swal-small-popup',
        icon: 'swal-swal-icon-error',
      },
    });
  }

  /**
   * Show warning dialog
   */
  static async warning(options: DialogOptions): Promise<boolean> {
    return this.confirm({ ...options, icon: 'warning' });
  }

  /**
   * Show info dialog
   */
  static async info(options: DialogOptions): Promise<boolean> {
    return this.confirm({ ...options, icon: 'info' });
  }
}

/**
 * Exchange Rate specific dialog messages
 */
export class ExchangeRateDialogMessages {
  /**
   * Delete confirmation dialog for exchange rate
   */
  static async deleteConfirmation(rateName?: string): Promise<boolean> {
    const message = rateName 
      ? `ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບອັດຕາແລກປ່ຽນ "${rateName}" ນີ້?`
      : 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບອັດຕາແລກປ່ຽນນີ້?';
    
    return DialogService.confirm({
      title: 'ຢືນຢັນການລຶບ',
      text: message,
      btnOKText: 'ລຶບ',
      btnCancelText: 'ຍົກເລີກ',
      icon: 'warning'
    });
  }

  /**
   * Set active rate confirmation
   */
  static async setActiveConfirmation(rateName?: string): Promise<boolean> {
    const message = rateName 
      ? `ຕ້ອງການຕັ້ງ "${rateName}" ເປັນອັດຕາແລກປ່ຽນທີ່ໃຊ້ງານບໍ?`
      : 'ຕ້ອງການຕັ້ງເປັນອັດຕາແລກປ່ຽນທີ່ໃຊ້ງານບໍ?';
    
    return DialogService.confirm({
      title: 'ຢືນຢັນການຕັ້ງອັດຕາໃຊ້ງານ',
      text: message,
      btnOKText: 'ຕົກລົງ',
      btnCancelText: 'ຍົກເລີກ',
      icon: 'question'
    });
  }

  /**
   * Delete success message
   */
  static async deleteSuccess(): Promise<void> {
    return DialogService.success({
      title: 'ສຳເລັດ',
      text: 'ລຶບອັດຕາແລກປ່ຽນສຳເລັດແລ້ວ'
    });
  }

  /**
   * Delete error message
   */
  static async deleteError(errorMessage?: string): Promise<void> {
    return DialogService.error({
      title: 'ຜິດພາດ',
      text: errorMessage || 'ບໍ່ສາມາດລຶບອັດຕາແລກປ່ຽນໄດ້'
    });
  }

  /**
   * Set active success message
   */
  static async setActiveSuccess(): Promise<void> {
    return DialogService.success({
      title: 'ສຳເລັດ',
      text: 'ຕັ້ງເປັນອັດຕາແລກປ່ຽນທີ່ໃຊ້ງານແລ້ວ'
    });
  }

  /**
   * Set active error message
   */
  static async setActiveError(errorMessage?: string): Promise<void> {
    return DialogService.error({
      title: 'ຜິດພາດ',
      text: errorMessage || 'ບໍ່ສາມາດຕັ້ງເປັນອັດຕາທີ່ໃຊ້ງານໄດ້'
    });
  }
}

/**
 * Common dialog messages that can be reused across the application
 */
export class CommonDialogMessages {
  /**
   * Generic delete confirmation
   */
  static async deleteConfirmation(itemName?: string): Promise<boolean> {
    const message = itemName 
      ? `ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບ "${itemName}" ນີ້?`
      : 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບລາຍການນີ້?';
    
    return DialogService.confirm({
      title: 'ຢືນຢັນການລຶບ',
      text: message,
      btnOKText: 'ລຶບ',
      btnCancelText: 'ຍົກເລີກ',
      icon: 'warning'
    });
  }

  /**
   * Generic save confirmation
   */
  static async saveConfirmation(): Promise<boolean> {
    return DialogService.confirm({
      title: 'ຢືນຢັນການບັນທຶກ',
      text: 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການບັນທຶກການປ່ຽນແປງ?',
      btnOKText: 'ບັນທຶກ',
      btnCancelText: 'ຍົກເລີກ'
    });
  }

  /**
   * Generic success message
   */
  static async operationSuccess(message?: string): Promise<void> {
    return DialogService.success({
      title: 'ສຳເລັດ',
      text: message || 'ດໍາເນີນການສຳເລັດແລ້ວ'
    });
  }

  /**
   * Generic error message
   */
  static async operationError(message?: string): Promise<void> {
    return DialogService.error({
      title: 'ຜິດພາດ',
      text: message || 'ເກີດຄວາມຜິດພາດໃນການດໍາເນີນການ'
    });
  }

  /**
   * Network error message
   */
  static async networkError(): Promise<void> {
    return DialogService.error({
      title: 'ບັນຫາເຄືອຂ່າຍ',
      text: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີບເວີໄດ້ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ'
    });
  }

  /**
   * Unauthorized access message
   */
  static async unauthorizedAccess(): Promise<void> {
    return DialogService.error({
      title: 'ບໍ່ມີສິດທິ',
      text: 'ທ່ານບໍ່ມີສິດທິໃນການເຂົ້າເຖິງຂໍ້ມູນນີ້'
    });
  }
}
