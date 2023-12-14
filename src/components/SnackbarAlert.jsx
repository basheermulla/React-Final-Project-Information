import { Alert, Snackbar } from '@mui/material';
import PropTypes from 'prop-types';

function SnackbarAlertComp({ openSnackbar, openSnackbarAdmin, openSnackbarRegular, content, callbackHandleSnackClose, cover }) {

    return (
        <Snackbar open={openSnackbar || openSnackbarAdmin || openSnackbarRegular} autoHideDuration={2000} onClose={callbackHandleSnackClose} sx={{ pt: 6 }} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
            <Alert onClose={callbackHandleSnackClose} variant="filled" severity={cover} sx={{ width: '100%' }}>
                {content}
            </Alert>
        </Snackbar>
    )
}

export default SnackbarAlertComp