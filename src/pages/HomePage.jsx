import { useEffect, useMemo, useState } from 'react'
import { Box, Grid, Paper } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import PageTitleComp from '../components/PageTitle';
import SliderComp from '../components/Slider';
import { submitProductFail } from '../redux/actions/productActions';
import { submitCustomerFail } from '../redux/actions/customerActions';
import { submitPurchaseFail } from '../redux/actions/purchaseActions';
import LinearProgressComp from '../components/LinearProgress';
import AlertErrorComp from '../components/AlertError';
import { logout } from '../redux/actions/userActions';

function HomePageComp() {
    const { userLogin } = useSelector((state) => state.userLoginReducer);

    const { loading: productsLoad, error: productsError, products } = useSelector((state) => state.productReducer);
    const { loading: customersLoad, error: customersError, customers } = useSelector((state) => state.customerReducer);
    const { loading: purchasesLoad, error: purchasesError, purchases } = useSelector((state) => state.purchaseReducer);
    const { loading: usersLoad, error: usersError, users } = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const [detectRender, setDetectRender] = useState(true);

    const navigate = useNavigate()
    const location = useLocation();

    const handleSubmitError = () => {
        dispatch(submitProductFail());
        dispatch(submitCustomerFail());
        dispatch(submitPurchaseFail());
        dispatch(logout());
    }
    // Sorte By New Products 
    const new_products = useMemo(() => {
        const sortByNewProducts = products
            ?.slice()
            .sort((a, b) => b.published - a.published)
            .slice(0, 4);
        return sortByNewProducts
    }
        , [products]
    )

    // Sorte By Top Selling 
    const top_selling = useMemo(() => {
        // Group the Purchases based on their productID
        let groupByProductID = [];
        if (purchases) {
            groupByProductID = purchases?.reduce((acc, current) => {
                acc[current.productID] = acc[current.productID] ? [...acc[current.productID], current] : [current];
                return acc
            }, {});
        }
        if (products) {
            const sortByTopSelling = products
                .filter((product) => groupByProductID[product.id])
                .slice()
                .sort((a, b) => groupByProductID[b.id]?.length - groupByProductID[a.id]?.length)
                .slice(0, 4);

            return sortByTopSelling
        }
    }
        , [products]
    )

    useEffect(() => {
        if (location['pathname'] === '/') {
            setDetectRender(false);
        } else {
            setDetectRender(true);
        }
    }, [location['pathname']]);

    return (
        <Box width={'100%'}>
            {
                (productsLoad || customersLoad || purchasesLoad || usersLoad)
                &&
                <LinearProgressComp />
            }
            <Grid container component={Paper} elevation={6} sx={{ display: 'flow', justifyContent: "center", height: 'auto', minHeight: '100vh', p: 0, pb: 5 }}>
                <Grid container sx={{ display: 'flex', justifyContent: "center", p: 0 }}>
                    {
                        (productsError || customersError || purchasesError || usersError)
                        &&
                        <AlertErrorComp title={'Home Page Error'} content={productsError || customersError || purchasesError || usersError} callbackSubmitError={handleSubmitError} />
                    }{
                        !detectRender
                        &&
                        !productsError
                        &&
                        !customersError
                        &&
                        !purchasesError
                        &&
                        !usersError
                        &&
                        <>
                            <Grid container sx={{ width: '95%' }}>
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", pt: 2 }}>
                                    <PageTitleComp titleName={'New Products'} />
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", mb: 10 }}>
                                    <Box sx={{ width: '90%', pt: 1 }}>
                                        <SliderComp productsToSlide={new_products} sourcePage={'Home'} />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center" }}>
                                    <PageTitleComp titleName={'Top Selling'} />
                                </Grid>

                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", mb: 10 }}>
                                    <Box sx={{ width: '90%', pt: 1 }}>
                                        <SliderComp productsToSlide={top_selling} sourcePage={'Home'} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </>
                    }{
                        detectRender
                        &&
                        <Grid item xs={12} sx={{ height: '100vh' }}>
                            {userLogin?.role === 'admin' && <Outlet />}
                        </Grid>
                    }
                </Grid>
            </Grid>
        </Box>
    )
}

export default HomePageComp