import { useEffect, useState } from 'react';
import { Grid, Paper, Icon, useMediaQuery, Box } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import SliderComp from '../components/Slider';
import { red } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import RevenueCardComp from '../components/RevenueCard';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import CategoryIcon from '@mui/icons-material/Category';
import AccountCircleTwoTone from '@mui/icons-material/AccountCircleTwoTone';
import { submitProductFail } from '../redux/actions/productActions';
import LinearProgressComp from '../components/LinearProgress';
import AlertErrorComp from '../components/AlertError';

function ProductsPageComp() {
    const purchases = useSelector((state => state.purchaseReducer.purchases));
    const { userLogin } = useSelector((state) => state.userLoginReducer);
    const { loading: productsLoad, error: productsError, products } = useSelector((state) => state.productReducer);

    const dispatch = useDispatch();

    const [totalPurchased, setTotalPurchased] = useState(0);
    const [amountSale, setAmountSale] = useState(0);
    const [detectRender, setDetectRender] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    const theme = useTheme();
    const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));
    const blockSX = {
        p: 2.5,
        borderLeft: '1px solid ',
        borderBottom: '1px solid ',
        borderLeftColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[200],
        borderBottomColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[200]
    };

    const handleSubmitError = () => {
        dispatch(submitProductFail());
        if (location['pathname'] === '/customers/edit-product' || location['pathname'] === '/customers/edit-product') {
            navigate('/customers');
        } else {
            navigate('/products');
        }
    }

    useEffect(() => {
        // Group the Purchases based on their productID
        const groupByProductID = purchases?.reduce((acc, current) => {
            acc[current.productID] = acc[current.productID] ? [...acc[current.productID], current] : [current];
            return acc
        }, {});
        const total = purchases?.length
        setTotalPurchased(total)
        const amount = products?.filter((product) =>
            purchases?.find(purchase => purchase.productID === product.id))
            .reduce((acc, current) => (acc + groupByProductID[current.id].length * current.price), 0);

        setAmountSale(amount)
    }, [products, purchases])

    useEffect(() => {
        if (location['pathname'] === '/products') {
            setDetectRender(false);
        } else {
            setDetectRender(true);
        }
    }, [location['pathname']]);

    return (
        <Box width={'100%'}>
            {
                productsLoad
                &&
                <LinearProgressComp />
            }
            <Grid container component={Paper} elevation={6} sx={{ display: 'flow', justifyContent: "center", height: 'auto', minHeight: '100vh', p: 0, pb: 5 }}>
                <Grid container sx={{ display: 'flex', justifyContent: "center", p: 0 }}>
                    {
                        productsError
                        &&
                        location['pathname'] === '/products'
                        &&
                        <AlertErrorComp title={'Products Error'} content={productsError} callbackSubmitError={handleSubmitError} />
                    }{
                        !detectRender
                        &&
                        !productsError
                        &&
                        <Grid container sx={{ display: 'flex', justifyContent: "center", mt: 1, pl: 3, pr: 3 }}>
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
                            <Grid item xs={12} lg={4} textAlign={'left'}>
                                <RevenueCardComp
                                    primary="Number Of Products"
                                    secondary={products.length}
                                    content="Products on store"
                                    iconPrimary={CategoryIcon}
                                    color={theme.palette.warning.main}
                                />
                            </Grid>
                        </Grid>
                    }{
                        !detectRender
                        &&
                        !productsError
                        &&
                        <Grid item xs={12}>
                            {
                                userLogin.role === 'admin'
                                &&
                                <Icon
                                    onClick={() => navigate('/products/new-product')}
                                    sx={{ color: red[500], fontSize: 30, cursor: 'pointer' }}
                                >
                                    add_circle
                                </Icon>}
                        </Grid>
                    }{
                        !detectRender
                        &&
                        !productsError
                        &&
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", mb: 10 }}>
                            <Box sx={{ width: '90%', pt: 1 }}>
                                <SliderComp productsToSlide={products} sourcePage={'products'} />
                            </Box>
                        </Grid>
                    }{
                        detectRender
                        &&
                        userLogin?.role === 'admin'
                        &&
                        <Outlet />
                    }
                </Grid>
            </Grid>
        </Box>
    )
}

export default ProductsPageComp