import { useState } from 'react'
import {
    Box, Typography, Grid, Paper
} from '@mui/material';

function UsersPageComp() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", pb: 5 }}>
                <Box xs={{ display: 'flex', justifyContent: "center" }} >
                    <Typography gutterBottom variant="h3" component="div"> Users Page Comp </Typography>
                </Box>
            </Grid>
        </>
    )
}

export default UsersPageComp
