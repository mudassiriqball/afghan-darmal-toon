import React, { useState, useEffect } from 'react';
import Router from 'next/router'
import { Carousel, Row, Col, ListGroup, Button, Image } from 'react-bootstrap'
import useDimensions from "react-use-dimensions";

import theme from '../../constants/theme';
import CustomButton from '../CustomButton';

const SliderCarousel = (props) => {
    const [ref, { x, y, width }] = useDimensions();

    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    return (
        <div className='slider_carousel'>
            <Row noGutters className='_row'>
                <Carousel activeIndex={index} onSelect={handleSelect} indicators={false} interval={3000}>
                    {props.sliders_list && props.sliders_list.map((element, index) =>
                        <Carousel.Item key={element._id} >
                            <Image
                                ref={ref}
                                style={{
                                    width: '100vw',
                                    maxWidth: '100%', minHeight: width > 767 ? width / 4 || '28vw' : width / 1.5,
                                    maxHeight: width > 767 ? width / 4 || '28vw' : width / 1.5
                                }}
                                src={element.imageUrl}
                                alt='Slide {index}'
                            />
                            <Carousel.Caption>
                                <label className='carosuel_label'>{element.sub_category}</label>
                                <CustomButton
                                    size='sm'
                                    title={'Shop Now'}
                                    onClick={() => Router.push('/')}></CustomButton>
                            </Carousel.Caption>
                        </Carousel.Item>
                    )}
                </Carousel>
            </Row>

            <style type="text/css">{`
                .slider_carousel{
                    background-image: linear-gradient(180deg, ${theme.COLORS.MAIN} 0%, ${theme.COLORS.SECONDARY} 100%);
                }
                .slider_carousel ._row{
                    border-radius: 3px;
                    background: white;
                }
                .slider_carousel .carosuel_label {
                    width: 100%;
                    font-size: 16px;
                }

                @media (max-width: 1199px){
                }
                @media (max-width: 991px){
                }
                @media (max-width: 767px) {
                    .slider_carousel .carosuel_label {
                        font-size: 13px;
                    }
                }
            `}</style>
        </div >
    )
}

const styles = {
}
export default SliderCarousel