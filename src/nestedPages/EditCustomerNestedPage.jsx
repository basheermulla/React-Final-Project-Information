import { useEffect, useState } from 'react'
import { Box, Grid, Paper, Stack, Avatar, TextField, Button, TableContainer } from '@mui/material';
import { blue } from '@mui/material/colors';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { updateCustomer, deleteCustomer } from '../redux/actions/customerActions';
import UpdateIcon from '@mui/icons-material/Update';
import BasicTableComp from '../components/BasicTable';
import { deletePurchase } from '../redux/actions/purchaseActions';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

function EditCustomerNestedPageComp() {
    const customers = useSelector((state => state.customerReducer.customers));
    const products = useSelector((state => state.productReducer.products));
    const purchases = useSelector((state => state.purchaseReducer.purchases));
    const dispatch = useDispatch();

    const [customerID, setCustomerID] = useState(useLocation().state.customerID);
    const [pathName, setPathName] = useState(useLocation().pathname);
    const [customer, setCustomer] = useState({});

    const navigate = useNavigate();

    const handleInput = (event) => {
        let { name, value } = event.target;
        setCustomer({ ...customer, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        dispatch(updateCustomer(customer));
        const updateCustomerDB = { ...customer };
        delete updateCustomerDB[['id']];
        await updateDoc(doc(db, 'customers', customer.id), updateCustomerDB);

        if (pathName === '/products/edit-customer') {
            navigate('/products');
        } else if (pathName === '/customers/edit-customer') {
            navigate(-1);
        } else {
            navigate('/');
        }
    }

    const handleDelete = async () => {
        // Delete customer from customerReducer
        dispatch(deleteCustomer(customer.id));

        // Delete customer from firebase firestore DB
        await deleteDoc(doc(db, 'customers', customer.id));

        // Generate Purchased Arr to Delete
        const toDelete_purchases = purchases.filter((purchase) => purchase.customerID === customerID);
        let arr_purchaseID = []
        toDelete_purchases.forEach(purchase => {
            arr_purchaseID.push(purchase.id)
        });

        // Delete customer's related data from the "Purchased" table in purchaseReducer
        dispatch(deletePurchase(arr_purchaseID));

        // Delete customer's related data from the "Purchased" table in firebase firestore DB
        const promises = toDelete_purchases.map((docId) => deleteDoc(doc(db, "purchases", docId.id)))
        await Promise.all(promises);
        navigate(-1);
    }

    const handleCancel = () => {
        console.log(pathName);
        if (pathName === '/products/edit-customer') {
            navigate('/products');
        } else if (pathName === '/customers/edit-customer') {
            navigate(-1);
        } else {
            navigate('/');
        }
    }

    const handleClose = () => {
        if (pathName === '/customers/edit-customer' || pathName === '/customers/edit-product') {
            navigate('/customers');
        } else {
            navigate('/products');
        }
    }

    useEffect(() => {
        const desire_Customer = customers.find((customer) => customer.id === customerID);
        setCustomer(desire_Customer);
    }, [customerID]);

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", mt: 5, p: 1 }}>
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
                            onClick={() => handleDelete()}
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

                            modelTarget={pathName === '/customers/edit-customer' ? 'customers' : 'products'}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default EditCustomerNestedPageComp