import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Row, Col, Button, Form, Image, Card, Spinner, InputGroup, Nav } from 'react-bootstrap'
import axios from 'axios'
import { isMobile } from "react-device-detect";
import Link from 'next/link'
import useDimensions from "react-use-dimensions";
import Router from 'next/router'
React.useLayoutEffect = React.useEffect;

import theme from '../constants/theme';
import { getDecodedTokenFromStorage, getTokenFromStorage, checkTokenExpAuth } from '../utils/services/auth';
import CustomButton from '../components/CustomButton'
import AlertModal from '../components/alert-modal'

import CustomFormControl from '../components/custom-form-control';
import CalculateDiscountPrice from '../hooks/customer/calculate-discount';
import Loading from '../components/loading';
import urls from '../utils/urls'
import CssTransition from '../components/customer/CssTransition';

import { BiLogInCircle, BiDotsVertical } from 'react-icons/bi';
import { ImCart } from 'react-icons/im';
import { FiHome } from 'react-icons/fi';
import { TiPlus } from 'react-icons/ti';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaFacebook, FaMinus } from 'react-icons/fa';
import Toolbar from '../components/customer/toolbar'
import StickyBottomNavbar from '../components/customer/sticky-bottom-navbar';
import Layout from '../components/customer/Layout';
import Footer from '../components/customer/footer';

export async function getServerSideProps(context) {
    let categories_list = [];
    let sub_categories_list = [];
    await axios.get(urls.GET_REQUEST.CATEGORIES).then((res) => {
        categories_list = res.data.category.docs;
        sub_categories_list = res.data.sub_category.docs;
    }).catch((err) => {
    })
    return {
        props: {
            categories_list,
            sub_categories_list,
        },
    }
}

export default function Cart(props) {
    const [ref, { x, y, width }] = useDimensions();
    const [isProcedeOrder, setIsProcedeOrder] = useState(false)
    const [showDotView, setshowDotView] = useState(false);

    const [token, setToken] = useState(null)
    const [user, setUser] = useState({ _id: '', fullName: '', mobile: '', city: '', licenseNo: '', address: '', email: '', status: '', role: '', wishList: '', cart: '', entry_date: '' })

    const [cart_list, setCart_list] = useState([])
    const [isCartLoading, setIsCartLoading] = useState(true)
    const [cart_count, setCart_count] = useState(0)
    const [canUpdateCart, setCanUpdateCart] = useState(false);

    const [productsData, setProductsData] = useState('');
    const [sub_total, setSubTotal] = useState(0)

    // Alert Stuff
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMsg, setAlertMsg] = useState('');
    const [alertType, setAlertType] = useState('');

    useLayoutEffect(() => {
        async function getData() {
            const _decoded_token = await checkTokenExpAuth();
            if (_decoded_token != null) {
                setUser(_decoded_token)
                await axios.get(urls.GET_REQUEST.USER_BY_ID + _decoded_token._id).then((res) => {
                    setUser(res.data.data[0])
                    setCart_count(res.data.data[0].cart && res.data.data[0].cart.length)
                    setCart_list(res.data.data[0].cart)
                    setIsCartLoading(false)
                }).catch((err) => {
                    console.log('get user error');
                    setIsCartLoading(false)
                })
                const _token = await getTokenFromStorage();
                setToken(_token)
            }
        }
        getData()
        return () => {
        };
    }, []);


    useEffect(() => {
        calculateSubTotalPrice()
    }, [productsData])

    useEffect(() => {
        setProductsData('');
        cart_list && cart_list.forEach((element, index) => {
            getProducts(element, index);
        })
        async function getProducts(element, index) {
            await axios.get(urls.GET_REQUEST.GET_PRODUCT_BY_ID + element.p_id).then(res => {
                let obj = {}
                obj['_id'] = element._id;
                obj['p_id'] = element.p_id;
                obj['vendor_id'] = element.vendor_id;
                obj['product'] = res.data.data[0];
                obj['quantity'] = element.quantity;
                obj['check'] = false;
                obj['isLoading'] = false;
                setProductsData(prevPro => {
                    return [...new Set([...prevPro, obj])];
                })
            }).catch((err) => {
                console.log('Cart product getting err:', err)
            })
        }
        return () => {
        };
    }, [cart_list]);

    function calculateSubTotalPrice() {
        setSubTotal(0)
        let sum = 0
        productsData && productsData.forEach(element => {
            let count = element.product.price - element.product.discount / 100 * element.product.price
            let rounded = Math.floor(count);
            let decimal = count - rounded;
            if (decimal > 0) {
                sum += rounded + 1 * element.quantity
            } else {
                sum += rounded * element.quantity
            }
        })
        setSubTotal(sum)
    }

    function handleSetQuantity(quan, index) {
        let copyArray = []
        copyArray = Object.assign([], productsData)
        copyArray[index].quantity = quan
        setProductsData(copyArray)
    }

    // Delete Cart Data Single
    async function handleDeleteCart(obj_id, index) {
        let copyArray = []
        copyArray = Object.assign([], productsData)
        copyArray[index].isLoading = true
        setProductsData(copyArray)
        await axios({
            method: 'PUT',
            url: urls.PUT_REQUEST.CLEAR_CART + user._id,
            params: { obj_id: obj_id },
            headers: {
                'authorization': token
            }
        }).then(res => {
            let copyArray = []
            copyArray = Object.assign([], productsData)
            copyArray[index].isLoading = true
            setProductsData(copyArray)
            copyArray.splice(index, 1)
            setCart_count(cart_count - 1)
            setProductsData(copyArray);
            setAlertType('success');
            setAlertMsg('Item Removed Successfully from Cart');
            setShowAlertModal(true);
        }).catch(err => {
            let copyArray = []
            copyArray = Object.assign([], productsData)
            copyArray[index].isLoading = false
            setProductsData(copyArray)
            setAlertType('error');
            setAlertMsg('Cart Item Removed Failed!\nPlease Try Again Later.');
            setShowAlertModal(true);
            console.log('Cart item delete error:', err)
        })
    }
    async function handleClearCart() {
        await axios({
            method: 'DELETE',
            url: urls.DELETE_REQUEST.DELETE_CART + user._id,
            headers: {
                'authorization': token
            }
        }).then(res => {
            Router.reload();
        }).catch(err => {
            console.log('Clear Cart Data Failed Error:', err)
        })
    }
    // End of delete cart

    function handlePlaceOrderError(element) {
        setAlertType('error');
        setAlertMsg('Product stock out of stock, change stock and try again');
        setShowAlertModal(true);
        let copyArray = Object.assign([], productsData)
        let obj = {}
        obj = copyArray[element[0].index]
        obj['err'] = true
        copyArray[element.index] = obj;
        setProductsData(copyArray)
    }

    return (
        <div className='_cart'>
            <Layout
                user={user}
                token={token}
                categories_list={props.categories_list}
                sub_categories_list={props.sub_categories_list}
            />
            <AlertModal
                onHide={(e) => setShowAlertModal(false)}
                show={showAlertModal}
                alertType={alertType}
                message={alertMsg}
            />
            <Card className="text-black" style={{ background: `${theme.COLORS.WHITE}`, border: 'none' }}>
                <Card.Img src="cart_background.jpg" alt="Card image"
                    style={{
                        minWidth: '100%', maxWidth: '100%', minHeight: isMobile ? '60vw' : '35vw', maxHeight: isMobile ? '60vw' : '35vw', border: 'none',
                        borderBottomLeftRadius: '20%', borderBottomRightRadius: '20%',
                        borderBottom: `5px solid ${theme.COLORS.MAIN}`,
                    }} />
                <Card.ImgOverlay className='justify-content-center flex align-items-center'>
                    <Card.Title style={{ fontSize: isMobile ? '25px' : '70px', fontWeight: 'bolder', color: `${theme.COLORS.MAIN}` }}>CART</Card.Title>
                    <Card.Text style={{ fontSize: isMobile ? '16px' : '30px', fontWeight: 'bolder', color: `${theme.COLORS.MAIN}` }}>Your Partner for Medical Cannabis</Card.Text>
                    <div className='d-flex flex-row justify-content-center flex' style={{ position: 'absolute', bottom: isMobile ? '-25px' : '-40px', left: '0px', right: '0px' }}>
                        <div className='cart_link'>
                            <Nav.Link href="/" style={styles.boxStyle}>
                                <FiHome style={{
                                    color: theme.COLORS.WHITE,
                                    fontSize: '30px',
                                    alignSelf: 'center'
                                }} />
                            </Nav.Link>
                        </div>
                        <div className='cart_link'>
                            <Nav.Link href="#" style={styles.boxStyle}>
                                <ImCart style={{
                                    color: theme.COLORS.WHITE,
                                    fontSize: '30px',
                                    alignSelf: 'center'
                                }}
                                />
                            </Nav.Link>
                        </div>
                        <div className='cart_link'>
                            <Nav.Link href="#" onClick={() => setshowDotView(!showDotView)} style={styles.boxStyle}>
                                <BiDotsVertical style={{
                                    color: theme.COLORS.WHITE,
                                    fontSize: '30px',
                                    alignSelf: 'center'
                                }} />
                            </Nav.Link>
                        </div>
                    </div>
                </Card.ImgOverlay>
            </Card>
            <CssTransition show={showDotView} hide={() => setshowDotView(false)} />
            <label style={{ fontSize: isMobile ? '16px' : '20px', color: `${theme.COLORS.MAIN}`, fontWeight: 'bold', textAlign: 'center', marginTop: '100px', width: '100%' }}>{'----  SHOPPING  ----'}</label>
            <label style={{ fontSize: isMobile ? '20px' : '30px', color: `${theme.COLORS.SEC}`, fontWeight: 1000, textAlign: 'center', marginTop: '10px', width: '100%' }}>{'CART DATA'}</label>

            {/* Cart Data */}
            <div className='cart'>
                {isProcedeOrder ?
                    <ProcedeOrder
                        productsData={productsData}
                        token={token}
                        user={user}
                        cancel={() => setIsProcedeOrder(false)}
                        sub_total={sub_total}
                        clearCart={handleClearCart}
                        handlePlaceOrderError={handlePlaceOrderError}
                    />
                    :
                    isCartLoading ?
                        <Loading />
                        :
                        <>
                            <Row>
                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <Card style={{ border: `1px solid ${theme.COLORS.LIGHT_GRAY}`, boxShadow: `0px 0px 10px 0.5px ${theme.COLORS.LIGHT_GRAY}`, borderRadius: '0px' }}>
                                        <Card.Header className='pb-0 mb-0 bl-0 br-0'>
                                            <Row noGutters>
                                                <Col lg={4} md={4} sm={12} xs={12} className='d-flex justify-content-center align-items-center'>
                                                    <Card.Title>Product</Card.Title>
                                                </Col>
                                                <Col lg={4} md={4} sm={12} xs={12} className='d-flex justify-content-center align-items-center'>
                                                    <Card.Title>Quantity</Card.Title>
                                                </Col>
                                                <Col lg={4} md={4} sm={12} xs={12} className='d-flex justify-content-center align-items-center'>
                                                    <Card.Title>Total</Card.Title>
                                                </Col>
                                            </Row>
                                        </Card.Header>
                                        {productsData === '' ?
                                            <h6 className='w-100 text-center p-5' style={{ color: theme.COLORS.GRAY }}>{'No Data Found'}</h6>
                                            :
                                            productsData.map((element, index) =>
                                                <Card key={element._id} style={{ borderBottom: `1px solid ${theme.COLORS.SHADOW}` }}>
                                                    <Card.Body className='card_body' style={{ border: element.err ? '1px solid red' : null }}>
                                                        {element.isLoading ?
                                                            <Spinner animation='border' variant="danger" />
                                                            :
                                                            <AiOutlineDelete onClick={() => handleDeleteCart(element._id, index)} style={{ fontSize: '30px', color: theme.COLORS.DANGER, marginRight: '10px', cursor: 'pointer' }} />
                                                        }
                                                        <Row className='w-100'>
                                                            <Col lg={4} md={4} sm={12} xs={12} className='d-flex flex-row  justify-content-center align-items-center'>
                                                                <Image ref={ref} className='cart_img'
                                                                    style={{ maxHeight: width + width / theme.SIZES.IMAGE_HEIGHT_DIVIDE, minHeight: width + width / theme.SIZES.IMAGE_HEIGHT_DIVIDE }}
                                                                    src={element.product && element.product.imagesUrl && element.product.imagesUrl[0].imageUrl}
                                                                />
                                                                <div className='p-0 m-3'>{element.product && element.product.name}</div>
                                                            </Col>
                                                            <Col lg={4} md={4} sm={12} xs={12} className='d-flex justify-content-center align-items-center'>
                                                                <div className='d-flex flex-row align-items-center' style={{ height: '40px', border: `2px solid ${theme.COLORS.LIGHT_GRAY}`, borderRadius: '3px' }}>
                                                                    <FaMinus onClick={() => {
                                                                        if (element.quantity > 1 && canUpdateCart) {
                                                                            handleSetQuantity(element.quantity - 1, index)
                                                                        }
                                                                    }} style={{ fontSize: '15px', margin: '0% 20px', cursor: 'pointer', color: theme.COLORS.MAIN }} />
                                                                    <label style={{ margin: 'auto' }}>{element.quantity}</label>
                                                                    <TiPlus onClick={() => {
                                                                        if (element.quantity < element.product.stock && canUpdateCart) {
                                                                            handleSetQuantity(element.quantity + 1, index)
                                                                        }
                                                                    }} style={{ fontSize: '17px', margin: '0% 20px', cursor: 'pointer', color: theme.COLORS.MAIN }} />
                                                                </div>
                                                            </Col>
                                                            <Col lg={4} md={4} sm={12} xs={12} className='d-flex justify-content-center align-items-center'>
                                                                <h6 className='p-0 m-0' style={{ color: theme.COLORS.MAIN, fontWeight: 'bold' }}>
                                                                    {'Rs: '}
                                                                    <CalculateDiscountPrice price={element.product && element.product.price} discount={element.product && element.product.discount} />
                                                                </h6>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            )}
                                    </Card>
                                </Col>
                                <Col lg={12} md={12} sm={12} xs={12} className='d-flex flex-row pt-5 pl-2 pr-2' style={{ justifyContent: 'center' }}>
                                    <CustomButton
                                        style={{ borderRadius: '0px' }}
                                        rounded={false}
                                        block={productsData === '' ? false : true}
                                        size={productsData === '' ? 'lg' : 'sm'}
                                        title={'CONTINUE SHOPPING'}
                                        onClick={() => Router.push('/')}
                                    />
                                    {productsData !== '' ?
                                        <>
                                            <div className='w-75' />
                                            {canUpdateCart ?
                                                <CustomButton
                                                    block
                                                    title={'CANCEL UPDATE'}
                                                    onClick={() => { setCanUpdateCart(false), Router.reload() }}
                                                />
                                                :
                                                <CustomButton
                                                    block
                                                    title={'UPDATE CART'}
                                                    onClick={() => setCanUpdateCart(true)}
                                                />}
                                        </>
                                        :
                                        null
                                    }
                                </Col>
                            </Row>
                            <div style={{ borderBottom: `1px solid ${theme.COLORS.SHADOW}`, minHeight: '50px', minWidth: '100%', marginBottom: '20px' }} />
                            <Row>
                                <Col></Col>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Card style={{ border: `1px solid ${theme.COLORS.LIGHT_GRAY}`, boxShadow: `0px 0px 10px 0.5px ${theme.COLORS.SHADOW}`, borderRadius: '0px' }}>
                                        <Card.Body>
                                            <h3 style={{ color: theme.COLORS.GRAY, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>{'Order Summary'}</h3>
                                            <div style={{ padding: '20px' }}>
                                                <div className='d-inline-flex w-100 mt-4' style={{ fontSize: '14px', color: theme.COLORS.TEXT }}>
                                                    <h6 className='mr-auto'>{'Sub Total'}</h6>
                                                    <h6>{'Rs. '}{sub_total}</h6>
                                                </div>
                                                <div className='d-inline-flex w-100 mt-2' style={{ fontSize: '14px', color: theme.COLORS.TEXT }}>
                                                    <h6 className='mr-auto'>{'Shipping Charges'}</h6>
                                                    <h6>{'Rs. '}{'0'}</h6>
                                                </div>
                                                <hr style={{ color: theme.COLORS.SHADOW }} />
                                                <div className='d-inline-flex w-100 mb-2' style={{ fontSize: '14px', color: theme.COLORS.TEXT }}>
                                                    <h6 className='mr-auto'>{'Total'}</h6>
                                                    <h6>{'Rs. '}{'0'}</h6>
                                                </div>
                                            </div>
                                            <CustomButton
                                                title={'PROCEED TO CHECKOUT'}
                                                onClick={() => setIsProcedeOrder(true)}
                                                disabled={productsData == ''}
                                                block
                                            >
                                            </CustomButton>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                }
            </div>
            <Footer />
            <StickyBottomNavbar user={user} />
            <style type="text/css">{`
                .cart_link {
                    border-radius: 20px;
                    overflow: hidden;
                    margin: 0px 2px;
                    background: ${theme.COLORS.MAIN};
                }
                .cart_link:hover {
                    background: ${theme.COLORS.SEC};
                }
                .cart{
                    padding: 2% 15%;
                    min-height: 75vh;
                }
                .cart .card{
                    border: none;
                }
                .cart .card_body{
                    display: inline-flex;
                    align-items: center;
                    padding: 1%;
                    margin: 0%;
                }
                .cart_img{
                    width: 50px;
                }
                @media (max-width: 1199px){
                    .cart{
                        padding: 2% 12%;
                    }
                }
                @media (max-width: 991px){
                    .cart{
                        padding: 2% 9%;
                    }
                }
                 @media (max-width: 767px){
                    .cart{
                        padding: 2% 7%;
                    }
                }
                 @media (max-width: 575px){
                    .cart{
                        padding: 2% 5%;
                    }
                }
            `}</style>
            <style jsx>{`
                ._cart {
                    min-height: 100vh;
                    background: ${theme.COLORS.WHITE};
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
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

function ProcedeOrder(props) {
    const { productsData, token, user, cancel, sub_total, clearCart, handlePlaceOrderError } = props;
    const [cardRef, cardSize] = useDimensions();

    const [loading, setLoading] = useState(false)
    const [showAlertModal, setShowAlertModal] = useState(false)

    const [name, setName] = useState(user.fullName)
    const [city, setCity] = useState(user.city)
    const [mobile, setMobile] = useState(user.mobile)
    const [address, setAddress] = useState(user.address)

    const [nameError, setNameError] = useState('')
    const [cityError, setCityError] = useState('')
    const [mobError, setMobError] = useState('')
    const [addressError, setAddressError] = useState('')

    // Payment
    const [cashOnDeliveryChecked, setCashOnDeliveryChecked] = useState(false);
    const [onlinePaymentChecked, setOnlinePaymentChecked] = useState(false);

    async function confirmOrder() {
        if (name == '' || city == '' || mobile == '' || address == '') {
            if (name == '') {
                setNameError('Enter Value')
            }
            if (city == '') {
                setCityError('Enter Value')
            }
            if (mobile == '') {
                setMobError('Enter Value')
            }
            if (address == '') {
                setAddressError('Enter Value')
            }
        } else {
            setLoading(true)
            let data = []
            productsData.forEach((element, index) => {
                let pp = 0
                let unmounted = true
                let count = element.product.price - element.product.discount / 100 * element.product.price
                let rounded = Math.floor(count);
                let decimal = count - rounded;
                if (decimal > 0 && unmounted) {
                    pp = rounded + 1;
                } else if (unmounted) {
                    pp = rounded
                }
                data.push({
                    'vendor_id': element.product.vendor_id,
                    'p_id': element.p_id,
                    'stock': element.quantity,
                    'price': pp
                })
            })

            await axios.post(urls.POST_REQUEST.PLACE_ORDER + user._id,
                {
                    c_name: name,
                    city: city,
                    mobile: mobile,
                    address: address,
                    sub_total: sub_total,
                    // shippingCharges: productsData.shippingCharges,
                    productsData: data,
                },
                {
                    headers: {
                        'authorization': token
                    }
                }).then((res) => {
                    setLoading(false)
                    if (res.data.code == 200) {
                        setShowAlertModal(true)
                        clearCart()
                    } else if (res.data.code == 201) {
                        cancel()
                        handlePlaceOrderError(res.data.data)
                    }
                }).catch((err) => {
                    console.log('kkkk:', err)
                    alert('Not  Added')
                })
        }
    }

    function handleSetCity(city) {
        setCity(city)
        setCityError('')
    }
    return (
        <div className='proced_order'>
            <AlertModal
                onHide={(e) => setShowAlertModal(false)}
                show={showAlertModal}
                alertType={'success'}
                message={'Place Order'}
            />

            <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                    <Card style={{ border: `1px solid ${theme.COLORS.LIGHT_GRAY}`, boxShadow: `0px 0px 10px 0.5px ${theme.COLORS.LIGHT_GRAY}`, borderRadius: '0px' }}>
                        <Card.Body>
                            <h3 style={{ color: theme.COLORS.GRAY, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>{'Personel Information'}</h3>
                            <div style={{ padding: '20px' }}>
                                <Row className='p-0 m-0'>
                                    <Col lg={4} md={4} sm={12} xs={12}>
                                        <Form.Label className='field_label'>{'Full Name'} <span> * </span> </Form.Label>
                                        <InputGroup>
                                            <CustomFormControl
                                                placeholder='Enter Full Name'
                                                type="text"
                                                value={name}
                                                onChange={(e) => { setName(e.target.value), setNameError('') }}
                                            />
                                            <Form.Row className='err'> {nameError} </Form.Row>
                                        </InputGroup>
                                    </Col>
                                    <Col lg={4} md={4} sm={6} xs={12}>
                                        <Form.Label className='field_label'>{'City'} <span> * </span></Form.Label>
                                        <InputGroup>
                                            <CustomFormControl
                                                placeholder='Enter City'
                                                type="text"
                                                value={city}
                                                onChange={(e) => handleSetCity(e.target.value)}
                                            />
                                            <Form.Row className='err'> {cityError} </Form.Row>
                                        </InputGroup>
                                    </Col>
                                    <Col lg={4} md={4} sm={6} xs={12}>
                                        <Form.Label className='field_label'>{'Mobile Number'}  <span> * </span> </Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type='number'
                                                min='0'
                                                placeholder='+966590911891'
                                                value={mobile}
                                                onChange={(e) => { setMobile(e.target.value), setMobError('') }}
                                            />
                                            <Form.Row className='err'> {mobError} </Form.Row>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row className='p-0 ml-0 mb-0 mr-0 mt-2'>
                                    <Col lg={12} md={12} sm={12} xs={12}>
                                        <Form.Label className='field_label'> {'Address'} <span> * </span> </Form.Label>
                                        <InputGroup>
                                            <CustomFormControl
                                                placeholder='Enter Address'
                                                type="text"
                                                value={address}
                                                onChange={(e) => { setAddress(e.target.value), setAddressError('') }}
                                            />
                                            <Form.Row className='err'> {addressError} </Form.Row>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row style={{ marginTop: '3%' }}>
                <Col lg={6} md={6} sm={12} xs={12}>
                    <Card ref={cardRef} style={{ border: `1px solid ${theme.COLORS.LIGHT_GRAY}`, boxShadow: `0px 0px 10px 0.5px ${theme.COLORS.LIGHT_GRAY}`, borderRadius: '0px' }}>
                        <Card.Body>
                            <h3 style={{ color: theme.COLORS.GRAY, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>{'Order Summary'}</h3>
                            <div style={{ padding: '20px' }}>
                                <div className='d-inline-flex w-100 mt-4' style={{ fontSize: '14px', color: theme.COLORS.TEXT }}>
                                    <h6 className='mr-auto'>{'Sub Total'}</h6>
                                    <h6>{'Rs. '}{sub_total + ''}</h6>
                                </div>
                                <div className='d-inline-flex w-100 mt-2' style={{ fontSize: '14px', color: theme.COLORS.TEXT }}>
                                    <h6 className='mr-auto'>{'Shipping Charges'}</h6>
                                    <h6>{'Rs. '}{'0'}</h6>
                                </div>
                                <hr style={{ color: theme.COLORS.SHADOW }} />
                                <div className='d-inline-flex w-100 mb-2' style={{ fontSize: '14px', color: theme.COLORS.TEXT }}>
                                    <h6 className='mr-auto'>{'Total'}</h6>
                                    <h6>{'Rs. '}{'0'}</h6>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6} md={6} sm={12} xs={12}>
                    <Card style={{ border: `1px solid ${theme.COLORS.LIGHT_GRAY}`, boxShadow: `0px 0px 10px 0.5px ${theme.COLORS.LIGHT_GRAY}`, borderRadius: '0px', minHeight: cardSize.height, maxHeight: cardSize.height }}>
                        <Card.Body>
                            <h3 style={{ color: theme.COLORS.GRAY, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>{'Payment Option'}</h3>
                            <div style={{ padding: '20px' }}>
                                <Form.Group controlId="delivery" className='d-flex flex-row'>
                                    <Form.Label>Cash on Delivery</Form.Label>
                                    <Form.Check type="switch" checked={cashOnDeliveryChecked} onChange={(e) => { setCashOnDeliveryChecked(true), setOnlinePaymentChecked(false) }} label="" style={{ marginLeft: '20px' }} />
                                </Form.Group>
                                <Form.Group controlId="online" className='d-flex flex-row'>
                                    <Form.Label>Online Payment</Form.Label>
                                    <Form.Check type="switch" checked={onlinePaymentChecked} onChange={(e) => { setOnlinePaymentChecked(true), setCashOnDeliveryChecked(false) }} label="" style={{ marginLeft: '20px' }} />
                                </Form.Group>
                            </div>
                            <div className='d-flex flex-row'>
                                <CustomButton
                                    block
                                    title={'BACK'}
                                    onClick={cancel}
                                />
                                <div style={{ width: '20px' }} />
                                <CustomButton
                                    block
                                    title={onlinePaymentChecked ? 'PROCEED TO PAYMENT' : 'PLACE ORDER'}
                                    onClick={confirmOrder}
                                    loading={loading}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <style type="text/css">{`
                .proced_order {
                    padding: 5% 0%;
                }
                .proced_order .field_label {
                    font-size: 12px;
                }
                .proced_order .rs_label {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    color: gray;
                }
                .proced_order .center {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    color: blue;
                }
                .proced_order .err {
                    color: ${theme.COLORS.ERROR};
                    margin-left: 2px;
                    font-size: 12px;
                    width: 100%;
                }
            `}</style>
        </div>
    )
}

const styles = {
    boxStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: isMobile ? '60px' : '80px',
        height: isMobile ? '60px' : '80px',
        color: 'whitesmoke'
    },
}