"use client";
import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { HomeListProps, HomeType } from "../type/homeType";
import { useStore, useHomeMutations } from "../store/homeStore";
import { msgConfirm, msgSuccess, msgError } from "@/utils/sweetalert";
import { IEntityStatus } from "@/utils/base";

interface ButtonOptionProps {
  props: HomeListProps;
  currentToView: HomeType;
  loadHomeCall?: any;
}

export function ButtonOption({
  props,
  currentToView,
  loadHomeCall,
}: ButtonOptionProps) {
  const { lang, dictionary: dic } = props;

  const {
    deleteHomeAPI,
    restoreHomeAPI,
    setSelectedItem,
    setToggleUpdateComponent,
  } = useStore();
  const { deleteHomeMutation, restoreHomeMutation } = useHomeMutations();

  const isActive = currentToView?.isActive === IEntityStatus.active;

  const handleEdit = () => {
    setSelectedItem(currentToView);
    setToggleUpdateComponent(true);
  };

  const handleDeleteClick = async () => {
    const confirmed = await msgConfirm({
      title: dic?.confirmDeleteTitle,
      text: dic?.delete + " " + currentToView.name,
      btnConfirmText: dic?.confirm,
      btnCancelText: dic?.cancel,
      btnConfirmColor: "#1d5089ff",
    });

    if (!confirmed) return;

    try {
      await deleteHomeAPI({
        props: {
          mutation: deleteHomeMutation,
          _id: currentToView._id || "",
        },
      });

      await msgSuccess({
        title: dic?.success,
        text: dic?.deleted,
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
      text: dic?.restore + " " + currentToView.name,
      btnCancelText: dic?.cancel,
      btnConfirmText: dic?.restore,
      btnConfirmColor: "#1d5089ff",
    });

    if (!confirmed) return;

    try {
      await restoreHomeAPI({
        props: {
          mutation: restoreHomeMutation,
          _id: currentToView._id || "",
        },
      });

      await msgSuccess({
        title: dic?.success,
        text: dic?.restore,
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
