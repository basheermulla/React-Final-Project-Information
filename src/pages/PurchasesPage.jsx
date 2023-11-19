import { useState } from 'react'
import {
    Box, Typography, Grid, Paper
} from '@mui/material';

function PurchasesPageComp() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", height: '100vh' }}>
                <Box xs={{ display: 'flex', justifyContent: "center" }} >
                    <Typography gutterBottom variant="h3" component="div"> Purchases Page Comp </Typography>
                </Box>
            </Grid>
        </>
    )
}

export default PurchasesPageComp
