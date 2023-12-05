import { useEffect, useState } from 'react'
import { Alert, AlertTitle, Avatar, Box, Button, CardContent, Container, Grid, LinearProgress, Paper, Stack, TableContainer } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import AutoCompleteComp from '../components/AutoComplete';
import { blue, grey } from '@mui/material/colors';
import { AddShoppingCart } from '@mui/icons-material';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { AddPurchaseRequest, AddPurchaseSuccess, AddPurchaseFail, submitPurchaseFail } from '../redux/actions/purchaseActions';
import { updateProductQuantityRequest, updateProductQuantitySuccess, updateProductQuantityFail } from '../redux/actions/productActions';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

function PurchaseProductNestedPageComp() {
    const products = useSelector((state => state.productReducer.products));
    const customers = useSelector((state => state.customerReducer.customers));
    const { userLogin } = useSelector((state) => state.userLoginReducer);
    const { loading, error: showError_Addpurchase, purchases } = useSelector((state) => state.purchaseReducer);

    const dispatch = useDispatch();

    const [inputValue, setInputValue] = useState({});

    const { state } = useLocation();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const handleAddProduct = (value) => {
        if (value === null) {
            setInputValue({ ...inputValue, productName: '', productID: '' });
        } else {
            setInputValue({ ...inputValue, productName: value.label, productID: value.id });
        }
    }

    const handleAddCustomer = (value) => {
        if (value === null) {
            setInputValue({ ...inputValue, customerName: '' });
        } else {
            setInputValue({ ...inputValue, customerName: value.label, customerID: value.id });
        }
    }

    const handleSave = async () => {
        dispatch(AddPurchaseRequest());
        dispatch(updateProductQuantityRequest());

        let new_purchase_obj = [];
        const firestoreAddPurchaseDoc = async () => {
            new_purchase_obj = (state.productID)
                ? {
                    customerID: inputValue.customerID,
                    productID: state.productID,
                    date: new Date(),
                    orderNumber: Math.max(...purchases.map(purchase => purchase.orderNumber)) + 1
                }
                :
                {
                    customerID: state.customerID,
                    productID: inputValue.productID,
                    date: new Date(),
                    orderNumber: Math.max(...purchases.map(purchase => purchase.orderNumber)) + 1
                };

            const docRef = await addDoc(collection(db, 'purchases'), new_purchase_obj);
            const docId = docRef.id;
            return docId;
        }

        let product = {};
        const firestoreUpdateProductDoc = async () => {
            product = (state.productID)
                ? products.find((product) => product.id === state.productID)
                : products.find((product) => product.id === inputValue.productID)
            const obj_Firestore = { quantity: product.quantity - 1 };

            await updateDoc(doc(db, 'products', product.id), obj_Firestore);
        }

        const [res_AddPurchase, res_UpdateQuentityProduct] = await Promise.allSettled(
            [
                firestoreAddPurchaseDoc(),
                firestoreUpdateProductDoc()
            ]
        );
        const res_All = [res_AddPurchase, res_UpdateQuentityProduct]
        const isPromiseRejected = res_All.find((promise) => promise.status === 'rejected');
        console.log(isPromiseRejected);
        if (!isPromiseRejected) {
            console.log(res_AddPurchase);
            dispatch(AddPurchaseSuccess({ ...new_purchase_obj, id: res_AddPurchase.value }));
            console.log(res_UpdateQuentityProduct);
            const obj_Redux = { id: product.id, quantity: product.quantity - 1 };
            dispatch(updateProductQuantitySuccess(obj_Redux));
            navigate(-1);

            // If the purchase added to firebase ,but fail to update the product quentity ---> then delete the purchase from firebase
        } else if (res_AddPurchase.status === 'fulfilled') {

            // Delete Purchase

            dispatch(AddPurchaseFail(isPromiseRejected.reason));
            dispatch(updateProductQuantityFail(isPromiseRejected.reason));
        } else if (res_UpdateQuentityProduct.status === 'fulfilled') {
            dispatch(AddPurchaseFail(isPromiseRejected.reason));
            const obj_Firestore = { quantity: product.quantity };
            await updateDoc(doc(db, 'products', product.id), obj_Firestore);
            dispatch(updateProductQuantityFail(isPromiseRejected.reason));
        } else {
            dispatch(AddPurchaseFail(isPromiseRejected.reason));
            dispatch(updateProductQuantityFail(isPromiseRejected.reason));
        }
    }

    const handleClose = () => {
        console.log(pathname);
        if (pathname === '/customers/purchase-product') {
            navigate('/customers');
        } else if (pathname === '/products/purchase-product') {
            navigate('/products');
        } else {
            navigate('/');
        }
    }

    const handleSubmitError = () => {
        dispatch(submitPurchaseFail());
        if (pathname === '/customers/purchase-product') {
            navigate('/customers');
        } else if (pathname === '/products/purchase-product') {
            navigate('/products');
        } else {
            navigate('/');
        }
    }

    useEffect(() => {
        if (!userLogin) {
            navigate('/login')
        }
    }, [])

    return (
        <Box width={'100%'}>
            {
                loading
                &&
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            }
            {
                showError_Addpurchase
                &&
                <Grid container sx={{ mt: 3 }}>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                        <Alert severity="error" sx={{ width: '90%', display: 'flex', justifyContent: "center" }}>
                            <Grid item xs={12}>
                                <AlertTitle sx={{ textAlign: 'left' }}>
                                    <strong>Add Purchase Error</strong>
                                </AlertTitle>
                            </Grid>
                            <strong>{showError_Addpurchase}</strong>
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
                !showError_Addpurchase
                &&
                <Grid container component={Paper} elevation={0} sx={{ display: 'flex', justifyContent: "center", bgcolor: grey[0], p: 1 }}>
                    <TableContainer sx={{ display: 'flex', justifyContent: "right" }}>
                        <DisabledByDefaultIcon color="error" cursor='pointer' onClick={() => handleClose()} />
                    </TableContainer>
                    <Container sx={{ display: 'flex', justifyContent: "center" }} >
                        <Box sx={{ maxWidth: 400, position: "relative", m: 3 }}>
                            <Stack direction="row" spacing={2}>
                                <Avatar sx={{ bgcolor: blue[200], color: 'black', width: 400, height: 60, fontWeight: 'bold' }} variant='square'>Add Product To Customer</Avatar>
                            </Stack>
                            <CardContent >
                                {state.productID ?
                                    <AutoCompleteComp callbackLabelInput={handleAddCustomer} modelTarget={'customers'} data={customers} />
                                    :
                                    <AutoCompleteComp callbackLabelInput={handleAddProduct} modelTarget={'products'} data={products} />
                                }
                            </CardContent>
                            <Grid item xs={12} sm={8} sx={{ display: 'inline-flex', justifyContent: "center" }}>
                                <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    color='primary'
                                    sx={{ m: 1, mt: 3 }}
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    color="error"
                                    sx={{ m: 1, mt: 3 }}
                                    startIcon={<AddShoppingCart />}
                                    onClick={() => handleSave()}
                                >
                                    Add
                                </Button>
                            </Grid>
                        </Box>
                    </Container>
                </Grid>
            }
        </Box>
    )
}

export default PurchaseProductNestedPageComp