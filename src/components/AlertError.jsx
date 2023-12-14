import { Alert, AlertTitle, Box, Grid, LinearProgress, Button } from '@mui/material';
import PropTypes from 'prop-types';

function AlertErrorComp({ title, content, callbackSubmitError }) {

    return (
        <Grid container sx={{ mt: 3 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                <Alert severity="error" sx={{ width: '90%', display: 'flex', justifyContent: "center" }}>
                    <Grid item xs={12}>
                        <AlertTitle sx={{ textAlign: 'left' }}>
                            <strong>{title}</strong>
                        </AlertTitle>
                    </Grid>
                    <strong>{content}</strong>
                    <Grid item xs={12} sx={{ alignItems: 'center', display: 'flex', justifyContent: "center" }}>
                        <Button
                            type="button"
                            variant="contained"
                            color="error"
                            sx={{ m: 1, mt: 3 }}
                            onClick={() => callbackSubmitError()}
                        >
                            Return
                        </Button>
                    </Grid>
                </Alert>
            </Grid>
        </Grid>
    )
}

export default AlertErrorComp