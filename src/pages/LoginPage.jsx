import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Avatar, TextField, Button, Alert, AlertTitle, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { auth, db } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useSelector, useDispatch } from "react-redux";
import { login, signInError, signInRequest } from '../redux/actions/userActions';

const defaultTheme = createTheme();

function LoginPageComp() {
    const [userInput, setUserInput] = useState({ firstName: '', lastName: '', email: '', password: '', accessToken: '', role: '' });

    const { loading, error, userLogin } = useSelector((state) => state.userLoginReducer);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInput = (event) => {
        let { name, value } = event.target
        setUserInput({ ...userInput, [name]: value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        dispatch(signInRequest());

        signInWithEmailAndPassword(auth, data.get('email'), data.get('password'))
            .then(async (userCredential) => {
                // Signed in 
                const accessToken = userCredential.user.accessToken;
                // Retrive user data from firestore ---> users collection
                const q = query(collection(db, "users"), where("email", "==", data.get('email')));
                const querySnapshot = await getDocs(q);
                let obj_user = [];
                if (querySnapshot.docs.length === 1) {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        obj_user = {
                            ...userInput,
                            accessToken: accessToken,
                            firstName: doc.data().firstName,
                            lastName: doc.data().lastName,
                            role: doc.data().role
                        }
                        setUserInput(obj_user);
                    });
                }
                dispatch(login(obj_user));
                navigate('/');
            })
            .catch((error) => {
                dispatch(signInError(error));
            });
    }

    return (
        <Box width={'100%'}>
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
                                <Grid container justifyContent="center" sx={{ mb: 2 }}>
                                    <Grid item>
                                        <RouterLink to="/register">
                                            Don't have an account? Sign Up
                                        </RouterLink>
                                    </Grid>
                                </Grid>
                                {
                                    loading && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <CircularProgress />
                                    </Box>
                                }
                                {
                                    error && <Alert severity="error"> <AlertTitle >{error}</AlertTitle> </Alert>
                                }
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider >
        </Box>
    )
}

export default LoginPageComp
