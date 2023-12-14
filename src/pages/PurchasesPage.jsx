import { useState, useEffect, useCallback } from 'react'
import { Grid, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Box } from '@mui/material';
import { useSelector } from "react-redux";
import AutoCompleteComp from '../components/AutoComplete';
import DateFieldComp from '../components/DateField';
import { cyan, blue } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import moment from 'moment';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover
    },
    "&:last-child td, &:last-child th": {
        border: 1
    },
    '&:hover': {
        border: `2px solid ${cyan[100]}`,
    },
    [`&.${Table.root}`]: {
        borderRadius: "100px"
    }
}));


function PurchasesPageComp() {
    const products = useSelector((state => state.productReducer.products));
    const customers = useSelector((state => state.customerReducer.customers));
    const purchases = useSelector((state => state.purchaseReducer.purchases));

    const [originPurchasrs, setOriginPurchasrs] = useState([]);
    const [localPurchases, setLocalPurchases] = useState([]);
    const [inputValue, setInputValue] = useState({ productName: '', customerName: '', dateInput: '' });

    const handleSearchProduct = useCallback(
        (value) => {
            if (value === null) {
                setInputValue({ ...inputValue, productName: '' });
            } else {
                setInputValue({ ...inputValue, productName: value.label });
            }
        }, [inputValue]
    )

    const handleSearchCustomer = useCallback(
        (value) => {
            if (value === null) {
                setInputValue({ ...inputValue, customerName: '' });
            } else {
                setInputValue({ ...inputValue, customerName: value.label });
            }
        },
        [inputValue]
    )

    const handleSearchDate = useCallback(
        (dateInput) => {
            setInputValue({ ...inputValue, dateInput });
        },
      [inputValue]
    )
    
    const handleSearch = () => {
        console.log('inputValue = ', inputValue);
        let filterTable = originPurchasrs;
        if (inputValue.productName !== '' || inputValue.customerName !== '' || inputValue.dateInput) {
            filterTable = originPurchasrs.filter((purchase) => {
                const purchaseDate = moment(new Date(purchase.date)).format('DD/MM/YYYY');
                const inputDate = moment(new Date(inputValue?.dateInput['$d'] || '')).format('DD/MM/YYYY');
                return purchase.productName === inputValue.productName ||
                    purchase.customerName === inputValue.customerName ||
                    purchaseDate === inputDate
            });
            setLocalPurchases(filterTable);
        } else {
            filterTable = originPurchasrs
            setLocalPurchases(filterTable);
        }
    }

    // Set the origin and local purchases every time that the (whenever the) purchased state changes
    useEffect(() => {
        const mapPurchases = purchases?.map((purchase) => {
            return {
                ...purchase,
                productName: products?.find((product) => product.id === purchase.productID)?.name,
                customerName: customers?.find(customer => customer.id === purchase.customerID)?.firstName + ' ' +
                    customers?.find(customer => customer.id === purchase.customerID)?.lastName,
            }
        });
        const sortPurchases = mapPurchases?.slice().sort((a, b) => b.orderNumber - a.orderNumber)
        setOriginPurchasrs(sortPurchases);
        setLocalPurchases(sortPurchases);

    }, [purchases])

    return (
        <Box width={'100%'}>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flow', justifyContent: "center", height: 'auto', minHeight: '100vh', pb: 5, p: 2 }}>
                <Grid container justifyContent="center" alignItems="center">
                    <AutoCompleteComp callbackLabelProductInput={handleSearchProduct} modelTarget={'products'} data={products} />
                    <AutoCompleteComp callbackLabelCustomerInput={handleSearchCustomer} modelTarget={'customers'} data={customers} />
                    <Grid item xs={8} sm={3} sx={{ display: 'flex', justifyContent: "center" }}>
                        <DateFieldComp callbackDateInput={handleSearchDate} />
                    </Grid>
                    <Grid item xs={12} sm={12} mt={1}>
                        <Button variant="contained" color="secondary" onClick={() => handleSearch()}>
                            Search
                        </Button>
                    </Grid>
                </Grid>
                <Grid container>
                    <Box sx={{ overflow: "auto", display: 'flex', justifyContent: "center" }}>
                        <Box sx={{ width: "80%", display: "table", tableLayout: "fixed" }}>
                            <Table sx={{ mt: 5 }} aria-label="simple table">
                                <TableHead>
                                    <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0, bgcolor: blue[100], fontWeight: 'bold' } }}>
                                        <TableCell align='center'>ID</TableCell>
                                        <TableCell align='center'>Product</TableCell>
                                        <TableCell align="center">Customer</TableCell>
                                        <TableCell align="center">Order Number</TableCell>
                                        <TableCell align="center">Purchased Date</TableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        localPurchases?.map((purchase, index) => (
                                            <StyledTableRow
                                                key={purchase.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                hover
                                            >
                                                <TableCell component="th" scope="row" align="center">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {purchase.productName}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {purchase.customerName}
                                                </TableCell>
                                                <TableCell align="center">{purchase.orderNumber}</TableCell>
                                                <TableCell align="center">{moment(new Date(purchase.date)).format('DD/MM/YYYY')}</TableCell>
                                            </StyledTableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default PurchasesPageComp