import { useEffect, useState } from 'react'
import {
    Box, Typography, Grid, Paper, LinearProgress, Table, TableHead, TableRow, TableBody,
    TableSortLabel, Avatar, styled, Checkbox, TableContainer
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { blue } from '@mui/material/colors';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { setRole } from '../redux/actions/userActions';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.superLight,
        fontWeight: 'bold',
        color: theme.palette.common.black,

    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const defaultTheme = createTheme({
    palette: {
        primary: {
            superLight: blue[100],
            light: blue[200],
            main: blue[500],
            dark: blue[700],
            darker: blue[900],
        },
    },
});

function UsersPageComp() {
    const { userLogin } = useSelector((state) => state.userLoginReducer);
    const { users } = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const [progress, setProgress] = useState(false)

    const navigate = useNavigate();

    const handleChecked = async (event, user) => {
        const firestoreUpdateDoc = async () => {
            const updateRoleDB = { role: user.role === 'admin' ? 'regular' : 'admin' };
            // delete updateRoleDB['id'];
            await updateDoc(doc(db, 'users', user.id), updateRoleDB);
        }

        const [result] = await Promise.allSettled([firestoreUpdateDoc()])
        if (result.status === 'fulfilled') {
            console.log(result);
            dispatch(setRole(user.id))
        } else {
            console.log(result.reason);
            // dispatch(setRoleFail(result.reason));
        }


    }

    useEffect(() => {
        if (!userLogin) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        if (!userLogin) {
            navigate('/login')
        }
    }, [])

    return (
        <Box width={'100%'}>
            {
                progress
                &&
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            }
            <ThemeProvider theme={defaultTheme}>
                <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", pb: 5 }}>
                    <Grid container sx={{ display: 'flex', justifyContent: "center", p: 3 }}>
                        <Grid item xs={12}>
                            <Box sx={{ overflow: "auto", display: 'flex', justifyContent: "center" }}>
                                <Avatar sx={{ bgcolor: blue[200], color: 'black', width: 400, height: 60, fontSize: 18, fontWeight: 'bold' }} variant='square'>User Managment</Avatar>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 5 }}>
                            <Box sx={{ overflow: "auto", display: 'flex', justifyContent: "center" }}>
                                <Box sx={{ width: "80%", display: "table", tableLayout: "fixed" }}>
                                    <TableContainer component={Paper} elevation={3}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell align={"center"}>ID</StyledTableCell>
                                                    <StyledTableCell align={"center"}>Icon</StyledTableCell>
                                                    <StyledTableCell>Name</StyledTableCell>
                                                    <StyledTableCell>Username</StyledTableCell>
                                                    <StyledTableCell align={"center"}>Set admin</StyledTableCell>
                                                    <StyledTableCell align={"center"}>Role</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    users.map((user, i) => (
                                                        <StyledTableRow
                                                            key={i}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            hover
                                                        >
                                                            <StyledTableCell
                                                                component="th"
                                                                scope="row"
                                                                align={"center"}
                                                            >
                                                                {i + 1}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                                    <Avatar
                                                                        sx={{
                                                                            height: 42,
                                                                            width: 42,
                                                                            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                                                                            backgroundRepeat: 'no-repeat',
                                                                            backgroundSize: 'cover',
                                                                            backgroundPosition: 'center'
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </StyledTableCell>
                                                            <StyledTableCell>{user.firstName + ' ' + user.lastName}</StyledTableCell>
                                                            <StyledTableCell>{user.email}</StyledTableCell>
                                                            <StyledTableCell align={"center"}>
                                                                <Checkbox
                                                                    icon={<FavoriteBorder />}
                                                                    checkedIcon={<Favorite />}
                                                                    checked={user.role === 'admin' ? true : false}
                                                                    onChange={(e) => handleChecked(e, user)}
                                                                />
                                                            </StyledTableCell>
                                                            <StyledTableCell align={"center"}>{user.role}</StyledTableCell>
                                                        </StyledTableRow >
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </Box >
    )
}

export default UsersPageComp


//import { useEffect, useState } from 'react'
// import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
// import {
//     CssBaseline, Box, Toolbar, List, Typography, Divider, IconButton, Badge, Container, Grid, Paper,
//     Link,
// } from '@mui/material';
// import MuiDrawer from '@mui/material/Drawer';
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
// import MenuIcon from '@mui/icons-material/Menu';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import { mainListItems, secondaryListItems } from './listItems';
// import Chart from './Chart';
// import Deposits from './Deposits';
// import Orders from './Orders';

// function Copyright(props) {
//     return (
//         <Typography variant="body2" color="text.secondary" align="center" {...props}>
//             {'Copyright © '}
//             <Link color="inherit" href="https://mui.com/">
//                 Your Website
//             </Link>{' '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }

// const drawerWidth = 240;

// const AppBar = styled(MuiAppBar, {
//     shouldForwardProp: (prop) => prop !== 'open',
// }) < AppBarProps > (({ theme, open }) => ({
//     zIndex: theme.zIndex.drawer + 1,
//     transition: theme.transitions.create(['width', 'margin'], {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.leavingScreen,
//     }),
//     ...(open && {
//         marginLeft: drawerWidth,
//         width: `calc(100% - ${drawerWidth}px)`,
//         transition: theme.transitions.create(['width', 'margin'], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.enteringScreen,
//         }),
//     }),
// }));

// const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
//     ({ theme, open }) => ({
//         '& .MuiDrawer-paper': {
//             position: 'relative',
//             whiteSpace: 'nowrap',
//             width: drawerWidth,
//             transition: theme.transitions.create('width', {
//                 easing: theme.transitions.easing.sharp,
//                 duration: theme.transitions.duration.enteringScreen,
//             }),
//             boxSizing: 'border-box',
//             ...(!open && {
//                 overflowX: 'hidden',
//                 transition: theme.transitions.create('width', {
//                     easing: theme.transitions.easing.sharp,
//                     duration: theme.transitions.duration.leavingScreen,
//                 }),
//                 width: theme.spacing(7),
//                 [theme.breakpoints.up('sm')]: {
//                     width: theme.spacing(9),
//                 },
//             }),
//         },
//     }),
// );

// // TODO remove, this demo shouldn't need to reset the theme.
// const defaultTheme = createTheme();

// export default function Dashboard() {
//     const [open, setOpen] = useState(true);
//     const toggleDrawer = () => {
//         setOpen(!open);
//     };

//     return (
//         <ThemeProvider theme={defaultTheme}>
//             <Box sx={{ display: 'flex' }}>
//                 <CssBaseline />
//                 <AppBar position="absolute" open={open}>
//                     <Toolbar
//                         sx={{
//                             pr: '24px', // keep right padding when drawer closed
//                         }}
//                     >
//                         <IconButton
//                             edge="start"
//                             color="inherit"
//                             aria-label="open drawer"
//                             onClick={toggleDrawer}
//                             sx={{
//                                 marginRight: '36px',
//                                 ...(open && { display: 'none' }),
//                             }}
//                         >
//                             <MenuIcon />
//                         </IconButton>
//                         <Typography
//                             component="h1"
//                             variant="h6"
//                             color="inherit"
//                             noWrap
//                             sx={{ flexGrow: 1 }}
//                         >
//                             Dashboard
//                         </Typography>
//                         <IconButton color="inherit">
//                             <Badge badgeContent={4} color="secondary">
//                                 <NotificationsIcon />
//                             </Badge>
//                         </IconButton>
//                     </Toolbar>
//                 </AppBar>
//                 <Drawer variant="permanent" open={open}>
//                     <Toolbar
//                         sx={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'flex-end',
//                             px: [1],
//                         }}
//                     >
//                         <IconButton onClick={toggleDrawer}>
//                             <ChevronLeftIcon />
//                         </IconButton>
//                     </Toolbar>
//                     <Divider />
//                     <List component="nav">
//                         {mainListItems}
//                         <Divider sx={{ my: 1 }} />
//                         {secondaryListItems}
//                     </List>
//                 </Drawer>
//                 <Box
//                     component="main"
//                     sx={{
//                         backgroundColor: (theme) =>
//                             theme.palette.mode === 'light'
//                                 ? theme.palette.grey[100]
//                                 : theme.palette.grey[900],
//                         flexGrow: 1,
//                         height: '100vh',
//                         overflow: 'auto',
//                     }}
//                 >
//                     <Toolbar />
//                     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//                         <Grid container spacing={3}>
//                             {/* Chart */}
//                             <Grid item xs={12} md={8} lg={9}>
//                                 <Paper
//                                     sx={{
//                                         p: 2,
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         height: 240,
//                                     }}
//                                 >
//                                     <Chart />
//                                 </Paper>
//                             </Grid>
//                             {/* Recent Deposits */}
//                             <Grid item xs={12} md={4} lg={3}>
//                                 <Paper
//                                     sx={{
//                                         p: 2,
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         height: 240,
//                                     }}
//                                 >
//                                     <Deposits />
//                                 </Paper>
//                             </Grid>
//                             {/* Recent Orders */}
//                             <Grid item xs={12}>
//                                 <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
//                                     <Orders />
//                                 </Paper>
//                             </Grid>
//                         </Grid>
//                         <Copyright sx={{ pt: 4 }} />
//                     </Container>
//                 </Box>
//             </Box>
//         </ThemeProvider>
//     );
// }


