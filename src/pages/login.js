import React, { useState } from 'react'
import { Card, Dropdown, Form, Nav, Navbar } from 'react-bootstrap'
import theme from '../constants/theme'
import PhoneInput from 'react-phone-input-2'
import renderError from '../components/renderError'
import globalStyle from '../utils/styles/globalStyle';
import Link from 'next/link'
import urls from '../utils/urls'
import { saveTokenToStorage, removeTokenFromStorage } from '../utils/services/auth'
import axios from 'axios';
import CustomButton from '../components/CustomButton'
import jwt_decode from 'jwt-decode';
import Router from 'next/router';

import { BiLogInCircle } from 'react-icons/bi';
import SimpleToolbar from '../components/customer/simple-toolbar';
import StickyBottomNavbar from '../components/customer/sticky-bottom-navbar'

export default function Login(props) {
    const { user } = props;
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
        const loggedOut = await removeTokenFromStorage();
        if (loggedOut) {
            Router.replace('/');
        }
    }
    // End Of Acccount

    return (
        <div className='_login'>
            <SimpleToolbar title={'Login'} />
            <div style={{ marginTop: '10px', marginBottom: '10px', textAlign: 'center', color: theme.COLORS.MUTED }}>
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
                                onChange={(e) => { setPassword(e.target.value), setpasswordError('') }}
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
            <StickyBottomNavbar user={''} />
            <style jsx>{`
                ._login {
                    width: 100%;
                }
                ._login .signupSpan {
                    cursor: pointer;
                }
                ._login .link_div {
                    color: ${theme.COLORS.SEC};
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
