"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import CustomTextField from "@/@core/components/mui/TextField";
import { useMenuOptionStore, useMenuOptionMutations } from "../../store/menuOptionStore";
import { LOAD_MENU_OPTION_BY_MENU_ITEM } from "@/gql/queries/menuOption";
import { useLazyQuery } from "@apollo/client";
import { ToastService } from "@/utils/toastService";
import { msgConfirm } from "@/utils/sweetalert";
import { MenuItemListProps } from "../../type/menuItemType";

export default function MenuOptionModalComponent({ props }: { props: MenuItemListProps }) {
  const { dictionary: dic, lang } = props;
  const {
    isModalOpen,
    closeOptionsModal,
    targetMenuItem,
    options,
    loading,
    loadMenuOptionsAPI,
    createMenuOptionAPI,
    updateMenuOptionAPI,
    deleteMenuOptionAPI,
  } = useMenuOptionStore();

  const {
    createMenuOptionMutation,
    updateMenuOptionMutation,
    deleteMenuOptionMutation,
  } = useMenuOptionMutations();

  const [loadOptionsCall] = useLazyQuery(LOAD_MENU_OPTION_BY_MENU_ITEM, {
    fetchPolicy: "network-only",
  });

  // Local form state for adding a new option
  const [name, setName] = useState("");
  const [extraPrice, setExtraPrice] = useState<number | "">("");
  const [addingLoading, setAddingLoading] = useState(false);

  // Local state for editing an option
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editExtraPrice, setEditExtraPrice] = useState<number | "">("");

  const fetchOptions = useCallback(async () => {
    if (!targetMenuItem?._id) return;
    try {
      await loadMenuOptionsAPI({
        props: {
          query: loadOptionsCall,
          menuItemId: targetMenuItem._id,
        },
      });
    } catch (err: any) {
      ToastService.actionError("Options", err.message, dic);
    }
  }, [targetMenuItem, loadMenuOptionsAPI, loadOptionsCall, dic]);

  useEffect(() => {
    if (isModalOpen && targetMenuItem?._id) {
      setName("");
      setExtraPrice("");
      setEditingId(null);
      void fetchOptions();
    }
  }, [isModalOpen, targetMenuItem, fetchOptions]);

  const handleCreate = async () => {
    if (!name.trim() || !targetMenuItem?._id) return;
    setAddingLoading(true);
    try {
      await createMenuOptionAPI({
        props: {
          mutation: createMenuOptionMutation,
          menuItemId: targetMenuItem._id,
          name: name.trim(),
          extraPrice: Number(extraPrice) || 0,
        },
      });
      setName("");
      setExtraPrice("");
      ToastService.success(lang === "la" ? "ເພີ່ມຕົວເລືອກສຳເລັດ" : "Option added successfully");
    } catch (err: any) {
      ToastService.actionError("Options", err.message, dic);
    } finally {
      setAddingLoading(false);
    }
  };

  const startEdit = (opt: { _id?: string; name: string; extraPrice: number }) => {
    if (!opt._id) return;
    setEditingId(opt._id);
    setEditName(opt.name);
    setEditExtraPrice(opt.extraPrice);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditExtraPrice("");
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await updateMenuOptionAPI({
        props: {
          mutation: updateMenuOptionMutation,
          _id: id,
          name: editName.trim(),
          extraPrice: Number(editExtraPrice) || 0,
        },
      });
      cancelEdit();
      ToastService.updateSuccess(dic);
    } catch (err: any) {
      ToastService.actionError("Options", err.message, dic);
    }
  };

  const handleDelete = async (optId?: string, optName?: string) => {
    if (!optId) return;
    const confirmed = await msgConfirm({
      title: lang === "la" ? "ຢືນຢັນລຶບຕົວເລືອກ?" : "Delete Option?",
      text: `${lang === "la" ? "ທ່ານຕ້ອງການລຶບຕົວເລືອກ" : "Delete option"} "${optName}"?`,
      btnConfirmText: dic?.confirm || "Confirm",
      btnCancelText: dic?.cancel || "Cancel",
      btnConfirmColor: "#dc2626",
    });

    if (!confirmed) return;

    try {
      await deleteMenuOptionAPI({
        props: {
          mutation: deleteMenuOptionMutation,
          _id: optId,
        },
      });
      ToastService.deleteSuccess(dic);
    } catch (err: any) {
      ToastService.actionError("Options", err.message, dic);
    }
  };

  if (!isModalOpen) return null;

  return (
    <Dialog
      open={isModalOpen}
      onClose={closeOptionsModal}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", overflow: "hidden" },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          m: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#0A3981",
          color: "white",
          padding: "16px 20px",
        }}
      >
        <div className="flex items-center gap-2">
          <i className="tabler-adjustments-alt text-xl" />
          <div>
            <h3 className="font-bold text-base leading-tight">
              {lang === "la" ? "ຈັດການຕົວເລືອກ / ທັອບປິ້ງ" : "Manage Menu Options / Toppings"}
            </h3>
            {targetMenuItem?.name && (
              <p className="text-xs text-blue-200 mt-0.5">{targetMenuItem.name}</p>
            )}
          </div>
        </div>
        <IconButton
          onClick={closeOptionsModal}
          sx={{ color: "white", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}
        >
          <i className="tabler-x text-lg" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Add New Option Form */}
        <div className="bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
            {lang === "la" ? "+ ເພີ່ມຕົວເລືອກໃໝ່" : "+ Add New Option"}
          </h4>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1">
              <CustomTextField
                fullWidth
                size="small"
                placeholder={lang === "la" ? "ຊື່ຕົວເລືອກ (ເຊັ່ນ: ໄຂ່ດາວ, ພິເສດ)" : "Option Name (e.g. Fried Egg)"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim()) {
                    e.preventDefault();
                    void handleCreate();
                  }
                }}
              />
            </div>
            <div className="w-full sm:w-36">
              <CustomTextField
                fullWidth
                size="small"
                type="number"
                placeholder={lang === "la" ? "ລາຄາບວກ (+₭)" : "Extra Price (+₭)"}
                value={extraPrice}
                onChange={(e) => setExtraPrice(e.target.value === "" ? "" : Number(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim()) {
                    e.preventDefault();
                    void handleCreate();
                  }
                }}
              />
            </div>
            <Button
              variant="contained"
              size="small"
              onClick={handleCreate}
              disabled={!name.trim() || addingLoading}
              sx={{
                backgroundColor: "#0A3981",
                minWidth: 90,
                "&:hover": { backgroundColor: "#082d5c" },
              }}
              startIcon={
                addingLoading ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <i className="tabler-plus text-sm" />
                )
              }
            >
              {lang === "la" ? "ເພີ່ມ" : "Add"}
            </Button>
          </div>
        </div>

        {/* Existing Options List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {lang === "la" ? "ລາຍການຕົວເລືອກທັງໝົດ" : "Available Options"} ({options.length})
            </h4>
          </div>

          {loading && options.length === 0 ? (
            <div className="flex justify-center items-center py-8 text-gray-400">
              <CircularProgress size={24} className="mr-2" />
              <span className="text-xs">{lang === "la" ? "ກຳລັງໂຫຼດ..." : "Loading options..."}</span>
            </div>
          ) : options.length === 0 ? (
            <div className="text-center py-8 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400">
              <i className="tabler-adjustments-off text-3xl mb-1 inline-block" />
              <p className="text-xs">
                {lang === "la" ? "ຍັງບໍ່ມີຕົວເລືອກສຳລັບເມນູນີ້" : "No options added for this menu item yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {options.map((opt) => {
                const isEditing = editingId === opt._id;

                if (isEditing) {
                  return (
                    <div
                      key={opt._id}
                      className="p-2.5 rounded-xl border border-blue-400 bg-blue-50/40 dark:bg-blue-950/20 flex items-center gap-2"
                    >
                      <CustomTextField
                        size="small"
                        className="flex-1"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                      />
                      <CustomTextField
                        size="small"
                        type="number"
                        className="w-28"
                        value={editExtraPrice}
                        onChange={(e) =>
                          setEditExtraPrice(e.target.value === "" ? "" : Number(e.target.value))
                        }
                      />
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => opt._id && handleUpdate(opt._id)}
                        disabled={!editName.trim()}
                      >
                        <i className="tabler-check text-base" />
                      </IconButton>
                      <IconButton size="small" onClick={cancelEdit}>
                        <i className="tabler-x text-base" />
                      </IconButton>
                    </div>
                  );
                }

                return (
                  <div
                    key={opt._id}
                    className="p-2.5 sm:p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between gap-3 shadow-2xs hover:border-[#2F57AB]/50 transition-all"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
                        {opt.name}
                      </span>
                      {opt.extraPrice > 0 ? (
                        <Chip
                          label={`+${Number(opt.extraPrice).toLocaleString()} ₭`}
                          size="small"
                          color="primary"
                          variant="tonal"
                          sx={{ height: 20, fontSize: "11px", fontWeight: 700 }}
                        />
                      ) : (
                        <span className="text-[11px] text-gray-400 font-medium">Free (+0 ₭)</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <IconButton
                        size="small"
                        onClick={() => startEdit(opt)}
                        className="text-gray-500 hover:text-blue-600"
                        title={dic?.edit || "Edit"}
                      >
                        <i className="tabler-edit text-base" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(opt._id, opt.name)}
                        className="text-gray-400 hover:text-rose-600"
                        title={dic?.delete || "Delete"}
                      >
                        <i className="tabler-trash text-base" />
                      </IconButton>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

