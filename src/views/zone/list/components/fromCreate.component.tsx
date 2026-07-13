import { useSession } from "next-auth/react";
import { ZoneListProps } from "../../type/zoneType";
import { useStore, useZoneMutations } from "../../store/zoneStore";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ToastService } from "@/utils/toastService";
import { IRoleConfigLevel } from "@/utils/base";
import CustomTextField from "@/@core/components/mui/TextField";
import { msgError, msgSuccess,msgConfirm } from "@/utils/sweetalert";

const FromInputComponent = ({ props }: { props: ZoneListProps }) => {
  // Var
  const { lang, dictionary: dic } = props;

  // State
  const [name, setName] = useState("");

  // Hooks
  const {
    toggleCreateComponent,
    setToggleCreateComponent,
    createZoneAPI,
    loading,
    removeListenerState,
    setLoading,
  } = useStore();

  // Mutations
  const { createZoneMutation } = useZoneMutations();

  // Functions
  function closeCreateComponent() {
    setToggleCreateComponent(false);
    setName("");
  }

  async function onCreateZone() {
    try {
      if (!name)
        throw new Error(dic?.pleaseFilledAllInformation);

      await createZoneAPI({
        props: {
          name: name,
          mutation: createZoneMutation,
        },
      });

      setName("");
      closeCreateComponent();
      
      await msgSuccess({
        title: dic?.save,
        text: (dic as any)?.zoneCreatedSuccessfully,
        btnOKText: dic?.ok,
        btnOKColor: "#2F57AB",
      });
    } catch (error: any) {
      await msgError({
        title: dic?.reject,
        text: error?.message || dic?.reject,
        btnOKText: dic?.ok,
        btnOKColor: "#d33",
      });
    }
  }

  function clearForm() {
    setName("");
  }

  return (
    <Dialog
      open={toggleCreateComponent}
      onClose={closeCreateComponent}
      maxWidth="xs"
      fullWidth
      disableRestoreFocus
      disableEnforceFocus
      PaperProps={{

        sx: { borderRadius: "12px", overflow: "hidden" },
      }}
    >
      {/* Modal Header */}
      <DialogTitle
        sx={{
          m: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#0A3981",
          color: "white",
          padding: "16px 24px",
          fontWeight: 600,
          fontSize: "18px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <i className="tabler-circle-plus text-[20px]"></i>
          {dic.createZone}
        </Box>
        <IconButton
          onClick={closeCreateComponent}
          sx={{
            color: "white",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            padding: "4px",
          }}
        >
          <i className="tabler-x text-[18px]"></i>
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <div className="p-6">
          {/* Zone Name Input */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">
              {dic?.zone}
            </div>
            <CustomTextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading && name.trim()) {
                  e.preventDefault();
                  onCreateZone();
                }
              }}
              fullWidth
              size="small"
              className="w-full"
              autoFocus
              autoComplete="off"
              placeholder={dic?.placeHolder?.ZoneName}
              InputProps={{
                startAdornment: (
                  <i className="tabler-building text-[16px] mr-2" />
                ),
              }}
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
            <Button
              onClick={closeCreateComponent}
              variant="contained"
              color="secondary"
              disabled={loading}
              size="medium"
              className="min-w-[100px]"
            >
              <i className="tabler-x text-[16px] mr-1"></i>
              {dic?.cancel}
            </Button>

            <Button
              onClick={onCreateZone}
              variant="contained"
              disabled={loading || !name}
              size="medium"
              className="min-w-[100px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white "></div>
                  {dic?.creating}
                </>
              ) : (
                <>
                  <i className="tabler-device-floppy text-[18px] mr-2"></i>
                  {dic?.confirm}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FromInputComponent;
