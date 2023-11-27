import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
    Box, Typography, Grid, Paper, Avatar, TextField, Button, Link, Alert, AlertTitle
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

function LoginPageComp() {
    const [errorSignIp, setErrorSignIp] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
    }

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <Grid container component={Paper} elevation={6} sx={{ height: '84vh' }}>
                    <Grid item xs={false} sm={4} md={7}
                        sx={{
                            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <Grid item xs={12} sm={8} md={5}>
                        <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5"> Sign in </Typography>
                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus onChange={(e) => handleInput(e)}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={(e) => handleInput(e)}
                                />
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> Sign In </Button>
                                {
                                    errorSignIp && <Alert severity="error"> <AlertTitle >{errorMessage}</AlertTitle> </Alert>
                                }
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider >
        </>
    )
}

export default LoginPageComp
