import { useEffect, useState } from 'react'
import { Box, Grid, Paper, Stack, Avatar, TextField, Button, TableContainer } from '@mui/material';
import { blue } from '@mui/material/colors';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import Icon from '@mui/material/Icon';
import { addCustomerRequest, addCustomerSuccess, addCustomerFail, submitCustomerFail } from '../redux/actions/customerActions';
import AlertErrorComp from '../components/AlertError';
import LinearProgressComp from '../components/LinearProgress';
import SnackbarAlertComp from '../components/SnackbarAlert';

function NewCustomerNestedPageComp() {
    const { userLogin } = useSelector((state) => state.userLoginReducer);
    const { loading, error: showError_AddCustomer, customers } = useSelector((state) => state.customerReducer);

    const dispatch = useDispatch();

    const [customer, setCustomer] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const navigate = useNavigate();

    const handleInput = (event) => {
        let { name, value } = event.target;
        setCustomer({ ...customer, [name]: value })
    }

    const handleSnackOpen = () => {
        setOpenSnackbar(true);
    };

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
        navigate('/customers');
    };

    const handleSubmit = async (event) => {
        dispatch(addCustomerRequest())
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        const firestoreAddDoc = async () => {
            const addCustomerDB = { ...customer };
            const docRef = await addDoc(collection(db, 'customers'), addCustomerDB)
            const docId = docRef.id;
            setCustomer({ ...customer, id: docRef.id })
            return docId;
        }

        const [result] = await Promise.allSettled([firestoreAddDoc()])
        if (result.status === 'fulfilled') {
            console.log(result);
            handleSnackOpen();
            dispatch(addCustomerSuccess({ ...customer, id: result.value }));
        } else {
            console.log(result.reason);
            dispatch(addCustomerFail(result.reason));
        }
    }

    const handleCancel = () => {
        navigate(-1);
    }

    const handleClose = () => {
        navigate(-1);
    }

    const handleSubmitError = () => {
        dispatch(submitCustomerFail());
        navigate('/customers');
    }

    useEffect(() => {
        if (!userLogin) {
            navigate('/login')
        }
    }, [])

    return (
        <Box width={'100%'} mr={1} ml={1}>
            {
                loading
                &&
                <LinearProgressComp />
            }{
                showError_AddCustomer
                &&
                <AlertErrorComp title={'Add Customer Error'} content={showError_AddCustomer} callbackSubmitError={handleSubmitError} />
            }{
                !showError_AddCustomer
                &&
                <Grid container component={Paper} elevation={0} sx={{ display: 'flex', justifyContent: "center", p: 1 }}>
                    <TableContainer sx={{ display: 'flex', justifyContent: "right" }}>
                        <DisabledByDefaultIcon color="error" cursor='pointer' onClick={(e) => handleClose(e)} />
                    </TableContainer>
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} m={3} sx={{ justifyContent: "center" }} >
                            <Avatar sx={{ bgcolor: blue[200], color: 'black', width: 400, height: 60, fontWeight: 'bold' }} variant='square'>Add Customer</Avatar>
                        </Stack>
                    </Grid>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    autoComplete="firstName"
                                    id="firstName"
                                    label="First Name"
                                    name="firstName"
                                    value={customer.firstName || ''}
                                    autoFocus
                                    inputProps={{
                                        maxLength: 12
                                    }}
                                    onChange={(e) => handleInput(e)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    autoComplete="lastName"
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    value={customer.lastName || ''}
                                    inputProps={{
                                        maxLength: 12
                                    }}
                                    onChange={(e) => handleInput(e)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    autoComplete="city"
                                    id="city"
                                    label="City"
                                    name="city"
                                    value={customer.city || ''}
                                    inputProps={{
                                        maxLength: 24
                                    }}
                                    onChange={(e) => handleInput(e)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    autoComplete="src"
                                    id="src"
                                    label="Src"
                                    name="src"
                                    value={customer?.src || ''}
                                    onChange={(e) => handleInput(e)}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={8} sx={{ display: 'inline-flex', justifyContent: "center" }}>
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ m: 1, mt: 3 }}
                                onClick={() => handleCancel()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color='error'
                                startIcon={<Icon>add_circle</Icon>}
                                sx={{ m: 1, mt: 3 }}
                            >
                                Add
                            </Button>
                        </Grid>
                    </Box>
                    <SnackbarAlertComp
                        openSnackbar={openSnackbar}
                        content={'The customer was added successfully !'}
                        callbackHandleSnackClose={handleSnackClose} cover={'success'}
                    />
                </Grid>
            }
        </Box>
    )
}

export default NewCustomerNestedPageComp