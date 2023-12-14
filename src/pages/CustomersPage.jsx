import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Container, Icon, Box, Button, useMediaQuery
} from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import RowCollapsibleTableComp from '../components/RowCollapsibleTable';
import { blue, red } from '@mui/material/colors';
import { submitCustomerFail } from '../redux/actions/customerActions';
import AutoCompleteComp from '../components/AutoComplete';
import RevenueCardComp from '../components/RevenueCard';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import CategoryIcon from '@mui/icons-material/Category';
import AccountCircleTwoTone from '@mui/icons-material/AccountCircleTwoTone';
import { useTheme } from '@mui/material/styles';
import LinearProgressComp from '../components/LinearProgress';
import AlertErrorComp from '../components/AlertError';

function CustomersPageComp() {
    const products = useSelector((state => state.productReducer.products));
    const purchases = useSelector((state => state.purchaseReducer.purchases));
    const { userLogin } = useSelector((state) => state.userLoginReducer);
    const { loading: customersLoad, error: customersError, customers } = useSelector((state) => state.customerReducer);
    const dispatch = useDispatch();

    const [totalHighestPurchased, setTotalHighestPurchased] = useState({});
    const [highestAmountSale, setHighestAmountSale] = useState({});
    const [detectRender, setDetectRender] = useState(true);
    const [inputValue, setInputValue] = useState({ customerName: '' });
    const [search, setSearch] = useState("");

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
        dispatch(submitCustomerFail());
        if (location['pathname'] === '/customers/edit-product' || location['pathname'] === '/customers/edit-product') {
            navigate('/customers');
        } else {
            navigate('/products');
        }
    }

    const handleSearchCustomer = useCallback(
        (value) => {
            if (value === null) {
                setInputValue({ ...inputValue, customerName: '' });
            } else {
                setInputValue({ ...inputValue, customerName: value.label });
            }
        },
        [inputValue.customerName]
    )

    const customersToDisplay = useMemo(() => {
        // Map Purchases with Product Name and Group the Purchases based on their customerID
        let mapReduceToGroupPurchasesByCustomerID = [];
        if (purchases) {
            mapReduceToGroupPurchasesByCustomerID = purchases
                ?.map((purchase) => {
                    return {
                        ...purchase, productName: products.find(prod => prod.id === purchase.productID)?.name,
                        price: products.find(prod => prod.id === purchase.productID)?.price
                    }
                })
                .reduce((acc, ele) => { acc[ele.customerID] = acc[ele.customerID] ? [...acc[ele.customerID], ele] : [ele]; return acc }, {})

        }

        // Map customers with the otherData array [products purchsed, product Name]
        if (customers) {
            const readyDataToDisplay = search !== ""
                ? customers
                    ?.filter((customer) => (customer.firstName + ' ' + customer.lastName) === search)
                    ?.map((customer) => {
                        return {
                            ...customer,
                            otherData: mapReduceToGroupPurchasesByCustomerID[customer.id]
                        }
                    })
                : customers
                    ?.map((customer) => {
                        return {
                            ...customer,
                            otherData: mapReduceToGroupPurchasesByCustomerID[customer.id]
                        }
                    })
            return readyDataToDisplay
        }
        highestAmountSale
    }, [customers, purchases, search]
    )

    useEffect(() => {
        if (customers && customersToDisplay) {// Set data for Revenue Cards - [totalHighestPurchased] [highestAmountSale]

            const numOfPurchases = customersToDisplay
                ?.filter((customer) => customer.otherData)
                ?.map((customer) => {
                    return {
                        name: customer.firstName + ' ' + customer.lastName,
                        value: customer.otherData?.length
                    }
                });
            const maxPurchases = numOfPurchases.map((price) => price['value']);
            const max_1 = Math.max(...maxPurchases)
            const getMaxPurchasesCustomer = numOfPurchases.filter((customer) => customer.value === max_1)
            setTotalHighestPurchased(...getMaxPurchasesCustomer)

            const revenuePurchases = customersToDisplay
                ?.filter((customer) => customer.otherData)
                ?.map((customer) => {
                    return {
                        name: customer.firstName + ' ' + customer.lastName,
                        value: customer?.otherData?.reduce((sum, next) => sum + next.price, 0)
                    }
                });
            const maxRevenue = revenuePurchases.map((price) => price['value']);
            const max_2 = Math.max(...maxRevenue)
            const getMaxRevenueCustomer = revenuePurchases.filter((customer) => +customer.value === +max_2)
            setHighestAmountSale(...getMaxRevenueCustomer)
        }
    }, [customersToDisplay])

    useEffect(() => {
        if (location['pathname'] === '/customers') {
            setDetectRender(false);
        } else {
            setDetectRender(true);
        }
    }, [location['pathname']]);

    return (
        <Box width={'100%'}>
            {
                customersLoad
                &&
                <LinearProgressComp />
            }
            <Grid container component={Paper} elevation={6} sx={{ display: 'flow', justifyContent: "center", height: 'auto', minHeight: '100vh', p: 0, pb: 5 }}>
                <Grid container sx={{ display: 'flex', justifyContent: "center", p: 0 }}>
                    {
                        customersError
                        &&
                        location['pathname'] === '/customers'
                        &&
                        <AlertErrorComp title={'Customers Error'} content={customersError} callbackSubmitError={handleSubmitError} />
                    }{
                        !detectRender
                        &&
                        !customersError
                        &&
                        <>
                            <Grid container sx={{ display: 'flow', justifyContent: "center", p: 2 }}>
                                <Grid container sx={{ display: 'flex', justifyContent: "center", mt: 1, pl: 3, pr: 3 }}>
                                    <Grid item xs={12} lg={4} textAlign={'left'}>
                                        <RevenueCardComp
                                            primary="Highest Expenses"
                                            secondary={highestAmountSale?.value}
                                            content={`By - ${highestAmountSale?.name}`}
                                            iconPrimary={MonetizationOnTwoToneIcon}
                                            color={theme.palette.secondary.main}
                                            coin={String.fromCharCode(0x20aa)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={4} textAlign={'left'}>
                                        <RevenueCardComp
                                            primary="Highest Orders"
                                            secondary={totalHighestPurchased?.value}
                                            content={`By - ${totalHighestPurchased?.name}`}
                                            iconPrimary={AccountCircleTwoTone}
                                            color={theme.palette.primary.main}
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={4} textAlign={'left'}>
                                        <RevenueCardComp
                                            primary="Number Of Customers"
                                            secondary={customers.length}
                                            content={"Customers that bought certain product"}
                                            iconPrimary={CategoryIcon}
                                            color={theme.palette.warning.main}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        userLogin?.role === 'admin'
                                        &&
                                        <Icon
                                            onClick={() => navigate('/customers/new-customer')}
                                            sx={{ color: red[500], fontSize: 30, cursor: 'pointer' }}
                                        >
                                            add_circle
                                        </Icon>
                                    }
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", alignItems: 'center', p: 2 }}>
                                    <AutoCompleteComp
                                        callbackLabelCustomerInput={handleSearchCustomer}
                                        modelTarget={'customers'}
                                        data={customers}
                                    />
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => setSearch(inputValue.customerName)}>
                                        Search
                                    </Button>
                                </Grid>
                                <Container>
                                    <Grid item xs={12} sx={{ display: 'flow', justifyContent: "center", p: 2 }}>
                                        <Table aria-label="collapsible table">
                                            <TableHead>
                                                <TableRow sx={{ '& > *': { borderBottom: 0, bgcolor: blue[100], fontSize: 16, fontWeight: 'bold' } }}>
                                                    <TableCell component="th" scope="row" width='5%' />
                                                    <TableCell align="center" width='5%' > ID </TableCell>
                                                    <TableCell align="center" width='10%'> Icon </TableCell>
                                                    <TableCell align="center" width='20%'> Name </TableCell>
                                                    <TableCell align="center" width='30%'> City </TableCell>
                                                    {
                                                        userLogin?.role === 'admin'
                                                        &&
                                                        <TableCell align="center" width='20%'> Add Product </TableCell>
                                                    }
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    customersToDisplay.map((customer, index) => (
                                                        <RowCollapsibleTableComp key={customer.id} ID={index + 1} customer={customer} modelTarget={'customers'} />
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </Grid>
                                </Container>
                            </Grid >
                        </>
                    }{
                        detectRender
                        &&
                        userLogin?.role === 'admin'
                        &&
                        <Outlet />
                    }
                </Grid>
            </Grid >
        </Box>
    )
}

export default CustomersPageComp