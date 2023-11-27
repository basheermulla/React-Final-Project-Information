import {
    Box, Typography, Grid, Paper
} from '@mui/material';

function PageTitleComp({ titleName }) {

    return (
        <>
            <Grid container component={Paper} square variant="elevation" elevation={14} sx={{ display: 'flex', justifyContent: "center", p: 2, mb: 2 }}>
                <Box xs={{ display: 'flex', justifyContent: "center" }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <Typography variant="h4" color={'#2962ff'} fontWeight={'Bold'}> {titleName} </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </>
    )
}

export default PageTitleComp