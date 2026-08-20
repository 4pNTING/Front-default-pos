import React, { useState } from "react";
import Attachment, { AttachedFile } from "./Attachment";
import {
  uploadFile,
  validateFile,
  getFileUploadType,
} from "@/utils/fileUploadService";

export interface UploadFileProps {
  title?: string;
  file: AttachedFile | null; // Single file
  onFileChange: (file: AttachedFile | null) => void; // Single file callback
  ownerId: string;
  ownerType: string; // แนะนำให้ส่งค่า enum เช่น ILeasingFileType.mmsCustomer
  disabled?: boolean;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  dic?: any;
  autoUpload?: boolean; // Auto-upload on file select (default true)
  // ตัวเลือกให้ caller สร้างชื่อไฟล์ดาวน์โหลดเอง เช่น ตามเลขสัญญา
  generateDownloadFileName?: (file: AttachedFile) => string;
}

/**
 * Global UploadFile component
 * - ใช้ Attachment ภายใน
 * - รองรับ single-file upload พร้อมเรียก uploadFile ให้เอง
 * - ให้ module ต่าง ๆ ส่ง ownerType เป็น enum ของตัวเองได้
 */
const UploadFile: React.FC<UploadFileProps> = ({
  title,
  file,
  onFileChange,
  ownerId,
  ownerType,
  disabled = false,
  maxFileSize = 5,
  acceptedTypes = [".pdf", ".jpg", ".png"],
  dic,
  autoUpload = true,
  generateDownloadFileName,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFilesChange = async (newFiles: AttachedFile[]) => {
    const newFile = newFiles[0];

    if (!newFile) {
      onFileChange(null);
      return;
    }

    // Auto-upload mode
    if (autoUpload && !disabled && newFile.file && !newFile.url) {
      // Map extensions -> mime types
      const mimeTypes: string[] = [];
      acceptedTypes.forEach((ext) => {
        if (ext === ".pdf") mimeTypes.push("application/pdf");
        if (ext === ".jpg" || ext === ".jpeg") mimeTypes.push("image/jpeg");
        if (ext === ".png") mimeTypes.push("image/png");
        if (ext === ".webp") mimeTypes.push("image/webp");
      });

      if (
        !validateFile(newFile.file, {
          maxSize: maxFileSize,
          allowedTypes: mimeTypes,
        })
      ) {
        return;
      }

      setUploading(true);

      try {
        const fileUrl = await uploadFile({
          file: newFile.file,
          ownerId,
          ownerType,
          uploadType: getFileUploadType(newFile.file),
        });

        if (fileUrl) {
          const finalName = generateDownloadFileName
            ? generateDownloadFileName(newFile)
            : newFile.name;

          const uploadedFile: AttachedFile = {
            ...newFile,
            url: fileUrl,
            file: undefined,
            name: finalName || newFile.name,
          };
          onFileChange(uploadedFile);
        } else {
          onFileChange(null);
        }
      } catch (error) {
        console.error("Upload error:", error);
        onFileChange(null);
      } finally {
        setUploading(false);
      }
    } else {
      // Manual upload mode or file already uploaded
      const finalName = generateDownloadFileName
        ? generateDownloadFileName(newFile)
        : newFile.name;

      const fileWithName: AttachedFile = {
        ...newFile,
        name: finalName || newFile.name,
      };
      onFileChange(fileWithName);
    }
  };

  const filesArray: AttachedFile[] = file ? [file] : [];

  return (
    <div className="global-upload-file">
      {uploading && (
        <div className="mb-2 text-blue-600 text-sm flex items-center ">
          <i className="tabler-loader animate-spin mr-2" />
          {dic?.uploading}
        </div>
      )}

      <Attachment
        title={title}
        files={filesArray}
        onFilesChange={handleFilesChange}
        maxFiles={1}
        maxFileSize={maxFileSize}
        acceptedTypes={acceptedTypes}
        disabled={disabled || uploading}
        multiple={false}
        dic={dic}
      />
    </div>
  );
};

export default UploadFile;
