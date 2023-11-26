import { useEffect, useState } from 'react'
import {
    Box, Typography, Card, CardMedia, CardContent, CardActions, Button, IconButton, Table, TableHead, TableRow, TableCell, TableBody, Collapse
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { cyan } from '@mui/material/colors';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { AddShoppingCart } from '@mui/icons-material';
import { purple, blue, grey } from '@mui/material/colors';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useLocation, useNavigate, Link as LinkRouter } from 'react-router-dom';
import moment from 'moment';
import { useSelector, useDispatch } from "react-redux";

function CollapsibleTableComp({ ID, customer, AddProduct }) {
    const products = useSelector((state => state.productReducer.products));
    const purchases = useSelector((state => state.purchaseReducer.purchases));

    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        console.log(customer);
    }, [customer])

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 0, bgcolor: grey[100], fontSize: 16 } }}>
                <TableCell component="th" scope="row">
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="center"> {ID} </TableCell>
                <TableCell align="center" sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CardMedia
                        component="img"
                        sx={{ width: 72, height: 72, }} image={customer.src}
                        alt="Live from space album cover"
                    />
                </TableCell>
                <TableCell align="center">
                    <LinkRouter
                        to={'/customers/edit-customer'} state={{ customer: customer }}
                    >
                        {customer.firstName + ' ' + customer.lastName}
                    </LinkRouter>
                </TableCell>
                <TableCell align="center"> {customer.city} </TableCell>
                <TableCell align="center">
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            navigate('/products/purchase-product', { state: { customerID: customer.id } })
                        }}
                    >
                        Save
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Customer's Other Data
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow sx={{ '& > *': { bgcolor: blue[50], fontSize: 14, fontWeight: 'bold' } }}>
                                        <TableCell align="center"> Order Number </TableCell>
                                        <TableCell align="center"> Product Name </TableCell>
                                        <TableCell align="center"> Purchased Date </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customer?.otherData?.map((otherDataCustomer, index) => (
                                        <TableRow key={index} sx={{ '& > *': { fontSize: 14 } }}>
                                            <TableCell align="center">
                                                {otherDataCustomer.orderNumber}
                                            </TableCell>
                                            <TableCell align="center">
                                                <LinkRouter
                                                    to={'/products/edit-product'} state={{
                                                        product: products.find((product) => product.id === otherDataCustomer.productID)
                                                    }}
                                                >
                                                    {otherDataCustomer.productName}
                                                </LinkRouter>
                                            </TableCell>
                                            <TableCell align="center">
                                                {moment(new Date(otherDataCustomer.date)).format('DD/MM/YYYY')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}

export default CollapsibleTableComp