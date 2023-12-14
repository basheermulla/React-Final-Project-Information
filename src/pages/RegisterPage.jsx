import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Avatar, Button, TextField, Paper, Box, Grid, Typography, Container, Alert, AlertTitle,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { signUpSuccess, signUpError, signUpRequest } from '../redux/actions/userActions';
import { utilUserRegister } from '../utils/userAuthAndLogin';

const defaultTheme = createTheme();

function RegisterPageComp() {
  const [userInput, setUserInput] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'regular' });
  const { userLogin } = useSelector((state) => state.userLoginReducer);
  const { loading, authError } = useSelector((state) => state.userRegisterReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInput = (event) => {
    let { name, value } = event.target
    setUserInput({ ...userInput, [name]: value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    dispatch(signUpRequest());
    const { user, error } = await utilUserRegister(data, userInput.role);
    console.log(user, error);
    if (error) {
      dispatch(signUpError(error));
    } else {
      dispatch(signUpSuccess());
      navigate('/login')
    }

  };

  useEffect(() => {
    console.log('userLogin = ', userLogin);
    if (userLogin) {
      navigate('/');
    }
  }, []);

  return (
    <Box width={'100%'}>
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
                {
                  loading && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                }
                {
                  authError && <Alert severity="error"> <AlertTitle >{authError}</AlertTitle> </Alert>
                }
              </Box>
            </Box>
          </Container>
        </Grid>
      </ThemeProvider>
    </Box>
  )
}

export default RegisterPageComp