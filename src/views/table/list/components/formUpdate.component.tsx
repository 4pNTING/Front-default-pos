"use client";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { TableListProps, TableStatus } from "../../type/tableType";
import { useTableStore, useTableMutations } from "../../store/tableStore";
import { ToastService } from "@/utils/toastService";
import CustomTextField from "@/@core/components/mui/TextField";

const UpdateComponent = ({
  props,
  onClose,
  onSuccess,
}: {
  props: TableListProps;
  onClose?: () => void;
  onSuccess?: () => void;
}) => {
  const { toggleUpdateComponent, setToggleUpdateComponent, selectedItem, updateTableAPI, zoneList, loading } =
    useTableStore();
  const { updateTableMutation } = useTableMutations();
  const { dictionary: dic } = props;
  const labels = dic?.tablePage;

  const [number, setNumber] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [capacity, setCapacity] = useState<string>("4");
  const [status, setStatus] = useState<TableStatus>("available");
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<{ number?: string; zoneId?: string; capacity?: string }>({});

  useEffect(() => {
    if (selectedItem) {
      setNumber(selectedItem.number ?? "");
      setZoneId(selectedItem.zoneId ?? "");
      setCapacity(selectedItem.capacity ? String(selectedItem.capacity) : "4");
      setStatus(selectedItem.status ?? "available");
      setIsActive(selectedItem.isActive !== "inactive");
    }
  }, [selectedItem]);

  const validate = () => {
    const errs: { number?: string; zoneId?: string; capacity?: string } = {};
    if (!number.trim()) errs.number = labels?.numberRequired || "Please enter table number";
    if (!zoneId) errs.zoneId = labels?.zoneRequired || "Please select a zone";
    if (!capacity || Number(capacity) <= 0) errs.capacity = labels?.capacityRequired || "Please enter valid capacity";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleClose = () => {
    setToggleUpdateComponent(false);
    if (onClose) onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (!validate()) {
      ToastService.formInvalid(dic);
      return;
    }

    try {
      await updateTableAPI({
        props: {
          mutation: updateTableMutation,
          dictionary: dic,
          _id: selectedItem._id,
          number: number.trim(),
          zoneId,
          capacity: Number(capacity),
          status,
          isActive: isActive ? "active" : "inactive",
        },
      });

      ToastService.updateSuccess(dic);
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      ToastService.actionError(labels?.edit || "Edit Table", error?.message, dic);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={toggleUpdateComponent}
      onClose={handleClose}
      PaperProps={{
        style: { width: "100%", maxWidth: 440 },
      }}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between px-6 py-4 bg-[#0A3981] text-white">
          <Typography variant="h6" className="font-semibold text-white">
            {labels?.edit || "Edit Table"}
          </Typography>
          <IconButton onClick={handleClose} size="small" className="text-white hover:bg-white/20">
            <i className="tabler-x text-[20px]" />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 p-6 overflow-y-auto gap-5">
          {/* Table Number */}
          <CustomTextField
            fullWidth
            label={labels?.number || "Table Number"}
            placeholder={labels?.numberPlaceholder || "e.g. T01, VIP-1"}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            error={!!errors.number}
            helperText={errors.number}
            required
          />

          {/* Zone Selector */}
          <FormControl fullWidth error={!!errors.zoneId} required>
            <InputLabel id="edit-zone-select-label">{labels?.zone || "Zone"}</InputLabel>
            <Select
              labelId="edit-zone-select-label"
              value={zoneId}
              label={labels?.zone || "Zone"}
              onChange={(e) => setZoneId(e.target.value)}
            >
              {zoneList.map((zone) => (
                <MuiMenuItem key={zone._id} value={zone._id}>
                  {zone.name}
                </MuiMenuItem>
              ))}
            </Select>
            {errors.zoneId && <FormHelperText>{errors.zoneId}</FormHelperText>}
          </FormControl>

          {/* Capacity */}
          <CustomTextField
            fullWidth
            type="number"
            label={labels?.capacity || "Capacity (Seats)"}
            placeholder={labels?.capacityPlaceholder || "e.g. 4"}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            error={!!errors.capacity}
            helperText={errors.capacity}
            inputProps={{ min: 1, max: 100 }}
            required
          />

          {/* Table Status */}
          <FormControl fullWidth>
            <InputLabel id="edit-table-status-label">{labels?.status || "Table Status"}</InputLabel>
            <Select
              labelId="edit-table-status-label"
              value={status}
              label={labels?.status || "Table Status"}
              onChange={(e) => setStatus(e.target.value as TableStatus)}
            >
              <MuiMenuItem value="available">{labels?.statusAvailable || "Available"}</MuiMenuItem>
              <MuiMenuItem value="occupied">{labels?.statusOccupied || "Occupied"}</MuiMenuItem>
              <MuiMenuItem value="reserved">{labels?.statusReserved || "Reserved"}</MuiMenuItem>
            </Select>
          </FormControl>

          {/* Active Status Switch */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div>
              <Typography variant="body2" className="font-medium">
                {dic?.status || "Status"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isActive ? dic?.["active"] || "Active" : dic?.["inactive"] || "Inactive"}
              </Typography>
            </div>
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              color="primary"
            />
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
            <Button variant="tonal" color="secondary" onClick={handleClose} disabled={loading}>
              {dic?.cancel || "Cancel"}
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#0A3981" }}
              disabled={loading}
              className="min-w-[100px]"
              startIcon={
                loading ? (
                  <i className="tabler-loader-2 text-[16px] animate-spin" />
                ) : (
                  <i className="tabler-check text-[16px]" />
                )
              }
            >
              {labels?.edit || "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default UpdateComponent;
