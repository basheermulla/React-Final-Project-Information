import { useState } from 'react'
import {
    Box, Typography
} from '@mui/material';

function NewCustomerNestedPageComp() {

    return (
        <>
            <Box xs={{ display: 'flex', justifyContent: "center" }} >
                <Typography gutterBottom variant="h3" component="div"> New Customer Nested Page Comp </Typography>
            </Box>
        </>
    )
}

export default NewCustomerNestedPageComp