import { useState, useRef, useEffect, memo } from 'react'
import {
    Box, Typography, Button, IconButton, Table, TableHead, TableRow, TableCell, TableBody,
    Collapse, Avatar
} from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate, Link as LinkRouter } from 'react-router-dom';
import moment from 'moment';
import { useSelector } from "react-redux";

function RowCollapsibleTableComp({ ID, customer, modelTarget }) {
    const products = useSelector((state => state.productReducer.products));
    const { userLogin } = useSelector((state) => state.userLoginReducer);

    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 0, bgcolor: grey[100], fontSize: 16 } }}>
                {console.log('RowCollapsibleTableComp page')}
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
                    <Avatar
                        sx={{
                            height: 64,
                            width: 64,                            
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                        src={customer?.src}
                    />
                </TableCell>
                <TableCell align="center">
                    {modelTarget === 'customers' ?
                        <LinkRouter
                            to={'/customers/edit-customer'} state={{ customerID: customer.id }}
                        >
                            {customer?.firstName + ' ' + customer?.lastName}
                        </LinkRouter>
                        :
                        <LinkRouter
                            to={'/products/edit-customer'} state={{ customerID: customer?.id }}
                        >
                            {customer?.firstName + ' ' + customer?.lastName}
                        </LinkRouter>
                    }
                </TableCell>
                <TableCell align="center"> {customer?.city} </TableCell>
                {userLogin.role === 'admin' && <TableCell align="center">
                    {modelTarget === 'customers' ?
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                navigate('/customers/purchase-product', { state: { customerID: customer?.id } })
                            }}
                        >
                            Save
                        </Button>
                        :
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                navigate('/products/purchase-product', { state: { customerID: customer?.id } })
                            }}
                        >
                            Save
                        </Button>
                    }
                </TableCell>}
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
                                                {modelTarget === 'customers' ?
                                                    <LinkRouter
                                                        to={'/customers/edit-product'} state={{
                                                            productID: otherDataCustomer.productID
                                                        }}
                                                    >
                                                        {otherDataCustomer.productName}
                                                    </LinkRouter>
                                                    :
                                                    <LinkRouter
                                                        to={'/products/edit-product'} state={{
                                                            productID: otherDataCustomer.productID
                                                        }}
                                                    >
                                                        {otherDataCustomer.productName}
                                                    </LinkRouter>
                                                }
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

export default memo(RowCollapsibleTableComp)