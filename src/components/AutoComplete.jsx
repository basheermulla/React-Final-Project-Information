import { Autocomplete, TextField, Grid } from '@mui/material';
import { memo } from 'react';

function AutoCompleteComp({ callbackLabelInput, modelTarget, data }) {

    return (
        <>
            {console.log('AutoCompleteComp page')}
            {modelTarget === 'products' ?
                <Autocomplete
                    disablePortal
                    onChange={(e, value) => {
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
                    onChange={(e, value) => {
                        callbackLabelInput(value)
                    }}
                    defaultChecked={''}
                    options={data.map((customer) => ({ id: customer.id, label: customer.firstName + ' ' + customer.lastName }) /*{ return customer.firstName + ' ' + customer.lastName }*/)}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    sx={{ width: 300, m: 2 }}
                    renderInput={(params) =>
                        <Grid item xs={12} sm={12}>
                            <TextField {...params} label="Customer" />
                        </Grid>
                    }
                />
            }
        </>
    )
}

export default memo(AutoCompleteComp)