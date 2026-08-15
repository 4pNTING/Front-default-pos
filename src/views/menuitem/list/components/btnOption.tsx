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
    setSelectedItem,
    setToggleUpdateComponent,
  } = useMenuItemStore();
  const { deleteMenuItemMutation } = useMenuItemMutations();

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
      title: labels.deleteTitle,
      text: labels.deleteQuestion.replace("{name}", currentToView.name),
      btnConfirmText: labels.deleteConfirm,
      btnCancelText: dic.cancel,
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
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error: any) {
      ToastService.actionError("ລຶບ MenuItem", error.message, dic);
    }
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      <Tooltip title={dic.edit}>
        <IconButton
          onClick={handleEdit}
          size="small"
          className="text-gray-600 hover:bg-gray-50"
        >
          <i className="tabler-edit text-[18px] text-yellow-500"></i>
        </IconButton>
      </Tooltip>

      <Tooltip title={dic.delete}>
        <IconButton
          onClick={handleDeleteClick}
          size="small"
          className="text-gray-600 hover:bg-gray-50"
        >
          <i className="tabler-trash text-[18px] text-red-500"></i>
        </IconButton>
      </Tooltip>
    </div>
  );
}
