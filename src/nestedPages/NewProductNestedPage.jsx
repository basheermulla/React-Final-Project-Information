import { useEffect, useState } from 'react'
import { Box, Grid, TextField, Button, Paper, Stack, Avatar, TableContainer, LinearProgress, Alert, AlertTitle } from '@mui/material';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { addProductRequest, addProductSuccess, addProductFail, submitProductFail } from '../redux/actions/productActions';
import Icon from '@mui/material/Icon';

function NewProductNestedPageComp() {
    const { userLogin } = useSelector((state) => state.userLoginReducer);
    const { loading, error: showError_AddProduct, products } = useSelector((state) => state.productReducer);

    const dispatch = useDispatch();

    const [product, setProduct] = useState({ published: new Date() });

    const navigate = useNavigate();

    const handleInput = (event) => {
        let { name, value } = event.target;
        value = isNaN(value) ? value : +value;
        setProduct({ ...product, [name]: value })
    }

    const handleSubmit = async (event) => {
        dispatch(addProductRequest())
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        const firestoreAddDoc = async () => {
            const addProductDB = { ...product };
            const docRef = await addDoc(collection(db, 'products'), addProductDB);
            const docId = docRef.id;
            setProduct({ ...product, id: docRef.id });
            return docId;
        }

        const [result] = await Promise.allSettled([firestoreAddDoc()])
        if (result.status === 'fulfilled') {
            console.log(result);
            dispatch(addProductSuccess({ ...product, id: result.value }));
            navigate('/products');
        } else {
            console.log(result.reason);
            dispatch(addProductFail(result.reason));
        }
    }

    const handleCancel = () => {
        navigate('/products');
    }

    const handleClose = () => {
        navigate('/products');
    }

    const handleSubmitError = () => {
        dispatch(submitProductFail());
        navigate('/products');
    }

    useEffect(() => {
        if (!userLogin) {
            navigate('/login')
        }
    }, [])

    return (
        <Box width={'100%'}>
            {
                loading
                &&
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            }
            {
                showError_AddProduct
                &&
                <Grid container sx={{ mt: 3 }}>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                        <Alert severity="error" sx={{ width: '90%', display: 'flex', justifyContent: "center" }}>
                            <Grid item xs={12}>
                                <AlertTitle sx={{ textAlign: 'left' }}>
                                    <strong>Add Product Error</strong>
                                </AlertTitle>
                            </Grid>
                            <strong>{showError_AddProduct}</strong>
                            <Grid item xs={12} sx={{ alignItems: 'center', display: 'flex', justifyContent: "center" }}>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="error"
                                    sx={{ m: 1, mt: 3 }}
                                    onClick={() => handleSubmitError()}
                                >
                                    Return
                                </Button>
                            </Grid>
                        </Alert>
                    </Grid>
                </Grid>
            }
            {
                !showError_AddProduct
                &&
                <Grid container component={Paper} elevation={0} sx={{ display: 'flex', justifyContent: "center", p: 1 }}>
                    <TableContainer sx={{ display: 'flex', justifyContent: "right" }}>
                        <DisabledByDefaultIcon color="error" cursor='pointer' onClick={(e) => handleClose(e)} />
                    </TableContainer>
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} m={3} sx={{ justifyContent: "center" }}>
                            <Avatar sx={{ bgcolor: blue[200], color: 'black', width: 400, height: 60, fontWeight: 'bold' }} variant='square'>Add Product</Avatar>
                        </Stack>
                    </Grid>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    autoComplete="name"
                                    id="name"
                                    label="Name"
                                    name="name"
                                    value={product?.name || ''}
                                    autoFocus
                                    inputProps={{
                                        maxLength: 16
                                    }}
                                    onChange={(e) => handleInput(e)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    autoComplete="price"
                                    id="price"
                                    label="Price"
                                    name="price"
                                    value={product?.price || ''}
                                    inputProps={{
                                        maxLength: 6
                                    }}
                                    onChange={(e) => handleInput(e)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    autoComplete="quantity"
                                    id="quantity"
                                    label="Quantity"
                                    name="quantity"
                                    value={product?.quantity || ''}
                                    inputProps={{
                                        maxLength: 6
                                    }}
                                    onChange={(e) => handleInput(e)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    autoComplete="description"
                                    id="description"
                                    label="Description"
                                    name="description"
                                    value={product?.description || ''}
                                    inputProps={{
                                        maxLength: 100
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
                                    value={product?.src || ''}
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
            }
        </Box>
    )
}

export default NewProductNestedPageComp