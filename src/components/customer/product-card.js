import React from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import { FiShoppingCart } from 'react-icons/fi';
import ReactStars from 'react-rating-stars-component';
import theme from '../../constants/theme';
import useDimensions from "react-use-dimensions";
import Link from 'next/link';

export default function ProductCard(props) {
    const { element } = props;
    console.log('element:', element);
    const [ref, { x, y, width }] = useDimensions();

    return (
        <div className='_productCard'>
            <Link href='/products/[category]/[sub_category]/[product]' as={`/products/${element.categoryId}/${element.subCategoryId}/${element._id}`}>
                <Card className='_card' >
                    <Card.Body >
                        <Card.Title>{element.name}</Card.Title>
                        <Card.Text style={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                        }}>
                            {element.description}
                        </Card.Text>
                        <Card.Img
                            variant="top"
                            ref={ref}
                            src={element.imagesUrl[0].imageUrl}
                            style={{ minWidth: '100%', minHeight: width + width / theme.SIZES.IMAGE_HEIGHT_DIVIDE, maxHeight: width + width / theme.SIZES.IMAGE_HEIGHT_DIVIDE }}
                        />
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
            </Link>
            <style type="text/css">{`
                ._productCard ._card {
                    margin: 2%;
                }
                ._productCard ._card:hover{
                    box-shadow: 0px 0px 10px 0.5px ${theme.COLORS.SHADOW};
                    transition: width 0.5s, height 0.5s, opacity 0.5s 0.5s;
                    cursor: pointer;
                    border: none;
                    margin: 0% 2% 4% 2%;
                }
            `}</style>
        </div>
    )
}
