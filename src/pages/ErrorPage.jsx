import { Box, Typography, Grid, Paper, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

function ErrorPageComp() {
    return (
        <Box width={'100%'}>
            <ThemeProvider theme={defaultTheme}>
                <Grid container component={Paper} elevation={6} sx={{ display: 'flow', bgcolor: '#fafafa', justifyContent: "center", height: 'auto', minHeight: '100vh' }}>
                    <Grid item xs={12}>
                        <Box sx={{ overflow: "auto", display: 'flex', justifyContent: "center" }}>
                            <Avatar sx={{ bgcolor: '#fff', color: 'black', width: 1, height: 100, fontSize: 18, fontWeight: 'bold' }} variant='square'>
                                <Typography variant='h6'>404 Error - Page Not Found</Typography>
                            </Avatar>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </Box >
    )
}

export default ErrorPageComp