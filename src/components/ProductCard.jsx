import { useEffect, useState } from 'react';
import {
    Box, Typography, Card, CardMedia, CardContent, CardActions, Button, Grid, Paper, makeStyles
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { purple, blue, grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { Link as LinkRouter, useLocation, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';

const CardInfo = styled(CardContent)(({ theme }) => ({
    '&:last-child': {
        paddingBottom: theme.spacing(2),
    },
    stretch: {
        height: 'calc(100% - 20px)',
        border: "1px solid red"
    }
}));

function ProductCardComp({ product, sourcePage }) {
    const { userLogin } = useSelector((state) => state.userLoginReducer);
    const navigate = useNavigate();

    return (
        <>
            <Card sx={{ maxWidth: 250, minHeight: 520, display: 'flex', flexDirection: 'column', }}>
                <Box sx={{ position: 'relative' }}>
                    {sourcePage === 'products' ?
                        <CardMedia
                            component="img"
                            height='200px'
                            image={product.src}
                            alt={product.name}
                            sx={{ cursor: () => userLogin.role === 'admin' ? 'pointer' : 'auto' }}
                            onClick={(e) => userLogin.role === 'admin' ? navigate('bought-customers', { state: { productID: product.id } }) : null}
                        />
                        :
                        <CardMedia
                            component="img"
                            height='200px'
                            image={product.src}
                            alt={product.name}
                        />
                    }
                </Box>
                <Grid container display='grid' height='320px'
                >
                    <CardContent sx={{ justifyContent: 'center' }}>
                        <Typography variant="h5" gutterBottom component="div" fontWeight='bold'>
                            {sourcePage === 'products' ?
                                <LinkRouter
                                    to={userLogin.role === 'admin' ? '/products/edit-product' : '#'}
                                    state={{ productID: product.id }}
                                    style={{ pointerEvents: userLogin.role === 'admin' ? '' : 'none' }}
                                >
                                    <strong>{product.name}</strong>
                                </LinkRouter>
                                :
                                product.name
                            }

                        </Typography>
                        <Typography variant="h6" gutterBottom component="div" color={blue[500]} fontWeight='bold'>
                            {product.price} {String.fromCharCode(0x20aa)}
                        </Typography>
                        <Typography mb={0} variant="subtitle1" gutterBottom component="div" color={purple[500]} fontWeight='bold'>
                            [{product.quantity}]
                        </Typography>
                        <Typography variant="p" gutterBottom component="div" color={grey[500]}>
                            {product.description}
                        </Typography>
                    </CardContent>
                    {
                        userLogin.role === 'admin' && <CardActions sx={{ justifyContent: 'center', alignItems: 'end' }}>
                            {sourcePage === 'products' ?
                                <Button
                                    disabled={product.quantity > 0 ? false : true}
                                    type="button"
                                    variant="contained"
                                    color='error'
                                    startIcon={<AddIcon />}
                                    sx={{ borderRadius: 5 }}
                                    onClick={() => {
                                        navigate('/products/purchase-product', { state: { productID: product.id } })
                                    }}
                                >
                                    Add
                                </Button>
                                :
                                <Button
                                    disabled={product.quantity > 0 ? false : true}
                                    type="button"
                                    variant="contained"
                                    color='error'
                                    startIcon={<AddIcon />}
                                    sx={{ borderRadius: 5 }}
                                    onClick={() => {
                                        navigate('/purchase-product', { state: { productID: product.id } })
                                    }}
                                >
                                    Add
                                </Button>
                            }

                        </CardActions>
                    }
                </Grid>
            </Card>
        </>
    )
}

export default ProductCardComp