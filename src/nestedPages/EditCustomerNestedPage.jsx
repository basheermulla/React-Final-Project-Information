import { useEffect, useState } from 'react'
import { Box, Grid, Paper, Stack, Avatar, TextField, Button, TableContainer, LinearProgress, Alert, AlertTitle, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar } from '@mui/material';
import { blue } from '@mui/material/colors';
import { doc, updateDoc, deleteDoc, addDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import {
    updateCustomerRequest,
    updateCustomerSuccess,
    updateCustomerFail,
    deleteCustomerRequest,
    deleteCustomerSuccess,
    deleteCustomerFail,
    submitCustomerFail,
} from '../redux/actions/customerActions';
import { deletePurchaseSuccess } from '../redux/actions/purchaseActions';
import UpdateIcon from '@mui/icons-material/Update';
import BasicTableComp from '../components/BasicTable';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

function EditCustomerNestedPageComp() {
    const products = useSelector((state => state.productReducer.products));
    const purchases = useSelector((state => state.purchaseReducer.purchases));
    const { userLogin } = useSelector((state) => state.userLoginReducer);
    const { loading, error: showError_UpdateCustomer, customers } = useSelector((state) => state.customerReducer);
    const dispatch = useDispatch();

    const [customerID, setCustomerID] = useState(useLocation().state.customerID);
    const [customer, setCustomer] = useState({});
    const [open, setOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

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
        navigate(-1);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event) => {
        dispatch(updateCustomerRequest())
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        const firestoreUpdateDoc = async () => {
            const updateCustomerDB = { ...customer };
            delete updateCustomerDB['id'];
            await updateDoc(doc(db, 'customers', customer.id), updateCustomerDB);
        }

        const [result] = await Promise.allSettled([firestoreUpdateDoc()])
        if (result.status === 'fulfilled') {
            console.log(result);
            handleSnackOpen();
            dispatch(updateCustomerSuccess(customer));
        } else {
            console.log(result.reason);
            dispatch(updateCustomerFail(result.reason));
        }
    }

    // Delete customer from firebase firestore DB, then delete from customerReducer
    const handleDelete = async () => {
        dispatch(deleteCustomerRequest());

        const firestoreDeleteCustomerDoc = async () => {
            await deleteDoc(doc(db, 'customers', customer.id));
        }

        let toDelete_purchases = [];
        const firestoreDeletePurchaseDoc = async () => {
            // Generate Purchased Arr to Delete
            toDelete_purchases = purchases.filter((purchase) => purchase.customerID === customerID);

            // Delete customer's related data from the "Purchased" table in firebase firestore DB
            const promises = toDelete_purchases.map((docId) => deleteDoc(doc(db, "purchases", docId.id)))
            await Promise.all(promises);
        }

        const [res_DeleteCustomer, res_DeletePurchases] = await Promise.allSettled(
            [
                firestoreDeleteCustomerDoc(),
                firestoreDeletePurchaseDoc()
            ]
        )
        const res_All = [res_DeleteCustomer, res_DeletePurchases]
        const isPromiseRejected = res_All.find((promise) => promise.status === 'rejected');
        if (!isPromiseRejected) {
            dispatch(deleteCustomerSuccess(customerID));

            // Delete customer's related data from the "Purchased" table in purchaseReducer
            let arr_purchaseID = []
            toDelete_purchases.forEach(purchase => {
                arr_purchaseID.push(purchase.id)
            });
            dispatch(deletePurchaseSuccess(arr_purchaseID));
            navigate(-1);
        } else if (res_DeleteCustomer.status === 'fulfilled') {
            // We add the customer again after deleting him, 
            // Due to the fact that the Promise.allSettled fell through
            const addCustomerDB = { ...customer };
            delete addCustomerDB['id'];
            await setDoc(doc(db, "customers", customer.id), addCustomerDB);
            dispatch(deleteCustomerFail(isPromiseRejected.reason));
            // dispatch(deletePurchaseFail(isPromiseRejected.reason));
        } else if (res_DeletePurchases.status === 'fulfilled') {
            // We add  the customer purchases after deleting them,  
            // Due to the fact that the Promise.allSettled fell through
            toDelete_purchases.forEach(async (purchase) => {
                const addPurchaseDB = { ...purchase };
                delete addPurchaseDB['id'];
                await setDoc(doc(db, "purchases", purchase.id), addPurchaseDB);
            });
            dispatch(deleteCustomerFail(isPromiseRejected.reason));
        } else {
            dispatch(deleteCustomerFail(isPromiseRejected.reason));
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
        navigate(-1);
    }

    useEffect(() => {
        const desire_Customer = customers.find((customer) => customer.id === customerID);
        setCustomer(desire_Customer);
    }, [customerID]);

    useEffect(() => {
        if (!userLogin) {
            navigate('/login')
        }
    }, [])

    return (
        <Box sx={{ width: '100%', mr: 1, ml: 1 }}>
            {
                loading
                &&
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            }
            {
                showError_UpdateCustomer
                &&
                <Grid container sx={{ mt: 3 }}>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                        <Alert severity="error" sx={{ width: '90%', display: 'flex', justifyContent: "center" }}>
                            <Grid item xs={12}>
                                <AlertTitle sx={{ textAlign: 'left' }}>
                                    <strong>Edit Customer Error</strong>
                                </AlertTitle>
                            </Grid>
                            <strong>{showError_UpdateCustomer}</strong>
                            <Grid item xs={12} sx={{ alignItems: 'center', display: 'flex', justifyContent: "center" }}>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="error"
                                    sx={{ m: 1, mt: 3 }}
                                    onClick={() => handleSubmitError()}
                                >
                                    Return
                                </Button>
                            </Grid>
                        </Alert>
                    </Grid>
                </Grid>
            }
            {
                !showError_UpdateCustomer
                &&
                <Grid container component={Paper} elevation={0} sx={{ display: 'flex', justifyContent: "center", p: 1 }}>
                    <TableContainer sx={{ display: 'flex', justifyContent: "right" }}>
                        <DisabledByDefaultIcon color="error" cursor='pointer' onClick={(e) => handleClose(e)} />
                    </TableContainer>
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} m={3} sx={{ justifyContent: "center" }} >
                            <Avatar sx={{ bgcolor: blue[200], color: 'black', width: 400, height: 60, fontWeight: 'bold' }} variant='square'>Edit Customer</Avatar>
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
                                    value={customer?.firstName || ''}
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
                                    value={customer?.lastName || ''}
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
                                    value={customer?.city || ''}
                                    inputProps={{
                                        maxLength: 24
                                    }}
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
                                type="button"
                                fullWidth
                                variant="outlined"
                                color='error'
                                sx={{ m: 1, mt: 3 }}
                                onClick={handleClickOpen}
                            >
                                Delete
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color='error'
                                startIcon={<UpdateIcon />}
                                sx={{ m: 1, mt: 3 }}
                            >
                                Update
                            </Button>
                        </Grid>
                    </Box>
                    <Dialog
                        open={open}
                        onClose={handleClickClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Are you sure you want to delete this customer?"}
                        </DialogTitle>
                        <DialogActions>
                            <Button
                                variant="contained"
                                color='primary'
                                onClick={handleClickClose}
                            >
                                Disagree
                            </Button>
                            <Button
                                variant="contained"
                                color='error'
                                onClick={handleDelete}
                                autoFocus
                            >
                                Agree
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleSnackClose} sx={{ pt: 9.5 }} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                        <Alert onClose={handleSnackClose} variant="filled" severity="success" sx={{ width: '100%' }}>
                            The information was updated successfully !
                        </Alert>
                    </Snackbar>
                    <Grid item xs={12} sm={8}>
                        <Box sx={{ display: 'flex', justifyContent: "center", mb: 3 }} >
                            <BasicTableComp
                                data={
                                    products.filter((product) =>
                                        purchases.find(purchase =>
                                            purchase.customerID === customerID &&
                                            purchase.productID === product.id
                                        ))
                                }

                                modelTarget={location.pathname === '/customers/edit-customer' ? 'customers' : 'products'}
                            />
                        </Box>
                    </Grid>
                </Grid>
            }
        </Box>
    )
}

export default EditCustomerNestedPageComp