import { useEffect, useState } from 'react'
import {
    Typography, CardMedia, Button, Table, TableHead, TableRow, TableCell, TableBody, Stack, Avatar, TableContainer
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

function BasicTableComp({ data, model }) {

    const navigate = useNavigate();

    useEffect(() => {
        console.log(data);
    }, [data])

    return (
        <>
            <TableContainer sx={{ display: 'flex', justifyContent: "center", m: 2 }} >
                <Table aria-label="collapsible table" sx={{ border: 0 }}>
                    <TableHead>
                        <TableRow sx={{ '& > *': { borderBottom: 0, bgcolor: blue[100], fontSize: 15, fontWeight: 'bold' } }}>
                            <TableCell component="th" scope="row" align="center" width='10%' > ID </TableCell>
                            <TableCell align="center" width='30%'> Icon </TableCell>
                            <TableCell align="center" width='60%'> Name </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">
                                    {index + 1}
                                </TableCell>
                                <TableCell align="center" sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 60, height: 60, }} image={item.src}
                                        alt="Live from space album cover"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {model === 'customers'
                                        ?
                                        <LinkRouter
                                            to={'/products/edit-product'} state={{ product: item }}
                                        >
                                            {item.name}
                                        </LinkRouter>
                                        :
                                        <LinkRouter
                                            to={'/customers/edit-customer'} state={{ customer: item }}
                                        >
                                            {item.firstName + ' ' + item.lastName}
                                        </LinkRouter>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default BasicTableComp