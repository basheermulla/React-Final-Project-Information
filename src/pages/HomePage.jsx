import { useEffect, useState } from 'react'
import { Grid, Paper } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useSelector } from "react-redux";
import PageTitleComp from '../components/PageTitle';
import SliderComp from '../components/Slider';
import { gridSpacing } from '../utils/constant';

function HomePageComp() {
    const products = useSelector((state => state.productReducer.products));
    const purchases = useSelector((state => state.purchaseReducer.purchases));
    const { userLogin } = useSelector((state) => state.userLoginReducer);

    const [newProducts, setNewProducts] = useState([]);
    const [topSellingProducts, setTopSellingProducts] = useState([]);

    useEffect(() => {
        // Group the Purchases based on their productID
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
                <Grid container spacing={gridSpacing} sx={{ display: 'flex', justifyContent: "center", p: 2 }}>
                    <Grid item xs={12}>
                        <PageTitleComp titleName={'New Products'} />
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 10 }}>
                        <SliderComp productsToSlide={newProducts} sourcePage={'home'} />
                    </Grid>
                    <Grid item xs={12}>
                        <PageTitleComp titleName={'Top Selling'} />
                    </Grid>

                    <Grid item xs={12}>
                        <SliderComp productsToSlide={topSellingProducts} sourcePage={'home'} />
                    </Grid>

                    <Grid item xs={12}>
                        {userLogin.role === 'admin' && <Outlet />}
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default HomePageComp