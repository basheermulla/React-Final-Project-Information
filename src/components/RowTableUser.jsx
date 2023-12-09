import { Box, TableRow, Avatar, styled, Checkbox } from '@mui/material';
import { blue } from '@mui/material/colors';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

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

function RowTableUserComp({ ID, user, callBackSetRole }) {

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <StyledTableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    hover
                >
                    <StyledTableCell
                        component="th"
                        scope="row"
                        align={"center"}
                    >
                        {ID}
                    </StyledTableCell>
                    <StyledTableCell>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Avatar
                                sx={{
                                    height: 64,
                                    width: 64,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                                src='https://source.unsplash.com/random?wallpapers'
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
                            onChange={(e) => callBackSetRole(e, user)}
                        />
                    </StyledTableCell>
                    <StyledTableCell align={"center"}>{user.role}</StyledTableCell>
                </StyledTableRow >
            </ThemeProvider>
        </>
    )
}

export default RowTableUserComp