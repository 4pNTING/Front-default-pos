"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  TextField,
  Chip,
  Avatar,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { POSListProps, CustomerType } from "../../type/posType";
import { usePOSStore, usePOSMutations } from "../../store/posStore";
import { ToastService } from "@/utils/toastService";

export const PosCustomerModalComponent: React.FC<{ props: POSListProps }> = ({ props }) => {
  const { lang, dictionary: dic } = props;
  const {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    customerModalOpen,
    setCustomerModalOpen,
    setDiscount,
    cart,
    currentOrder,
    setCustomers,
  } = usePOSStore();

  const { createCustomerMutation } = usePOSMutations();

  const [activeTab, setActiveTab] = useState<0 | 1>(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // New Customer Form State
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newVillage, setNewVillage] = useState("");

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    if (!searchKeyword.trim()) return customers.slice(0, 50);
    const kw = searchKeyword.toLowerCase().trim();
    return customers.filter((c) => {
      const fn = (c.firstName || "").toLowerCase();
      const ln = (c.lastName || "").toLowerCase();
      const phone = (c.phoneNumber || "").toLowerCase();
      return fn.includes(kw) || ln.includes(kw) || phone.includes(kw);
    });
  }, [customers, searchKeyword]);

  // Handle select customer
  const handleSelectCustomer = (customer: CustomerType) => {
    setSelectedCustomer(customer);
    ToastService.success(
      lang === "la"
        ? `ເລືອກລູກຄ້າ: ${customer.firstName || ""} ${customer.lastName || ""}`
        : `Selected: ${customer.firstName || ""} ${customer.lastName || ""}`
    );
    setCustomerModalOpen(false);
  };

  // Handle deselect customer
  const handleDeselectCustomer = () => {
    setSelectedCustomer(null);
    ToastService.info(lang === "la" ? "ຍົກເລີກການເລືອກລູກຄ້າແລ້ວ" : "Customer deselected");
    setCustomerModalOpen(false);
  };

  // Quick apply member discount (e.g. 5% or 10%)
  const handleApplyDiscount = (percent: number) => {
    const subTotal =
      (Number(currentOrder?.subTotal) || 0) +
      cart.reduce((sum, item) => sum + item.totalPrice, 0);

    const discountAmount = Math.round((subTotal * percent) / 100);
    setDiscount(discountAmount);
    ToastService.success(
      lang === "la"
        ? `ນຳໃຊ້ສ່ວນຫຼຸດສະມາຊິກ ${percent}% (${discountAmount.toLocaleString()} ₭)`
        : `Applied ${percent}% member discount (${discountAmount.toLocaleString()} ₭)`
    );
  };

  // Quick register new customer
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim()) {
      ToastService.error(lang === "la" ? "ກະລຸນາໃສ່ຊື່ລູກຄ້າ" : "Please enter customer first name");
      return;
    }

    try {
      setCreateLoading(true);
      const res = await createCustomerMutation({
        variables: {
          input: {
            firstName: newFirstName.trim(),
            lastName: newLastName.trim(),
            phoneNumber: newPhoneNumber.trim(),
            village: newVillage.trim(),
            isActive: "active",
          },
        },
      });

      const created: CustomerType = res.data?.createCustomer?.customer;
      if (created) {
        setCustomers([created, ...customers]);
        setSelectedCustomer(created);
        ToastService.success(
          lang === "la"
            ? `ລົງທະບຽນ ແລະ ເລືອກລູກຄ້າ: ${created.firstName} ${created.lastName || ""}`
            : `Created & selected: ${created.firstName} ${created.lastName || ""}`
        );
        // Reset form
        setNewFirstName("");
        setNewLastName("");
        setNewPhoneNumber("");
        setNewVillage("");
        setActiveTab(0);
        setCustomerModalOpen(false);
      }
    } catch (err: any) {
      ToastService.error(err.message || "Failed to create customer");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <Dialog
      open={customerModalOpen}
      onClose={() => setCustomerModalOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #0A3981 0%, #1F4E96 100%)",
          color: "#fff",
          p: 2.5,
          position: "relative",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-xl">
            <i className="tabler-users" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white leading-tight">
              {lang === "la" ? "ລູກຄ້າ / ສະມາຊິກ (Customer & Member)" : "Customer & Member Selection"}
            </h3>
            <p className="text-xs text-blue-100 font-normal">
              {lang === "la"
                ? "ເລືອກສະມາຊິກເພື່ອຜູກກັບບິນ ແລະ ຮັບສິດທິພິເສດ"
                : "Select or register customer for this order"}
            </p>
          </div>
        </div>

        <IconButton
          onClick={() => setCustomerModalOpen(false)}
          sx={{
            position: "absolute",
            top: 14,
            right: 14,
            color: "rgba(255,255,255,0.8)",
            "&:hover": { color: "#fff", backgroundColor: "rgba(255,255,255,0.15)" },
          }}
          size="small"
        >
          <i className="tabler-x text-lg" />
        </IconButton>
      </DialogTitle>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 px-4">
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ minHeight: 46 }}
        >
          <Tab
            value={0}
            icon={<i className="tabler-search text-base mr-1" />}
            iconPosition="start"
            label={lang === "la" ? "ຄົ້ນຫາສະມາຊິກ" : "Search Member"}
            sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.85rem", minHeight: 46 }}
          />
          <Tab
            value={1}
            icon={<i className="tabler-user-plus text-base mr-1" />}
            iconPosition="start"
            label={lang === "la" ? "ລົງທະບຽນໃໝ່ດ່ວນ" : "Quick Register"}
            sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.85rem", minHeight: 46 }}
          />
        </Tabs>
      </div>

      <DialogContent sx={{ p: 2.5, minHeight: 380 }}>
        {/* TAB 0: SEARCH & SELECT */}
        {activeTab === 0 && (
          <div className="flex flex-col gap-3">
            {/* Active Selected Customer Card */}
            {selectedCustomer && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    sx={{
                      bgcolor: "#0A3981",
                      width: 42,
                      height: 42,
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    {(selectedCustomer.firstName || "C")[0].toUpperCase()}
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        {selectedCustomer.firstName} {selectedCustomer.lastName || ""}
                      </h4>
                      <Chip
                        label={lang === "la" ? "ສະມາຊິກ" : "Selected Member"}
                        size="small"
                        color="primary"
                        sx={{ height: 20, fontSize: "10px", fontWeight: 700 }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">
                      <i className="tabler-phone text-[12px] mr-1 inline" />
                      {selectedCustomer.phoneNumber || (lang === "la" ? "ບໍ່ມີເບີໂທ" : "No Phone")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={handleDeselectCustomer}
                    sx={{ textTransform: "none", py: 0.5, px: 1.5, fontSize: "11px", fontWeight: 600 }}
                  >
                    {lang === "la" ? "ຍົກເລີກການເລືອກ" : "Deselect"}
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Member Discount Options (If customer selected) */}
            {selectedCustomer && (
              <div className="p-2.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-900 dark:text-amber-200 font-medium">
                  <i className="tabler-discount-2 text-base text-amber-600" />
                  <span>{lang === "la" ? "ສ່ວນຫຼຸດສະມາຊິກ:" : "Member Discount:"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyDiscount(5)}
                    className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    -5%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyDiscount(10)}
                    className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    -10%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyDiscount(15)}
                    className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    -15%
                  </button>
                </div>
              </div>
            )}

            {/* Search Input */}
            <TextField
              fullWidth
              size="small"
              placeholder={
                lang === "la"
                  ? "ຄົ້ນຫາຊື່ລູກຄ້າ ຫຼື ເບີໂທລະສັບ..."
                  : "Search customer by name or phone..."
              }
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              InputProps={{
                startAdornment: <i className="tabler-search text-gray-400 mr-2" />,
                sx: { borderRadius: "10px" },
              }}
            />

            {/* Customer List */}
            <div className="max-h-[260px] overflow-y-auto flex flex-col gap-1.5 pr-1">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  <i className="tabler-user-off text-3xl mb-1 block" />
                  {lang === "la" ? "ບໍ່ພົບຂໍ້ມູນລູກຄ້າ" : "No customers found"}
                </div>
              ) : (
                filteredCustomers.map((cust) => {
                  const isSelected = selectedCustomer?._id === cust._id;
                  return (
                    <div
                      key={cust._id}
                      onClick={() => handleSelectCustomer(cust)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-50/80 dark:bg-blue-900/30 border-[#0A3981]"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: isSelected ? "#0A3981" : "#e0e7ff",
                            color: isSelected ? "#fff" : "#3730a3",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                          }}
                        >
                          {(cust.firstName || "C")[0].toUpperCase()}
                        </Avatar>
                        <div>
                          <div className="font-semibold text-xs text-gray-800 dark:text-gray-100">
                            {cust.firstName} {cust.lastName || ""}
                          </div>
                          <span className="text-[11px] text-gray-400 block">
                            {cust.phoneNumber || (lang === "la" ? "ບໍ່ມີເບີໂທ" : "No Phone")}
                            {cust.village ? ` • ${cust.village}` : ""}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="small"
                        variant={isSelected ? "contained" : "outlined"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCustomer(cust);
                        }}
                        sx={{
                          textTransform: "none",
                          fontSize: "11px",
                          fontWeight: 600,
                          py: 0.4,
                          px: 1.5,
                          borderRadius: "8px",
                          backgroundColor: isSelected ? "#0A3981" : undefined,
                        }}
                      >
                        {isSelected
                          ? lang === "la"
                            ? "ເລືອກແລ້ວ"
                            : "Selected"
                          : lang === "la"
                          ? "ເລືອກ"
                          : "Select"}
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 1: QUICK REGISTER */}
        {activeTab === 1 && (
          <form onSubmit={handleCreateCustomer} className="flex flex-col gap-3 py-1">
            <div className="grid grid-cols-2 gap-2.5">
              <TextField
                required
                fullWidth
                size="small"
                label={lang === "la" ? "ຊື່ (First Name)" : "First Name"}
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                InputProps={{ sx: { borderRadius: "10px" } }}
              />
              <TextField
                fullWidth
                size="small"
                label={lang === "la" ? "ນາມສະກຸນ (Last Name)" : "Last Name"}
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                InputProps={{ sx: { borderRadius: "10px" } }}
              />
            </div>

            <TextField
              fullWidth
              size="small"
              label={lang === "la" ? "ເບີໂທລະສັບ (Phone Number)" : "Phone Number"}
              placeholder="020 xxxx xxxx"
              value={newPhoneNumber}
              onChange={(e) => setNewPhoneNumber(e.target.value)}
              InputProps={{
                startAdornment: <i className="tabler-phone text-gray-400 mr-2" />,
                sx: { borderRadius: "10px" },
              }}
            />

            <TextField
              fullWidth
              size="small"
              label={lang === "la" ? "ບ້ານ / ທີ່ຢູ່ (Village / Address)" : "Village / Address"}
              value={newVillage}
              onChange={(e) => setNewVillage(e.target.value)}
              InputProps={{ sx: { borderRadius: "10px" } }}
            />

            <div className="pt-2">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={createLoading || !newFirstName.trim()}
                sx={{
                  backgroundColor: "#0A3981",
                  py: 1.2,
                  fontWeight: 700,
                  borderRadius: "10px",
                  "&:hover": { backgroundColor: "#082d5c" },
                }}
                startIcon={
                  createLoading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <i className="tabler-check text-base" />
                  )
                }
              >
                {createLoading
                  ? lang === "la"
                    ? "ກຳລັງບັນທຶກ..."
                    : "Saving..."
                  : lang === "la"
                  ? "ບັນທຶກ & ເລືອກທັນທີ"
                  : "Save & Select Member"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PosCustomerModalComponent;
