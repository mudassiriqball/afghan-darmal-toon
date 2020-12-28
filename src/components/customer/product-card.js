import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { FiShoppingCart } from 'react-icons/fi'
import reactStars from 'react-rating-stars-component'
import theme from '../../constants/theme';

export default function ProductCard(props) {
    const { element } = props;
    return (
        <div className='_productCard'>
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
                            <reactStars
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
