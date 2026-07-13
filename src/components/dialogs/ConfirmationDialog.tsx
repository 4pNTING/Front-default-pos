'use client';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Divider } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    padding: 0,
    minWidth: 450,
    maxWidth: 500,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    background: theme.palette.background.paper,
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(2px)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(3, 3, 2),
  textAlign: 'center',
  '& .MuiTypography-root': {
    fontWeight: 600,
    fontSize: '1.25rem',
    color: theme.palette.text.primary,
    marginBottom: 0,
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(0, 3, 3),
  textAlign: 'center',
  '& .MuiTypography-root': {
    color: theme.palette.text.secondary,
    lineHeight: 1.6,
    fontSize: '0.95rem',
  },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3, 3),
  justifyContent: 'center',
  gap: theme.spacing(2),
  '& .MuiButton-root': {
    minWidth: 100,
    height: 40,
    borderRadius: 8,
    textTransform: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  '& .MuiButton-outlined': {
    borderColor: theme.palette.divider,
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.text.secondary,
    },
  },
  '& .MuiButton-contained': {
    boxShadow: 'none',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
    },
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 64,
  height: 64,
  borderRadius: '50%',
  margin: '0 auto 16px',
  backgroundColor: 'rgba(244, 67, 54, 0.1)',
  color: theme.palette.error.main,
  fontSize: '32px',
}));

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  loading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = 'ຢືນຢັນ',
  cancelText = 'ຍົກເລີກ',
  confirmColor = 'error',
  loading = false,
}) => {
  const theme = useTheme();

  return (
    <StyledDialog
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth={false}
    >
      <StyledDialogTitle>
        <IconWrapper>
          <i className="tabler-alert-triangle" />
        </IconWrapper>
        <Typography variant="h6">{title}</Typography>
      </StyledDialogTitle>

      <StyledDialogContent>
        <Typography variant="body1">
          {content}
        </Typography>
      </StyledDialogContent>

      <StyledDialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          disabled={loading}
          startIcon={loading ? (
            <Box sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              border: `2px solid ${theme.palette.common.white}`,
              borderTop: '2px solid transparent',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },
            }} />
          ) : (
            <i className="tabler-trash text-[16px]" />
          )}
        >
          {confirmText}
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default ConfirmationDialog;
