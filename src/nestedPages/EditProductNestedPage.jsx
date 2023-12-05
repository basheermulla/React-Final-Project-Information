import { useEffect, useState } from 'react'
import { Box, Grid, TextField, Button, Paper, Stack, Avatar, TableContainer, LinearProgress, CircularProgress, Alert, AlertTitle } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import { deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useSelector, useDispatch } from "react-redux";
import {
    updateProductRequest,
    updateProductSuccess,
    updateProductFail,
    deleteProductRequest,
    deleteProductSuccess,
    deleteProductFail,
    submitProductFail
} from '../redux/actions/productActions';
import { deletePurchaseSuccess } from '../redux/actions/purchaseActions';
import UpdateIcon from '@mui/icons-material/Update';
import BasicTableComp from '../components/BasicTable';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

function EditProductNestedPageComp() {
    const customers = useSelector((state => state.customerReducer.customers));
    const purchases = useSelector((state => state.purchaseReducer.purchases));
    const { userLogin } = useSelector((state) => state.userLoginReducer);
    const { loading, error: showError_UpdateProduct, products } = useSelector((state) => state.productReducer);
    const dispatch = useDispatch();

    const [productID, setProductID] = useState(useLocation().state.productID);
    const [pathName, setPathName] = useState(useLocation().pathname)
    const [product, setProduct] = useState({});

    const navigate = useNavigate();
    const location = useLocation();

    const handleInput = (event) => {
        let { name, value } = event.target;
        value = isNaN(value) ? value : +value;
        setProduct({ ...product, [name]: value })
    }

    const handleSubmit = async (event) => {
        dispatch(updateProductRequest())
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        const firestoreUpdateDoc = async () => {
            const updateProductDB = { ...product };
            delete updateProductDB['id'];
            await updateDoc(doc(db, 'product', product.id), updateProductDB);
        }

        const [result] = await Promise.allSettled([firestoreUpdateDoc()])
        if (result.status === 'fulfilled') {
            console.log(result);
            dispatch(updateProductSuccess(product));
            if (pathName === '/customers/edit-product') {
                navigate('/customers');
            } else if (pathName === '/products/edit-product') {
                navigate(-1);
            } else {
                navigate('/');
            }
        } else {
            console.log(result.reason);
            dispatch(updateProductFail(result.reason));
        }
    }

    // Delete product from firebase firestore DB, then delete from productReducer
    const handleDelete = async () => {
        dispatch(deleteProductRequest());

        const firestoreDeleteProductDoc = async () => {
            await deleteDoc(doc(db, 'products', product.id));
        }

        let toDelete_purchases = [];
        const firestoreDeletePurchaseDoc = async () => {
            // Generate Purchased Arr to Delete
            toDelete_purchases = purchases.filter((purchase) => purchase.productID === productID);

            // Delete product's related data from the "Purchased" table in firebase firestore DB
            const promises = toDelete_purchases.map((docId) => deleteDoc(doc(db, "purchases", docId.id)))
            await Promise.all(promises);
        }

        const [res_DeleteProduct, res_DeletePurchases] = await Promise.allSettled(
            [
                firestoreDeleteProductDoc(),
                firestoreDeletePurchaseDoc()
            ]
        )
        const res_All = [res_DeleteProduct, res_DeletePurchases]
        const isPromiseRejected = res_All.find((promise) => promise.status === 'rejected');
        console.log(res_All);
        console.log(isPromiseRejected);
        if (!isPromiseRejected) {
            console.log(res_DeleteProduct);
            dispatch(deleteProductSuccess(productID));

            // Delete product's related data from the "Purchased" table in purchaseReducer
            let arr_purchaseID = []
            toDelete_purchases.forEach(purchase => {
                arr_purchaseID.push(purchase.id)
            });
            dispatch(deletePurchaseSuccess(arr_purchaseID));
            if (pathName === '/customers/edit-product') {
                navigate('/customers');
            } else if (pathName === '/products/edit-product') {
                navigate(-1);
            } else {
                navigate('/');
            }
        } else if (res_DeleteProduct.status === 'fulfilled') {
            console.log(res_All);
            // We add the product again after deleting him, 
            // Due to the fact that the Promise.allSettled fell through
            const addProductDB = { ...product };
            delete addProductDB['id'];
            await setDoc(doc(db, "products", product.id), addProductDB);
            dispatch(deleteProductFail(isPromiseRejected.reason));
            // dispatch(deletePurchaseFail(isPromiseRejected.reason));
        } else if (res_DeletePurchases.status === 'fulfilled') {
            console.log(res_All);
            // We add  the product purchases after deleting them,  
            // Due to the fact that the Promise.allSettled fell through
            toDelete_purchases.forEach(async (purchase) => {
                const addPurchaseDB = { ...purchase };
                delete addPurchaseDB['id'];
                await setDoc(doc(db, "purchases", purchase.id), addPurchaseDB);
            });
            dispatch(deleteProductFail(isPromiseRejected.reason));
        } else {
            dispatch(deleteProductFail(isPromiseRejected.reason));
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
        if (pathName === '/customers/edit-product') {
            navigate('/customers');
        } else if (pathName === '/products/edit-product') {
            navigate(-1);
        } else {
            navigate('/');
        }
    }

    const handleSubmitError = () => {
        dispatch(submitProductFail());
        if (pathName === '/customers/edit-product') {
            navigate('/customers');
        } else if (pathName === '/products/edit-product') {
            navigate(-1);
        } else {
            navigate('/');
        }
    }

    useEffect(() => {
        const desire_Product = products.find((product) => product.id === productID);
        setProduct(desire_Product);
    }, [productID]);

    useEffect(() => {
        if (!userLogin) {
            navigate('/login')
        }
    }, [])

    return (
        <Box sx={{ width: '100%' }}>
            {
                loading
                &&
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            }
            {
                showError_UpdateProduct
                &&
                <Grid container sx={{ mt: 3 }}>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                        <Alert severity="error" sx={{ width: '90%', display: 'flex', justifyContent: "center" }}>
                            <Grid item xs={12}>
                                <AlertTitle sx={{ textAlign: 'left' }}>
                                    <strong>Edit Product Error</strong>
                                </AlertTitle>
                            </Grid>
                            <strong>{showError_UpdateProduct}</strong>
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
                !showError_UpdateProduct
                &&
                <Grid container component={Paper} elevation={0} sx={{ display: 'flex', justifyContent: "center", p: 1 }}>
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
                                    customers?.filter((customer) =>
                                        purchases?.find(purchase =>
                                            purchase.productID === productID &&
                                            purchase.customerID === customer.id
                                        ))
                                }

                                modelTarget={pathName === '/products/edit-product' ? 'products' : 'customers'}
                            />
                        </Box>
                    </Grid>

                </Grid>
            }
        </Box>
    )
}

export default EditProductNestedPageComp