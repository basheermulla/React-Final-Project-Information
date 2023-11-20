import { useEffect, useState } from 'react';
import {
    Box, Typography, Grid, Paper, Card, CardMedia, CardContent, CardActions, Button
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import { purple, blue, grey } from '@mui/material/colors';
import { AddShoppingCart } from '@mui/icons-material';
import imgCard from '../assets/TV_1.png';
import { useSelector, useDispatch } from "react-redux";
import { collection, getDocs } from 'firebase/firestore';
import db from "../firebase/firebase";

function ProductsPageComp() {
    const products = useSelector((state => state.productReducer.products));
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "products"));
            const products = querySnapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    status: 'UNCHANGED',
                    ...doc.data()
                }
            });
            console.log(products);
            dispatch({ type: 'LOAD_PRODUCTS', payload: products });
        }
        fetchData();
    }, []);

    useEffect(() => {
        console.log('products = ', products);
    })

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", height: '100vh' }}>
                {
                    products.map((product) => {
                        return <Box key={product.id} xs={{ display: 'flex', justifyContent: "center" }} >
                            <Card sx={{ maxWidth: 320, justifyContent: "center", alignItems: 'center', alignContent: 'center', m: 1 }}>
                                <CardMedia sx={{ height: 140 }} image={product.src} title="green iguana" />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div"> {product.name} </Typography>
                                    <Typography variant="h6" color={blue[500]}> Price: {product.price} </Typography>
                                    <Typography variant="h6" color={purple[500]}> Quantity: {product.quantity} </Typography>
                                    <Typography variant="p" color={grey[500]}> Description: {product.description} </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: "center" }}>
                                    <Button variant="contained" color="error" size="small" startIcon={<AddShoppingCart />}>Add</Button>
                                </CardActions>
                            </Card>
                        </Box>
                    })
                }
                <Outlet />
            </Grid>
        </>
    )
}

export default ProductsPageComp