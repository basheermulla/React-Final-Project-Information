import { useState, useEffect, useRef } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
import ProductCardComp from './ProductCard';

function SliderComp({ initialSlide = 0, productsToSlide, sourcePage }) {
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
        console.log(sourcePage);
    }, [initialSlide, hasSetPosition, slider, productsToSlide]);

    return (
        <>
            <Slider ref={slider} {...settings}>
                {
                    productsToSlide?.map((product) => {
                        return <ProductCardComp key={product.id} product={product} sourcePage={sourcePage} />
                    })
                }
            </Slider>
        </>
    )
}

export default SliderComp