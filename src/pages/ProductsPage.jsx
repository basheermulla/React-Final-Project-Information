import { useState } from 'react'
import {
    Box, Typography, Grid, Paper
} from '@mui/material';
import { Outlet } from 'react-router-dom';

function ProductsPageComp() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", height: '100vh' }}>
                <Box xs={{ display: 'flex', justifyContent: "center" }} >
                    <Typography gutterBottom variant="h3" component="div"> Products Page Comp </Typography>
                </Box>

                <Outlet />
            </Grid>
        </>
    )
}

export default ProductsPageComp