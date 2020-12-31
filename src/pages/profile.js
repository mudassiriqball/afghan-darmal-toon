import React, { useState, useEffect } from 'react';
import Router from 'next/router'
import axios from 'axios'
import { Row, Col, ListGroup } from 'react-bootstrap'
import { faUserCircle, faImage, faThumbsUp, faClock } from '@fortawesome/free-regular-svg-icons'
import { getDecodedTokenFromStorage, removeTokenFromStorage, getTokenFromStorage, checkTokenExpAuth } from '../utils/services/auth';
import AlertModal from '../components/alert-modal'
import ManageAccount from '../components/profile/manage-account'
import MyProfile from '../components/profile/my-profile'
import Address from '../components/profile/address'
import ChangeProfilePicture from '../components/profile/change-profile-picture'
import ManageOrders from '../components/profile/manage-orders'
import Orders from '../components/profile/orders'
import MyWishlist from '../components/profile/my-wishlist';
import urls from '../utils/urls';
import theme from '../constants/theme';
import Toolbar from '../components/customer/toolbar';
import StickyBottomNavbar from '../components/customer/sticky-bottom-navbar';

export async function getServerSideProps(context) {
    let categories_list = []
    let sub_categories_list = []

    await axios.get(urls.GET_REQUEST.CATEGORIES).then((res) => {
        categories_list = res.data.category.docs
        sub_categories_list = res.data.sub_category.docs
    }).catch((error) => {
    })

    return {
        props: {
            categories_list,
            sub_categories_list
        },
    }
}

export default function Profile(props) {
    const [token, setToken] = useState(null)
    const [user, setUser] = useState({
        _id: '', fullName: '', mobile: '', city: '', licenseNo: '', address: '',
        email: '', status: '', role: '', wishList: '', cart: '', entry_date: ''
    })

    const [cart_count, setCart_count] = useState(0)
    const [view, setView] = useState('manage_account')

    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMsg, setAlertMsg] = useState('')

    const [dashboard_href, setdashboard_href] = useState('/')

    const [pending_orders_count, setPending_orders_count] = useState(0)
    const [delivered_orders_count, setDelivered_orders_count] = useState(0)
    const [cancelled_orders_count, setCancelled_orders_count] = useState(0)
    const [returned_orders_count, setReturned_orders_count] = useState(0)

    const [isOrderDisabled, setIsOrderDisabled] = useState(false)

    useEffect(() => {
        const getDecodedToken = async () => {
            const decodedToken = await getDecodedTokenFromStorage();
            if (decodedToken !== null) {
                setUser(decodedToken);
            }
        }
        getDecodedToken();
        return () => { }
    }, []);

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        async function getData() {
            const _decoded_token = await checkTokenExpAuth()
            if (_decoded_token != null) {
                setUser(_decoded_token);
                await getUser(_decoded_token._id);
                // await axios.get(urls.GET_REQUEST.CUSTOMER_ALL_ORDERS_COUNT + _decoded_token._id).then((res) => {
                //     setPending_orders_count(res.data.pending_orders_count)
                //     setDelivered_orders_count(res.data.delivered_orders_count)
                //     setCancelled_orders_count(res.data.cancelled_orders_count)
                //     setReturned_orders_count(res.data.returned_orders_count)
                // }).catch((error) => {
                //     console.log('user order count error in profile',error)
                // })
                const _token = await getTokenFromStorage();
                if (_token !== null)
                    setToken(_token)
            } else {
                Router.replace('/')
            }
        }
        getData()
        return () => {
            unmounted = false
            source.cancel();
        };
    }, []);

    async function getUser(id) {
        await axios.get(urls.GET_REQUEST.USER_BY_ID + id).then((res) => {
            setUser(res.data.data[0]);
        }).catch((err) => {
            console.log('Get user error in profile', err);
        })
    }

    useEffect(() => {
        if (view == 'pending_orders' || view == 'cancelled_orders' || view == 'delivered_orders' || view == 'returned_orders') {
            setIsOrderDisabled(true)
            setTimeout(() => {
                setIsOrderDisabled(false)
            }, 3000);
        }
    }, [view])

    useEffect(() => {
        if (user.role == 'admin') {
            setdashboard_href('/admin')
        }
        return () => {
        }
    }, [user])

    function handleShowAlert(msg) {
        setAlertMsg(msg)
        setShowAlertModal(true)
    }

    return (
        <div className='profile'>
            <Toolbar user={user} />
            <AlertModal
                onHide={(e) => setShowAlertModal(false)}
                show={showAlertModal}
                header={'Success'}
                message={alertMsg}
                iconname={faThumbsUp}
                color={'green'}
            />
            {/* <Layout
                role={user.role}
                fullName={user.fullName}
                cart_count={cart_count}
                categories_list={props.categories_list}
                sub_categories_list={props.sub_categories_list}
                {...props}
            > */}
            <div className='_div'>
                <Row>
                    <Col lg={3} md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item style={{ color: view == 'manage_account' || view == 'my_profile' || view == 'change_picture' || view == 'address' ? 'blue' : 'black' }}
                                onClick={() => { setView('manage_account') }}
                            >
                                {'Manage Account'}
                            </ListGroup.Item>
                            <ListGroup.Item style={{ color: view == 'my_profile' && 'blue' }}
                                onClick={() => { setView('my_profile') }}
                            >
                                {'My Profile'}
                            </ListGroup.Item>
                            <ListGroup.Item style={{ color: view == 'address' && 'blue' }}
                                onClick={() => { setView('address') }}
                            >
                                {'Address'}
                            </ListGroup.Item>
                            <ListGroup.Item style={{ color: view == 'change_picture' && 'blue' }}
                                onClick={() => { setView('change_picture') }}
                            >
                                {'Change Picture'}
                            </ListGroup.Item>
                            <ListGroup.Item onClick={() => Router.push('/reset-password')}>{'Change Password'}</ListGroup.Item>
                        </ListGroup>
                        {user.role == 'customer' && <>
                            <ListGroup variant="flush" >
                                <ListGroup.Item style={{ color: view == 'wish_list' ? 'blue' : 'black' }}
                                    onClick={() => { setView('wish_list') }}
                                >
                                    {'My Wishlist'}
                                </ListGroup.Item>
                            </ListGroup>

                            <ListGroup variant="flush" >
                                <ListGroup.Item style={{ color: view == 'manage_orders' || view == 'pending_orders' || view == 'delivered_orders' || view == 'cancelled_orders' || view == 'returned_orders' ? 'blue' : 'black' }}
                                    onClick={() => { setView('manage_orders') }}
                                >
                                    {'My Orders'}
                                </ListGroup.Item>
                                <ListGroup.Item disabled={isOrderDisabled} style={{ color: view == 'pending_orders' && 'blue' }}
                                    onClick={() => { setView('pending_orders') }}
                                >
                                    {'Pending'}
                                </ListGroup.Item>
                                <ListGroup.Item disabled={isOrderDisabled} style={{ color: view == 'delivered_orders' && 'blue' }}
                                    onClick={() => { setView('delivered_orders') }}
                                >
                                    {'Delivered'}
                                </ListGroup.Item>
                                <ListGroup.Item disabled={isOrderDisabled} style={{ color: view == 'cancelled_orders' && 'blue' }}
                                    onClick={() => { setView('cancelled_orders') }}
                                >
                                    {'Cancelled'}
                                </ListGroup.Item>
                                {/* <ListGroup.Item disabled={isOrderDisabled} style={{ color: view == 'returned_orders' && 'blue' }}
                                        onClick={() => { setView('returned_orders') }}
                                    >
                                        {'Returned'}
                                    </ListGroup.Item> */}
                            </ListGroup>
                        </>
                        }
                    </Col>
                    <Col style={{ overflowY: 'auto', height: '75vh' }}>
                        {view == 'manage_account' && <ManageAccount
                            _id={user._id}
                            role={user.role}
                            fullName={user.fullName}
                            shop_name={user.shop_name}
                            address={user.address}
                            shop_address={user.shop_address}
                            countary={user.countary}
                            city={user.city}
                            avatar={user.avatar}
                            mobile={user.mobile}
                            email={user.email}
                            setView={(value) => setView(value)}
                        />}
                        {view == 'my_profile' && <MyProfile
                            token={token}
                            _id={user._id}
                            role={user.role}
                            fullName={user.fullName}
                            gender={user.gender}
                            mobile={user.mobile}
                            email={user.email}
                            showAlert={(msg) => handleShowAlert(msg)}
                            reloadUser={() => getUser(user._id)}
                        />}
                        {view == 'address' && <Address
                            token={token}
                            _id={user._id}
                            role={user.role}
                            shop_name={user.shop_name}
                            address={user.address}
                            shop_address={user.shop_address}
                            countary={user.countary}
                            city={user.city}
                            showAlert={(msg) => handleShowAlert(msg)}
                            reloadUser={() => getUser(user._id)}
                        />}
                        {view == 'change_picture' && <ChangeProfilePicture
                            token={token}
                            _id={user._id}
                            avatar={user.avatar}
                            showAlert={(msg) => handleShowAlert(msg)}
                            reloadUser={() => getUser(user._id)}
                        />}
                        {view == 'wish_list' && <MyWishlist
                            token={token}
                            role={user.role}
                            _id={user._id}
                            wish_list={user.wish_list}
                            showAlert={(msg) => handleShowAlert(msg)}
                            reloadUser={() => getUser(user._id)}
                        />}
                        {view == 'manage_orders' && <ManageOrders
                            _id={user._id}
                            role={user.role}
                            pending_orders_count={pending_orders_count}
                            delivered_orders_count={delivered_orders_count}
                            cancelled_orders_count={cancelled_orders_count}
                            returned_orders_count={returned_orders_count}
                            setView={(value) => setView(value)}
                        />}
                        {view == 'pending_orders' && <Orders
                            token={token}
                            _id={user._id}
                            status={'pending'}
                            setView={(value) => setView(value)}
                        />}
                        {view == 'delivered_orders' && <Orders
                            token={token}
                            _id={user._id}
                            status={'delivered'}
                            setView={(value) => setView(value)}
                        />}
                        {view == 'cancelled_orders' && <Orders
                            token={token}
                            _id={user._id}
                            status={'cancelled'}
                            setView={(value) => setView(value)}
                        />}
                        {view == 'returned_orders' && <Orders
                            token={token}
                            _id={user._id}
                            status={'returned'}
                            setView={(value) => setView(value)}
                        />}
                    </Col>
                </Row>
            </div>
            <StickyBottomNavbar user={user} />
            <style type="text/css">{`
                .profile {
                    min-height: 100vh;
                    background: ${theme.COLORS.SECONDARY};
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                }
                .profile ._div {
                    margin: 1% 7% 0% 7%;
                    min-height: 75vh;
                }
                .profile .list-group-item:first-child {
                    background: none;
                    color: gray;
                    font-size: 16px;
                    cursor: default;
                }
                .profile .list-group-item:first-child:hover{
                    background: none;
                    color: blue;
                    cursor: pointer;
                    font-size: 16px;
                }
                .profile .list-group-item {
                    background: none;
                    color: gray;
                    font-size: 13px;
                    cursor: pointer;
                }
                .profile .list-group-item:hover {
                    background: ${theme.COLORS.MAIN};
                    color: blue;
                }
                .profile .row {
                    padding: 0%;
                    margin: 0%;
                }
                @media (max-width: 1199px){
                    .profile ._div {
                        margin: 1% 3% 0% 3%;
                    }
                }
                @media (max-width: 991px){
                    .profile ._div {
                        margin: 1% 0% 0% 0%;
                        padding: 0%;
                    }
                }
                @media (max-width: 767px){
                    .profile {
                        // display: none;
                    }
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








