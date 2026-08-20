"use client";
import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { MenuItemListProps, MenuItemType } from "../../type/menuItemType";
import { useMenuItemStore, useMenuItemMutations } from "../../store/menuItemStore";
import { msgConfirm } from "@/utils/sweetalert";
import { ToastService } from "@/utils/toastService";

interface ButtonOptionProps {
  props: MenuItemListProps;
  currentToView: MenuItemType;
  onEditClick?: (item: MenuItemType) => void;
  onRefresh?: () => Promise<void>;
}

export function ButtonOption({
  props,
  currentToView,
  onEditClick,
  onRefresh,
}: ButtonOptionProps) {
  const { dictionary: dic } = props;
  const labels = dic.menuItemPage;

  const {
    deleteMenuItemAPI,
    restoreMenuItemAPI,
    setSelectedItem,
    setToggleUpdateComponent,
  } = useMenuItemStore();
  const { deleteMenuItemMutation, restoreMenuItemMutation } = useMenuItemMutations();

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
      title: labels?.deleteTitle || dic?.confirmDeleteTitle,
      text: labels?.deleteQuestion?.replace("{name}", currentToView.name) || dic?.confirmDeleteText,
      btnConfirmText: labels?.deleteConfirm || dic?.confirm,
      btnCancelText: dic?.cancel,
      btnConfirmColor: "#1d5089ff",
    });

    if (!confirmed) return;

    try {
      await deleteMenuItemAPI({
        props: {
          mutation: deleteMenuItemMutation,
          _id: currentToView._id,
        },
      });

      ToastService.deleteSuccess(dic);
    } catch (error: any) {
      ToastService.actionError("ลบ MenuItem", error.message, dic);
    }
  };

  const handleRestoreClick = async () => {
    const confirmed = await msgConfirm({
      title: dic?.confirmRestoreTitle || "Restore",
      text: dic?.confirmRestoreText || "Are you sure you want to restore this item?",
      btnCancelText: dic?.cancel || "Cancel",
      btnConfirmText: dic?.confirm || "Confirm",
      btnConfirmColor: "#1d5089ff",
    });

    if (!confirmed) return;

    try {
      await restoreMenuItemAPI({
        props: {
          mutation: restoreMenuItemMutation,
          _id: currentToView._id,
        },
      });

      ToastService.restoreSuccess(dic);
    } catch (error: any) {
      ToastService.actionError("กู้คืน MenuItem", error.message, dic);
    }
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      {isActive ? (
        <>
          <Tooltip title={dic?.edit || "Edit"}>
            <IconButton
              onClick={handleEdit}
              size="small"
              className="text-gray-600 hover:bg-gray-50"
            >
              <i className="tabler-edit text-[18px] text-yellow-500"></i>
            </IconButton>
          </Tooltip>

          <Tooltip title={dic?.disabled || dic?.delete || "Delete"}>
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
          <Tooltip title={dic?.restore || "Restore"}>
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
