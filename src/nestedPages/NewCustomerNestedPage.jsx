import { useState } from 'react'
import { Box, Grid, Paper, Stack, Avatar, TextField, Button, TableContainer } from '@mui/material';
import { blue } from '@mui/material/colors';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import Icon from '@mui/material/Icon';
import { addCustomer, loadAllCustomers } from '../redux/actions/customerActions';

function NewCustomerNestedPageComp() {
    const dispatch = useDispatch();

    const [customer, setCustomer] = useState({});

    const navigate = useNavigate();

    const handleInput = (event) => {
        let { name, value } = event.target;
        setCustomer({ ...customer, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        console.log(customer);
        dispatch(addCustomer(customer));
        await addDoc(collection(db, 'customers'), customer);

        const querySnapshot = await getDocs(collection(db, "customers"));
        const customers = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                // status: 'UNCHANGED',
                ...doc.data()
            }
        });
        dispatch(loadAllCustomers(customers));

        navigate('/customers');
    }

    const handleCancel = () => {
        navigate('/customers');
    }

    const handleClose = () => {
        navigate('/customers');
    }

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", mt: 5, p: 1 }}>
                <TableContainer sx={{ display: 'flex', justifyContent: "right" }}>
                    <DisabledByDefaultIcon color="error" cursor='pointer' onClick={(e) => handleClose(e)} />
                </TableContainer>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2} m={3} sx={{ justifyContent: "center" }} >
                        <Avatar sx={{ bgcolor: blue[200], color: 'black', width: 400, height: 60, fontWeight: 'bold' }} variant='square'>Add Customer</Avatar>
                    </Stack>
                </Grid>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                fullWidth
                                autoComplete="firstName"
                                id="firstName"
                                label="First Name"
                                name="firstName"
                                value={customer.firstName || ''}
                                autoFocus
                                inputProps={{
                                    maxLength: 12
                                }}
                                onChange={(e) => handleInput(e)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                fullWidth
                                autoComplete="lastName"
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                value={customer.lastName || ''}
                                inputProps={{
                                    maxLength: 12
                                }}
                                onChange={(e) => handleInput(e)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                fullWidth
                                autoComplete="city"
                                id="city"
                                label="City"
                                name="city"
                                value={customer.city || ''}
                                inputProps={{
                                    maxLength: 24
                                }}
                                onChange={(e) => handleInput(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                autoComplete="src"
                                id="src"
                                label="Src"
                                name="src"
                                value={customer?.src || ''}
                                onChange={(e) => handleInput(e)}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={8} sx={{ display: 'inline-flex', justifyContent: "center" }}>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{ m: 1, mt: 3 }}
                            onClick={() => handleCancel()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color='error'
                            startIcon={<Icon>add_circle</Icon>}
                            sx={{ m: 1, mt: 3 }}
                        >
                            Add
                        </Button>
                    </Grid>
                </Box>
            </Grid>
        </>
    )
}

export default NewCustomerNestedPageComp