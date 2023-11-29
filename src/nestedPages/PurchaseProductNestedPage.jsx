import { useEffect, useState } from 'react'
import {
    Avatar,
    Box, Button, CardContent, Container, Grid, Paper, Stack, TableContainer, Icon
} from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import AutoCompleteComp from '../components/AutoComplete';
import { blue, grey } from '@mui/material/colors';
import { AddShoppingCart } from '@mui/icons-material';
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import db from "../firebase/firebase";
import { AddPurchase, loadAllPurchase } from '../redux/actions/purchaseActions';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { updateProductQuantity } from '../redux/actions/productActions';

function PurchaseProductNestedPageComp() {
    const products = useSelector((state => state.productReducer.products));
    const customers = useSelector((state => state.customerReducer.customers));
    const purchases = useSelector((state => state.purchaseReducer.purchases));

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
        let new_purchase_obj = [];
        if (state.productID) {
            new_purchase_obj = {
                customerID: inputValue.customerID,
                productID: state.productID,
                date: new Date(),
                orderNumber: Math.max(...purchases.map(purchase => purchase.orderNumber)) + 1
            };
            console.log(new_purchase_obj);
        } else {
            new_purchase_obj = {
                customerID: state.customerID,
                productID: inputValue.productID,
                date: new Date(),
                orderNumber: Math.max(...purchases.map(purchase => purchase.orderNumber)) + 1
            };
            console.log(new_purchase_obj);
        }
        
        dispatch(AddPurchase(new_purchase_obj));
        await addDoc(collection(db, 'purchases'), new_purchase_obj);
        
        let product = {};
        if (state.productID) {
            product = products.find((product) => product.id === state.productID)
            const obj_Redux = { id: product.id, quantity: product.quantity - 1 };
            const obj_Firestore = { quantity: product.quantity - 1 };

            dispatch(updateProductQuantity(obj_Redux));
            await updateDoc(doc(db, 'products', product.id), obj_Firestore);

        } else {
            product = products.find((product) => product.id === inputValue.productID)
            const obj_Redux = { id: product.id, quantity: product.quantity - 1 };
            const obj_Firestore = { quantity: product.quantity - 1 };

            dispatch(updateProductQuantity(obj_Redux));
            await updateDoc(doc(db, 'products', product.id), obj_Firestore);
        }

        navigate(-1);
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

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", bgcolor: grey[0], mt: 5, p: 1 }}>
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
        </>
    )
}

export default PurchaseProductNestedPageComp