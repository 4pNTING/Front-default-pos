"use client";
import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { CustomerListProps, CustomerType } from "../../type/customerType";
import { useStore, useCustomerMutations } from "../../store/customerStore";
import { msgConfirm } from "@/utils/sweetalert";
import { ToastService } from "@/utils/toastService";
import { IEntityStatus } from "@/utils/base";

interface ButtonOptionProps {
  props: CustomerListProps;
  currentToView: CustomerType;
  onEditClick?: (item: CustomerType) => void;
  loadCustomerCall?: any;
}

export function ButtonOption({
  props,
  currentToView,
  onEditClick,
  loadCustomerCall,
}: ButtonOptionProps) {
  const { lang, dictionary: dic } = props;

  const {
    deleteCustomerAPI,
    restoreCustomerAPI,
    setSelectedItem,
    setToggleUpdateComponent,
  } = useStore();
  const { deleteCustomerMutation, restoreCustomerMutation } =
    useCustomerMutations();

  const isActive = currentToView?.isActive === IEntityStatus.active;

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
      title: dic?.confirmDeleteTitle,
      text: dic?.confirmDeleteText,
      btnConfirmText: dic?.confirm,
      btnCancelText: dic?.cancel,
      btnConfirmColor: "#1d5089ff",
    });

    if (!confirmed) return;

    try {
      await deleteCustomerAPI({
        props: {
          mutation: deleteCustomerMutation,
          _id: currentToView._id || "",
        },
      });

      ToastService.deleteSuccess(dic);
    } catch (error: any) {
      ToastService.actionError("ປິດໃຊ້ງານ Customer", error.message, dic);
    }
  };

  const handleRestoreClick = async () => {
    const confirmed = await msgConfirm({
      title: dic?.confirmRestoreTitle,
      text: dic?.confirmRestoreText,
      btnCancelText: dic?.cancel,
      btnConfirmText: dic?.confirm,
      btnConfirmColor: "#1d5089ff",
    });

    if (!confirmed) return;

    try {
      await restoreCustomerAPI({
        props: {
          mutation: restoreCustomerMutation,
          _id: currentToView._id || "",
        },
      });

      ToastService.restoreSuccess(dic);
    } catch (error: any) {
      ToastService.actionError("ເປີດໃຊ້ງານ Customer", error.message, dic);
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
