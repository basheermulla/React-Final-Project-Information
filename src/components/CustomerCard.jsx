import { useState } from 'react'
import {
    Box, Typography
} from '@mui/material';

function CustomerCardComp() {

    return (
        <>
            <Box xs={{ display: 'flex', justifyContent: "center" }} >
                <Typography gutterBottom variant="h3" component="div"> Customer Card Comp </Typography>
            </Box>
        </>
    )
}

export default CustomerCardComp