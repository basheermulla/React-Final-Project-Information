import { useEffect, useState } from 'react'
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function UsersPageComp() {
    const { userLogin } = useSelector((state) => state.userLoginReducer);

    const navigate = useNavigate();

    useEffect(() => {
        if (!userLogin) {
            navigate('/login')
         }
    }, [])

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
