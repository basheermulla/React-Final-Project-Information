import { useState } from 'react'
import {
    Box, Grid, Paper, Table, TableHead, TableRow, TableBody, Avatar, styled, TableContainer, Stack
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { blue } from '@mui/material/colors';
import { setRole } from '../redux/actions/userActions';
import RowTableUser from '../components/RowTableUser';
import LinearProgressComp from '../components/LinearProgress';
import SnackbarAlertComp from '../components/SnackbarAlert';

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
    const { loading: usersLoad, error: usersError, users } = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const [openSnackbarAdmin, setOpenSnackbarAdmin] = useState(false);
    const [openSnackbarRegular, setOpenSnackbarRegular] = useState(false);
    const [alertName, setAlertName] = useState("")

    const handleSnackbarAdminOpen = () => {
        setOpenSnackbarAdmin(true);
    };

    const handleSnackbarAdminClose = () => {
        setOpenSnackbarAdmin(false);
    };

    const handleSnackbarRegularOpen = () => {
        setOpenSnackbarRegular(true);
    };

    const handleSnackbarRegularClose = () => {
        setOpenSnackbarRegular(false);
    };


    const handleChecked = async (event, user) => {
        const firestoreUpdateDoc = async () => {
            const updateRoleDB = { role: user.role === 'admin' ? 'regular' : 'admin' };
            // delete updateRoleDB['id'];
            await updateDoc(doc(db, 'users', user.id), updateRoleDB);
        }

        const name = user.firstName + ' ' + user.lastName;

        setAlertName(name)

        const [result] = await Promise.allSettled([firestoreUpdateDoc()])
        if (result.status === 'fulfilled') {
            console.log(result);
            dispatch(setRole(user.id));
            console.log(user.role);
            user.role === 'admin'
                ? handleSnackbarRegularOpen()
                : handleSnackbarAdminOpen()

        } else {
            console.log(result.reason);
        }
    }

    return (
        <Box width={'100%'}>
            {
                usersLoad
                &&
                <LinearProgressComp />
            }
            <ThemeProvider theme={defaultTheme}>
                <Grid container component={Paper} elevation={6} sx={{ display: 'flow', justifyContent: "center", height: 'auto', minHeight: '100vh', pb: 5 }}>
                    <Grid item sx={{ display: 'flex', justifyContent: "center" }}>
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
                                                            <RowTableUser key={user.id} ID={i + 1} user={user} callBackSetRole={handleChecked} />
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
                </Grid>
                <Stack sx={{ width: '100%' }}>
                    <SnackbarAlertComp
                        openSnackbar={openSnackbarAdmin}
                        content={`You gave ${alertName} admin role !`}
                        callbackHandleSnackClose={handleSnackbarAdminClose} cover={'success'}
                    />
                    <SnackbarAlertComp
                        openSnackbar={openSnackbarRegular}
                        content={`You gave ${alertName} regular role !`}
                        callbackHandleSnackClose={handleSnackbarRegularClose} cover={'error'}
                    />
                </Stack>
            </ThemeProvider>
        </Box >
    )
}

export default UsersPageComp