import { useState, useEffect, useRef } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCardComp from './ProductCard';
import { Box, Grid, IconButton, Paper } from '@mui/material';
import { blue } from '@mui/material/colors';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { gridSpacing } from '../utils/constant';

const styleObj = {
    "&:hover": {
        backgroundColor: blue[300]
    },
    "&:active": {
        boxShadow: 1
    },
    "&:focus": {
        outline: 'none',
    },
    boxShadow: 6,
    backgroundColor: blue[100],
    color: 'black'
};


function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <Box sx={{ height: 'fit-content' }}>
            <IconButton
                style={{ ...style }}
                sx={styleObj}
                onClick={onClick}
            >
                <KeyboardArrowRight fontSize="large" color='info' />
            </IconButton>
        </Box>
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <Box sx={{ height: 'fit-content' }}>
            <IconButton
                style={{ ...style }}
                sx={styleObj}
                onClick={onClick}
            >
                <KeyboardArrowLeft fontSize="large" color='info' />
            </IconButton>
        </Box>
    );
}

function SliderComp({ initialSlide = 0, productsToSlide, sourcePage }) {
    const [hasSetPosition, setHasSetPosition] = useState(false);

    const slider = useRef();

    const settings = {
        autoplay: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        useCSS: true,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };

    useEffect(() => {
        if (slider.current && !hasSetPosition) {
            slider.current.slickGoTo(initialSlide);
            setHasSetPosition(true);
        }
    }, [initialSlide, hasSetPosition, slider, productsToSlide]);

    return (
        <>
            <Slider ref={slider} {...settings} style={{ display: 'flex' }}>
                {
                    productsToSlide?.map((product, i) => {
                        return <Grid key={i} container direction="column" alignItems="center" spacing={gridSpacing} textAlign="center">
                            <Grid item >
                                <ProductCardComp key={product.id} product={product} sourcePage={sourcePage} />
                            </Grid>
                        </Grid>
                    })
                }
            </Slider>
        </>
    )
}

export default SliderComp