import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Box, AppBar, Toolbar, IconButton, Typography, Paper, Menu, MenuItem, Tooltip, Avatar, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import shopLogo from '../assets/sw-open-shop-3.jpg';
import pages from '../utils/nav-list-pages.json';
import settings from '../utils/setting-links.json';
import { useSelector, useDispatch } from "react-redux";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { loadProductsRequest, loadProductsSuccess, loadProductsFail } from '../redux/actions/productActions';
import { loadCustomersRequest, loadCustomersSuccess, loadCustomersFail } from '../redux/actions/customerActions';
import { loadPurchasesRequest, loadPurchasesSuccess, loadPurchasesFail } from '../redux/actions/purchaseActions';
import { blue } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { logout } from '../redux/actions/userActions';

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

function HeaderComp() {
    const products = useSelector((state => state.productReducer.products));
    const userLogin = useSelector((state) => state.userLoginReducer.userLogin);

    // const userstate = useSelector((state) => state);
    // console.log(userstate);

    const dispatch = useDispatch();

    const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', email: '', accessToken: '' });
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElLogin, setAnchorElLogin] = useState(null);
    const [flagColor, setFlagColor] = useState(0);
    const [pagesToDiaplay, setPagesToDiaplay] = useState([]);
    const [authState, setAuthState] = useState([])

    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (path, index) => {
        setAnchorElNav(null);
        setFlagColor(index);
        navigate(path);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleClickSetting = (e, path) => {
        if (e.target.innerText === 'Logout') {
            setAnchorElLogin(false)
            dispatch(logout());
            navigate(`${path}`);
        }
    }

    useEffect(() => {
        if (userLogin?.email) {
            switch (userLogin.role) {
                case 'admin':
                    const showAllPagesItem = pages['pages-Links'];
                    setPagesToDiaplay(showAllPagesItem)
                    break;
                case 'regular':
                    const matchPagesItem = pages['pages-Links'].filter((page) => page.pagename !== 'Users');
                    setPagesToDiaplay(matchPagesItem)
                    break;
                default:
                    const matchPagesItem2 = pages['pages-Links'].filter((page) => page.pagename !== 'Users');
                    setPagesToDiaplay(matchPagesItem2)
                    break;
            }
            setAnchorElLogin(true);
        } else {
            setAnchorElLogin(false)
        }
        setUserInfo(userLogin);
    }, [userLogin]);

    useEffect(() => {
        dispatch(loadProductsRequest());
        dispatch(loadCustomersRequest());
        dispatch(loadPurchasesRequest());
        const fetchProducts = async () => {
            let products = [];
            const querySnapshot = await getDocs(collection(db, "products"));
            products = querySnapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                    published: doc.data().published.toDate()
                }
            });
            return products;
        }

        // dispatch(signUpRequest());
        const fetchCustomers = async () => {
            const querySnapshot = await getDocs(collection(db, "customers"));
            let customers = [];
            customers = querySnapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            });
            return customers;
        }

        // dispatch(signUpRequest());
        const fetchPurchases = async () => {
            const querySnapshot = await getDocs(collection(db, "purchases"));
            let purchases = [];
            purchases = querySnapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date.toDate()
                }
            });
            return purchases;
        }

        // Fetch All data [Products, Customers, Purchases] from firebase DB with Promise.all
        if (userLogin) {
            const func = async () => {
                const [Products, Customers, Purchases] = await Promise.allSettled([fetchProducts(), fetchCustomers(), fetchPurchases()])
                if (Products.status === 'fulfilled') {
                    dispatch(loadProductsSuccess(Products.value));
                } else {
                    console.log(Products.reason);
                    dispatch(loadProductsFail(Products.reason));
                }

                if (Customers.status === 'fulfilled') {
                    dispatch(loadCustomersSuccess(Customers.value));
                } else {
                    console.log(Products.reason);
                    dispatch(loadCustomersFail(Customers.reason));
                }

                if (Purchases.status === 'fulfilled') {
                    dispatch(loadPurchasesSuccess(Purchases.value));
                } else {
                    console.log(Purchases.reason);
                    dispatch(loadPurchasesFail(Purchases.reason));
                }
            }

            func()
        }

    }, [userLogin]);

    return (
        <Box width={'100%'}>
            <ThemeProvider theme={theme}>
                <Grid container component={Paper} elevation={6}>
                    <AppBar position="static">
                        <Toolbar disableGutters sx={{ justifyContent: 'space-between', bgcolor: 'primary.dark' }}>
                            <IconButton onClick={(e) => { if (userLogin) { navigate('/'), setFlagColor(0) } }} sx={{ p: 1, mr: 0 }}>
                                <Avatar alt="Remy Sharp" src={shopLogo} />
                            </IconButton>
                            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar"
                                    aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
                                    keepMounted transformOrigin={{ vertical: 'top', horizontal: 'left', }}
                                    open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}
                                    sx={{ display: { xs: 'block', md: 'none' }, }}
                                >
                                    {
                                        pagesToDiaplay.map((page, index) => (
                                            <MenuItem key={index} onClick={handleCloseNavMenu}>
                                                <Typography textAlign="center">{page.pagename}</Typography>
                                            </MenuItem>
                                        ))}
                                </Menu>
                            </Box>
                            {
                                anchorElLogin
                                &&
                                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                    {
                                        pagesToDiaplay.map((page, index) => (
                                            <Button
                                                key={index}
                                                variant="raised"

                                                onClick={() => handleCloseNavMenu(page.link, index)}
                                                sx={{
                                                    bgcolor: flagColor === index ? 'primary.darker' : "primary.dark",
                                                    "&:hover": { bgcolor: 'primary.darker' },
                                                    "&:focus": { outline: 'none' },
                                                    color: 'white',
                                                    display: 'block'
                                                }}
                                            >
                                                {page.pagename}
                                            </Button>
                                        ))
                                    }
                                </Box>
                            }
                            <Box sx={{ flexGrow: 0 }}>
                                <Button
                                    sx={{ display: anchorElLogin ? 'none' : 'block', mr: 1 }}
                                    variant="contained"
                                    color="error"
                                    onClick={(e) => navigate('login')}
                                >
                                    Login
                                </Button>
                                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                                    {
                                        anchorElLogin
                                        &&
                                        <Typography
                                            component="p"
                                            variant="p"
                                        > Hello, {userInfo?.firstName + ' ' + userInfo?.lastName}
                                        </Typography>
                                    }
                                    {
                                        anchorElLogin
                                        &&
                                        <Tooltip title="Open settings">
                                            <IconButton onClick={handleOpenUserMenu} >
                                                <Avatar
                                                    alt="Remy Sharp"
                                                    sx={{
                                                        backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>}

                                    <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'right', }} keepMounted
                                        transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                                        open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}
                                    >
                                        {
                                            settings['settings-Links'].map((setting, index) => (
                                                <MenuItem key={index} onClick={handleCloseUserMenu}>
                                                    <Typography textAlign="center" onClick={(e) => handleClickSetting(e, setting.link)}>{setting.settingname}</Typography>
                                                </MenuItem>
                                            ))
                                        }
                                    </Menu>
                                </Box>
                            </Box>
                        </Toolbar>
                    </AppBar>
                </Grid>
            </ThemeProvider>
        </Box>
    )
}

export default HeaderComp