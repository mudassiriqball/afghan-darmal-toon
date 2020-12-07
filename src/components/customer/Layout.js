import React, { useState } from 'react'
import { Button, Card, DropdownButton, Dropdown, Form, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import theme from '../../constants/theme'
import PhoneInput from 'react-phone-input-2'
import renderError from '../renderError'
import { BiLogInCircle } from 'react-icons/bi'
import globalStyle from '../../utils/styles/globalStyle'
import Link from 'next/link'

export default function Layout(props) {
    const [showDropdown, setShowDropdown] = useState(false)
    const [passwordError, setPasswordError] = useState('')

    return (
        <>
            <Navbar style={{ background: theme.COLORS.SEC, padding: '0.45% 6%' }} variant='dark'>
                <Nav className="mr-auto">
                    <Nav.Link style={{ fontWeight: 'bold' }} className='text-uppercase' active href="">afghandarmaltoon@gmail.com</Nav.Link>
                    <Nav.Link style={{ fontWeight: 'bold' }} active href="">+92 3413657092</Nav.Link>
                </Nav>
                <Nav>
                    <Dropdown show={showDropdown}
                        flip={true}
                        onMouseEnter={() => setShowDropdown(true)}
                        onMouseLeave={() => setShowDropdown(false)}>
                        <Dropdown.Toggle style={{ background: theme.COLORS.SEC }}>
                            {'Login / Signup'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ width: '18rem', padding: '0' }} className='dropdown-menu dropdown-menu-right' >
                            <div style={{ width: '18rem', marginTop: '10px', marginBottom: '10px', textAlign: 'center', color: theme.COLORS.MUTED }}>
                                {'Don\'t have account ? '}
                                <span className='signupSpan'><Link href='/signup'>{'Signup'}</Link></span>
                            </div>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title style={{ color: theme.COLORS.MAIN, textAlign: 'center', marginBottom: '20px' }}>Signin</Card.Title>
                                    <Form>
                                        <Form.Group controlId="formBasicEmail">
                                            <PhoneInput
                                                inputStyle={{ width: '100%' }}
                                                country={'pk'}
                                                onlyCountries={['pk', 'af']}
                                                value={''}
                                                disableDropdown
                                                onChange={phone => { }}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formBasicPassword">
                                            <Form.Control type="password" placeholder="Password" />
                                            {renderError(passwordError)}
                                        </Form.Group>
                                        <Button variant="danger" style={{ width: '100%', }} type="submit">
                                            <BiLogInCircle style={globalStyle.leftIcon} />
                                            {'Login'}
                                        </Button>
                                    </Form>
                                    <a href="#" className='color w-100' style={{ fontSize: 'small', marginTop: '50px' }}>Forgot Password ?</a>
                                </Card.Body>
                            </Card>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Navbar>



            <Navbar style={{ background: theme.COLORS.WHITE, padding: '2.6% 6%' }} variant='light'>
                <Nav className="mr-auto">
                    <Nav.Link active href="">afghandarmaltoon@gmail.com</Nav.Link>
                    <Nav.Link active href="">+92 3413657092</Nav.Link>
                </Nav>
                <Nav className="">
                    <Nav.Link active href="">Login</Nav.Link>
                    <Nav.Link active href="">Register</Nav.Link>
                </Nav>
            </Navbar>
            <style jsx>{`
             .signupSpan {
                 cursor: pointer;
             }
             .signupSpan:hover {
                 cursor: pointer;
             }
            //  .color {
            //      color: red
            //  }
            `}</style>
        </>
    )
}
