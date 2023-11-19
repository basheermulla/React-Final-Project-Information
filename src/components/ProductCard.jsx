import { useState } from 'react'
import {
    Box, Typography
} from '@mui/material';

function ProductCardComp() {

    return (
        <>
            <Box xs={{ display: 'flex', justifyContent: "center" }} >
                <Typography gutterBottom variant="h3" component="div"> Product Card Comp </Typography>
            </Box>
        </>
    )
}

export default ProductCardComp