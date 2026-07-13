import { CategoryListProps } from "@/views/category/type/categoryType";
import { IEntityStatus } from "@/utils/base";
import { useCategoryStore, useCategoryMutations } from "@/views/category/store/categoryStore";
import {
  Button,
  IconButton,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useState, useRef } from "react";
import { msgError, msgSuccess } from "@/utils/sweetalert";
import CustomTextField from "@/@core/components/mui/TextField";

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
  const [isActive, setIsActive] = useState(true);

  const saveIntentRef = useRef(false);

  const { createCategoryMutation } = useCategoryMutations();
  const { setToggleCreateComponent, createCategoryAPI, setLoading } = useCategoryStore();

  function closeCreateComponent() {
    setToggleCreateComponent(false);
    clearForm();
    if (onClose) onClose();
  }

  function clearForm() {
    setName("");
    setDescription("");
    setIsActive(true);
  }

  async function onSubmitCreate() {
    if (saveIntentRef.current) return;
    saveIntentRef.current = true;
    setLoading(true);

    try {
      if (!name) {
        throw new Error(dic?.pleaseFilledAllInformation);
      }

      await createCategoryAPI({
        props: {
          mutation: createCategoryMutation,
          name: name
        },
      });

      clearForm();
      setToggleCreateComponent(false);

      await msgSuccess({
        title: dic?.save,
        text: name + " " + (dic?.savedSuccessfully),
        btnOKText: dic?.ok,
        btnOKColor: "#2F57AB",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        closeCreateComponent();
      }
    } catch (error: any) {
      await msgError({
        title: dic?.reject,
        text: error?.message || dic?.reject,
        btnOKText: dic?.ok,
        btnOKColor: "#d33",
      });
    } finally {
      setLoading(false);
      saveIntentRef.current = false;
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeCreateComponent();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-start pt-[100px] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleBackdropClick}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
        {/* Form Header */}
        <div
          className="flex items-center justify-between p-4 border-b border-gray-100 rounded-t-2xl"
          style={{ backgroundColor: "#2F57AB", color: "white" }}
        >
          <div className="flex items-center">
            <div className="w-10 h-9 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
              <i className="tabler-category text-xl text-white"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">ເພີ່ມໝວດໝູ່ໃໝ່</h2>
            </div>
          </div>
          <IconButton onClick={closeCreateComponent} sx={{ color: "white" }}>
            <i className="tabler-x" />
          </IconButton>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50/40 via-blue-25/20 to-white border border-blue-100/40 p-6 rounded-lg mb-4 shadow-sm">
              <div className="grid grid-cols-1 gap-4">
                <div className="form-group">
                  <label className="block text-l font-medium mb-2">
                    {dic?.name} <span className="text-red-500">*</span>
                  </label>
                  <CustomTextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    size="small"
                    autoComplete="off"
                    placeholder="Enter category name"
                    InputProps={{
                      startAdornment: (
                        <i className="tabler-tag text-[18px] mr-1 text-gray-500" />
                      ),
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="block text-l font-medium mb-2">
                    {dic?.description}
                  </label>
                  <CustomTextField
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    autoComplete="off"
                    placeholder="Enter description (optional)"
                  />
                </div>

                <div className="form-group mt-2">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Active Status"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
          <Button
            variant="outlined"
            color="secondary"
            onClick={closeCreateComponent}
            startIcon={<i className="tabler-x" />}
            sx={{ borderRadius: "8px", px: 3 }}
          >
            {dic?.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={onSubmitCreate}
            startIcon={<i className="tabler-device-floppy" />}
            disabled={!name}
            sx={{
              backgroundColor: "#2F57AB",
              "&:hover": { backgroundColor: "#1e3a75" },
              borderRadius: "8px",
              px: 3,
            }}
          >
            {dic?.save}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComponent;
