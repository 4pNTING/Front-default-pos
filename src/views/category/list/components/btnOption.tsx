"use client";
import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { CategoryListProps, CategoryType } from "../../type/categoryType";
import { useCategoryStore, useCategoryMutations } from "../../store/categoryStore";
import { IEntityStatus } from "@/utils/base";
import { msgConfirm, msgSuccess, msgError } from "@/utils/sweetalert";

interface ButtonOptionProps {
  props: CategoryListProps;
  currentToView: CategoryType;
  loadCategoryCall?: any;
}

export function ButtonOption({
  props,
  currentToView,
  loadCategoryCall,
}: ButtonOptionProps) {
  const { dictionary: dic } = props;

  const {
    deleteCategoryAPI,
    restoreCategoryAPI,
    setSelectedItem,
    setToggleUpdateComponent,
  } = useCategoryStore();
  const { deleteCategoryMutation, restoreCategoryMutation } =
    useCategoryMutations();

  const isActive = currentToView?.isActive === IEntityStatus.active;

  const handleEdit = () => {
    setSelectedItem(currentToView);
    setToggleUpdateComponent(true);
  };

  const handleDeleteClick = async () => {
    const confirmed = await msgConfirm({
      title: dic?.confirmDelete,
      text:
        dic?.confirmDeleteText +
        " " +
        currentToView.name,
      btnConfirmText: dic?.confirm,
      btnCancelText: dic?.cancel,
      btnConfirmColor: "#2F57AB",
    });

    if (!confirmed) return;

    try {
      await deleteCategoryAPI({
        props: {
          mutation: deleteCategoryMutation,
          _id: currentToView._id || "",
        },
      });

      await msgSuccess({
        title: dic?.success,
        text: dic?.deleteSuccess,
        btnOKText: dic?.ok,
        btnOKColor: "#2F57AB",
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
      text:
        dic?.restore +
        " " +
        currentToView.name,
      btnCancelText: dic?.cancel,
      btnConfirmText: dic?.restore,
      btnConfirmColor: "#2F57AB",
    });

    if (!confirmed) return;

    try {
      await restoreCategoryAPI({
        props: {
          mutation: restoreCategoryMutation,
          _id: currentToView._id || "",
        },
      });

      await msgSuccess({
        title: dic?.success,
        text: dic?.restore + "ໝວດໝູ່ສຳເລັດແລ້ວ",
        btnOKText: dic?.ok,
        btnOKColor: "#2F57AB",
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

            <Tooltip title={dic?.delete}>
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
