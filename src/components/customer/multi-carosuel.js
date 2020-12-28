import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import Carousel from "react-multi-carousel";
import theme from '../../constants/theme';
import ReactStars from "react-rating-stars-component";

import { FiShoppingCart } from 'react-icons/fi';
import Link from 'next/link';
import getProductsByCategorySubCategoryPageLimit from '../../hooks/customer/getProductsByCategorySubCategoryPageLimit';

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};

const images = [
    "https://images.unsplash.com/photo-1549989476-69a92fa57c36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550133730-695473e544be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550167164-1b67c2be3973?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550338861-b7cfeaf8ffd8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550223640-23097fc71cb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550353175-a3611868086b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550330039-a54e15ed9d33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549737328-8b9f3252b927?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549833284-6a7df91c1f65?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1549985908-597a09ef0a7c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550064824-8f993041ffd3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
];

export default function MultiCarosuel(props) {
    return (
        props.categories_list && props.categories_list.map((element, index) => (
            <MultiCarosuelRow
                category={element}
                sub_categories_list={props.sub_categories_list}
            />
        ))
    )
}

function MultiCarosuelRow(props) {
    const { category, sub_categories_list } = props;
    const [page, setPage] = useState(0);
    const [subCategory_id, setSubCategory_id] = useState(null);

    const { PRODUCTS_PAGE_LIMIT_LOADING, PRODUCTS_PAGE_LIMIT_ERROR, PRODUCTS_PAGE_LIMIT_PRODUCTS, USERS_SEARCH_PAGES, USERS_SEARCH_TOTAL } =
        getProductsByCategorySubCategoryPageLimit(category._id, subCategory_id, page, '9');

    return (
        <div className='_multiCarosuel'>
            <Row noGutters>
                <Col lg={12} md={12} sm={12} xs={12}>
                    <Card style={{ flex: 1, border: 'none', }}>
                        <Card.Body className='pb-0 mb-0'>
                            <Row noGutters>
                                <Col lg={5} md={5} sm={8} xs={8} className='d-flex align-items-center'>
                                    <h3>{props.category.value}</h3>
                                </Col>
                                <Col lg={5} md={5} className='align-items-center sm_xs_display_none'>
                                    <div style={{ borderBottom: `0.25px solid ${theme.COLORS.SHADOW}`, width: '100%', maxHeight: '0.5px' }} />
                                </Col>
                                <Col lg={2} md={2} sm={4} xs={4} className='ml-auto d-flex align-items-center'>
                                    <a style={{ marginLeft: 'auto', color: theme.COLORS.LINK, fontSize: '15px', cursor: 'pointer' }}>{'Show More'}</a>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row noGutters>
                <Col lg={3} md={3} className='sm_xs_display_none overflow-auto'>
                    <Card style={{ flex: 1, border: 'none', }}>
                        <Card.Body>
                            {sub_categories_list && sub_categories_list.map((element, index) => {
                                if (category._id === element.category_id) {
                                    return <div onClick={() => setSubCategory_id(element._id)} className='_a'>{element.label}</div>
                                }
                            })}
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={9} md={9} sm={12} xs={12} >
                    <Carousel
                        swipeable={true}
                        draggable={true}
                        showDots={false}
                        slidesToSlide={1}
                        responsive={responsive}
                        ssr={true} // means to render carousel on server-side.
                        infinite={true}
                        // autoPlay={true}
                        // autoPlaySpeed={1000}
                        keyBoardControl={true}
                        // customTransition="transform 300ms ease-in-out"
                        customTransition="all .5s linear"
                        // transitionDuration={3000}
                        containerClass="carousel-container"
                        removeArrowOnDeviceType={["tablet", "mobile"]}
                        // deviceType={this.props.deviceType}
                        // dotListClass="custom-dot-list-style"
                        // customLeftArrow={}
                        itemClass="carousel-item-padding-50-px"
                    >
                        {images && images.map((element, index) => (
                            <Card className='_card'>
                                <Card.Body>
                                    <Card.Title>Card Title</Card.Title>
                                    <Card.Text>
                                        {'Some quick example text to build on the card title and make up the bulk of'}
                                    </Card.Text>
                                    <Card.Img variant="top" src={element} />
                                    <div style={{ borderTop: `1px solid lightgray`, margin: '10px 0px' }} />
                                    <Row noGutters>
                                        <Col lg={8} md={8} sm={8} xs={8}>
                                            <ReactStars
                                                count={5}
                                                value={3}
                                                edit={false}
                                                size={15}
                                                activeColor='orange'
                                            />
                                            <label>{'Rs: 1990'}</label>
                                        </Col>
                                        <Col lg={4} md={4} sm={4} xs={4} className='d-flex align-items-center'>
                                            <div className='mr-auto' />
                                            <div style={{ border: `1px solid ${theme.COLORS.LIGHT_GRAY}`, borderRadius: '3px', padding: '7px' }}>
                                                <FiShoppingCart style={{ fontSize: '28px', color: theme.COLORS.GRAY }} />
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </Carousel>
                </Col>
            </Row>
            <style type="text/css">{`
                ._multiCarosuel ._card {
                    margin: 4%;
                }
                ._multiCarosuel ._card:hover{
                    box-shadow: 0px 0px 10px 0.5px ${theme.COLORS.SHADOW};
                    cursor: pointer;
                    border: none;
                    margin: 2%;
                }
                ._multiCarosuel ._a {
                    width: 100%;
                    padding: 2% 5%;
                    border-radius: 5px;
                    color: ${theme.COLORS.GRAY};
                    cursor: pointer;
                }
                ._multiCarosuel ._a:hover{
                    text-decoration: none;
                    background: ${theme.COLORS.MAIN};
                    color: ${theme.COLORS.WHITE};
                }
                ._multiCarosuel h3 {
                    font-weight: bold;
                }
                ._multiCarosuel label {
                    font-weight: bold;
                    color: ${theme.COLORS.MAIN};
                    font-size: 18px;
                    font-family: Rubik, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
                }
                
                ._multiCarosuel .sm_xs_display_none {
                    display: flex;
                }
                @media only screen and (max-width: 600px) {
                    ._multiCarosuel {
                        padding: 2% 5%;
                    }
                    ._multiCarosuel .sm_xs_display_none {
                        display: none;
                    }
                }
                @media only screen and (min-width: 600px) {
                    ._multiCarosuel {
                        padding: 2% 5%;
                    }
                }
                @media only screen and (min-width: 768px) {
                    ._multiCarosuel {
                        padding: 2% 7%;
                    }
                }
                @media only screen and (min-width: 992px) {
                    ._multiCarosuel {
                        padding: 2% 9%;
                    }
                }
                @media only screen and (min-width: 1200px) {
                    ._multiCarosuel {
                        padding: 2% 12%;
                    }
                }
            `}</style>
            <style jsx global>{`
                * {
                    font-family: Oswald,sans-serif;
                }
            `}</style>
        </div>
    )
}
