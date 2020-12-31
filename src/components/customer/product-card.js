import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import { FiShoppingCart } from 'react-icons/fi';
import ReactStars from 'react-rating-stars-component';
import theme from '../../constants/theme';
import useDimensions from "react-use-dimensions";
import Link from 'next/link';
import CustomButton from '../CustomButton';
import axios from 'axios';
import urls from '../../utils/urls';

export default function ProductCard(props) {
    const { element, user, token } = props;
    const [ref, { x, y, width }] = useDimensions();
    const [isCartHover, setIsCartHover] = useState(false);

    // Add to cart
    const [quantity, setQuantity] = useState(1);
    const [cartLoading, setCartLoading] = useState(false);
    const handleAddToCart = async () => {
        if (user.full_name == '') {
            alert('Please Login Before Add to Cart!');
        } else {
            setCartLoading(true);
            let data = {
                p_id: element._id,
                vendor_id: element.vendor_id,
                quantity: 1
            };
            await axios.put(urls.PUT_REQUEST.ADD_TO_CART + user._id, data, {
                headers: {
                    'authorization': token,
                }
            }).then(function (res) {
                setCartLoading(false);
                setShowAlertModal(true);
                getUser(user._id);
            }).catch(function (err) {
                setCartLoading(false)
                console.log('Add to cart error:', err);
                alert('Error');
            });
        }
    }
    // End of Add to cart

    return (
        <div className='_productCard'>
            <Link href='/products/[category]/[sub_category]/[product]' as={`/products/${element.categoryId}/${element.subCategoryId}/${element._id}`}>
                <Card className='_card' >
                    <Card.Body className='p-3'>
                        <Card.Title style={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            color: theme.COLORS.GRAY
                        }}
                        >{element.name}</Card.Title>
                        <Card.Text className='abc' >
                            {element.description}
                        </Card.Text>
                        <Card.Img
                            variant="top"
                            ref={ref}
                            src={element.imagesUrl[0].imageUrl}
                            style={{ minWidth: '100%', minHeight: width + (width / theme.SIZES.IMAGE_HEIGHT_DIVIDE), maxHeight: width + (width / theme.SIZES.IMAGE_HEIGHT_DIVIDE) }}
                        />
                        <div style={{ borderTop: `1px solid lightgray`, margin: '5px 0px' }} />
                        <Row noGutters>
                            <Col className='p-0'>
                                <ReactStars
                                    count={5}
                                    value={3}
                                    edit={false}
                                    size={15}
                                    activeColor='orange'
                                />
                                <h6 className='p-0 m-0' style={{ color: theme.COLORS.MAIN, fontWeight: 'bold' }}>{'Rs: ' + element.price}</h6>
                            </Col>
                            <Col
                                onMouseEnter={() => setIsCartHover(true)}
                                onMouseLeave={() => setIsCartHover(false)}
                                lg={4} md={4} sm={4} xs={4} className='d-flex align-items-center p-0'
                            >
                                <div className='mr-auto' />
                                {isCartHover ?
                                    <div style={{ position: 'absolute', top: '0px', right: '0px', bottom: '0px' }}>
                                        <CustomButton
                                            size={'sm'}
                                            loading={cartLoading}
                                            disabled={cartLoading}
                                            title={'ADD TO CART'}
                                            // variant={'success'}
                                            spinnerSize={'lg'}
                                            onlyLoading
                                            onClick={() => handleAddToCart()}
                                        />
                                    </div>
                                    :
                                    <div style={{ border: `1px solid ${theme.COLORS.LIGHT_GRAY}`, borderRadius: '3px', padding: '5px' }}>
                                        <FiShoppingCart style={{ fontSize: '20px', color: theme.COLORS.GRAY }} />
                                    </div>}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Link>
            <style type="text/css">{`
                ._productCard ._card {
                    margin: 3%;
                }
                .abc {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2; /* number of lines to show */
                    -webkit-box-orient: vertical;
                    font-size: 12px;
                    color: ${theme.COLORS.GRAY}
                }
                ._productCard ._card:hover{
                    box-shadow: 0px 0px 10px 0.5px ${theme.COLORS.SHADOW};
                    transition: width 0.5s, height 0.5s, opacity 0.5s 0.5s;
                    cursor: pointer;
                    border: none;
                    margin: 2%;
                }
            `}</style>
        </div>
    )
}
