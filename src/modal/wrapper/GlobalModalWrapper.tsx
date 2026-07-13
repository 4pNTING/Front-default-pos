'use client';
import { Drawer } from '@mui/material';
import { useModalStore } from '../store/modalStore';
import ModalGlobalConfig from '../config/modal-config';
import { getDictionary } from '@/utils/getDictionary';

interface GlobProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: string;
}

const GlobalModalWrapper = (props: GlobProps) => {
  const { isOpen, modalType, closeModal, setCloseOnly } = useModalStore();
  return (
    <Drawer
      open={isOpen}
      anchor={'bottom'}
      variant="temporary"
      onClose={closeModal}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: {
            xs: '100vw',
            sm: '100vw',
          },
          height: '100vh',
          background: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <ModalGlobalConfig
        formProps={{
          handleClose: setCloseOnly,
          ...props,
        }}
        modalType={modalType}
      />
    </Drawer>
  );
};

export default GlobalModalWrapper;
