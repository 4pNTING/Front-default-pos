"use client";
import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { RoomAreaListProps, RoomAreaType } from "../type/roomAreaType";
import { useStore, useRoomAreaMutations } from "../store/roomAreaStore";
import { msgConfirm, msgSuccess, msgError } from "@/utils/sweetalert";
import { IEntityStatus, IRoomAreaStatus } from "@/utils/base";

interface ButtonOptionProps {
  props: RoomAreaListProps;
  currentToView: RoomAreaType;
  onEditClick?: (item: RoomAreaType) => void;
  loadRoomAreaCall?: any;
}

export function ButtonOption({
  props,
  currentToView,
  onEditClick,
  loadRoomAreaCall,
}: ButtonOptionProps) {
  const { lang, dictionary: dic } = props;

  const {
    deleteRoomAreaAPI,
    restoreRoomAreaAPI,
    setSelectedItem,
    setToggleUpdateComponent,
  } = useStore();
  const { deleteRoomAreaMutation, restoreRoomAreaMutation } =
    useRoomAreaMutations();

  const isActive = currentToView?.isActive === IEntityStatus.active;
  const isUsing = currentToView?.status === IRoomAreaStatus.using;

  const handleEdit = async () => {
    // Check if currentToView has complete data
    if (
      !currentToView ||
      !currentToView._id ||
      !currentToView.name ||
      !currentToView.zone
    ) {
      await msgError({
        title: dic?.error,
        text: dic?.dataIncomplete,
        btnOKText: dic?.ok,
        btnOKColor: "#1d5089ff",
      });
      return;
    }

    setSelectedItem(currentToView);
    setToggleUpdateComponent(true);
  };

  const handleDeleteClick = async () => {
    const confirmed = await msgConfirm({
      title: dic?.confirmDeleteTitle,
      text: dic?.disabledRoomArea + " " + currentToView.name,
      btnConfirmText: dic?.disabled,
      btnCancelText: dic?.cancel,
      btnConfirmColor: "#1d5089ff",
    });

    if (!confirmed) return;

    try {
      await deleteRoomAreaAPI({
        props: {
          _id: currentToView._id || "",
          mutation: deleteRoomAreaMutation,
        },
      });

      await msgSuccess({
        title: dic?.success,
        text: dic?.disabledRoomArea,
        btnOKText: dic?.ok,
        btnOKColor: "#1d5089ff",
      });
    } catch (error: any) {
      await msgError({
        title: dic?.error,
        text: error.message,
        btnOKText: dic?.ok,
        btnOKColor: "#1d5089ff",
      });
    }
  };

  const handleRestoreClick = async () => {
    const confirmed = await msgConfirm({
      title: dic?.confirmRestoreTitle,
      text: dic?.confirmRestoreTitle + " " + currentToView.name,
      btnCancelText: dic?.cancel,
      btnConfirmText: dic?.confirm,
      btnConfirmColor: "#1d5089ff",
    });

    if (!confirmed) return;

    try {
      await restoreRoomAreaAPI({
        props: {
          _id: currentToView._id || "",
          mutation: restoreRoomAreaMutation,
        },
      });

      await msgSuccess({
        title: dic?.success,
        text: dic?.confirmRestoreTitle + " " + currentToView.name,
        btnOKText: dic?.ok,
        btnOKColor: "#1d5089ff",
      });
    } catch (error: any) {
      await msgError({
        title: dic?.error,
        text: error.message,
        btnOKText: dic?.ok,
        btnOKColor: "#1d5089ff",
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
                disabled={isUsing}
              >
                <i
                  className={`tabler-edit text-[18px] ${isUsing ? "text-gray-400" : "text-yellow-500"}`}
                ></i>
              </IconButton>
            </Tooltip>

            <Tooltip title={dic?.disabled}>
              <IconButton
                onClick={handleDeleteClick}
                size="small"
                className="text-gray-600 hover:bg-gray-50"
                disabled={isUsing}
              >
                <i
                  className={`tabler-trash text-[18px] ${isUsing ? "text-gray-400" : "text-red-500"}`}
                ></i>
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
