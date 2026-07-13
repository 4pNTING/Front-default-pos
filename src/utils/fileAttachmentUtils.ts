// utils/fileAttachmentUtils.ts
import type { AttachedFile } from "@core/components/custom-inputs";

/**
 * แปลง File[] | string[] → AttachedFile[]
 * รองรับทั้ง File objects (ใหม่) และ string paths (จาก database)
 */
export const filesToAttachedFiles = (files: (File | string)[]): AttachedFile[] => {
  return files.map((file, index) => {
    if (typeof file === 'string') {
      // String path from database
      const fileName = file.split('/').pop()?.split('?')[0] || 'file';
      const fileType = fileName.toLowerCase().includes('.pdf') ? 'application/pdf' : 'image/jpeg';
      
      return {
        id: `${Date.now()}-${index}-${fileName}`,
        name: fileName,
        originalName: fileName,
        size: 0, // Unknown size for string paths
        type: fileType, // Set appropriate type
        url: file, // Store the path as URL
      };
    } else {
      // File object
      return {
        id: `${Date.now()}-${index}-${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      };
    }
  });
};

/**
 * แปลง AttachedFile[] → (File | string)[]
 * รักษาทั้ง File objects และ string paths
 */
export const attachedFilesToFiles = (attachedFiles: AttachedFile[]): (File | string)[] => {
  return attachedFiles
    .map((af) => {
      if (af.file) {
        return af.file; // Return File object
      } else if (af.url) {
        return af.url; // Return string path from database
      }
      return null;
    })
    .filter((item): item is File | string => item !== null);
};
