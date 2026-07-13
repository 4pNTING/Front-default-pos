"use client";
import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { ZoneListProps, ZoneType } from "../../type/zoneType";
import { useStore, useZoneMutations } from "../../store/zoneStore";
import { ToastService } from "@/utils/toastService";
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
      title: dic?.confirmDeleteTitle,
      text: `ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການປິດໃຊ້ງານ "${currentToView.name}" ນີ້?`,
      btnConfirmText: dic?.disabled,
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

      // if (loadZoneCall) {
      //   await loadZoneAPI({
      //     props: {
      //       query: loadZoneCall,
      //       dictionary: dic,
      //     },
      //   });
      // }

      await msgSuccess({
        title: dic?.success,
        text: "ປິດໃຊ້ງານ Zone ສຳເລັດແລ້ວ",
        btnOKText: dic?.ok,
        btnOKColor: "#1d5089ff",
      });
    } catch (error: any) {
      await msgError({
        title: dic?.error,
        text: error.message,
        btnOKText: dic?.ok,
        btnOKColor: "#d33",
      });
    }
  };

  const handleRestoreClick = async () => {
    const confirmed = await msgConfirm({
      title: dic?.confirmRestoreTitle,
      text: `ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການເປີດໃຊ້ງານ "${currentToView.name}" ນີ້?`,
      btnCancelText: dic?.cancel,
      btnConfirmText: dic?.restore,
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

      // if (loadZoneCall) {
      //   await loadZoneAPI({
      //     props: {
      //       query: loadZoneCall,
      //       dictionary: dic,
      //     },
      //   });
      // }

      await msgSuccess({
        title: dic?.success,
        text: "ເປີດໃຊ້ງານ Zone ສຳເລັດແລ້ວ",
        btnOKText: dic?.ok,
        btnOKColor: "#1d5089ff",
      });
    } catch (error: any) {
      await msgError({
        title: dic?.error,
        text: error.message,
        btnOKText: dic?.ok,
        btnOKColor: "#d33",
      });
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
