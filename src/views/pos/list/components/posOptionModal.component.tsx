"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import { POSListProps } from "../../type/posType";
import { usePOSStore } from "../../store/posStore";
import { LOAD_MENU_OPTION_BY_MENU_ITEM } from "@/gql/queries/menuOption";
import { useLazyQuery } from "@apollo/client";
import { resolveImageUrl } from "@/utils/imageUrl";

interface PosOptionModalProps {
  props: POSListProps;
  item: any | null;
  open: boolean;
  onClose: () => void;
}

export const PosOptionModal: React.FC<PosOptionModalProps> = ({
  props,
  item,
  open,
  onClose,
}) => {
  const { dictionary: dic, lang } = props;
  const { addToCart } = usePOSStore();

  const [loadOptionsCall, { loading }] = useLazyQuery(
    LOAD_MENU_OPTION_BY_MENU_ITEM,
    { fetchPolicy: "network-only" }
  );

  const [options, setOptions] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open && item?._id) {
      setQuantity(1);
      setNote("");
      setSelectedOptions([]);
      setOptions([]);

      void (async () => {
        try {
          const res = await loadOptionsCall({
            variables: { input: { menuItemId: item._id } },
          });
          const list = res.data?.loadMenuOptionByMenuItem?.menuOption || [];
          setOptions(list.filter((o: any) => o.isActive !== "inactive"));
        } catch {
          setOptions([]);
        }
      })();
    }
  }, [open, item, loadOptionsCall]);

  if (!open || !item) return null;

  const basePrice = Number(item.price) || 0;
  const extraPriceSum = selectedOptions.reduce(
    (sum, o) => sum + (Number(o.extraPrice) || 0),
    0
  );
  const singleUnitPrice = basePrice + extraPriceSum;
  const grandTotal = singleUnitPrice * quantity;

  const handleToggleOption = (opt: any) => {
    const isSelected = selectedOptions.some((o) => o._id === opt._id);
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter((o) => o._id !== opt._id));
    } else {
      setSelectedOptions([...selectedOptions, opt]);
    }
  };

  const handleConfirmAddToCart = () => {
    const optionNames = selectedOptions.map(
      (o) => `${o.name}${o.extraPrice > 0 ? ` (+${Number(o.extraPrice).toLocaleString()} ₭)` : ""}`
    );

    const fullNoteParts: string[] = [];
    if (optionNames.length > 0) {
      fullNoteParts.push(optionNames.join(", "));
    }
    if (note.trim()) {
      fullNoteParts.push(note.trim());
    }

    addToCart(item, {
      extraPrice: extraPriceSum,
      quantity,
      note: fullNoteParts.join(" | "),
    });

    onClose();
  };

  const imageUrl = resolveImageUrl(item.photo);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", overflow: "hidden" },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#0A3981",
          color: "white",
        }}
      >
        <span className="font-bold text-sm">
          {lang === "la" ? "ເລືອກຕົວເລືອກ / ທັອບປິ້ງ" : "Customize Menu Item"}
        </span>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "white", "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" } }}
        >
          <i className="tabler-x text-lg" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {/* Item Summary Bar */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 mb-3.5">
          <div className="relative w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0 flex items-center justify-center text-gray-400">
            {imageUrl ? (
              <Image src={imageUrl} alt={item.name} fill className="object-cover" unoptimized />
            ) : (
              <i className="tabler-meat text-2xl" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100 truncate">
              {item.name}
            </h4>
            <span className="text-xs font-semibold text-[#2F57AB] dark:text-blue-400">
              {basePrice.toLocaleString()} ₭
            </span>
          </div>
        </div>

        {/* Options / Toppings list */}
        <div className="mb-3.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
            {lang === "la" ? "ຕົວເລືອກ / ທັອບປິ້ງ" : "Options & Toppings"}
          </label>

          {loading ? (
            <div className="flex items-center justify-center py-6 text-gray-400">
              <CircularProgress size={20} className="mr-2" />
              <span className="text-xs">{lang === "la" ? "ກຳລັງໂຫຼດ..." : "Loading options..."}</span>
            </div>
          ) : options.length === 0 ? (
            <div className="text-center py-4 bg-gray-50 dark:bg-gray-800/40 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 text-xs">
              {lang === "la" ? "ບໍ່ມີຕົວເລືອກພິເສດສຳລັບເມນູນີ້" : "No special options for this item."}
            </div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {options.map((opt) => {
                const isChecked = selectedOptions.some((o) => o._id === opt._id);
                return (
                  <div
                    key={opt._id}
                    onClick={() => handleToggleOption(opt)}
                    className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer select-none transition-all ${
                      isChecked
                        ? "border-[#2F57AB] bg-blue-50/50 dark:bg-blue-950/30"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        size="small"
                        checked={isChecked}
                        sx={{ p: 0, color: "#2F57AB", "&.Mui-checked": { color: "#2F57AB" } }}
                      />
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {opt.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                      {opt.extraPrice > 0 ? `+${Number(opt.extraPrice).toLocaleString()} ₭` : "Free"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Custom Note input */}
        <div className="mb-3.5">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
            {lang === "la" ? "ໝາຍເຫດເພີ່ມເຕີມ" : "Special Instructions / Note"}
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              lang === "la"
                ? "ເຊັ່ນ: ບໍ່ໃສ່ຜັກບົ່ວ, ເຜັດໜ້ອຍ..."
                : "e.g. less spicy, no onions..."
            }
            className="w-full text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none focus:border-[#2F57AB] text-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Quantity Stepper */}
        <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700 mb-3">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {lang === "la" ? "ຈຳນວນ" : "Quantity"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center font-bold hover:bg-gray-200"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-bold text-[#2F57AB] dark:text-blue-400">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-[#2F57AB] text-white flex items-center justify-center font-bold hover:bg-[#25468a]"
            >
              +
            </button>
          </div>
        </div>

        {/* Add Button with Total */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleConfirmAddToCart}
          sx={{
            backgroundColor: "#0A3981",
            py: 1.2,
            fontWeight: 700,
            fontSize: "13px",
            "&:hover": { backgroundColor: "#082d5c" },
          }}
          startIcon={<i className="tabler-plus text-base" />}
        >
          {lang === "la" ? "ເພີ່ມລົງອໍເດີ" : "Add to Order"} • {grandTotal.toLocaleString()} ₭
        </Button>
      </DialogContent>
    </Dialog>
  );
};
