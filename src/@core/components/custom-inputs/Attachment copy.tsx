import React, { useState, useRef } from "react";
import {Box,Button,Typography,Paper,LinearProgress,Alert} from "@mui/material";

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File;
  url?: string;
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
  dic, placeholder = dic?.clickToSelectFile || "ຄລິກເພື່ອເລືອກໄຟລ໌",
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles: AttachedFile[] = [];
    const fileArray = Array.from(selectedFiles);

    if (!multiple) {
      if (fileArray.length > 1) {
        setError("ສາມາດເລືອກໄດ້ພຽງໄຟລ໌ດຽວເທົ່ານັ້ນ");
        return;
      }
    } else {
      if (files.length + fileArray.length > maxFiles) {
        setError(`ສາມາດແນບໄດ້ສູງສຸດ ${maxFiles} ໄຟລ໌`);
        return;
      }
    }

    for (const file of fileArray) {
      if (file.size > maxFileSize * 1024 * 1024) {
        setError(`ໄຟລ໌ ${file.name} ມີຂະໜາດໃຫຍ່ເກີນ ${maxFileSize}MB`);
        return;
      }

      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (acceptedTypes.length > 0 && !acceptedTypes.includes(fileExtension)) {
        setError(`ປະເພດໄຟລ໌ ${fileExtension} ບໍ່ຖືກຮອງຮັບ`);
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

    setError(null);
    onFilesChange(multiple ? [...files, ...newFiles] : newFiles);
  };

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = files.filter((file) => file.id !== fileId);
    onFilesChange(updatedFiles);
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
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf": return "tabler-file-type-pdf";
      case "jpg":
      case "png":
      case "jpeg": return "tabler-photo";
      default: return "tabler-file";
    }
  };

  const handlePrint = (e: React.MouseEvent, file: AttachedFile) => {
    e.stopPropagation();
    let fileUrl = "";
    if (file.url) fileUrl = file.url;
    else if (file.file) fileUrl = URL.createObjectURL(file.file);
    if (!fileUrl) return;

    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);
    const frameDoc = printFrame.contentWindow?.document;
    if (!frameDoc) return;

    frameDoc.open();
    frameDoc.write(`
        <html>
        <head>
          <title>${file.name}</title>
          <style>
            @media print {
              @page { margin: 0; size: auto; }
              body { margin: 0; background-color: white !important; display: flex; align-items: center; justify-content: center; width: 100%; height: 100vh; }
              img, embed { max-width: 100%; max-height: 100vh; object-fit: contain; border: none; }
            }
            body { margin: 0; background-color: white; display: flex; align-items: center; justify-content: center; width: 100vw; height: 100vh; }
            img, embed { max-width: 100%; max-height: 100%; object-fit: contain; border: none; }
          </style>
        </head>
        <body>
        </body>
        </html>
    `);

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      const embed = frameDoc.createElement("embed");
      embed.setAttribute("src", fileUrl);
      embed.setAttribute("type", "application/pdf");
      frameDoc.body.appendChild(embed);
    } else {
      const img = frameDoc.createElement("img");
      img.setAttribute("src", fileUrl);
      frameDoc.body.appendChild(img);
    }

    frameDoc.close();

    setTimeout(() => {
      try {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
      } catch (error) {
        console.error("Print failed:", error);
      } finally {
        setTimeout(() => {
          document.body.removeChild(printFrame);
          if (file.file) URL.revokeObjectURL(fileUrl);
        }, 500);
      }
    }, 250);
  };

  const hasSingleFile = !multiple && files.length > 0;
  const singleFile = hasSingleFile ? files[0] : null;

  return (
    <Box>
      {title && (<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>)}

      <input
        ref={fileInputRef} type="file" multiple={multiple} accept={acceptedTypes.join(",")}
        onChange={(e) => handleFileSelect(e.target.files)} style={{ display: "none" }} disabled={disabled}
      />

      {/* UNIFIED BOX FOR SINGLE FILE MODE */}
      {!multiple && (
        <Paper
          variant="outlined"
          sx={{
            border: hasSingleFile ? "2px dashed #10b981" : dragOver ? "2px dashed #3b82f6" : "2px dashed #d1d5db",
            backgroundColor: hasSingleFile ? "#f0fdf4" : dragOver ? "#eff6ff" : disabled ? "#f9fafb" : "#fefefe",
            borderRadius: 2, cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s ease-in-out",
            "&:hover": {
              borderColor: disabled ? "#d1d5db" : hasSingleFile ? "#059669" : "#3b82f6",
              backgroundColor: disabled ? "#f9fafb" : hasSingleFile ? "#dcfce7" : "#f8fafc",
            },
            minHeight: "40px", display: "flex", alignItems: "center", p: 1, px: 2,
          }}
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          {hasSingleFile && singleFile ? (
            <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, minWidth: 0 }}>
                <i className={`${getFileIcon(singleFile.name)} text-[20px] text-green-600`} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#059669", fontSize: "13px", fontWeight: 500, overflow: "hidden", 
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}
                >
                  {singleFile.name}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                {(singleFile.url || singleFile.file) && (
                  <Box
                    onClick={(e) => handlePrint(e, singleFile)} title={dic?.print || "ພິມ"}
                    sx={{ cursor: "pointer", p: 1, color: "#3b82f6", "&:hover": { color: "#2563eb" } }}
                  >
                    <i className="tabler-printer text-[18px]" />
                  </Box>
                )}
                <Box
                  onClick={(e) => { e.stopPropagation(); if (!disabled) handleRemoveFile(singleFile.id); }}
                  title={dic?.delete || "ລຶບ"}
                  sx={{
                    cursor: disabled ? "not-allowed" : "pointer", p: 1, 
                    color: disabled ? "#d1d5db" : "#ef4444", 
                    "&:hover": { color: disabled ? "#d1d5db" : "#dc2626" },
                  }}
                >
                  <i className="tabler-trash text-[18px]" />
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
              <i className="tabler-upload text-[20px] text-gray-400" />
              <Typography variant="body2" sx={{ color: "#9ca3af", fontSize: "14px", fontStyle: "italic" }}>
                {placeholder}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* AREA AND FILE LIST FOR MULTIPLE MODE */}
      {multiple && (
        <>
          <Paper
            variant="outlined"
            sx={{
              border: dragOver ? "2px dashed #3b82f6" : "2px dashed #d1d5db", borderRadius: 2,
              backgroundColor: dragOver ? "#eff6ff" : disabled ? "#f9fafb" : "#fefefe",
              cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s ease-in-out",
              "&:hover": { borderColor: disabled ? "#d1d5db" : "#3b82f6", backgroundColor: disabled ? "#f9fafb" : "#f8fafc" },
            }}
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <Box sx={{ p: 1.5, textAlign: "center", minHeight: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
                <i className="tabler-upload text-[16px] text-gray-500 mr-2"></i>
                <Typography variant="body2" sx={{ color: "#6b7280", fontSize: "14px" }}>
                  {placeholder}
                </Typography>
                {files.length > 0 && (
                  <Typography
                    variant="caption"
                    sx={{ color: "#059669", fontWeight: 500, ml: 1, fontSize: "12px" }}
                  >
                    ({files.length})
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>

          {files.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ color: "#6b7280", mb: 1, display: "block" }}>
                ໄຟລ໌ທີ່ແນບມາ ({files.length})
              </Typography>
              {files.map((file) => (
                <Paper
                  key={file.id} variant="outlined"
                  sx={{
                    p: 1.5, mb: 1, display: "flex", alignItems: "center", justifyContent: "space-between",
                    backgroundColor: "#fafafa", "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, minWidth: 0 }}>
                    <i className={`${getFileIcon(file.name)} text-[24px] text-blue-600`} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      >
                        {file.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {(file.url || file.file) && (
                      <Button
                        size="small" variant="text" onClick={(e) => handlePrint(e, file)} title={dic?.print || "ພິມ"}
                        sx={{
                          minWidth: "auto", px: 1, color: "#3b82f6", 
                          "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                        }}
                      >
                        <i className="tabler-printer text-[18px]" />
                      </Button>
                    )}
                    <Button
                      size="small" variant="text" onClick={() => handleRemoveFile(file.id)} disabled={disabled}
                      title={dic?.delete || "ລຶບ"}
                      sx={{
                        minWidth: "auto", px: 1, color: "#ef4444", 
                        "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                      }}
                    >
                      <i className="tabler-trash text-[18px]" />
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mt: 2 }}>
          {error}
        </Alert>
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