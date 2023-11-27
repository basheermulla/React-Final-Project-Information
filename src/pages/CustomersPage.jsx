import { useEffect, useState } from 'react'
import {
    Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Container, Icon, Stack
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import CollapsibleTableComp from '../components/CollapsibleTable';
import { blue, red } from '@mui/material/colors';
import PageTitleComp from '../components/PageTitle';

function CustomersPageComp() {
    const customers = useSelector((state => state.customerReducer.customers));
    const products = useSelector((state => state.productReducer.products));
    const purchases = useSelector((state => state.purchaseReducer.purchases));

    const [customersWithOtherData, setCustomersWithOtherData] = useState([]);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        console.log(purchases);
        console.log(products);
        const addProductNameToPurchases = purchases.map((pur) => {
            return {
                ...pur,
                productName: products.find(prod => prod.id === pur.productID)?.name
            }
        });

        // Group the Purchases based on their customerID
        var groupByCustomerID = addProductNameToPurchases.reduce((acc, ele) => {
            acc[ele.customerID] = acc[ele.customerID] ? [...acc[ele.customerID], ele] : [ele];
            return acc
        }, {});

        // Map customers with the otherData array [products purchsed, product Name]
        const readyDataToDisplay = customers.map((customer) => {
            return {
                ...customer,
                otherData: groupByCustomerID[customer.id]
            }
        })

        setCustomersWithOtherData(readyDataToDisplay);
    }, []);

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", p: 2, pb: 5 }}>
                <PageTitleComp titleName={'Customers'} />
                <Container sx={{ display: 'flex', justifyContent: "center", mt: 2 }} >
                    <Stack direction="row" spacing={6}>
                        <Icon onClick={() => navigate('/customers/new-customer')} sx={{ color: red[500], fontSize: 30, cursor: 'pointer' }} >add_circle</Icon>
                    </Stack>
                </Container>
                <Container sx={{ display: 'flex', justifyContent: "center", mt: 3 }}>
                    <Table aria-label="collapsible table" sx={{ border: 0 }}>
                        <TableHead>
                            <TableRow sx={{ '& > *': { borderBottom: 0, bgcolor: blue[100], fontSize: 16, fontWeight: 'bold' } }}>
                                <TableCell component="th" scope="row" width='5%' />
                                <TableCell align="center" width='5%' > ID </TableCell>
                                <TableCell align="center" width='10%'> Icon </TableCell>
                                <TableCell align="center" width='20%'> Name </TableCell>
                                <TableCell align="center" width='30%'> City </TableCell>
                                <TableCell align="center" width='20%'> Add Product </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customersWithOtherData.map((customer, index) => (
                                <CollapsibleTableComp key={customer.id} ID={index + 1} customer={customer} modelTarget={'customers'} />
                            ))}
                        </TableBody>
                    </Table>
                </Container>                
                <Container sx={{ mt: 2 }} >
                    <Outlet />
                </Container>
            </Grid >
        </>
    )
}

export default CustomersPageComp