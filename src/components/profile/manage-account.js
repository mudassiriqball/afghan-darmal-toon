import React from 'react'
import { Card, Row, Col, Nav, Image } from 'react-bootstrap'
import theme from '../../constants/theme'

export default function ManageAccount(props) {
    return (
        <div className='manage_account'>
            <div className='heading'>{'Manage Account'}</div>
            <Row>
                <Col className='card_col'>
                    <Card >
                        <Card.Header >
                            <div className='mr-auto'>{'Personal Info'}</div>
                            <Nav.Link onClick={() => { props.setView('my_profile') }}>{'Edit'}</Nav.Link>
                        </Card.Header>
                        <Card.Body>
                            <label className='label'>{props.fullName}</label>
                            <label className='label'>{props.mobile}</label>
                            <label className='label'>{props.email}</label>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='card_col'>
                    <Card >
                        <Card.Header>
                            <div className='mr-auto'>{'Profile Picture'}</div>
                            <Nav.Link onClick={() => { props.setView('change_picture') }}>{'Edit'}</Nav.Link>
                        </Card.Header>
                        <Card.Body className='w-100 d-flex align-items-center justify-content-center'>
                            <Image src={props.avatar} roundedCircle thumbnail fluid
                                style={{ minWidth: '120px', maxWidth: '120px', minHeight: '120px', maxHeight: '120px' }} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='card_col'>
                    <Card >
                        <Card.Header >
                            <div className='mr-auto'>{'Shipping Address'}</div>
                            <Nav.Link onClick={() => { props.setView('address') }}>{'Address'}</Nav.Link>
                        </Card.Header>
                        <Card.Body>
                            <label className='label'>{props.fullName}</label>
                            <label className='label'>{props.address}</label>
                        </Card.Body>
                    </Card>
                </Col>
                {/* } */}
            </Row>
            <style type="text/css">{`
                .manage_account .card_col {
                    padding: 5px;
                }
                .manage_account .heading {
                    font-size: 18px;
                    margin: 10px 5px;
                }
                .manage_account .card {
                    border: none;
                    background: rgb(165,64,162);
                    // background: linear-gradient(135deg, ${theme.COLORS.MAIN} 0%, ${theme.COLORS.SEC} 100%);
                    background: white;
                    min-height: 200px;
                    opacity: 0.8;
                }
                .manage_account .card-header {
                    display: inline-flex;
                    align-items: center;
                    font-size: 15px;
                    font-weight: bold;
                    color: ${theme.COLORS.TEXT};
                    border: none;
                    padding-bottom: 0%;
                    background: none;
                }
                .manage_account .label {
                    font-size: 13px;
                    width: 100%;
                    color: ${theme.COLORS.TEXT};
                }
                .manage_account .address_label {
                    font-size: 11px;
                    width: 100%;
                    color: ${theme.COLORS.TEXT};
                }
                .manage_account .count_label {
                    color: ${theme.COLORS.TEXT};
                    font-size: 20px;
                }
            `}</style>
        </div>
    )
}