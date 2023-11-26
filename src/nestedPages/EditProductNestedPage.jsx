import { useEffect, useState } from 'react'
import {
    Box, Typography, Grid, TextField, Button, Paper, Stack, Avatar
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { purple, blue, grey, cyan } from '@mui/material/colors';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import db from "../firebase/firebase";
import { useSelector, useDispatch } from "react-redux";
import { updateProduct } from '../redux/actions/productActions';
import UpdateIcon from '@mui/icons-material/Update';
import BasicTableComp from '../components/BasicTable';

function EditProductNestedPageComp() {
    const customers = useSelector((state => state.customerReducer.customers));
    const purchases = useSelector((state => state.purchaseReducer.purchases));
    const dispatch = useDispatch();

    const [product, setProduct] = useState(useLocation().state.product);

    const navigate = useNavigate();

    const handleInput = (event) => {
        let { name, value } = event.target;
        value = isNaN(value) ? value : +value;
        setProduct({ ...product, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        dispatch(updateProduct(product));
        const updateProductDB = { ...product };
        delete updateProductDB['id'];
        await updateDoc(doc(db, 'products', product.id), updateProductDB);
        navigate(-1);
    }

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", mt: 5, p: 1 }}>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2} m={3} sx={{ justifyContent: "center" }}>
                        <Avatar sx={{ bgcolor: blue[200], color: 'black', width: 400, height: 60, fontWeight: 'bold' }} variant='square'>Edit Product</Avatar>
                    </Stack>
                </Grid>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                fullWidth
                                autoComplete="sdsname"
                                id="name"
                                label="Name"
                                name="name"
                                defaultValue={product.name}
                                autoFocus
                                onChange={(e) => handleInput(e)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                fullWidth
                                autoComplete="sdsdprice"
                                id="price"
                                label="Price"
                                name="price"
                                defaultValue={product.price}
                                onChange={(e) => handleInput(e)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                fullWidth
                                autoComplete="sdsdquantity"
                                id="quantity"
                                label="Quantity"
                                name="quantity"
                                defaultValue={product.quantity}
                                onChange={(e) => handleInput(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                autoComplete="sdsddescription"
                                id="description"
                                label="Description"
                                name="description"
                                defaultValue={product.description}
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
                            customers.filter((customer) =>
                                purchases.find(purchase => purchase.productID === product.id) &&
                                purchases.find(purchase => purchase.customerID === customer.id)
                            )
                        }
                        model={'products'} />
                </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default EditProductNestedPageComp