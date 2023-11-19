import { useState } from 'react'
import {
    Box, Typography
} from '@mui/material';

function UserCardComp() {

    return (
        <>
            <Box xs={{ display: 'flex', justifyContent: "center" }} >
                <Typography gutterBottom variant="h3" component="div"> User Card Comp </Typography>
            </Box>
        </>
    )
}

export default UserCardComp