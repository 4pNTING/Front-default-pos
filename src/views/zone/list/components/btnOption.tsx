"use client";
import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { ZoneListProps, ZoneType } from "../../type/zoneType";
import { useStore, useZoneMutations } from "../../store/zoneStore";
import { CommonToastMessages, ToastService } from "@/utils/toastService";
import { msgConfirm, msgSuccess, msgError } from "@/utils/sweetalert";

interface ButtonOptionProps {
  props: ZoneListProps;
  currentToView: ZoneType;
  onEditClick?: (item: ZoneType) => void;
  loadZoneCall?: any;
}

export function ButtonOption({
  props,
  currentToView,
  onEditClick,
  loadZoneCall,
}: ButtonOptionProps) {
  const { lang, dictionary: dic } = props;

  const { deleteZoneAPI, restoreZoneAPI, loadZoneAPI } = useStore();
  const { deleteZoneMutation, restoreZoneMutation } = useZoneMutations();

  const isActive = currentToView?.isActive === "active";

  const handleEdit = () => {
    if (onEditClick) {
      onEditClick(currentToView);
    }
  };

  const handleDeleteClick = async () => {
    const confirmed = await msgConfirm({
      title: dic?.confirmDeleteTitle || "ຢືນຢັນການລົບ",
      text: dic?.confirmDeleteText || "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບ?",
      btnConfirmText: dic?.confirm || "ຢືນຢັນ",
      btnCancelText: dic?.cancel,
      btnConfirmColor: "#1d5089ff",
    });

    if (!confirmed) return;

    try {
      await deleteZoneAPI({
        props: {
          _id: currentToView._id || "",
          mutation: deleteZoneMutation,
        },
      });

      ToastService.deleteSuccess(dic);
    } catch (error: any) {
      ToastService.actionError("ປິດໃຊ້ງານໂຊນ", error.message, dic);
    }
  };

  const handleRestoreClick = async () => {
    const confirmed = await msgConfirm({
      title: dic?.confirmRestoreTitle,
      text: "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການເປີດໃຊ້ງານ?",
      btnCancelText: dic?.cancel,
      btnConfirmText: dic?.confirm || "ຢືນຢັນ",
      btnConfirmColor: "#1d5089ff",
    });

    if (!confirmed) return;

    try {
      await restoreZoneAPI({
        props: {
          _id: currentToView._id || "",
          mutation: restoreZoneMutation,
        },
      });

      ToastService.restoreSuccess(dic);
    } catch (error: any) {
      ToastService.actionError("ເປີດໃຊ້ງານໂຊນ", error.message, dic);
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center justify-center">
        {isActive ? (
          <>
            <Tooltip title={dic?.edit}>
              <IconButton
                onClick={handleEdit}
                size="small"
                className="text-gray-600 hover:bg-gray-50"
              >
                <i className="tabler-edit text-[18px] text-yellow-500"></i>
              </IconButton>
            </Tooltip>

            <Tooltip title={dic?.disabled}>
              <IconButton
                onClick={handleDeleteClick}
                size="small"
                className="text-gray-600 hover:bg-gray-50"
              >
                <i className="tabler-trash text-[18px] text-red-500"></i>
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title={dic?.restore}>
              <IconButton
                onClick={handleRestoreClick}
                size="small"
                className="text-gray-600 hover:bg-gray-50"
              >
                <i className="tabler-refresh text-[18px] text-green-500"></i>
              </IconButton>
            </Tooltip>
          </>
        )}
      </div>
    </>
  );
}
