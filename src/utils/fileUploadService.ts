// utils/fileUploadService.ts
import { ToastService } from '@/utils/toastService';

interface UploadOptions {
  file: File;
  ownerId: string;
  ownerType: string;
  uploadType?: 'pdf' | 'image'; // 'pdf' or 'image'
  dic?: any; // Add dictionary for localized messages
}

interface UploadResponse {
  success?: boolean;
  message?: string;
  file?: {
    _id: string;
    fileName: string;
    filePath: string;
    [key: string]: any;
  };
  urls?: {
    info: string;
    preview: string;
    download: string;
  };
  // Legacy fields
  url?: string;
  fileUrl?: string;
  downloadUrl?: string;
}

const getUploadApiUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || '';
  if (apiUrl.includes('/api-gateway')) {
    return apiUrl.replace('/api-gateway', '/api/upload');
  }
  if (apiUrl.endsWith('/')) {
    return `${apiUrl}api/upload`;
  }
  if (apiUrl) {
    return `${apiUrl}/api/upload`;
  }
  return '/api/upload';
};

/**
 * Upload file to server
 * @param options - Upload configuration
 * @returns Promise<string> - File URL or empty string on failure
 */
export const uploadFile = async (options: UploadOptions): Promise<string> => {
  const { file, ownerId, ownerType, uploadType = 'pdf', dic } = options;

  // Validate ownerId
  if (!ownerId) {
    ToastService.error(dic?.ownerIdRequired || 'ຕ້ອງການ Owner ID ສຳລັບການອັບໂຫລດໄຟລ໌');
    return '';
  }

  // Prepare FormData
  const formData = new FormData();
  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');

  formData.append('file', file);
  formData.append('ownerId', ownerId);
  formData.append('ownerType', ownerType);
  formData.append('originalName', nameWithoutExt);
  formData.append('uploadType', uploadType);

  try {
    const uploadUrl = getUploadApiUrl();
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      ToastService.error(dic?.uploadFailed ? `${dic.uploadFailed}: ${response.status} - ${errorText}` : `ອັບໂຫລດລົ້ມເຫລວ: ${response.status} - ${errorText}`);
      console.error('Upload error:', errorText);
      return '';
    }

    const result: UploadResponse = await response.json();
    const fileUrl = result.url || result.fileUrl || result.downloadUrl || '';

    if (fileUrl) {
      return fileUrl;
    } else {
      console.warn('Upload response:', result);
      return '';
    }
  } catch (error) {
    console.error('Upload error:', error);
    ToastService.error(dic?.uploadError || 'ເກີດຂໍ້ຜິດພາດໃນການອັບໂຫລດໄຟລ໌');
    return '';
  }
};

/**
 * Validate file before upload
 * @param file - File to validate
 * @param options - Validation options
 * @returns boolean - true if valid
 */
export const validateFile = (
  file: File,
  options?: {
    maxSize?: number; // in MB
    allowedTypes?: string[];
    dic?: any; // Add dictionary for localized messages
  }
): boolean => {
  const maxSize = options?.maxSize || 10; // Default 10MB
  const allowedTypes = options?.allowedTypes || [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
  ];

  const dic = options?.dic;

  // Check file size
  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > maxSize) {
    ToastService.error(dic?.fileSizeTooBig ? `${dic.fileSizeTooBig} (${dic.maximum || 'ສູງສຸດ'} ${maxSize}MB)` : `ໄຟລ໌ມີຂະໜາດໃຫຍ່ເກີນໄປ (ສູງສຸດ ${maxSize}MB)`);
    return false;
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    ToastService.error(dic?.invalidFileType || 'ປະເພດໄຟລ໌ບໍ່ຖືກຕ້ອງ');
    return false;
  }

  return true;
};

/**
 * Get file type from file extension or MIME type
 * @param file - File object
 * @returns 'pdf' | 'image'
 */
export const getFileUploadType = (file: File): 'pdf' | 'image' => {
  if (file.type.startsWith('image/')) {
    return 'image';
  }
  return 'pdf';
};

/**
 * Global helper สำหรับอัปโหลดไฟล์ของ owner ใด ๆ
 * - เติม token / backendKey / platformKey จาก env ให้ครบ
 * - ให้ caller ส่ง ownerType เอง (รองรับ ILeasingFileType ทุกตัว)
 */
export const uploadOwnerFile = async (params: {
  file: File;
  ownerId: string;
  ownerType: string; // แนะนำให้ส่ง ILeasingFileType.xxx
  dic?: any;
}): Promise<string> => {
  const { file, ownerId, ownerType, dic } = params;
  return uploadFile({
    file,
    ownerId,
    ownerType,
    uploadType: getFileUploadType(file),
    dic,
  });
};
