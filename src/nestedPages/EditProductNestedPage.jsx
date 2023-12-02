import { useEffect, useState } from 'react'
import { Box, Grid, TextField, Button, Paper, Stack, Avatar, TableContainer } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useSelector, useDispatch } from "react-redux";
import { deleteProduct, updateProduct } from '../redux/actions/productActions';
import UpdateIcon from '@mui/icons-material/Update';
import BasicTableComp from '../components/BasicTable';
import { deletePurchase } from '../redux/actions/purchaseActions';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

function EditProductNestedPageComp() {
    const products = useSelector((state => state.productReducer.products));
    const customers = useSelector((state => state.customerReducer.customers));
    const purchases = useSelector((state => state.purchaseReducer.purchases));
    const dispatch = useDispatch();

    const [productID, setProductID] = useState(useLocation().state.productID);
    const [pathName, setPathName] = useState(useLocation().pathname)
    const [product, setProduct] = useState({});

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
        console.log(product);
        dispatch(updateProduct(product));
        const updateProductDB = { ...product };
        delete updateProductDB['id'];
        await updateDoc(doc(db, 'products', product.id), updateProductDB);

        if (pathName === '/customers/edit-product') {
            navigate('/customers');
        } else if (pathName === '/products/edit-product') {
            navigate(-1);
        } else {
            navigate('/');
        }
    }

    const handleDalete = async () => {
        // Delete product from productReducer
        dispatch(deleteProduct(product.id));

        // Delete product from firebase firestore DB
        await deleteDoc(doc(db, 'products', product.id));

        // Generate Purchased Arr to Delete
        const toDelete_purchases = purchases.filter((purchase) => purchase.productID === productID);
        let arr_purchaseID = []
        toDelete_purchases.forEach(purchase => {
            arr_purchaseID.push(purchase.id)
        });

        // Delete product's related data from the "Purchased" table in purchaseReducer
        dispatch(deletePurchase(arr_purchaseID));

        // Delete product's related data from the "Purchased" table in firebase firestore DB
        const promises = toDelete_purchases.map((docId) => deleteDoc(doc(db, "purchases", docId.id)))
        await Promise.all(promises);

        if (pathName === '/customers/edit-product') {
            navigate('/customers');
        } else if (pathName === '/products/edit-product') {
            navigate(-1);
        } else {
            navigate('/');
        }
    }

    const handleCancel = () => {
        if (pathName === '/customers/edit-product') {
            navigate('/customers');
        } else if (pathName === '/products/edit-product') {
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
        const desire_Product = products.find((product) => product.id === productID);
        setProduct(desire_Product);
    }, [productID]);

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", mt: 5, p: 1 }}>
                <TableContainer sx={{ display: 'flex', justifyContent: "right" }}>
                    <DisabledByDefaultIcon color="error" cursor='pointer' onClick={(e) => handleClose(e)} />
                </TableContainer>
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
                                autoComplete="name"
                                id="name"
                                label="Name"
                                name="name"
                                value={product?.name || ''}
                                autoFocus
                                inputProps={{
                                    maxLength: 16
                                }}
                                onChange={(e) => handleInput(e)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                fullWidth
                                autoComplete="price"
                                id="price"
                                label="Price"
                                name="price"
                                value={product?.price || ''}
                                inputProps={{
                                    maxLength: 6
                                }}
                                onChange={(e) => handleInput(e)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                fullWidth
                                autoComplete="quantity"
                                id="quantity"
                                label="Quantity"
                                name="quantity"
                                value={product?.quantity || ''}
                                inputProps={{
                                    maxLength: 6
                                }}
                                onChange={(e) => handleInput(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                autoComplete="description"
                                id="description"
                                label="Description"
                                name="description"
                                value={product?.description || ''}
                                inputProps={{
                                    maxLength: 100
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
                            onClick={() => handleDalete()}
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
                                customers.filter((customer) =>
                                    purchases.find(purchase =>
                                        purchase.productID === productID &&
                                        purchase.customerID === customer.id
                                    ))
                            }

                            modelTarget={pathName === '/products/edit-product' ? 'products' : 'customers'}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default EditProductNestedPageComp