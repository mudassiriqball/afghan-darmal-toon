import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, Form, Col, Row, InputGroup, Button, Spinner } from 'react-bootstrap'
import theme from '../../constants/theme'
import urls from '../../utils/urls'
import CustomButton from '../CustomButton'

export default function MyProfile(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [isEditProfile, setisEditProfile] = useState(false)
    const [fullName, setFull_name] = useState(props.fullName)
    const [mobile, setMobile] = useState(props.mobile);
    const [email, setEmail] = useState(props.email)

    useEffect(() => {
        setFull_name(props.fullName)
        setMobile(props.mobile);
        setEmail(props.email)
        return () => {
        }
    }, [props])

    function handleUpdateProfile() {
        setIsLoading(true)
        let data = {}
        data = {
            fullName: fullName,
            email: email,
        }
        axios.put(urls.PUT_REQUEST.UPDATE_USER_PROFILE + props._id, data, {
            headers: {
                'authorization': props.token,
            }
        }).then((response) => {
            setisEditProfile(false)
            setIsLoading(false)
            props.showAlert('Personal Info Updated Successfully')
            props.reloadUser()
        }).catch((error) => {
            setIsLoading(false)
            console.log('Update Personal Info Failed:', error)
            alert('Update Personal Info Failed')
        });
    }

    function handleCancelEdit() {
        setisEditProfile(!isEditProfile)
        setFull_name(props.fullName)
        setEmail(props.email);
    }

    return (
        <div className='my_profile'>
            {!props.isMobile && <label className='heading'>{'My Profile'}</label>}
            <Card className='my_card'>
                <Card.Body>
                    <Row className='p-0 m-0'>
                        <Form.Group as={Col} lg={12} md={12} sm={12} xs={12} className='my_profile_col'>
                            <Form.Label className='form_label'>{'Mobile'}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    className='form_control'
                                    value={mobile || ''}
                                    style={{ color: theme.COLORS.MUTED }}
                                    disabled={true}
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} lg={6} md={6} sm={6} xs={12} className='my_profile_col'>
                            <Form.Label className='form_label'>{'Full Name'}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    className='form_control'
                                    value={fullName || ''}
                                    onChange={(e) => setFull_name(e.target.value)}
                                    style={{ color: isEditProfile ? theme.COLORS.TEXT : theme.COLORS.MUTED }}
                                    disabled={!isEditProfile}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Row className='p-0 m-0'>
                        <Form.Group as={Col} className='my_profile_col'>
                            <Form.Label className='form_label'>{'Email'}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    className='form_control'
                                    placeholder='mr.x@gmail.com'
                                    type='email'
                                    value={email || ''}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ color: isEditProfile ? theme.COLORS.TEXT : theme.COLORS.MUTED }}
                                    disabled={!isEditProfile}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Form.Group as={Row} className='ml-0 mr-0 mb-0 mt-5 p-0'>
                        <Col lg="auto" md="auto" sm="auto" xs="auto" className='my_profile_col'>
                            <CustomButton
                                disabled={isLoading}
                                title={isEditProfile ? 'Cancel' : 'Edit Profile'}
                                onClick={handleCancelEdit}
                            >
                            </CustomButton>
                        </Col>
                        <Col></Col>
                        <Col lg="auto" md="auto" sm="auto" xs="auto" className='my_profile_col'>
                            {isEditProfile &&
                                <CustomButton
                                    loading={isLoading}
                                    disabled={fullName == props.fullName && email == props.email}
                                    title={isLoading ? 'Updating' : 'Update'}
                                    onClick={handleUpdateProfile}
                                >
                                </CustomButton>
                            }
                        </Col>
                    </Form.Group>
                </Card.Body>
            </Card>
            <style type="text/css">{`
                 .my_profile .card {
                    background: rgb(165,64,162);
                    background: white;
                    min-height: 200px;
                }
                .my_profile .card-header {
                    display: inline-flex;
                    align-items: center;
                    font-size: 15px;
                    font-weight: bold;
                    color: ${theme.COLORS.TEXT};
                    border: none;
                    padding-bottom: 0%;
                    background: none;
                }
                .my_profile .heading {
                    font-size: 18px;
                    padding-top: 10px;
                    width: 100%;
                }
                .my_profile .form_label {
                    font-size: 13px;
                    color: ${theme.COLORS.TEXT};
                }
                .my_profile .form_control:disabled {
                    background: none;
                    color: white;
                }
                @media (max-width: 1199px){
                    .my_profile .my_profile_col {
                        padding-left: 0.5%;
                        padding-right: 0.5%;
                    }
                }
                @media (max-width: 767px){
                    .my_profile {
                        padding: 1.5%;
                    }
                    .my_profile .my_profile_col {
                        padding: 0%;
                    }
                    .my_profile .card-body {
                        padding: ${isEditProfile ? '3%' : 'auto'};
                    }
                }
            `}</style>
        </div>
    )
}
