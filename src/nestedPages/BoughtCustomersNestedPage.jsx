import { useState, useEffect } from 'react'
import {
    Avatar,
    Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import CollapsibleTableComp from '../components/CollapsibleTable';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

function BoughtCustomersNestedPageComp() {
    const customers = useSelector((state => state.customerReducer.customers));
    const products = useSelector((state => state.productReducer.products));
    const purchases = useSelector((state => state.purchaseReducer.purchases));

    const [productID, setProductID] = useState()
    const [customerRows, setCustomerRows] = useState([]);

    const { state } = useLocation();
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/products');
    }

    useEffect(() => {
        setProductID(state.productID);
    }, [state])

    useEffect(() => {
        // Filter purchases By productID and groupBy purchases By customerID
        const filterByProductIDAndGroupByCustomerID = purchases
            .filter((purchase) => purchase.productID === productID)
            .map((purchase) => { return { ...purchase, productName: products.find(prod => prod.id === purchase.productID).name } })
            .reduce((acc, current) => {
                acc[current.customerID] = acc[current.customerID] ? [...acc[current.customerID], current] : [current];
                return acc
            }, {})
        console.log(filterByProductIDAndGroupByCustomerID);

        // Map customers with the otherData array [products purchsed, product Name]
        const readyDataToDisplay = customers
            .filter((customer) => purchases.find(purchase =>
                purchase.customerID === customer.id &&
                purchase.productID === productID))
            .map((customer) => {
                return {
                    ...customer,
                    otherData: filterByProductIDAndGroupByCustomerID[customer.id]
                }
            })
        console.log(readyDataToDisplay);
        setCustomerRows(readyDataToDisplay);
    }, [productID]);

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", mt: 5, p: 1 }}>
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
                            {customerRows.map((row, index) => (
                                <CollapsibleTableComp key={row.id} ID={index + 1} customer={row} AddProduct={true} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    )
}

export default BoughtCustomersNestedPageComp