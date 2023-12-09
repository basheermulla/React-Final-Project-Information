import { useEffect, useMemo, useState } from 'react'
import { Alert, AlertTitle, Box, Button, Grid, LinearProgress, Paper } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import PageTitleComp from '../components/PageTitle';
import SliderComp from '../components/Slider';
import { submitProductFail } from '../redux/actions/productActions';
import { submitCustomerFail } from '../redux/actions/customerActions';
import { submitPurchaseFail } from '../redux/actions/purchaseActions';

function HomePageComp() {
    const { userLogin } = useSelector((state) => state.userLoginReducer);

    const { loading: productsLoad, error: productsError, products } = useSelector((state) => state.productReducer);
    const { loading: customersLoad, error: customersError, customers } = useSelector((state) => state.customerReducer);
    const { loading: purchasesLoad, error: purchasesError, purchases } = useSelector((state) => state.purchaseReducer);
    const dispatch = useDispatch();

    const [detectRender, setDetectRender] = useState(true);

    const navigate = useNavigate()
    const location = useLocation();

    const handleSubmitError = () => {
        dispatch(submitProductFail());
        dispatch(submitCustomerFail());
        dispatch(submitPurchaseFail());
        navigate('/');
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

    useEffect(() => {
        if (!userLogin) {
            navigate('/login')
        }
    }, [])

    return (
        <Box width={'100%'}>
            {console.log('Home page')}
            {
                (productsLoad || customersLoad || purchasesLoad)
                &&
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            }
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", height: 'auto', minHeight: '100vh', p: 0, pb: 5 }}>
                <Grid container sx={{ display: 'flex', justifyContent: "center", p: 0 }}>
                    {
                        (productsError || customersError || purchasesError)
                        &&
                        <Grid container sx={{ mt: 3 }}>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                                <Alert severity="error" sx={{ width: '90%', display: 'flex', justifyContent: "center" }}>
                                    <Grid item xs={12}>
                                        <AlertTitle sx={{ textAlign: 'left' }}>
                                            <strong>Home Page Error</strong>
                                        </AlertTitle>
                                    </Grid>
                                    <strong>{productsError || customersError || purchasesError}</strong>
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
                        !detectRender
                        &&
                        !productsError
                        &&
                        !customersError
                        &&
                        !purchasesError
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
                    }

                    {
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