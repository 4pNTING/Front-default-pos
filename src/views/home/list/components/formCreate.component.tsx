import { HomeListProps } from "../../type/homeType";
import { useStore, useHomeMutations } from "../../store/homeStore";
import { Button } from "@mui/material";
import { useRef, useState } from "react";
import { msgError, msgSuccess } from "@/utils/sweetalert";
import CustomTextField from "@/@core/components/mui/TextField";

const CreateComponent = ({
  props,
  onClose,
  onSuccess,
}: {
  props: HomeListProps;
  onClose?: () => void;
  onSuccess?: () => void;
}) => {
  const { lang, dictionary: dic } = props;

  const [name, setName] = useState("");
  const saveIntentRef = useRef(false);

  const { createHomeMutation } = useHomeMutations();
  const {
    toggleCreateComponent,
    setToggleCreateComponent,
    createHomeAPI,
    loading,
    setLoading,
    removeListenerState,
  } = useStore();

  function closeCreateComponent() {
    setToggleCreateComponent(false);
    clearForm();
  }

  async function onSubmitCreate() {
    if (saveIntentRef.current) return;
    saveIntentRef.current = true;
    setLoading(true);

    try {
      if (!name) {
        throw new Error(dic?.pleaseFilledAllInformation);
      }

      await createHomeAPI({
        props: {
          mutation: createHomeMutation,
          name: name,
        },
      });

      clearForm();
      setToggleCreateComponent(false);

      await msgSuccess({
        title: dic?.save || "",
        text: name + " " + (dic?.savedSuccessfully || ""),
        btnOKText: dic?.ok || "",
        btnOKColor: "#2F57AB",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        closeCreateComponent();
      }
    } catch (error: any) {
      await msgError({
        title: dic?.reject || "",
        text: error?.message || dic?.reject || "",
        btnOKText: dic?.ok || "",
        btnOKColor: "#d33",
      });
    } finally {
      setLoading(false);
      saveIntentRef.current = false;
    }
  }

  function clearForm() {
    setName("");
  }

  const closeModal = () => {
    removeListenerState();
    closeCreateComponent();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Form Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-100"
        style={{ backgroundColor: "#0A3981", color: "white" }}
      >
        <div className="flex items-center">
          <div className="w-10 h-9 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
            <i className="tabler-home text-xl text-white"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{dic?.create}</h2>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div className="p-6">
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50/40 via-blue-25/20 to-white border border-blue-100/40 p-6 rounded-lg mb-4 shadow-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="block text-l font-medium mb-2">
                  {dic?.name}
                </label>
                <CustomTextField
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  size="small"
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-home text-[18px] mr-1" />
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outlined"
            color="inherit"
            onClick={closeModal}
            disabled={loading}
          >
            {dic?.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={onSubmitCreate}
            disabled={loading}
            style={{ backgroundColor: "#2F57AB" }}
          >
            {dic?.save}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComponent;
