import { useState } from "react";
import { CategoryListProps } from "@/views/category/type/categoryType";
import {
  useCategoryStore,
  useCategoryMutations,
} from "@/views/category/store/categoryStore";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
} from "@mui/material";
import { msgError, msgSuccess } from "@/utils/sweetalert";
import CustomTextField from "@/@core/components/mui/TextField";
import { ToastService } from "@/utils/toastService";

const CreateComponent = ({
  props,
  onClose,
  onSuccess,
}: {
  props: CategoryListProps;
  onClose?: () => void;
  onSuccess?: () => void;
}) => {
  const { dictionary: dic } = props;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { createCategoryMutation } = useCategoryMutations();
  const {
    toggleCreateComponent,
    setToggleCreateComponent,
    createCategoryAPI,
    loading,
    setLoading,
  } = useCategoryStore();

  function closeCreateComponent() {
    setToggleCreateComponent(false);
    clearForm();
    if (onClose) onClose();
  }

  function clearForm() {
    setName("");
    setDescription("");
  }

  async function onSubmitCreate() {
    try {
      if (!name.trim()) {
        ToastService.formInvalid(dic);
        return;
      }

      await createCategoryAPI({
        props: {
          mutation: createCategoryMutation,
          name: name.trim(),
        },
      });

      clearForm();
      closeCreateComponent();

      ToastService.createSuccess(dic);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      ToastService.actionError("ເພີ່ມ Category", error?.message, dic);
    }
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
          {dic?.createCategory}
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
          {/* Category Name Input */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              {dic?.name} <span className="text-red-500 ml-1">*</span>
            </div>
            <CustomTextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading && name.trim()) {
                  e.preventDefault();
                  onSubmitCreate();
                }
              }}
              fullWidth
              size="small"
              className="w-full"
              autoFocus
              autoComplete="off"
              placeholder="Enter category name"
              InputProps={{
                startAdornment: (
                  <i className="tabler-tag text-[16px] mr-2 text-gray-500" />
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
              onClick={onSubmitCreate}
              variant="contained"
              disabled={loading || !name.trim()}
              size="medium"
              className="min-w-[100px]"
              sx={{
                backgroundColor: "#0A3981",
                "&:hover": { backgroundColor: "#082d5c" },
              }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {dic?.creating || "Saving..."}
                </>
              ) : (
                <>
                  <i className="tabler-device-floppy text-[18px] mr-2"></i>
                  {dic?.confirm || dic?.save}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateComponent;
