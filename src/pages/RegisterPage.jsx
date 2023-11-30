import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Avatar, Button, TextField, Link, Paper, Box, Grid, Typography, Container, Alert, AlertTitle, CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { auth, db } from '../firebase/firebase';
// import db from "../firebase/firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { signUpSuccess, signUpError, signUpRequest } from '../redux/actions/userActions';

const defaultTheme = createTheme();

function RegisterPageComp() {
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [errorSignUp, setErrorSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { loading, authError } = useSelector((state) => state.userRegisterReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInput = (event) => {
    let { name, value } = event.target
    setUser({ ...user, [name]: value });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    dispatch(signUpRequest());

    createUserWithEmailAndPassword(auth, data.get('email'), data.get('password')) // Signed up 
      .then(async (userCredential) => {
        const obj = {
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          email: data.get('email')
        };
        console.log(userCredential);
        await setDoc(doc(db, "users", userCredential.user.uid), obj); // Add a new document in collection "users"
        dispatch(signUpSuccess());
        navigate('/login')
      }).catch((error) => {
        dispatch(signUpError(error));

      });
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Grid container component={Paper} elevation={6} sx={{ height: '100vh' }}>
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                      onChange={(e) => handleInput(e)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                      onChange={(e) => handleInput(e)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      onChange={(e) => handleInput(e)}
                    />

                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      onChange={(e) => handleInput(e)}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="center" sx={{ mb: 2 }}>
                  <Grid item>
                    <RouterLink to="/login">
                      Already have an account? Sign in
                    </RouterLink>
                  </Grid>
                </Grid>
                {loading && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>}
                {
                  authError && <Alert severity="error"> <AlertTitle >{authError}</AlertTitle> </Alert>
                }
              </Box>
            </Box>
          </Container>
        </Grid>
      </ThemeProvider>

    </>
  )
}

export default RegisterPageComp
