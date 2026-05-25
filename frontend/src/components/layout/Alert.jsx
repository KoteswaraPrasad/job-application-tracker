import { Alert as MuiAlert, Snackbar } from '@mui/material';
import { useContext } from 'react';
import AlertContext from '../../context/alertContext';

const Alert = () => {
    const { alert, setAlert } = useContext(AlertContext);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setAlert(null);
    };

    if (!alert) return null;

    return (
        <Snackbar
            open={!!alert}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <MuiAlert
                onClose={handleClose}
                severity={alert.type}
                sx={{ width: '100%' }}
                elevation={6}
                variant="filled"
            >
                {alert.msg}
            </MuiAlert>
        </Snackbar>
    );
};

export default Alert;
