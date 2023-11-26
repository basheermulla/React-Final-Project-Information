import { useState } from 'react'
import {
    Box, Typography, Grid, Paper, Stack, Avatar, TextField, Button,
} from '@mui/material';
import { purple, blue, grey, cyan } from '@mui/material/colors';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import db from "../firebase/firebase";
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { updateCustomer } from '../redux/actions/customerActions';
import UpdateIcon from '@mui/icons-material/Update';
import BasicTableComp from '../components/BasicTable';

function EditCustomerNestedPageComp() {
    const products = useSelector((state => state.productReducer.products));
    const purchases = useSelector((state => state.purchaseReducer.purchases));
    const dispatch = useDispatch();

    const [customer, setCustomer] = useState(useLocation().state.customer);

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
        const updateCustomerRedux = { ...customer };
        delete updateCustomerRedux[['status']];
        delete updateCustomerRedux[['otherData']];
        dispatch(updateCustomer(updateCustomerRedux));
        const updateCustomerDB = { ...customer };
        delete updateCustomerDB[['status']];
        delete updateCustomerDB[['otherData']];
        delete updateCustomerDB[['id']];
        await updateDoc(doc(db, 'customers', customer.id), updateCustomerDB);
        navigate(-1);
    }

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", mt: 5, p: 1 }}>
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
                                defaultValue={customer.firstName}
                                autoFocus
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
                                defaultValue={customer.lastName}
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
                                defaultValue={customer.city}
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
                            onClick={() => navigate(-1)}
                        >
                            Cancel
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
                                    purchases.find(purchase => purchase.customerID === customer.id) &&
                                    purchases.find(purchase => purchase.productID === product.id)
                                )
                            }
                            model={'customers'} />
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default EditCustomerNestedPageComp