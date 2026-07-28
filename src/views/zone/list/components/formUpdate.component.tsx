"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import { ZoneListProps, ZoneType } from "../../type/zoneType";
import { useStore, useZoneMutations } from "../../store/zoneStore";
import { CommonToastMessages, ToastService } from "@/utils/toastService";
import CustomTextField from "@/@core/components/mui/TextField";
import { msgError, msgSuccess } from "@/utils/sweetalert";

interface FormUpdateComponentProps {
  props: ZoneListProps;
  item?: ZoneType;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function FormUpdateComponent({
  props,
  item,
  open,
  onClose,
  onSuccess,
}: FormUpdateComponentProps) {
  const { dictionary: dic } = props;
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateZoneAPI } = useStore();
  const { updateZoneMutation } = useZoneMutations();

  // Initialize form data when item changes
  useEffect(() => {
    if (item) {
      setName(item.name || "");
    }
  }, [item]);

  const handleClose = () => {
    setName("");
    setLoading(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!item?._id) {
      await msgError({
        title: dic?.error,
        text: "ບໍ່ສາມາດແກ້ໄຂ Zone ໄດ້",
        btnOKText: dic?.ok,
        btnOKColor: "#d33",
      });
      return;
    }

    setLoading(true);

    try {
      await updateZoneAPI({
        props: {
          _id: item._id,
          mutation: updateZoneMutation,
          name: name.trim(),
        },
      });

      ToastService.updateSuccess(dic);
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      ToastService.actionError("ແກ້ໄຂໂຊນ", error.message, dic);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = name.trim();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      disableRestoreFocus
      disableEnforceFocus
    >
      {/* Modal Header */}
      <DialogTitle
        sx={{
          m: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#0A3981",
          color: "white",
          padding: "16px 24px",
          fontWeight: 600,
          fontSize: "18px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "white",
            fontWeight: 600,
          }}
        >
          <i className="tabler-edit text-[20px] mr-2" />
          {dic?.editZone}
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: "white",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            padding: "4px",
          }}
        >
          <i className="tabler-x text-[20px]" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <div className="p-6">
          {/* Zone Name */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              {dic?.zoneName}
            </div>
            <CustomTextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading && name.trim()) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              fullWidth
              size="small"
              placeholder="Enter zone name"
              disabled={loading}
              autoFocus
              InputProps={{
                startAdornment: (
                  <i className="tabler-building-arch text-[16px] mr-2 text-gray-500" />
                ),
              }}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={handleClose}
              variant="contained"
              color="secondary"
              disabled={loading}
              size="medium"
              className="min-w-[100px]"
              startIcon={<i className="tabler-x text-[16px]" />}
            >
              {dic?.cancel}
            </Button>

            <Button
              onClick={handleSubmit}
              variant="contained"
              color="warning"
              disabled={loading || !isFormValid}
              size="medium"
              className="min-w-[120px] hover:bg-yellow-700"
              startIcon={
                loading ? (
                  <i className="tabler-loader-2 text-[16px] animate-spin" />
                ) : (
                  <i className="tabler-edit text-[16px]" />
                )
              }
            >
              {loading ? "Updating..." : dic?.update}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
