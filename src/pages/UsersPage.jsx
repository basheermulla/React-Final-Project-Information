import { useState } from 'react'
import { Box, Typography, Grid, Paper } from '@mui/material';

function UsersPageComp() {
    const [count, setCount] = useState(0)

    return (
        <Box width={'100%'}>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", pb: 5, height: '100vh' }}>
                <Box xs={{ display: 'flex', justifyContent: "center" }} >
                    <Typography gutterBottom variant="h3" component="div"> Users Page Comp </Typography>
                </Box>
            </Grid>
        </Box>
    )
}

export default UsersPageComp
