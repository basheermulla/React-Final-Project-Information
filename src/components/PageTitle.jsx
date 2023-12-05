import {
    Box, Typography, Grid, Paper
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            superLight: blue[50],
            light: blue[200],
            main: blue[500],
            dark: blue[700],
            darker: blue[900],
        },
    },
});

function PageTitleComp({ titleName }) {

    return (
        <>
            <ThemeProvider theme={theme}>
                <Grid container component={Paper} square variant="elevation" elevation={1} sx={{ display: 'flex', justifyContent: "center", bgcolor: 'primary.light', width: '98%', borderRadius: 9, p: 2, mb: 1 }}>
                    <Box xs={{ display: 'flex', justifyContent: "center" }} >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="h5" color={'#2962aa'} fontWeight={'Bold'}> {titleName} </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </ThemeProvider>
        </>
    )
}

export default PageTitleComp