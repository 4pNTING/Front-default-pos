import Close from '@/@menu/svg/Close';
// import WorkingHoursCreateForm from '@/views/working-hours/form/WorkingHoursCreateForm';
// import WorkingHoursUpdateForm from '@/views/working-hours/form/WorkingHoursUpdateForm';
// import { workingHoursMTs } from '@/views/working-hours/type/workingHoursTypes';
import { Box, IconButton, Typography } from '@mui/material';
import { ModalFormProps } from '../type/modalType';
import { roleMTs } from '@/views/role/type/roleTypes';
// import FormCreateRole from '@/views/role/form/FormCreateRole';

const ModalGlobalConfig = ({
  modalType,
  formProps,
}: {
  modalType: string | null;
  formProps: ModalFormProps;
}) => {
  switch (modalType) {
    // none
    default:
      return (
        <Box
          borderRadius={'5px'}
          display={'flex'}
          flexDirection={'column'}
          bgcolor={'white'}
          padding={'30px'}
          alignItems={'center'}
        >
          <Typography>No modal config</Typography>
          <IconButton onClick={formProps.handleClose}>
            <Close />
          </IconButton>
        </Box>
      );
  }
};

export default ModalGlobalConfig;
