import { useEffect, useState } from 'react'
import { CardMedia, Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@mui/material';
import { blue } from '@mui/material/colors';
import { Link as LinkRouter, useLocation } from 'react-router-dom';

function BasicTableComp({ data, modelTarget }) {
    const [pathName, setPathName] = useState(useLocation().pathname);

    return (
        <>
            <TableContainer sx={{ display: 'flex', justifyContent: "center", m: 2 }}>
            {console.log('BasicTableComp page')}
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
                                {modelTarget === 'customers' && <TableCell align="center">
                                    {pathName === '/customers/edit-customer'
                                        ?
                                        <LinkRouter
                                            to={'/customers/edit-product'} state={{ productID: item.id }}
                                        >
                                            {item.name}
                                        </LinkRouter>
                                        :
                                        <p
                                            to={'/customers/edit-product'} state={{ productID: item.id }}
                                        >
                                            {item.firstName + ' ' + item.lastName}
                                        </p>}
                                </TableCell>}
                                {modelTarget === 'products' && <TableCell align="center">
                                    {pathName === '/products/edit-product'
                                        ?
                                        <LinkRouter
                                            to={'/products/edit-customer'} state={{ customerID: item.id }}
                                        >
                                            {item.firstName + ' ' + item.lastName}
                                        </LinkRouter>
                                        :
                                        <p
                                            to={'/products/edit-customer'} state={{ customerID: item.id }}
                                        >
                                            {item.name}
                                        </p>}
                                </TableCell>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default BasicTableComp