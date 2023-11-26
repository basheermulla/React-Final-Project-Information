import { useState, useEffect, useRef } from 'react'
import {
    Box, Typography, Card, CardMedia, CardContent, CardActions, Button, IconButton, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { cyan } from '@mui/material/colors';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { AddShoppingCart } from '@mui/icons-material';
import { purple, blue, grey } from '@mui/material/colors';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector, useDispatch } from "react-redux";
import ProductCardComp from './ProductCard';

function SliderComp({ initialSlide = 0 }) {
    const products = useSelector((state => state.productReducer.products));

    const [hasSetPosition, setHasSetPosition] = useState(false);
    const slider = useRef();

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1
    };

    useEffect(() => {
        if (slider.current && !hasSetPosition) {
            slider.current.slickGoTo(initialSlide);
            setHasSetPosition(true);
        }
    }, [initialSlide, hasSetPosition, slider]);

    return (
        <>
            <Slider ref={slider} {...settings}>
                {
                    products.map((product) => {
                        return <ProductCardComp key={product.id} product={product} />
                    })
                }
            </Slider>
        </>
    )
}

export default SliderComp