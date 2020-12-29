import React from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import { FiShoppingCart } from 'react-icons/fi';
import ReactStars from 'react-rating-stars-component';
import theme from '../../constants/theme';
import useDimensions from "react-use-dimensions";

export default function ProductCard(props) {
    const { element } = props;
    console.log('element:', element);
    const [ref, { x, y, width }] = useDimensions();

    return (
        <div className='_productCard'>
            <Card className='_card' >
                <Card.Body ref={ref}>
                    <Card.Title>{element.name}</Card.Title>
                    <Card.Text style={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                    }}>
                        {element.description}
                    </Card.Text>
                    <Card.Img variant="top" style={{ minWidth: '100%', minHeight: width, maxHeight: width }} src={element.imagesUrl[0].imageUrl} />
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
        </div>
    )
}
