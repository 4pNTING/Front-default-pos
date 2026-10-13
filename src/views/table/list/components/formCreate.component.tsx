"use client";
import React, { useState } from "react";
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
} from "@mui/material";
import { TableListProps, TableStatus } from "../../type/tableType";
import { useTableStore, useTableMutations } from "../../store/tableStore";
import { ToastService } from "@/utils/toastService";
import CustomTextField from "@/@core/components/mui/TextField";

const CreateComponent = ({
  props,
  onClose,
  onSuccess,
}: {
  props: TableListProps;
  onClose?: () => void;
  onSuccess?: () => void;
}) => {
  const { toggleCreateComponent, setToggleCreateComponent, createTableAPI, zoneList, loading } = useTableStore();
  const { createTableMutation } = useTableMutations();
  const { dictionary: dic } = props;
  const labels = dic?.tablePage;

  const [number, setNumber] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [capacity, setCapacity] = useState<string>("4");
  const [status, setStatus] = useState<TableStatus>("available");

  const [errors, setErrors] = useState<{ number?: string; zoneId?: string; capacity?: string }>({});

  const validate = () => {
    const errs: { number?: string; zoneId?: string; capacity?: string } = {};
    if (!number.trim()) errs.number = labels?.numberRequired || "Please enter table number";
    if (!zoneId) errs.zoneId = labels?.zoneRequired || "Please select a zone";
    if (!capacity || Number(capacity) <= 0) errs.capacity = labels?.capacityRequired || "Please enter valid capacity";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleClose = () => {
    setNumber("");
    setZoneId("");
    setCapacity("4");
    setStatus("available");
    setErrors({});
    setToggleCreateComponent(false);
    if (onClose) onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      ToastService.formInvalid(dic);
      return;
    }

    try {
      await createTableAPI({
        props: {
          mutation: createTableMutation,
          dictionary: dic,
          number: number.trim(),
          zoneId,
          capacity: Number(capacity),
          status,
        },
      });

      ToastService.createSuccess(dic);
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      ToastService.actionError(labels?.create || "Add Table", error?.message, dic);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={toggleCreateComponent}
      onClose={handleClose}
      PaperProps={{
        style: { width: "100%", maxWidth: 440 },
      }}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between px-6 py-4 bg-[#0A3981] text-white">
          <Typography variant="h6" className="font-semibold text-white">
            {labels?.create || "Add Table"}
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
            <InputLabel id="zone-select-label">{labels?.zone || "Zone"}</InputLabel>
            <Select
              labelId="zone-select-label"
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
            <InputLabel id="table-status-label">{labels?.status || "Table Status"}</InputLabel>
            <Select
              labelId="table-status-label"
              value={status}
              label={labels?.status || "Table Status"}
              onChange={(e) => setStatus(e.target.value as TableStatus)}
            >
              <MuiMenuItem value="available">{labels?.statusAvailable || "Available"}</MuiMenuItem>
              <MuiMenuItem value="occupied">{labels?.statusOccupied || "Occupied"}</MuiMenuItem>
              <MuiMenuItem value="reserved">{labels?.statusReserved || "Reserved"}</MuiMenuItem>
            </Select>
          </FormControl>

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
              {labels?.create || "Add Table"}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default CreateComponent;
