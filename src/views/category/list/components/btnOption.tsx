"use client";
import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { CategoryListProps, CategoryType } from "../../type/categoryType";
import { useCategoryStore, useCategoryMutations } from "../../store/categoryStore";
import { IEntityStatus } from "@/utils/base";
import { msgConfirm, msgSuccess, msgError } from "@/utils/sweetalert";
import { ToastService } from "@/utils/toastService";

interface ButtonOptionProps {
  props: CategoryListProps;
  currentToView: CategoryType;
  onEditClick?: (item: CategoryType) => void;
  loadCategoryCall?: any;
}

export function ButtonOption({
  props,
  currentToView,
  onEditClick,
  loadCategoryCall,
}: ButtonOptionProps) {
  const { lang, dictionary: dic } = props;

  const {
    deleteCategoryAPI,
    restoreCategoryAPI,
    loadCategoryAPI,
    setSelectedItem,
    setToggleUpdateComponent,
  } = useCategoryStore();
  const { deleteCategoryMutation, restoreCategoryMutation } =
    useCategoryMutations();

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
      title: dic?.confirmDeleteTitle || "ຢືນຢັນການລົບ?",
      text: dic?.confirmDeleteText || "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບ?",
      btnConfirmText: dic?.confirm || "ຢືນຢັນ",
      btnCancelText: dic?.cancel,
      btnConfirmColor: "#1d5089ff",
    });

    if (!confirmed) return;

    try {
      await deleteCategoryAPI({
        props: {
          mutation: deleteCategoryMutation,
          _id: currentToView._id || "",
        },
      });

      ToastService.deleteSuccess(dic);
    } catch (error: any) {
      ToastService.actionError("ປິດໃຊ້ງານ Category", error.message, dic);
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
      await restoreCategoryAPI({
        props: {
          mutation: restoreCategoryMutation,
          _id: currentToView._id || "",
        },
      });

      ToastService.restoreSuccess(dic);
    } catch (error: any) {
      ToastService.actionError("ເປີດໃຊ້ງານ Category", error.message, dic);
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

            <Tooltip title={dic?.disabled || dic?.delete}>
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
