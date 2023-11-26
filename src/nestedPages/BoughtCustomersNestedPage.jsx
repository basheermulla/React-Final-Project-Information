import { useState, useParams, useEffect } from 'react'
import {
    Avatar,
    Box, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import { purple, blue, grey, cyan } from '@mui/material/colors';
import CollapsibleTableComp from '../components/CollapsibleTable';

function BoughtCustomersNestedPageComp() {
    const customers = useSelector((state => state.customerReducer.customers));
    const products = useSelector((state => state.productReducer.products));
    const purchases = useSelector((state => state.purchaseReducer.purchases));

    const [productID, setProductID] = useState()
    const [customerRows, setCustomerRows] = useState([]);

    const { state } = useLocation();

    useEffect(() => {
        setProductID(state.productID);
    }, [state])

    useEffect(() => {
        // Filter purchases By productID and groupBy purchases By customerID
        const filterByProductIDandgroupByCustomerID = purchases
            .filter((pur) => pur.productID === productID)
            .map((pur) => { return { ...pur, productName: products.find(prod => prod.id === pur.productID).name } })
            .reduce((acc, ele) => {
                acc[ele.customerID] = acc[ele.customerID] ? [...acc[ele.customerID], ele] : [ele];
                return acc
            }, {})
        console.log(filterByProductIDandgroupByCustomerID);
        // Map customers with the otherData array [products purchsed, product Name]
        const readyDataToDisplay = customers.map((customer) => {
            return {
                ...customer,
                otherData: filterByProductIDandgroupByCustomerID[customer.id]
            }
        })
        console.log(readyDataToDisplay);
        setCustomerRows(readyDataToDisplay);
    }, [productID]);

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", mt: 5 }}>
                <Stack direction="row" spacing={2} m={3}>
                    <Avatar sx={{  bgcolor: blue[200], color: 'black', width: 400, height: 60, fontSize: 18, fontWeight: 'bold' }} variant='square'>Customers who bought the product</Avatar>
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