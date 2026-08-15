import { MenuItemListProps } from "../../type/menuItemType";
import { useMenuItemStore, useMenuItemMutations } from "../../store/menuItemStore";
import {
  Drawer,
  Button,
  IconButton,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ToastService } from "@/utils/toastService";
import CustomTextField from "@/@core/components/mui/TextField";
import { UploadFile } from "@core/components/custom-inputs";
import type { AttachedFile } from "@core/components/custom-inputs";

const UpdateComponent = ({
  props,
  onClose,
  onSuccess,
}: {
  props: MenuItemListProps;
  onClose?: () => void;
  onSuccess?: () => void;
}) => {
  const { toggleUpdateComponent, setToggleUpdateComponent, selectedItem, updateMenuItemAPI, categoryList, loading } =
    useMenuItemStore();
  const { updateMenuItemMutation } = useMenuItemMutations();
  const labels = props.dictionary.menuItemPage;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [menuItemFile, setMenuItemFile] = useState<AttachedFile | null>(null);

  const [errors, setErrors] = useState<{ name?: string; price?: string; categoryId?: string }>({});

  useEffect(() => {
    if (selectedItem) {
      setName(selectedItem.name ?? "");
      setDescription(selectedItem.description ?? "");
      setPrice(selectedItem.price ? String(selectedItem.price) : "");
      setCategoryId(selectedItem.categoryId ?? "");
      setIsActive(selectedItem.isActive !== "inactive");

      if (selectedItem.photo) {
        setMenuItemFile({
          id: `menu-item-${selectedItem._id}`,
          name: selectedItem.name,
          size: 0,
          type: "image/*",
          url: selectedItem.photo,
        });
      } else {
        setMenuItemFile(null);
      }
    }
  }, [selectedItem]);

  const validate = () => {
    const errs: { name?: string; price?: string; categoryId?: string } = {};
    if (!name.trim()) errs.name = labels.nameRequired;
    if (!price || Number(price) <= 0) errs.price = labels.priceRequired;
    if (!categoryId) errs.categoryId = labels.categoryRequired;
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
      ToastService.formInvalid(props.dictionary);
      return;
    }

    try {
      await updateMenuItemAPI({
        props: {
          mutation: updateMenuItemMutation,
          dictionary: props.dictionary,
          _id: selectedItem._id,
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          categoryId,
          isActive: isActive ? "active" : "inactive",
          menuItemFile,
        },
      });

      ToastService.updateSuccess(props.dictionary);
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      ToastService.actionError("ແກ້ໄຂ MenuItem", error?.message, props.dictionary);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={toggleUpdateComponent}
      onClose={handleClose}
      PaperProps={{
        style: { width: "100%", maxWidth: 480 },
      }}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between px-6 py-4 bg-[#0A3981] text-white">
          <div className="flex items-center gap-2">
            <i className="tabler-edit text-[20px]" />
            <Typography variant="h6" fontWeight={600} sx={{ color: "white" }}>
              {labels.edit}
            </Typography>
          </div>
          <IconButton
            onClick={handleClose}
            sx={{
              color: "white",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              padding: "4px",
            }}
          >
            <i className="tabler-x text-[18px]" />
          </IconButton>
        </div>

        <form id="update-menu-item-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <CustomTextField
            fullWidth
            label={labels.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />

          <FormControl fullWidth size="small" error={!!errors.categoryId}>
            <InputLabel id="category-update-select-label">{labels.category}</InputLabel>
            <Select
              labelId="category-update-select-label"
              label={labels.category}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as string)}
            >
              {categoryList && categoryList.length > 0 ? (
                categoryList.map((cat: any) => (
                  <MuiMenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MuiMenuItem>
                ))
              ) : (
                <MuiMenuItem value="" disabled>
                  {labels.noCategory}
                </MuiMenuItem>
              )}
            </Select>
            {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
          </FormControl>

          <CustomTextField
            fullWidth
            type="number"
            label={`${labels.price} (${labels.currency}) `}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={!!errors.price}
            helperText={errors.price}
          />

          <CustomTextField
            fullWidth
            multiline
            rows={3}
            label={labels.description}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                color="primary"
              />
            }
            label={isActive ? props.dictionary.active : props.dictionary.inactive}
          />

          <Divider className="my-2" />

          <div>
            <Typography variant="subtitle2" className="mb-2 font-medium">
              {labels.image}
            </Typography>
            <UploadFile
              file={menuItemFile}
              onFileChange={setMenuItemFile}
              ownerId={selectedItem?._id ?? ""}
              ownerType="menuItem"
              maxFileSize={5}
              acceptedTypes={[".jpg", ".png", ".webp"]}
              disabled={loading}
              dic={props.dictionary}
              autoUpload={false}
            />
          </div>
        </form>

        <div className="p-4 border-t flex items-center justify-end gap-2 bg-gray-50 dark:bg-gray-800">
          <Button variant="outlined" color="secondary" onClick={handleClose} disabled={loading}>
            {props.dictionary.cancel}
          </Button>
          <Button
            type="submit"
            form="update-menu-item-form"
            variant="contained"
            color="warning"
            disabled={loading}
            className="min-w-[120px] hover:bg-yellow-700"
            startIcon={
              loading ? (
                <i className="tabler-loader-2 text-[16px] animate-spin" />
              ) : (
                <i className="tabler-edit text-[16px]" />
              )
            }
          >
            {props.dictionary.update}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default UpdateComponent;
