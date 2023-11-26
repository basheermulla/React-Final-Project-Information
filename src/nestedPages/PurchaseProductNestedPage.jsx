import { useState } from 'react'
import {
    Avatar,
    Box, Button, CardContent, Container, Grid, Paper, Stack
} from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import AutoCompleteComp from '../components/AutoComplete';
import { blue, grey } from '@mui/material/colors';
import { AddShoppingCart } from '@mui/icons-material';
import { addDoc, collection, doc, getDocs } from 'firebase/firestore';
import db from "../firebase/firebase";
import { AddPurchase, getAllPurchase } from '../redux/actions/purchaseActions';

function PurchaseProductNestedPageComp() {
    const products = useSelector((state => state.productReducer.products));
    const purchases = useSelector((state => state.purchaseReducer.purchases));
    const dispatch = useDispatch();

    const [inputValue, setInputValue] = useState({ productName: '', productID: '' });

    const { state } = useLocation();
    const navigate = useNavigate();

    const handleAddProduct = (value) => {
        if (value === null) {
            setInputValue({ ...inputValue, productName: '', productID: '' });
        } else {
            setInputValue({ ...inputValue, productName: value.label, productID: value.id });
        }
    }

    const handleSave = async () => {
        const new_purchase_obj = {
            customerID: state.customerID,
            productID: inputValue.productID,
            date: new Date(),
            orderNumber: Math.max(...purchases.map(purchase => purchase.orderNumber)) + 1
        };
        //dispatch(AddPurchase(new_purchase_obj));
        await addDoc(collection(db, 'purchases'), new_purchase_obj);
        const querySnapshot = await getDocs(collection(db, "purchases"));
        const purchasesFromDB = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                // status: 'UNCHANGED',
                ...doc.data(),
                date: doc.data().date.toDate()
            }
        });
        dispatch(getAllPurchase(purchasesFromDB));
        navigate(-1);
    }

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", bgcolor: grey[0], mt: 5 }}>
                <Container sx={{ display: 'flex', justifyContent: "center" }} >
                    <Box sx={{ maxWidth: 400, position: "relative", m: 3 }}>
                        <Stack direction="row" spacing={2}>
                            <Avatar sx={{ bgcolor: blue[200], color: 'black', width: 400, height: 60, fontWeight: 'bold' }} variant='square'>Add Product To Customer</Avatar>
                        </Stack>
                        <CardContent >
                            <AutoCompleteComp callbackLabelInput={handleAddProduct} modelTarget={'products'} data={products} />
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