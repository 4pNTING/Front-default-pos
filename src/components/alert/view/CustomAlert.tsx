import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { CustomAlertProps } from '../type/customAlertTypes';
import { IconButton, Typography } from '@mui/material';
import { getIconStatus } from '../config/alertConfigs';
import { MessageTypes } from '@/types/messageTypes';
export default function CustomAlert(props: CustomAlertProps) {
    const dic = props.dictionary;
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        if (props?.callBeforeOpen) {
            props.callBeforeOpen();
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            {props.indicator ?
                React.cloneElement(props.indicator, { onClick: handleClickOpen }) :
                <Button variant="outlined" onClick={handleClickOpen}>
                    {dic.open}
                </Button>}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <IconButton onClick={handleClose} sx={{ position: "absolute", right: 10, top: 10 }}>
                    <i className="tabler-x text-xl" />
                </IconButton>
                <i style={{
                    alignSelf: "center",
                    width: 50,
                    height: 50,
                    marginTop: "20px",
                    marginBottom: "5px"
                }} className={`${getIconStatus(props?.type ?? MessageTypes.WARNING)}`} />
                <DialogContent sx={{ minWidth: 350, paddingTop: "10px", paddingBottom: "30px", maxWidth: "550px" }}>
                    <Typography textAlign={"center"} alignSelf={"center"} variant='h5'>
                        {props?.title ?? "Hello, How are you?"}
                    </Typography>
                    <DialogContentText textAlign={"center"}>
                        {props?.msg ?? "May I help you."}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button startIcon={<i className={`tabler-${props?.negIcon ?? 'x'} text-xl`} />} color={'error'} variant={'outlined'} autoFocus onClick={() => {
                        if (props?.negClicked) {
                            props?.negClicked();
                        }
                        handleClose();
                    }}>
                        {props?.negText ?? dic.cancel}
                    </Button>
                    <Button startIcon={<i className={`tabler-${props?.posIcon ?? 'check'} text-xl`} />} color={'primary'} variant="contained" onClick={() => {
                        if (props?.posClicked) {
                            props?.posClicked();
                        }
                        handleClose();
                    }} autoFocus>
                        {props?.posText ?? dic.ok}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
