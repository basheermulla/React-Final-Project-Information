import { memo, useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, Container, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

function RevenueCardComp({ primary, secondary, content, iconPrimary, color, coin }) {
    const theme = useTheme();
    const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));

    const IconPrimary = iconPrimary;
    const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;

    return (
        <>
            <Card sx={{ background: color, position: 'relative', color: '#fff', m: 2}}>
                <CardContent>
                    <Typography
                        variant="body2"
                        sx={{
                            position: 'absolute',
                            right: 13,
                            top: 36,
                            color: '#fff',
                            '&> svg': { width: 100, height: 100, opacity: '0.5' },
                            [theme.breakpoints.down('sm')]: {
                                top: 13,
                                '&> svg': { width: 80, height: 80 }
                            }
                        }}
                    >
                        {primaryIcon}
                    </Typography>
                    <Grid container direction={matchDownXs ? 'column' : 'row'} spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="h5" color="inherit">
                                {primary}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h3" color="inherit">
                                {secondary} {coin}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="inherit">
                                {content}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}

RevenueCardComp.propTypes = {
    primary: PropTypes.string,
    secondary: PropTypes.number,
    content: PropTypes.string,
    iconPrimary: PropTypes.object,
    color: PropTypes.string,
    coin: PropTypes.string
};

export default memo(RevenueCardComp)