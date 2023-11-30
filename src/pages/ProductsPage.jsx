import { useEffect, useState } from 'react';
import {
    Typography, Grid, Paper, Card, CardContent, Container, Icon, Box, CardMedia, CardActions, Button
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import SliderComp from '../components/Slider';
import { blue, red } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepPurple } from '@mui/material/colors';
import PageTitleComp from '../components/PageTitle';

function ProductsPageComp() {
    const products = useSelector((state => state.productReducer.products));
    const purchases = useSelector((state => state.purchaseReducer.purchases));
    const { loading, error, userLogin } = useSelector((state) => state.userLoginReducer);
    
    const [selectedMovie, setSelectedMovie] = useState(-1);
    const [totalPurchased, setTotalPurchased] = useState(0);
    const [amountSale, setAmountSale] = useState(0);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        // Group the Purchases based on their productID
        console.log(purchases);
        const groupByProductID = purchases.reduce((acc, current) => {
            acc[current.productID] = acc[current.productID] ? [...acc[current.productID], current] : [current];
            return acc
        }, {});

        const total = purchases.length
        setTotalPurchased(total)

        const amount = products.filter((product) =>
            purchases.find(purchase => purchase.productID === product.id))
            .reduce((acc, current) => (acc + groupByProductID[current.id].length * current.price), 0);
        setAmountSale(amount)
    }, [products, purchases])

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", p: 2, pb: 5 }}>
                <PageTitleComp titleName={'Products'} />
                <Container sx={{ display: 'flex', justifyContent: "center", height: 160 }} >
                    <Card sx={{ maxWidth: 300, position: "relative", height: 160, mr: 10 }}>
                        <Stack direction="row" spacing={2}>
                            <Avatar sx={{ bgcolor: deepPurple[500], width: 300, height: 80, fontWeight: 'bold' }} variant='square'>Total Purchased Products</Avatar>
                        </Stack>
                        <CardContent>
                            <Typography variant="h4" gutterBottom component="div" color={blue[500]} fontWeight='bold' >
                                {totalPurchased}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ maxWidth: 300, position: "relative", height: 160 }}>
                        <Stack direction="row" spacing={2}>
                            <Avatar sx={{ bgcolor: deepPurple[500], width: 300, height: 80, fontWeight: 'bold' }} variant='square'>Amount Of Sale</Avatar>
                        </Stack>
                        <CardContent>
                            <Typography variant="h4" gutterBottom component="div" color={blue[500]} fontWeight='bold'>
                                {amountSale} {' '} {String.fromCharCode(0x20aa)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Container>
                <Container sx={{ display: 'flex', justifyContent: "center", mt: 2 }} >
                    <Stack direction="row" spacing={6}>
                        <Icon onClick={() => navigate('/products/new-product')} sx={{ color: red[500], fontSize: 30, cursor: 'pointer' }} >add_circle</Icon>
                    </Stack>
                </Container>
                <Container sx={{ mt: 2 }} >
                    {selectedMovie /*!== -1*/ && <SliderComp initialSlide={selectedMovie} productsToSlide={products} sourcePage={'products'} />}
                </Container>
                <Container sx={{ mt: 2 }} >
                    <Outlet />
                </Container>
            </Grid>
        </>
    )
}

export default ProductsPageComp