import { useEffect, useState } from 'react'
import { Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Container, Icon, Stack, Box, LinearProgress, Alert, AlertTitle, Button } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import RowCollapsibleTableComp from '../components/RowCollapsibleTable';
import { blue, red } from '@mui/material/colors';
import { gridSpacing } from '../utils/constant';
import { submitCustomerFail } from '../redux/actions/customerActions';

function CustomersPageComp() {
    const products = useSelector((state => state.productReducer.products));
    const purchases = useSelector((state => state.purchaseReducer.purchases));
    const { userLogin } = useSelector((state) => state.userLoginReducer);
    const { loading: customersLoad, error: customersError, customers } = useSelector((state) => state.customerReducer);
    const dispatch = useDispatch();

    const [customersWithOtherData, setCustomersWithOtherData] = useState([]);
    const [detectRender, setDetectRender] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmitError = () => {
        console.log('Clock me');
        dispatch(submitCustomerFail());
        if (location['pathname'] === '/customers/edit-product' || location['pathname'] === '/customers/edit-product') {
            navigate('/customers');
        } else {
            navigate('/products');
        }
    }

    useEffect(() => {
        if (!userLogin) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        // Map Purchases with Product Name and Group the Purchases based on their customerID
        const mapReduceToGroupPurchasesByCustomerID = purchases
            ?.map((purchase) => { return { ...purchase, productName: products.find(prod => prod.id === purchase.productID)?.name } })
            .reduce((acc, ele) => { acc[ele.customerID] = acc[ele.customerID] ? [...acc[ele.customerID], ele] : [ele]; return acc }, {})

        // Map customers with the otherData array [products purchsed, product Name]
        const readyDataToDisplay = customers?.map((customer) => {
            return {
                ...customer,
                otherData: mapReduceToGroupPurchasesByCustomerID[customer.id]
            }
        })
        setCustomersWithOtherData(readyDataToDisplay);
    }, [customers, purchases]);

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
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            }
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", p: 0, pb: 5 }}>
                {
                    customersError
                    &&
                    location['pathname'] === '/customers'
                    &&
                    <Grid container sx={{ mt: 3 }}>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                            <Alert severity="error" sx={{ width: '90%', display: 'flex', justifyContent: "center" }}>
                                <Grid item xs={12}>
                                    <AlertTitle sx={{ textAlign: 'left' }}>
                                        <strong>Customers Error</strong>
                                    </AlertTitle>
                                </Grid>
                                <strong>{customersError}</strong>
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
                    !customersError
                    &&
                    <Container>
                        <Grid container spacing={gridSpacing} sx={{ display: 'flex', justifyContent: "center", p: 2 }}>

                            <Grid item xs={12}>
                                {
                                    userLogin.role === 'admin'
                                    &&
                                    <Icon onClick={() => navigate('/customers/new-customer')} sx={{ color: red[500], fontSize: 30, cursor: 'pointer' }} >add_circle</Icon>
                                }
                            </Grid>
                            <Grid item xs={12} sx={{ justifyContent: "center" }}>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow sx={{ '& > *': { borderBottom: 0, bgcolor: blue[100], fontSize: 16, fontWeight: 'bold' } }}>
                                            <TableCell component="th" scope="row" width='5%' />
                                            <TableCell align="center" width='5%' > ID </TableCell>
                                            <TableCell align="center" width='10%'> Icon </TableCell>
                                            <TableCell align="center" width='20%'> Name </TableCell>
                                            <TableCell align="center" width='30%'> City </TableCell>
                                            {
                                                userLogin.role === 'admin'
                                                &&
                                                <TableCell align="center" width='20%'> Add Product </TableCell>
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            customersWithOtherData.map((customer, index) => (
                                                <RowCollapsibleTableComp key={customer.id} ID={index + 1} customer={customer} modelTarget={'customers'} />
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </Grid>


                        </Grid >
                    </Container>
                }
                {
                    detectRender
                    &&
                    <Grid item xs={12}>
                        {userLogin?.role === 'admin' && <Outlet />}
                    </Grid>
                }
            </Grid >
        </Box>
    )
}

export default CustomersPageComp