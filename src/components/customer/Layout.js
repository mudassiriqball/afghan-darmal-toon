import React, { useState } from 'react'
import { Button, Card, DropdownButton, Dropdown, Form, Nav, Navbar, NavDropdown, Spinner, CardColumns } from 'react-bootstrap'
import theme from '../../constants/theme'
import PhoneInput from 'react-phone-input-2'
import renderError from '../renderError'
import globalStyle from '../../utils/styles/globalStyle'
import Link from 'next/link'
import urls from '../../utils/urls'
import { saveTokenToStorage } from '../../utils/services/auth'
import axios from 'axios';
import CustomButton from '../CustomButton'
import jwt_decode from 'jwt-decode';
import Router from 'next/router';
import { CSSTransition } from 'react-transition-group';

import { BiLogInCircle, BiDotsVertical, BiLogOutCircle } from 'react-icons/bi';
import { ImCart } from 'react-icons/im';
import { HiOutlineLocationMarker, HiOutlineMailOpen } from 'react-icons/hi';
import { AiOutlinePhone, AiFillTwitterCircle, AiFillInstagram, AiOutlineClose } from 'react-icons/ai';
import { FaFacebook } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { RiDashboardFill } from 'react-icons/ri';
import CssTransition from './CssTransition'

export default function Layout(props) {
    const { user } = props;
    const [showDropdown, setShowDropdown] = useState(false);
    const [passwordError, setpasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [mobileError, setmobileError] = useState('');
    const [error, setError] = useState('');

    // Login/Signup
    const handleLogin = async () => {
        if (mobile == '' || password == '') {
            if (mobile == '')
                setmobileError('Required *');
            else
                setmobileError('');
            if (password == '')
                setpasswordError('Required *');
            else
                setpasswordError('');
        } else {
            setLoading(true);
            let data = {};
            data = {
                mobile: '+' + mobile,
                password: password
            };
            await axios.post(urls.POST_REQUEST.LOGIN, data).then(function (res) {
                console.log('ttoao:', res.data)
                setLoading(false);
                saveTokenToStorage(res.data.token);
                const decodedToken = jwt_decode(res.data.token);
                console.log('token:', decodedToken)
                if (decodedToken.data.role == 'customer') {
                    Router.replace('/')
                } else if (decodedToken.data.role == 'admin') {
                    Router.replace('/admin')
                } else {
                    Router.replace('/')
                }
            }).catch(function (err) {
                setLoading(false);
                setError('Incorrect mobile or password!')
                console.log('Login error:', err);
            });
        }
    }
    const handleEnterKeyPress = (e) => {
        if (e.keyCode == 13 || e.which == 13) {
            handleLogin();
        }
    }
    // End Of Login/Signup

    // Acccount
    const logoutUser = async () => {
        if (await removeTokenFromStorage()) {
            Router.replace('/');
        }
    }
    // End Of Acccount


    // 2nd Nav
    const [pagesHover, setpagesHover] = useState(false);
    const [homeHover, sethomeHover] = useState(false);
    const [servicesHover, setservicesHover] = useState(false);
    const [showHomeDropDown, setshowHomeDropDown] = useState(false);
    const [showPagesDropDown, setshowPagesDropDown] = useState(false);
    const [showServicesDropDown, setshowServicesDropDown] = useState(false);



    // Dots View
    const [dotsView, setDotsView] = useState(false);

    return (
        <div className='_div'>
            <Navbar style={{ background: theme.COLORS.SEC, padding: '0.45% 6%' }} variant='dark'>
                <Nav className="mr-auto">
                    <Nav.Link style={{ fontWeight: 'bold' }} className='text-uppercase' active href="">afghandarmaltoon@gmail.com</Nav.Link>
                    <Nav.Link style={{ fontWeight: 'bold' }} active href="">+92 3413657092</Nav.Link>
                </Nav>
                {/* Login/Signup */}
                {user.fullName === '' &&
                    <Nav>
                        <Dropdown show={showDropdown}
                            flip={"true"}
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}>
                            <Dropdown.Toggle as={Nav.Link} >
                                {'Login / Signup'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ width: '18rem', }} className='dropdown-menu dropdown-menu-right' >
                                <div style={{ width: '18rem', marginTop: '10px', marginBottom: '10px', textAlign: 'center', color: theme.COLORS.MUTED }}>
                                    {'Don\'t have account ? '}
                                    <span className='signupSpan'><Link href='/signup'>{'Signup'}</Link></span>
                                </div>
                                <Card style={{ border: 'none' }}>
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
                                                    onChange={phone => { setMobile(phone), setmobileError('') }}
                                                    onKeyPress={(e) => handleEnterKeyPress(e)}
                                                />
                                                {mobileError !== '' && renderError(mobileError)}
                                            </Form.Group>
                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Control
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Password"
                                                    onKeyPress={(e) => handleEnterKeyPress(e)}
                                                />
                                                {passwordError !== '' && renderError(passwordError)}
                                            </Form.Group>
                                            {error !== '' && renderError(error)}
                                            <CustomButton
                                                block
                                                loading={loading}
                                                disabled={loading}
                                                title={'Login'}
                                                onClick={() => handleLogin()}
                                            >
                                                {!loading && <BiLogInCircle style={globalStyle.leftIcon} />}
                                            </CustomButton>
                                        </Form>
                                        <a href="#" className='color w-100' style={{ fontSize: 'small', marginTop: '50px' }}>Forgot Password ?</a>
                                    </Card.Body>
                                </Card>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                }

                {/* Account */}
                {user.fullName !== '' &&
                    <Nav className="justify-content-center">
                        <Dropdown show={showDropdown}
                            flip={"true"}
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}>
                            <Dropdown.Toggle as={Nav.Link}
                                style={{ fontWeight: 'bold' }}
                            >
                                {'Account'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className='dropdown-menu dropdown-menu-right' style={{ border: 'none', paddingTop: '7px', background: 'none' }} >
                                <Card style={{ boxShadow: `1px 0px 3px lightgray` }}>
                                    <div className='link_div'>
                                        <Nav.Link href="#" onClick={() => setShowDropdown(false)} style={{ fontWeight: 'bolder', padding: '10px', color: theme.COLORS.SEC, fontSize: '12px', flexDirection: "row", alignItems: 'center' }}>
                                            <CgProfile style={{ color: theme.COLORS.SEC, fontSize: '20px', marginRight: '10px' }} />
                                            {'PROFILE'}
                                        </Nav.Link>
                                    </div>
                                    {user.role == 'admin' &&
                                        <div className='link_div'>
                                            <Nav.Link href="/admin" onClick={() => setShowDropdown(false)} style={{ fontWeight: 'bolder', padding: '10px', color: theme.COLORS.SEC, fontSize: '12px', flexDirection: "row", alignItems: 'center' }}>
                                                <RiDashboardFill style={{ color: theme.COLORS.SEC, fontSize: '20px', marginRight: '10px' }} />
                                                {'DASHBOARD'}
                                            </Nav.Link>
                                        </div>
                                    }
                                    {user.role == 'ministory' &&
                                        <div className='link_div'>
                                            <Nav.Link href="/admin" onClick={() => setShowDropdown(false)} style={{ fontWeight: 'bolder', padding: '10px', color: theme.COLORS.SEC, fontSize: '12px', flexDirection: "row", alignItems: 'center' }}>
                                                <RiDashboardFill style={{ color: theme.COLORS.SEC, fontSize: '20px', marginRight: '10px' }} />
                                                {'DASHBOARD'}
                                            </Nav.Link>
                                        </div>
                                    }
                                    <div className='link_div'>
                                        <Nav.Link href="#" onClick={() => logoutUser()} style={{ fontWeight: 'bolder', padding: '10px', color: theme.COLORS.SEC, fontSize: '12px', flexDirection: "row", alignItems: 'center' }}>
                                            <BiLogOutCircle style={{ color: theme.COLORS.SEC, fontSize: '20px', marginRight: '10px' }} />
                                            {'LOGOUT'}
                                        </Nav.Link>
                                    </div>
                                </Card>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                }
            </Navbar>























            {/* Nav Links */}
            <Navbar style={{ background: theme.COLORS.WHITE, padding: '1.5% 6%', justifyContent: 'center', flex: 1 }} variant='light'>
                <Nav className="justify-content-center" style={{ flex: 1 }}>
                    <Nav.Link href="/home" style={{ color: theme.COLORS.MAIN, fontWeight: 'bolder', fontSize: '25px' }}>AFGHAN DARMAL TOON</Nav.Link>
                </Nav>
                <Nav className="justify-content-center" style={{ flex: 1 }}>
                    {/* HOME */}
                    <Dropdown show={showHomeDropDown}
                        flip={"true"}
                        onMouseEnter={() => setshowHomeDropDown(true)}
                        onMouseLeave={() => setshowHomeDropDown(false)}>
                        <Dropdown.Toggle as={Nav.Link}
                            onMouseEnter={() => sethomeHover(true)}
                            onMouseLeave={() => sethomeHover(false)}
                            style={{ background: theme.COLORS.WHITE, fontWeight: 'bold', background: homeHover ? theme.COLORS.MAIN : theme.COLORS.WHITE, padding: '20px 30px' }}
                        >
                            {'HOME'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='dropdown-menu' style={{ border: 'none', paddingTop: '27px', background: 'none' }} >
                            <Card style={{ boxShadow: `1px 0px 7px lightgray` }}>
                                <div className='link_div'>
                                    <Nav.Link href="/" style={{ fontWeight: 'bolder', padding: '10px 30px' }}>HOME</Nav.Link>
                                </div>
                            </Card>
                        </Dropdown.Menu>
                    </Dropdown>


                    {/* PAGES */}
                    <Dropdown show={showPagesDropDown}
                        flip={"true"}
                        onMouseEnter={() => setshowPagesDropDown(true)}
                        onMouseLeave={() => setshowPagesDropDown(false)}>
                        <Dropdown.Toggle as={Nav.Link}
                            onMouseEnter={() => setpagesHover(true)}
                            onMouseLeave={() => setpagesHover(false)}
                            style={{ background: theme.COLORS.WHITE, fontWeight: 'bold', background: pagesHover ? theme.COLORS.MAIN : theme.COLORS.WHITE, padding: '20px 30px' }}
                        >
                            {'PAGES'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='dropdown-menu' style={{ border: 'none', paddingTop: '27px', background: 'none' }} >
                            <Card style={{ boxShadow: `1px 0px 7px lightgray` }}>
                                <div className='link_div'>
                                    <Nav.Link href="/cart" style={{ fontWeight: 'bolder', padding: '10px 30px' }}>CART</Nav.Link>
                                </div>
                                <div className='link_div'>
                                    <Nav.Link href="#" style={{ fontWeight: 'bolder', padding: '10px 30px' }}>LOL</Nav.Link>
                                </div>
                            </Card>
                        </Dropdown.Menu>
                    </Dropdown>


                    {/* SERVICES */}
                    <Dropdown show={showServicesDropDown}
                        flip={"true"}
                        onMouseEnter={() => setshowServicesDropDown(true)}
                        onMouseLeave={() => setshowServicesDropDown(false)}>
                        <Dropdown.Toggle as={Nav.Link}
                            onMouseEnter={() => setservicesHover(true)}
                            onMouseLeave={() => setservicesHover(false)}
                            style={{ background: theme.COLORS.WHITE, fontWeight: 'bold', background: servicesHover ? theme.COLORS.MAIN : theme.COLORS.WHITE, padding: '20px 30px' }}
                        >
                            {'SERVICES'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='dropdown-menu' style={{ border: 'none', paddingTop: '27px', background: 'none' }} >
                            <Card style={{ boxShadow: `1px 0px 7px lightgray` }}>
                                <div className='link_div'>
                                    <Nav.Link href="/" style={{ fontWeight: 'bolder', padding: '10px 30px' }}>HOME</Nav.Link>
                                </div>
                            </Card>
                        </Dropdown.Menu>
                    </Dropdown>

                </Nav>
                <Nav className="justify-content-center" style={{ flex: 1 }}>
                    <div className='cart'>
                        <Nav.Link href="#" onClick={() => setDotsView(!dotsView)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px' }}>
                            <BiDotsVertical style={styles.cart} />
                        </Nav.Link>
                    </div>
                    <div className='cart'>
                        <Nav.Link href="/cart" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px' }}>
                            <ImCart style={styles.cart} />
                        </Nav.Link>
                    </div>
                </Nav>
            </Navbar>

            <CssTransition show={dotsView} hide={() => setDotsView(false)} />

            <style jsx>{`
                ._div .signupSpan {
                    cursor: pointer;
                }
                ._div .signupSpan:hover {
                    cursor: pointer;
                }
                ._div .cart {
                    width: 60px;
                    height: 60px;
                    margin-left: 5%;
                    background: ${theme.COLORS.MAIN};
                }
                ._div .cart:hover {
                    background: ${theme.COLORS.SEC};
                }


                // 2nd Nav
                ._div .link_div {
                    color: ${theme.COLORS.SEC};
                }
                ._div .link_div:hover {
                    background: ${theme.COLORS.MAIN};
                    color: ${theme.COLORS.WHITE};
                }
            `}</style>
            <style jsx global>{`
                * {
                    font-family: Oswald,sans-serif;
                }
            `}</style>
        </div >
    )
}

const styles = {
    cart: {
        color: theme.COLORS.WHITE,
        fontSize: '30px',
        alignSelf: 'center'
    },
    dotsIcon: {
        color: theme.COLORS.MAIN,
        fontSize: '30px',
        alignSelf: 'center',
        marginRight: '15px',
    },
    dotsSocialIcon: {
        color: theme.COLORS.SEC,
        fontSize: '50px',
        margin: '15px',
    },
    dotsSocialIconFB: {
        color: theme.COLORS.SEC,
        fontSize: '47px',
        margin: '15px',
    }

}