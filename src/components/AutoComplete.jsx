import {
    Box, Button, Autocomplete, TextField, Grid
} from '@mui/material';
import { useEffect, useState } from 'react';

function AutoCompleteComp({ callbackLabelInput, modelTarget, data }) {
    const [inputValue, setInputValue] = useState('');

    return (
        <>
            {modelTarget === 'products' ?
                <Autocomplete
                    disablePortal
                    id={'id-ddd'}
                    onInputChange={(event, newInputValue, id) => {
                        console.log(event, newInputValue, id);
                        setInputValue(newInputValue);
                    }}
                    onChange={(e, value) => {
                        console.log(value)
                        callbackLabelInput(value)
                    }}
                    defaultChecked={''}
                    options={data
                        .filter((product) => product.quantity > 0)
                        .map((product) => ({ id: product.id, label: product.name }))}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    sx={{ width: 300, m: 2 }}
                    renderInput={(params) =>
                        <Grid item xs={12} sm={12}>
                            <TextField fullWidth {...params} autoFocus label="Product" />
                        </Grid>
                    }
                />
                :
                <Autocomplete
                    disablePortal

                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                        callbackLabelInput(newInputValue)
                    }}
                    onChange={(e, value) => {
                        console.log(value)
                        callbackLabelInput(value)
                    }}
                    defaultChecked={''}
                    options={data.map((customer) => ({ id: customer.id, label: customer.firstName + ' ' + customer.lastName }) /*{ return customer.firstName + ' ' + customer.lastName }*/)}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    sx={{ width: 300, m: 2 }}
                    renderInput={(params) =>
                        <Grid item xs={12} sm={12}>
                            <TextField {...params} autoFocus label="Customer" />
                        </Grid>
                    }
                />
            }

        </>
    )
}

export default AutoCompleteComp