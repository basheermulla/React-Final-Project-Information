import { useEffect, useState } from 'react'
import {
    Card, CardMedia, CardContent, Typography, Button, CardActions, Grid, Paper, Box, Container
} from '@mui/material';
import { red, purple } from '@mui/material/colors';
import { AddShoppingCart } from '@mui/icons-material';
import imgCard from '../assets/TV_1.png'
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import PageTitleComp from '../components/PageTitle';
import SliderComp from '../components/Slider';

const input = [
    { id: 1, keyOne: "valueOne", keyTwo: "valueTwo" },
    { id: 2, keyOne: "valueOn", keyTwo: "valueTw" },
    { id: 3, keyOne: "valueO", keyTwo: "valueT" },
    { id: 4, keyOne: "value", keyTwo: "value" }
];


function HomePageComp() {
    const products = useSelector((state => state.productReducer.products));
    const purchases = useSelector((state => state.purchaseReducer.purchases));

    const [selectedMovie, setSelectedMovie] = useState(-1);
    const [newProducts, setNewProducts] = useState([]);
    const [topSellingProducts, setTopSellingProducts] = useState([]);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        // Group the Purchases based on their productID
        console.log(purchases);
        const groupByProductID = purchases.reduce((acc, current) => {
            acc[current.productID] = acc[current.productID] ? [...acc[current.productID], current] : [current];
            return acc
        }, {});

        const sortedProductsByNew = products.slice().sort((a, b) => b.published - a.published).slice(0, 2);
        setNewProducts(sortedProductsByNew);

        const sortedProductsByTopCelling = products.slice().sort((a, b) => groupByProductID[b.id]?.length - groupByProductID[a.id]?.length).slice(0, 2);
        setTopSellingProducts(sortedProductsByTopCelling);
        console.log(sortedProductsByTopCelling);
    }, [products]);

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", p: 2, pb: 5 }}>
                <PageTitleComp titleName={'NEW PRODUCTS'} />
                <Container sx={{ mt: 2, mb: 10 }} >
                    {selectedMovie /*!== -1*/ && <SliderComp initialSlide={selectedMovie} productsToSlide={newProducts} sourcePage={'home'} />}
                </Container>
                <PageTitleComp titleName={'TOP SELLING'} />
                <Container sx={{ mt: 2 }} >
                    {selectedMovie /*!== -1*/ && <SliderComp initialSlide={selectedMovie} productsToSlide={topSellingProducts} sourcePage={'home'} />}
                </Container>
                <Container sx={{ mt: 2 }} >
                    <Outlet />
                </Container>
            </Grid>
        </>
    )
}

export default HomePageComp
