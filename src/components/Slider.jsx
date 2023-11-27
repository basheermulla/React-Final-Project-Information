import { useState, useEffect, useRef } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
import ProductCardComp from './ProductCard';

function SliderComp({ initialSlide = 0 }) {
    const products = useSelector((state => state.productReducer.products));

    const [hasSetPosition, setHasSetPosition] = useState(false);
    
    const slider = useRef();

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
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