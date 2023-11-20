import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button, Container, Box, AppBar, Toolbar, IconButton, Typography, Paper, Menu, MenuItem, Tooltip, Avatar, Grid
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import shopLogo from '../assets/sw-open-shop-3.jpg';
import pages from '../utils/nav-list-pages.json';
import settings from '../utils/setting-links.json';
import { useSelector, useDispatch } from "react-redux";

function HeaderComp() {
    const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', email: '', accessToken: '' });
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElLogin, setAnchorElLogin] = useState(null);

    const navigate = useNavigate();
    const products = useSelector((state => state.products));
    
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        console.log(event.currentTarget);
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (path) => {
        setAnchorElNav(null);
        navigate(path)
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleAuthLogin = () => {
        setAnchorElLogin(true);
    };

    const handleClickSetting = (e) => {
        if (e.target.innerText === 'Logout') {
            console.log(e.target.innerText);
        }
    }

    // useEffect(() => {
    //     console.log(pages);
    // })

    return (
        <>
            <Grid container component={Paper} elevation={6}>
                <AppBar position="static">
                    <Container maxWidth="xl">
                        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                            <IconButton onClick={(e) => navigate('/')} sx={{ p: 0, mr: 1 }}>
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
                                    {pages['pages-Links'].map((page, index) => (
                                        <MenuItem key={index} onClick={handleCloseNavMenu}>
                                            <Typography textAlign="center">{page.pagename}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                            {/*anchorElLogin && */<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                {
                                    pages['pages-Links'].map((page, index) => (
                                        <Button key={index} onClick={() => handleCloseNavMenu(page.link)} sx={{ my: 2, color: 'white', display: 'block' }}>
                                            {page.pagename}
                                        </Button>
                                    ))
                                }
                            </Box>
                            }
                            <Box sx={{ flexGrow: 0 }}>
                                <Button
                                    sx={{ m: 2, display: anchorElLogin ? 'none' : 'block' }}
                                    variant="contained"
                                    color="error"
                                    onClick={(e) => navigate('login')}
                                >
                                    Login
                                </Button>
                                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                                    {anchorElLogin && <Typography
                                        component="p"
                                        variant="p"
                                    > Hello, {userInfo?.firstName + ' ' + userInfo?.lastName}
                                    </Typography>
                                    }
                                    {anchorElLogin && <Tooltip title="Open settings">
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
                                                    <Typography textAlign="center" onClick={() => navigate(setting.link)}>{setting.settingname}</Typography>
                                                </MenuItem>
                                            ))
                                        }
                                    </Menu>
                                </Box>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </Grid>
        </>
    )
}

export default HeaderComp
