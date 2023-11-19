import { useState } from 'react'
import {
    Box, Typography
} from '@mui/material';

function NewProductNestedPageComp() {

    return (
        <>
            <Box xs={{ display: 'flex', justifyContent: "center" }} >
                <Typography gutterBottom variant="h3" component="div"> New Product Nested Page Comp </Typography>
            </Box>
        </>
    )
}

export default NewProductNestedPageComp