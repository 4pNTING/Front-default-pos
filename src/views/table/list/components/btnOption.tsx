"use client";
import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { TableListProps, TableType } from "../../type/tableType";
import { useTableStore, useTableMutations } from "../../store/tableStore";
import { msgConfirm } from "@/utils/sweetalert";
import { ToastService } from "@/utils/toastService";

interface ButtonOptionProps {
  props: TableListProps;
  currentToView: TableType;
  onEditClick?: (item: TableType) => void;
  onRefresh?: () => Promise<void>;
}

export function ButtonOption({
  props,
  currentToView,
  onEditClick,
}: ButtonOptionProps) {
  const { dictionary: dic } = props;
  const labels = dic.tablePage;

  const {
    deleteTableAPI,
    restoreTableAPI,
    setSelectedItem,
    setToggleUpdateComponent,
  } = useTableStore();
  const { deleteTableMutation, restoreTableMutation } = useTableMutations();

  const isActive = currentToView?.isActive === "active";

  const handleEdit = () => {
    if (onEditClick) {
      onEditClick(currentToView);
    } else {
      setSelectedItem(currentToView);
      setToggleUpdateComponent(true);
    }
  };

  const handleDeleteClick = async () => {
    const confirmed = await msgConfirm({
      title: labels.deleteTitle || dic.confirmDeleteTitle,
      text: labels.deleteQuestion?.replace("{name}", currentToView.number) || dic.confirmDeleteText,
      btnConfirmText: labels.deleteConfirm || dic.confirm,
      btnCancelText: dic.cancel,
      btnConfirmColor: "#1d5089ff",
    });

    if (!confirmed) return;

    try {
      await deleteTableAPI({
        props: {
          mutation: deleteTableMutation,
          _id: currentToView._id,
        },
      });

      ToastService.deleteSuccess(dic);
    } catch (error: any) {
      ToastService.actionError(labels.deleteTitle, error.message, dic);
    }
  };

  const handleRestoreClick = async () => {
    const confirmed = await msgConfirm({
      title: dic.confirmRestoreTitle,
      text: dic.confirmRestoreText,
      btnCancelText: dic.cancel,
      btnConfirmText: dic.confirm,
      btnConfirmColor: "#1d5089ff",
    });

    if (!confirmed) return;

    try {
      await restoreTableAPI({
        props: {
          mutation: restoreTableMutation,
          _id: currentToView._id,
        },
      });

      ToastService.restoreSuccess(dic);
    } catch (error: any) {
      ToastService.actionError(labels.restoreSuccess, error.message, dic);
    }
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      {isActive ? (
        <>
          <Tooltip title={dic.edit}>
            <IconButton
              onClick={handleEdit}
              size="small"
              className="text-gray-600 hover:bg-gray-50"
            >
              <i className="tabler-edit text-[18px] text-yellow-500"></i>
            </IconButton>
          </Tooltip>

          <Tooltip title={dic.disabled || dic.delete}>
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
          <Tooltip title={dic.restore}>
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
  );
}
