import {
    Box, Typography, Card, CardMedia, CardContent, CardActions, Button, Grid, Paper
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { purple, blue, grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { Link as LinkRouter, useLocation, useNavigate } from 'react-router-dom';

const CardInfo = styled(CardContent)(({ theme }) => ({
    '&:last-child': {
        paddingBottom: theme.spacing(2),
    }
}));

function ProductCardComp({ product }) {
    const navigate = useNavigate();

    return (
        <>
            <Grid container sx={{ display: 'flex', justifyContent: "center", p: 2 }}>
                <Card sx={{ maxWidth: 250, minHeight: 520, position: "relative" }}>
                    <Box sx={{ position: 'relative' }}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={product.src}
                            alt={product.name}
                            sx={{ cursor: 'pointer' }}
                            onClick={(e) => navigate('bought-customers', { state: { productID: product.id } })} />
                    </Box>
                    <CardInfo>
                        <Typography variant="h5" gutterBottom component="div">
                            <LinkRouter
                                to={'/products/edit-product'} state={{ productID: product.id }}
                            >
                                {product.name}
                            </LinkRouter>
                        </Typography>
                        <Typography variant="h6" gutterBottom component="div" color={blue[500]}>
                            Price: {product.price}
                        </Typography>
                        <Typography mb={0} variant="subtitle1" gutterBottom component="div" color={purple[500]}>
                            Quantity: {product.quantity}
                        </Typography>
                        <Typography variant="p" gutterBottom component="div" color={grey[500]}>
                            Description: {product.description}
                        </Typography>
                    </CardInfo>
                </Card>
            </Grid>
        </>
    )
}

export default ProductCardComp