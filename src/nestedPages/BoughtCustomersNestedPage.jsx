import { useState, useEffect } from 'react'
import { Avatar, Box, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import RowCollapsibleTableComp from '../components/RowCollapsibleTable';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

function BoughtCustomersNestedPageComp() {
    const customers = useSelector((state => state.customerReducer.customers));
    const products = useSelector((state => state.productReducer.products));
    const purchases = useSelector((state => state.purchaseReducer.purchases));
    const { userLogin } = useSelector((state) => state.userLoginReducer);
    
    const [productID, setProductID] = useState()
    const [customersWithOtherData, setCustomersWithOtherData] = useState([]);

    const { state } = useLocation();
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/products');
    }

    useEffect(() => {
        setProductID(state.productID);
    }, [state])

    useEffect(() => {
        // Filter purchases By productID 
        // Then, Map Purchases with Product Name and Group the Purchases based on their customerID filterMapReduceToGroupPurchasesByCustomerID
        const filterMapReduceToGroupPurchasesByCustomerID = purchases
            .filter((purchase) => purchase.productID === productID)
            .map((purchase) => { return { ...purchase, productName: products.find(prod => prod.id === purchase.productID).name } })
            .reduce((acc, current) => {
                acc[current.customerID] = acc[current.customerID] ? [...acc[current.customerID], current] : [current];
                return acc
            }, {})

        // Map customers with the otherData array [products purchsed, product Name]
        const readyDataToDisplay = customers
            .filter((customer) => purchases.find(purchase =>
                purchase.customerID === customer.id &&
                purchase.productID === productID))
            .map((customer) => {
                return {
                    ...customer,
                    otherData: filterMapReduceToGroupPurchasesByCustomerID[customer.id]
                }
            });

        setCustomersWithOtherData(readyDataToDisplay);
    }, [productID]);

    useEffect(() => {
        if (!userLogin) {
            navigate('/login')
         }
    }, [])

    return (
        <Box width={'100%'}>
            <Grid container component={Paper} elevation={0} sx={{ display: 'flex', justifyContent: "center", p: 1 }}>
                <TableContainer sx={{ display: 'flex', justifyContent: "right" }}>
                    <DisabledByDefaultIcon color="error" cursor='pointer' onClick={(e) => handleClose(e)} />
                </TableContainer>
                <Stack direction="row" spacing={2} m={3}>
                    <Avatar sx={{ bgcolor: blue[200], color: 'black', width: 400, height: 60, fontSize: 18, fontWeight: 'bold' }} variant='square'>Customers who bought the product</Avatar>
                </Stack>
                <TableContainer sx={{ display: 'flex', justifyContent: "center", m: 2 }} >
                    <Table aria-label="collapsible table" sx={{ border: 0 }}>
                        <TableHead>
                            <TableRow sx={{ '& > *': { borderBottom: 0, bgcolor: blue[100], fontSize: 15, fontWeight: 'bold' } }}>
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
                                <RowCollapsibleTableComp key={customer.id} ID={index + 1} customer={customer} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Box>
    )
}

export default BoughtCustomersNestedPageComp