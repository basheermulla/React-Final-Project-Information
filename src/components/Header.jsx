import { memo, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Box, AppBar, Toolbar, IconButton, Typography, Paper, Menu, MenuItem, Tooltip, Avatar, Grid } from '@mui/material';
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
import { loadUsersRequest, loadUsersSuccess, loadUsersFail } from '../redux/actions/userActions';
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
    const userLogin = useSelector((state) => state.userLoginReducer.userLogin);

    const dispatch = useDispatch();

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElLogin, setAnchorElLogin] = useState(null);
    const [flagColor, setFlagColor] = useState(0);
    const [pagesToDiaplay, setPagesToDiaplay] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

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
            setAnchorElLogin(false);
            setFlagColor(0);
            dispatch(logout());
            navigate(`${path}`);
        }
    }

    useEffect(() => {
        if (userLogin?.email) {
            switch (userLogin.role) {
                case 'admin':
                    const showAllPagesItem = pages['pages-Links'];
                    console.log(location);
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

            switch (location.pathname) {
                case "/":
                    setFlagColor(0);
                    break;
                case "/products":
                    setFlagColor(1);
                    break;
                case "/customers":
                    setFlagColor(2);
                    break;
                case "/purchases":
                    setFlagColor(3);
                    break;
                case "/users":
                    setFlagColor(4);
                    break;
                default:
                    setFlagColor(0);
                    break;
            }
        } else {
            setAnchorElLogin(false)
        }
    }, [userLogin]);

    useEffect(() => {
        dispatch(loadProductsRequest());
        dispatch(loadCustomersRequest());
        dispatch(loadPurchasesRequest());
        if (userLogin?.role) { dispatch(loadUsersRequest()); }
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

        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(db, "users"));
            const users = querySnapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            });
            return users;
        }

        // Fetch All data [Products, Customers, Purchases] from firebase DB with Promise.all
        // If the an admin ---> Fetch users data
        if (userLogin) {
            if (userLogin.role === 'admin') {
                const getData = async () => {
                    const [Products, Customers, Purchases, Users] = await Promise.allSettled([fetchProducts(), fetchCustomers(), fetchPurchases(), fetchUsers()])
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

                    if (Users.status === 'fulfilled') {
                        dispatch(loadUsersSuccess(Users.value));
                    } else {
                        console.log(Users.reason);
                        dispatch(loadUsersFail(Users.reason));
                    }
                }

                getData();
            } else {
                const getData = async () => {
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

                getData();
            }
        }

    }, [userLogin]);

    return (
        <Box width={'100%'}>
            <ThemeProvider theme={theme}>
                <Grid container component={Paper} elevation={6}>
                    <AppBar position="static">
                        <Toolbar disableGutters sx={{ justifyContent: 'space-between', bgcolor: 'primary.dark' }}>
                            <IconButton
                                onClick={(e) => { if (userLogin) { navigate('/'), setFlagColor(0) } }}
                                sx={{ p: 1, mr: 0, "&:focus": { outline: 'none' } }}
                            >
                                <Avatar alt="Remy Sharp" src={shopLogo} />
                            </IconButton>
                            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                    sx={{
                                        "&:focus": { outline: 'none' },
                                    }}
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
                                            <MenuItem key={index} onClick={() => handleCloseNavMenu(page.link, index)}>
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
                                        > Hello, {userLogin?.firstName + ' ' + userLogin?.lastName}
                                        </Typography>
                                    }{
                                        anchorElLogin
                                        &&
                                        <Tooltip title="Open settings">
                                            <IconButton
                                                onClick={handleOpenUserMenu}
                                                sx={{
                                                    "&:focus": { outline: 'none' },
                                                }}
                                            >
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
                                        </Tooltip>
                                    }
                                    <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'right', }} keepMounted
                                        transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                                        open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}
                                    >
                                        {
                                            settings['settings-Links'].map((setting, index) => (
                                                <MenuItem key={index} onClick={handleCloseUserMenu}>
                                                    <Typography
                                                        textAlign="center"
                                                        onClick={(e) => handleClickSetting(e, setting.link)}
                                                    >
                                                        {setting.settingname}
                                                    </Typography>
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

export default memo(HeaderComp)