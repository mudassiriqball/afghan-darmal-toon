import React from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function CountColoredCard(props) {
    return (
        <div className='count_colored_card'>
            <div className="hover">
                <Card style={{ background: props.background }} >
                    <Card.Header className='card_header'>{props.header}</Card.Header>
                    <Card.Body>
                        <Row noGutters>
                            <Col>
                                <Card.Text className='card_text'>
                                    {props.count}
                                </Card.Text>
                            </Col>
                            <Col>
                                <Card.Text className='card_text'>
                                    <FontAwesomeIcon icon={props.iconname} className='fontawesome' />
                                </Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
            <style type="text/css">{`
                .count_colored_card .fontawesome{
                    color: #404040;
                    width: 30px;
                    height: 30px;
                    maxHeight: 30px;
                    maxWidth: 30px;
                    float: right;
                }
                .count_colored_card .card_header{
                    color: black;
                    font-size: 14px;
                }
                .count_colored_card .card_text{
                    color: black;
                    font-size: 20px;
                }
                 @media (max-width: 767px) {
                     .count_colored_card .card_text{
                        color: black;
                        font-size: 13px;
                    }
                    .count_colored_card .card_text{
                        font-size: 15px;
                    }
                }
            `}</style>
            <style jsx>{`
                .hover {
                    margin: 1% 3.5%;
                }
                .hover:hover {
                    box-shadow: 0px 0px 10px 0.5px gray;
                    cursor: pointer
                }
                @media (max-width: 767px) {
                    .hover {
                        margin: 1% 1.4%;
                    }
                }
            `}</style>
        </div>
    )
}
