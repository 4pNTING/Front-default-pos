import Swal from 'sweetalert2';

export function msgSuccess(props: {
  title: string;
  text: string;
  btnOKText: string;
  btnOKColor: string;
}) {
  return Swal.fire({
    icon: 'success',
    title: props.title,
    text: props.text,
    showConfirmButton: true,
    confirmButtonText: props.btnOKText,
    confirmButtonColor: props.btnOKColor,
    customClass: {
      popup: 'swal-small-popup',
    },
  });
}

export function msgError(props: {
  title: string;
  text: string;
  btnOKText: string;
  btnOKColor: string;
}) {
  return Swal.fire({
    icon: 'error',
    title: props.title,
    text: props.text,
    showConfirmButton: true,
    confirmButtonText: props.btnOKText,
    confirmButtonColor: props.btnOKColor,
    customClass: {
      popup: 'swal-small-popup',
      icon: 'swal-swal-icon-error',
    },
  });
}

export async function msgConfirm(props: {
  title: string;
  text: string;
  btnConfirmText: string;
  btnCancelText: string;
  btnConfirmColor?: string;
  btnCancelColor?: string;
}): Promise<boolean> {
  const result = await Swal.fire({
    icon: 'question',
    title: props.title,
    text: props.text,
    showCancelButton: true,
    confirmButtonText: props.btnConfirmText,
    cancelButtonText: props.btnCancelText,
    confirmButtonColor: props.btnConfirmColor || '#3085d6', // ✅ default ฟ้า
    cancelButtonColor: props.btnCancelColor || '#d33',
    reverseButtons: true, 
    customClass: { popup: 'swal-small-popup' },
  });

  return result.isConfirmed;
}

export async function confirmDelete(dic: any): Promise<boolean> {
  return msgConfirm({
    title: dic?.confirmDeleteTitle || 'Confirm Delete',
    text: dic?.confirmDeleteUser || 'Are you sure you want to delete this item?',
    btnConfirmText: dic?.confirm || 'Confirm',
    btnCancelText: dic?.cancel || 'Cancel',
    btnConfirmColor: '#d33',
  });
}

export async function confirmRestore(dic: any): Promise<boolean> {
  return msgConfirm({
    title: dic?.confirmRestoreTitle || 'Confirm Restore',
    text: dic?.confirmRestoreUser || 'Are you sure you want to restore this item?',
    btnConfirmText: dic?.confirm || 'Confirm',
    btnCancelText: dic?.cancel || 'Cancel',
    btnConfirmColor: '#3085d6',
  });
}
