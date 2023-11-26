import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import {
    Card, CardMedia, CardContent, Typography, Button, CardActions, Grid, Paper, Box
} from '@mui/material';
import { red, purple } from '@mui/material/colors';
import { AddShoppingCart } from '@mui/icons-material';
import imgCard from '../assets/TV_1.png'

function HomePageComp() {
    const [user, setUser] = useState('');

    return (
        <>
            <Grid container component={Paper} elevation={6} sx={{ display: 'flex', justifyContent: "center", pb: 5 }}>
                <Box xs={{ display: 'flex', justifyContent: "center" }} >
                    <Card sx={{ maxWidth: 245, justifyContent: "center", alignItems: 'center', alignContent: 'center', m: 1 }}>
                        <CardMedia sx={{ height: 140 }} image={imgCard} title="green iguana" />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div"> PC </Typography>
                            <Typography variant="h5" color={purple[500]}> Price: [1169] </Typography>
                            <Typography variant="h5" color={red[500]}> Quantity: [35] </Typography>
                            <Typography variant="h5" color={red[500]}> Description: [laptop with a 15.6 inch screen, Intel® Core™ i7-1255U processor, 8GB internal memory, 512GB SSD drive and no operating system] </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "center" }}>
                            <Button variant="contained" size="small" startIcon={<AddShoppingCart />}>Add</Button>
                        </CardActions>
                    </Card>
                </Box>
                <Box xs={{ display: 'flex', justifyContent: "center" }} >
                    <Card sx={{ maxWidth: 245, justifyContent: "center", alignItems: 'center', alignContent: 'center', m: 1 }}>
                        <CardMedia sx={{ height: 140 }} image={imgCard} title="green iguana" />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div"> TV </Typography>
                            <Typography variant="h5" color={purple[500]}> Price: [999] </Typography>
                            <Typography variant="h5" color={red[500]}> Quantity: [40] </Typography>
                            <Typography variant="h5" color={red[500]}> Description: [LG UHD TVs upgrade your viewing experience. Enjoy vivid colors and breathtaking details in 4K resolution] </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "center" }}>
                            <Button variant="contained" size="small" startIcon={<AddShoppingCart />}>Add</Button>
                        </CardActions>
                    </Card>
                </Box>
            </Grid>
        </>
    )
}

export default HomePageComp
