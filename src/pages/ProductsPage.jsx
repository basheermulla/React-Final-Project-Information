import { useEffect, useState } from 'react';
import { Grid, Paper, Icon, useMediaQuery } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import SliderComp from '../components/Slider';
import { red } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import RevenueCardComp from '../components/RevenueCard';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import AccountCircleTwoTone from '@mui/icons-material/AccountCircleTwoTone';
import { gridSpacing } from '../utils/constant';


function ProductsPageComp() {
    const products = useSelector((state => state.productReducer.products));
    const purchases = useSelector((state => state.purchaseReducer.purchases));
    const { userLogin } = useSelector((state) => state.userLoginReducer);

    const [totalPurchased, setTotalPurchased] = useState(0);
    const [amountSale, setAmountSale] = useState(0);

    const navigate = useNavigate();

    const theme = useTheme();
    const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));
    const blockSX = {
        p: 2.5,
        borderLeft: '1px solid ',
        borderBottom: '1px solid ',
        borderLeftColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[200],
        borderBottomColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[200]
    };

    useEffect(() => {
        // Group the Purchases based on their productID
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
                <Grid container spacing={gridSpacing} sx={{ display: 'flex', justifyContent: "center", p: 2 }}>
                    <Grid item xs={12} lg={4} textAlign={'left'}>
                        <RevenueCardComp
                            primary="Revenue"
                            secondary={amountSale}
                            content="Depending on the purchase of products"
                            iconPrimary={MonetizationOnTwoToneIcon}
                            color={theme.palette.secondary.main}
                            coin={String.fromCharCode(0x20aa)}
                        />
                    </Grid>
                    <Grid item xs={12} lg={4} textAlign={'left'}>
                        <RevenueCardComp
                            primary="Orders Received"
                            secondary={totalPurchased}
                            content="20% Increase in the last month"
                            iconPrimary={AccountCircleTwoTone}
                            color={theme.palette.primary.main}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {userLogin.role === 'admin' && <Icon onClick={() => navigate('/products/new-product')} sx={{ color: red[500], fontSize: 30, cursor: 'pointer' }} >add_circle</Icon>}
                    </Grid>
                    <Grid item xs={12} sx={{ justifyContent: "center" }}>
                        <SliderComp productsToSlide={products} sourcePage={'products'} />
                    </Grid>
                    <Grid item xs={12}>
                        {userLogin.role === 'admin' && <Outlet />}
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default ProductsPageComp