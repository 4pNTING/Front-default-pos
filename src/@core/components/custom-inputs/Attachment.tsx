import React, { useState, useRef } from "react";
import {Box,Button,Typography,Paper,LinearProgress,Alert, IconButton, Chip} from "@mui/material";
import { ToastService } from '@/utils/toastService';

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File; 
  url?: string; 
  downloadFileName?: string; 
}

export interface AttachmentProps {
  title?: string;
  files: AttachedFile[];
  onFilesChange: (files: AttachedFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  disabled?: boolean;
  multiple?: boolean;
  placeholder?: string;
  dic?: any;
}

const Attachment: React.FC<AttachmentProps> = ({
  title = "", files = [], onFilesChange, maxFiles = 10, maxFileSize = 10, 
  acceptedTypes = [".pdf", ".jpg", ".png"], disabled = false, multiple = true, 
  dic, placeholder = dic?.clickToSelectFile,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles: AttachedFile[] = [];
    const fileArray = Array.from(selectedFiles);

    if (!multiple) {
      if (fileArray.length > 1) {
        ToastService.error(dic?.onlySingleFileAllowed);
        return;
      }
    } else {
      if (files.length + fileArray.length > maxFiles) {
        ToastService.error(
          dic?.maxFilesReached?.replace('{maxFiles}', maxFiles.toString())
        );
        return;
      }
    }

    for (const file of fileArray) {
      if (file.size > maxFileSize * 1024 * 1024) {
        ToastService.error(
          dic?.fileSizeExceeded
            ?.replace('{fileName}', file.name)
            .replace('{maxSize}', maxFileSize.toString())
        );
        return;
      }

      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (acceptedTypes.length > 0 && !acceptedTypes.includes(fileExtension)) {
        ToastService.error(
          dic?.fileTypeNotSupported?.replace('{type}', fileExtension)
        );
        continue;
      }

      newFiles.push({
        id: Date.now().toString() + Math.random().toString(36),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      });
    }

    onFilesChange(multiple ? [...files, ...newFiles] : newFiles);
  };

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = files.filter((file) => file.id !== fileId);
    onFilesChange(updatedFiles);
    // Reset file input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string): string => {
    if (!fileName) return "tabler-file";
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf": return "tabler-file-type-pdf";
      case "jpg":
      case "png":
      case "jpeg": return "tabler-photo";
      default: return "tabler-file";
    }
  };


  const getBackendBaseUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || '';
    if (apiUrl.includes('/api-gateway')) {
      return apiUrl.replace('/api-gateway', '');
    }
    return apiUrl;
  };

  const handleDownload = async (e: React.MouseEvent, file: AttachedFile) => {
    e.stopPropagation();
    
    const downloadName = file.downloadFileName || file.name;
    
    if (file.file) {
      // Local file object - direct download
      const fileUrl = URL.createObjectURL(file.file);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(fileUrl);
      return;
    }
    
    if (file.url && file.url.trim() !== '') {
      try {
        const baseUrl = getBackendBaseUrl();
        const fullUrl = file.url.startsWith('http') ? file.url : `${baseUrl}${file.url.startsWith('/') ? '' : '/'}${file.url}`;
        
        const response = await fetch(fullUrl, {
          method: 'GET',
        });
        
        if (!response.ok) {
          ToastService.error(`${dic?.fileDownloadFailed}: ${response.status}`);
          return;
        }
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = file.downloadFileName || file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      } catch (error) {
        ToastService.error(dic?.downloadError);
      }
    } else {
      ToastService.error(dic?.fileNotFound);
    }
  };

  const handlePreview = (e: React.MouseEvent, file: AttachedFile) => {
    e.stopPropagation();
    if (file.file) {
      const fileUrl = URL.createObjectURL(file.file);
      window.open(fileUrl, '_blank');
    } else if (file.url) {
      const baseUrl = getBackendBaseUrl();
      const fullUrl = file.url.startsWith('http') ? file.url : `${baseUrl}${file.url.startsWith('/') ? '' : '/'}${file.url}`;
      window.open(fullUrl, '_blank');
    }
  };

  const hasSingleFile = !multiple && files.length > 0;
  const singleFile = hasSingleFile ? files[0] : null;

  return (
    <Box sx={{ width: "100%" }}>
      {title && (<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{title}</Typography>)}

      <input
        ref={fileInputRef} type="file" multiple={multiple} accept={acceptedTypes.join(",")}
        onChange={(e) => handleFileSelect(e.target.files)} style={{ display: "none" }} disabled={disabled}
      />

      {/* SINGLE FILE MODE */}
      {!multiple && (
        <>
          {hasSingleFile && singleFile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <Paper
                variant="outlined"
                sx={{
                  px: 1, 
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#fff",
                  borderColor: "#e5e7eb",
                  borderRadius: 1, // Match MUI default radius often
                  flex: 1,
                  minWidth: 0,
                  height: "40px", // Match size="small"
                  minHeight: "40px"
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
                  <Box 
                    sx={{ 
                      width: 28, 
                      height: 28, 
                      borderRadius: 1, 
                      backgroundColor: "#f3f4f6", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    <i className={`${getFileIcon(singleFile.name)} text-[18px] text-blue-600`} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2" 
                      sx={{ fontWeight: 600, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: '0.875rem' }}
                    >
                      {singleFile.name}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Action Buttons Outside */}
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", flexShrink: 0 }}>
                {singleFile.file && (
                   <IconButton size="small" onClick={(e) => handlePreview(e, singleFile)} sx={{ border: '1px solid #e5e7eb', borderRadius: 1, width: 32, height: 32 }}>
                      <i className="tabler-eye text-[18px] text-gray-500" />
                   </IconButton>
                )}
                {(singleFile.url && !singleFile.file) && (
                   <IconButton size="small" onClick={(e) => handleDownload(e, singleFile)} sx={{ border: '1px solid #e5e7eb', borderRadius: 1, width: 32, height: 32 }}>
                      <i className="tabler-download text-[18px] text-gray-500" />
                   </IconButton>
                )}
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => !disabled && handleRemoveFile(singleFile.id)} 
                  disabled={disabled}
                  sx={{ border: '1px solid #fee2e2', borderRadius: 1, bgcolor: '#fef2f2', width: 32, height: 32 }}
                >
                   <i className="tabler-trash text-[18px]" />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                border: dragOver ? "2px dashed #3b82f6" : "2px dashed #d1d5db",
                backgroundColor: dragOver ? "#eff6ff" : disabled ? "#f9fafb" : "#fefefe",
                borderRadius: 1, 
                cursor: disabled ? "not-allowed" : "pointer", 
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: disabled ? "#d1d5db" : "#3b82f6",
                  backgroundColor: disabled ? "#f9fafb" : "#f8fafc",
                },
                height: "40px", 
                minHeight: "40px", 
                display: "flex", 
                flexDirection: "row", 
                alignItems: "center", 
                justifyContent: "flex-start", 
                gap: 1.5,
                px: 1.5, 
                width: "100%",
              }}
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              onClick={() => !disabled && fileInputRef.current?.click()}
            >
              <i className="tabler-upload text-[18px] text-gray-400" />
              <Typography variant="body2" sx={{ color: "#9ca3af", fontSize: '0.875rem' }}>
                {dic?.clickToUpload}
              </Typography>
            </Paper>
          )}
        </>
      )}

      {/* MULTIPLE MODE */}
      {multiple && (
        <>
          <Paper
            variant="outlined"
            sx={{
              border: dragOver ? "2px dashed #3b82f6" : "2px dashed #d1d5db", borderRadius: 1,
              backgroundColor: dragOver ? "#eff6ff" : disabled ? "#f9fafb" : "#fefefe",
              cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s ease-in-out",
              "&:hover": { borderColor: disabled ? "#d1d5db" : "#3b82f6", backgroundColor: disabled ? "#f9fafb" : "#f8fafc" },
              height: "40px", 
              minHeight: "40px", 
              display: "flex", 
              flexDirection: "row", 
              alignItems: "center", 
              justifyContent: "flex-start", 
              gap: 1.5,
              px: 1.5,
              width: "100%"
            }}
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
             <i className="tabler-upload text-[18px] text-gray-400" />
             <Typography variant="body2" sx={{ color: "#9ca3af", fontSize: '0.875rem' }}>
               {placeholder}
             </Typography>
          </Paper>

          {files.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {files.map((file) => (
                <Box key={file.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      px: 1, 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between",
                      backgroundColor: "#fff", 
                      borderColor: '#e5e7eb',
                      flex: 1,
                      height: '40px',
                      borderRadius: 1
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
                      <i className={`${getFileIcon(file.name)} text-[18px] text-blue-600`} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: '0.875rem' }}>
                          {file.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                  
                  {/* Actions Outside */}
                  <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                    {file.file ? (
                        <IconButton size="small" onClick={(e) => handlePreview(e, file)} sx={{ border: '1px solid #e5e7eb', borderRadius: 1, width: 32, height: 32 }}>
                          <i className="tabler-eye text-[18px] text-gray-500" />
                        </IconButton>
                    ) : (
                        <IconButton size="small" onClick={(e) => handleDownload(e, file)} sx={{ border: '1px solid #e5e7eb', borderRadius: 1, width: 32, height: 32 }}>
                          <i className="tabler-download text-[18px] text-gray-500" />
                        </IconButton>
                    )}
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleRemoveFile(file.id)} 
                      disabled={disabled}
                      sx={{ border: '1px solid #fee2e2', borderRadius: 1, bgcolor: '#fef2f2', width: 32, height: 32 }}
                    >
                      <i className="tabler-trash text-[18px]" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography variant="caption" sx={{ color: "#6b7280", mt: 1 }}>
            {dic?.loading}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Attachment;
