import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Row, Col, Button, Form, Image, Card, Spinner, InputGroup, Nav } from 'react-bootstrap'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faThumbsUp, faTimes } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import useDimensions from "react-use-dimensions";
import theme from '../constants/theme';
import { getDecodedTokenFromStorage, getTokenFromStorage, checkTokenExpAuth } from '../utils/services/auth';
import Router from 'next/router'
import CustomButton from '../components/CustomButton'
import AlertModal from '../components/alert-modal'

React.useLayoutEffect = React.useEffect;

import CustomFormControl from '../components/custom-form-control';
import CalculateDiscountPrice from '../hooks/customer/calculate-discount';
import Loading from '../components/loading';
import urls from '../utils/urls'
import CssTransition from '../components/customer/CssTransition';

import { BiLogInCircle, BiDotsVertical } from 'react-icons/bi';
import { ImCart } from 'react-icons/im';
import { FiHome } from 'react-icons/fi';
import { HiOutlineLocationMarker, HiOutlineMailOpen } from 'react-icons/hi';
import { AiOutlinePhone, AiFillTwitterCircle, AiFillInstagram, AiOutlineClose } from 'react-icons/ai';
import { FaFacebook } from 'react-icons/fa';
import Toolbar from '../components/customer/toolbar'


export async function getServerSideProps(context) {
    let categories_list = []
    let sub_categories_list = []

    // const url = MuhalikConfig.PATH + '/api/categories/categories';
    // await axios.get(url).then((res) => {
    //     categories_list = res.data.category.docs,
    //         sub_categories_list = res.data.sub_category.docs
    // }).catch((error) => {
    // })

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
    const [products, setProducts] = useState([])

    const [checkAll, setCheckAll] = useState(false)
    const [sub_total, setSubTotal] = useState(0)
    const [shipping_charges, setShipping_charges] = useState(0)

    const [showErrorAlertModal, setShowErrorAlertModal] = useState(false)

    useLayoutEffect(() => {
        setProducts([])
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        async function getData() {
            const _decoded_token = await checkTokenExpAuth()
            if (_decoded_token != null) {
                // if (_decoded_token.role != 'customer') {
                //     Router.push('/');
                // } else {
                if (unmounted) {
                    setUser(_decoded_token)
                    await axios.get(urls.GET_REQUEST.USER_BY_ID + _decoded_token._id, { cancelToken: source.token }).then((res) => {
                        if (unmounted) {
                            setUser(res.data.data[0])
                            setCart_count(res.data.data[0].cart.length)
                            setCart_list(res.data.data[0].cart)
                            setIsCartLoading(false)
                        }
                    }).catch((err) => {
                        if (axios.isCancel(err)) return
                        setIsCartLoading(false)
                    })
                    setShipping_charges(50);
                    const _token = await getTokenFromStorage();
                    setToken(_token)
                }
                // }
            }
        }
        getData()
        return () => {
            unmounted = false
            source.cancel();
        };
    }, []);


    useEffect(() => {
        calculateSubTotalPrice()
    }, [products])

    useEffect(() => {
        setProducts([])
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        cart_list && cart_list.forEach((element, index) => {
            getProducts(element, index)
        })
        async function getProducts(element, index) {

            await axios.get(urls.GET_REQUEST.GET_PRODUCT_BY_ID + element.p_id, { cancelToken: source.token }).then(res => {
                if (unmounted) {
                    let obj = {}
                    obj['_id'] = element._id;
                    obj['p_id'] = element.p_id;
                    obj['variation_id'] = element.variation_id;
                    obj['stock'] = element.stock;
                    obj['product'] = res.data.data[0];
                    obj['check'] = false;
                    obj['isLoading'] = false;
                    setProducts(prevPro => {
                        return [...new Set([...prevPro, obj])];
                    })
                }
            }).catch((error) => {
                if (unmounted) {
                    // alert('Error')
                }
            })
        }
        return () => {
            unmounted = false
            source.cancel();
        };
    }, [cart_list])


    function calculateSubTotalPrice() {
        setSubTotal(0)
        let sum = 0
        products.forEach(element => {
            let count = element.product.price - element.product.discount / 100 * element.product.price
            let rounded = Math.floor(count);
            let decimal = count - rounded;
            if (decimal > 0) {
                sum += rounded + 1 * element.stock
            } else {
                sum += rounded * element.stock
            }
        })
        setSubTotal(sum)
    }
    function getCartCont(length) {
        let options = []
        for (let i = 0; i < length; i++) {
            options.push(
                <option key={i}>{i + 1}</option>
            )
        }
        return options
    }

    function handleSetQuantity(quan, index) {
        let copyArray = []
        copyArray = Object.assign([], products)
        copyArray[index].stock = quan
        setProducts(copyArray)
    }

    function handleAllCheck(e) {
        let copyArray = []
        copyArray = Object.assign([], products)
        if (e.target.checked) {
            products.forEach((element, index) => {
                copyArray[index].check = true
            })
            setCheckAll(true)
        } else {
            products.forEach((element, index) => {
                copyArray[index].check = false
            })
            setCheckAll(false)
        }
        setProducts(copyArray)
    }

    function handleCheck(isChecked, index) {
        let copyArray = []
        copyArray = Object.assign([], products)
        copyArray[index].check = !copyArray[index].check
        setProducts(copyArray)

        if (!isChecked) {
            setCheckAll(false)
        }
    }

    function handleAllDeleteClick() {
        products.forEach((element, index) => {
            if (element.check) {
                handleDeleteCart(element._id, index)
            }
        })
        Router.reload()
    }

    async function handleDeleteCart(obj_id, index) {
        let copyArray = []
        copyArray = Object.assign([], products)
        copyArray[index].isLoading = true
        setProducts(copyArray)
        await axios({
            method: 'PUT',
            url: urls.PUT_REQUEST.CLEAR_CART + user._id,
            params: { obj_id: obj_id },
            headers: {
                'authorization': token
            }
        }).then(res => {
            let copyArray = []
            copyArray = Object.assign([], products)
            copyArray.splice(index, 1)
            setCart_count(cart_count - 1)
            setProducts(copyArray)
        }).catch(err => {
            let copyArray = []
            copyArray = Object.assign([], products)
            copyArray[index].isLoading = false
            setProducts(copyArray)
            alert('Error')
        })
    }

    async function handleProcedeOrder() {
        setIsProcedeOrder(true)
    }

    async function handleClearCart() {
        await axios({
            method: 'DELETE',
            url: urls.DELETE_REQUEST.DELETE_CART + user._id,
            headers: {
                'authorization': token
            }
        }).then(res => {
            Router.reload()
        }).catch(err => {
            alert('Error')
        })
    }

    function handlePlaceOrderError(element) {
        setShowErrorAlertModal(true)
        let copyArray = Object.assign([], products)
        let obj = {}
        obj = copyArray[element[0].index]
        obj['err'] = true
        copyArray[element.index] = obj;
        setProducts(copyArray)
    }

    return (
        <div className='_cart'>
            <Toolbar user={user} />
            <AlertModal
                onHide={(e) => setShowErrorAlertModal(false)}
                show={showErrorAlertModal}
                header={'Error'}
                message={'Product stock out of stock, change stock and try again'}
                iconname={faTimes}
                color={'red'}
            />
            <Card className="text-black" style={{ background: `${theme.COLORS.WHITE}`, border: 'none' }}>
                <Card.Img src="cart_background.jpg" alt="Card image"
                    style={{
                        width: '100%', height: '35vw', border: 'none',
                        borderBottomLeftRadius: '20%', borderBottomRightRadius: '20%',
                        borderBottom: `5px solid ${theme.COLORS.MAIN}`,
                    }} />
                <Card.ImgOverlay className='justify-content-center flex align-items-center'>
                    <Card.Title style={{ fontSize: '70px', fontWeight: 'bolder', color: `${theme.COLORS.MAIN}` }}>CART</Card.Title>
                    <Card.Text style={{ fontSize: '30px', fontWeight: 'bolder', color: `${theme.COLORS.MAIN}` }}>Your Partner for Medical Cannabis</Card.Text>
                    <div className='d-flex flex-row justify-content-center flex' style={{ position: 'absolute', bottom: '-40px', left: '0px', right: '0px' }}>
                        <div className='cart_link'>
                            <Nav.Link href="/" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80px', height: '80px', color: 'whitesmoke' }}>
                                <FiHome style={{
                                    color: theme.COLORS.WHITE,
                                    fontSize: '30px',
                                    alignSelf: 'center'
                                }} />
                            </Nav.Link>
                        </div>
                        <div className='cart_link'>
                            <Nav.Link href="#" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80px', height: '80px', color: 'whitesmoke' }}>
                                <ImCart style={{
                                    color: theme.COLORS.WHITE,
                                    fontSize: '30px',
                                    alignSelf: 'center'
                                }}
                                />
                            </Nav.Link>
                        </div>
                        <div className='cart_link'>
                            <Nav.Link href="#" onClick={() => setshowDotView(!showDotView)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80px', height: '80px', color: 'whitesmoke' }}>
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
            <label style={{ fontSize: '20px', color: `${theme.COLORS.MAIN}`, fontWeight: 'bold', textAlign: 'center', marginTop: '100px', width: '100%' }}>{'----  SHOPPING  ----'}</label>
            <label style={{ fontSize: '30px', color: `${theme.COLORS.SEC}`, fontWeight: 1000, textAlign: 'center', marginTop: '10px', width: '100%' }}>{'CART DATA'}</label>


            <div className='cart'>
                {isProcedeOrder ?
                    <ProcedeOrder
                        products={products}
                        token={token}
                        user={user}
                        cancel={() => setIsProcedeOrder(false)}
                        shipping_charges={shipping_charges}
                        sub_total={sub_total}
                        clearCart={handleClearCart}
                        handlePlaceOrderError={handlePlaceOrderError}
                    />
                    :
                    isCartLoading ?
                        <Loading />
                        :
                        products == '' ?
                            <div style={{ minHeight: '70vh' }} className='w-100 d-flex align-items-center justify-content-center'>
                                <CustomButton
                                    title={'Continue Shopping'}
                                    onClick={() => Router.push('/')}>
                                </CustomButton>
                            </div>
                            :
                            < Row noGutters>
                                <Col className='_col' lg={8} md={8} sm={12} xs={12}>
                                    <div>
                                        <Card>
                                            <Card.Body className='card_body'>
                                                <Form.Check checked={checkAll} onChange={(e) => handleAllCheck(e)}></Form.Check>
                                                <div>{'Select All'}</div>
                                                <div className='delete' onClick={handleAllDeleteClick}>
                                                    <FontAwesomeIcon icon={faTrash} className='fontawesome' />
                                                    <div>{'Delete'}</div>
                                                </div>
                                            </Card.Body>
                                        </Card>

                                        {products && products.map((element, index) =>
                                            <Card key={element._id}>
                                                <Card.Body className='card_body' style={{ border: element.err ? '1px solid red' : null }}>
                                                    <Form.Check className='m-0 pr-0' checked={element.check} onChange={(e) => handleCheck(e.target.checked, index)} ></Form.Check>
                                                    {element.product.product_type == "simple-product" ?
                                                        <Row className='w-100 p-0 m-0'>
                                                            <Col lg={2} md={2} sm={2} xs={3} className='_padding'>
                                                                <Image ref={ref} className='cart_img' thumbnail
                                                                    style={{ maxHeight: width + 15 || '200px', minHeight: width + 15 || '200px' }}
                                                                    src={element.product.product_image_link[0].url}
                                                                />
                                                            </Col>
                                                            <Col className='_padding'>
                                                                <div className='p-0 m-0'>{element.product.product_name}</div>
                                                            </Col>
                                                            <Col className='_padding d-inline-flex' lg='auto' md='auto' sm='auto' xs='auto' style={{ color: 'blue' }}>
                                                                <div>{'Rs. '}</div>
                                                                <CalculateDiscountPrice price={element.product.price} discount={element.product.discount} />
                                                            </Col>
                                                            <Col className='d-flex flex-column _padding' lg={2} md='auto' sm='auto' xs='auto'>
                                                                <Form.Control as="select" size='sm' onChange={(e) => handleSetQuantity(e.target.value, index)} defaultValue="Choose...">
                                                                    <option>{element.stock}</option>
                                                                    {getCartCont(element.product.product_in_stock).map(element =>
                                                                        element
                                                                    )}
                                                                </Form.Control>
                                                                <div className='d-inline-flex mt-auto'>
                                                                    <Link href='/products/category/[category]/[sub_category]/[product]' as={`/products/category/${element.product.category.value}/${element.product.sub_category.value}/${element.product._id}`}>
                                                                        <a style={{ fontSize: '12px', marginRight: '10px' }}>{'View'}</a>
                                                                    </Link>
                                                                    <div className='delete' onClick={() => handleDeleteCart(element._id, index)}>
                                                                        <div>{element.isLoading ? <Spinner animation="grow" size="sm" /> : 'Delete'}</div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        :
                                                        <Row className='w-100 p-0 m-0'>
                                                            <Col lg={2} md={2} sm={2} xs={3} className='_padding'>
                                                                <Image ref={ref} className='cart_img' thumbnail
                                                                    style={{ maxHeight: width + 15 || '200px', minHeight: width + 15 || '200px' }}
                                                                    src={element.variation.image_link[0].url}
                                                                />
                                                            </Col>
                                                            <Col className='_padding'>
                                                                <div className='p-0 m-0'>{element.product.product_name}</div>
                                                            </Col>
                                                            <Col className='_padding d-inline-flex' lg='auto' md='auto' sm='auto' xs='auto' style={{ color: 'blue' }}>
                                                                <div>{'Rs. '}</div>
                                                                <CalculateDiscountPrice price={element.variation.price} discount={element.variation.discount} />
                                                            </Col>
                                                            <Col className='d-flex flex-column _padding' lg={2} md='auto' sm='auto' xs='auto'>
                                                                <Form.Control as="select" size='sm' onChange={(e) => handleSetQuantity(e.target.value, index)} defaultValue="Choose...">
                                                                    <option>{element.stock}</option>
                                                                    {getCartCont(element.variation.stock).map(element =>
                                                                        element
                                                                    )}
                                                                </Form.Control>
                                                                <div className='d-inline-flex mt-auto'>
                                                                    <Link href='/products/category/[category]/[sub_category]/[product]' as={`/products/category/${element.product.category.value}/${element.product.sub_category.value}/${element.product._id}`}>
                                                                        <a style={{ fontSize: '12px', marginRight: '10px' }}>{'View'}</a>
                                                                    </Link>
                                                                    <div className='delete' onClick={() => handleDeleteCart(element._id, index)}>
                                                                        <div>{element.isLoading ? <Spinner animation="grow" size="sm" /> : 'Delete'}</div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    }
                                                </Card.Body>
                                            </Card>
                                        )}
                                    </div>
                                </Col>
                                <Col lg={4} md={4} sm={12} xs={12} className='_col'>
                                    <Card>
                                        <Card.Body className='p-3'>
                                            <div>{'Order Summary'}</div>
                                            <div className='d-inline-flex w-100 mt-4' style={{ fontSize: '14px', color: 'blue' }}>
                                                <div className='mr-auto'>{'Sub Total'}</div>
                                                <div>{'Rs. '}{sub_total}</div>
                                            </div>
                                            <div className='d-inline-flex w-100 mt-2' style={{ fontSize: '14px', color: 'blue' }}>
                                                <div className='mr-auto'>{'Shipping Charges'}</div>
                                                <div>{'Rs. '}{shipping_charges}</div>
                                            </div>
                                            <hr style={{ color: 'blue' }} />
                                            <div className='d-inline-flex w-100 mb-2' style={{ fontSize: '14px', color: 'blue' }}>
                                                <div className='mr-auto'>{'Total'}</div>
                                                <div>{'Rs. '}{sub_total + shipping_charges}</div>
                                            </div>
                                            <CustomButton
                                                title={'Place Order'}
                                                onClick={handleProcedeOrder}
                                                disabled={products == ''}
                                                block={true}>
                                            </CustomButton>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                }
            </div>


            <style type="text/css">{`
                .cart_link {
                    width: 80px;
                    height: 80px;
                    border-radius: 20px;
                    overflow: hidden;
                    margin: 0px 2px;
                    background: ${theme.COLORS.MAIN};
                }
                .cart_link:hover {
                    background: ${theme.COLORS.SEC};
                }
                .cart{
                    margin: 1% 11% 2% 11%;
                    min-height: 75vh;
                }
                .cart ._col{
                    padding: 0.5%;
                }
                .cart .card{
                    border: none;
                    margin-bottom: 1.5%;
                }
                .cart .card_body{
                    display: inline-flex;
                    align-items: center;
                    padding: 1%;
                    margin: 0%;
                }
                ._padding{
                    padding: 0% 10px;
                    margin: 0%;
                    font-size: 13px;
                }
                .cart .delete{
                    margin-left: auto;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    color: gray;
                    cursor: pointer;
                }
                .cart .delete:hover{
                    color: #cc0000;
                }
                .cart .fontawesome{
                    margin-right: 5px;
                    height: 15px;
                    width: 15px;
                    max-width: 15px;
                    max-height: 15px;
                }
                .cart_img{
                    width: 100%;
                }
                @media (max-width: 1199px){
                    .cart{
                        margin: 1% 5% 2% 5%;
                    }
                }
                @media (max-width: 991px){
                    .cart{
                        margin: 1% 2% 2% 2%;
                    }
                    ._padding{
                        padding: 0% 4px;
                    }
                }
                 @media (max-width: 767px){
                    .cart{
                        margin: 1% 5% 2% 5%;
                    }
                    ._padding{
                        font-size: 12px;
                        padding: 0% 2px;
                    }
                }
                 @media (max-width: 575px){
                    .cart{
                        margin: 1% 1% 50px 1%;
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
                html,
                body {
                    padding: 0;
                    margin: 0;
                    font-family: Roboto, Helvetica Neue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;
                }
            `}</style>
        </div >
    )
}

function ProcedeOrder(props) {
    const [loading, setLoading] = useState(false)
    const [showAlertModal, setShowAlertModal] = useState(false)

    const [name, setName] = useState('')
    const [city, setCity] = useState('')
    const [mobile, setMobile] = useState('')
    const [address, setAddress] = useState('')

    const [nameError, setNameError] = useState('')
    const [cityError, setCityError] = useState('')
    const [mobError, setMobError] = useState('')
    const [addressError, setAddressError] = useState('')

    const [shipping_charges, setShipping_charges] = useState(props.shipping_charges)

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
            props.products.forEach((element, index) => {
                if (element.product.product_type == "simple-product") {
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
                        'stock': element.stock,
                        'price': pp
                    })
                } else {
                    let pp = 0
                    let unmounted = true
                    let count = element.variation.price - element.variation.discount / 100 * element.variation.price
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
                        'variation_id': element.variation_id,
                        'stock': element.stock,
                        'price': pp
                    })
                }
            })

            await axios.post(urls.POST_REQUEST.PLACE_ORDER + props.user._id,
                {
                    c_name: name,
                    city: city,
                    mobile: mobile,
                    address: address,
                    sub_total: props.sub_total,
                    shipping_charges: shipping_charges,
                    products: data,
                },
                {
                    headers: {
                        'authorization': props.token
                    }
                }).then((res) => {
                    setLoading(false)
                    if (res.data.code == 200) {
                        setShowAlertModal(true)
                        props.clearCart()
                    } else if (res.data.code == 201) {
                        props.cancel()
                        props.handlePlaceOrderError(res.data.data)
                    }
                }).catch((error) => {
                    console.log('kkkk:', error)
                    alert('Not  Added')
                })
        }
    }

    function handleSetCity(city) {
        setCity(city)
        setCityError('')
        if (city == 'Riyadh' || city == 'riyadh' || 'رياض' || 'الرياض') {
            setShipping_charges(25)
        } else {
            setShipping_charges(45)
        }
    }

    return (
        <div className='proced_order'>
            <AlertModal
                onHide={(e) => setShowAlertModal(false)}
                show={showAlertModal}
                header={'Success'}
                message={'Place Order'}
                iconname={faThumbsUp}
                color={'green'}
            />
            <Card>
                <Form.Group as={Card.Body}>
                    <Row className='p-0 m-0'>
                        <Col lg={4} md={4} sm={12} xs={12}>
                            <Form.Label className='field_label'>{'Full Name'}</Form.Label>
                            <InputGroup>
                                <CustomFormControl
                                    placeholder='Enter Full Name'
                                    type="text"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value), setNameError('') }}
                                />
                                <Form.Row className='error'> {nameError} </Form.Row>
                            </InputGroup>
                        </Col>
                        <Col lg={4} md={4} sm={6} xs={12}>
                            <Form.Label className='field_label'>{'City'}</Form.Label>
                            <InputGroup>
                                <CustomFormControl
                                    placeholder='Enter City'
                                    type="text"
                                    value={city}
                                    onChange={(e) => handleSetCity(e.target.value)}
                                />
                                <Form.Row className='error'> {cityError} </Form.Row>
                            </InputGroup>
                        </Col>
                        <Col lg={4} md={4} sm={6} xs={12}>
                            <Form.Label className='field_label'>{'Mobile Number'} </Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type='number'
                                    min='0'
                                    placeholder='+966590911891'
                                    value={mobile}
                                    onChange={(e) => { setMobile(e.target.value), setMobError('') }}
                                />
                                <Form.Row className='error'> {mobError} </Form.Row>
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
                                <Form.Row className='error'> {addressError} </Form.Row>
                            </InputGroup>
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group as={Card.Body}>
                    <Row >
                        <Col >
                            <Form.Label className='rs_label'>{'Sub Total'}</Form.Label>
                            <InputGroup className='center'>
                                <Form.Label>{'Rs. '}{props.sub_total}</Form.Label>
                            </InputGroup>
                        </Col>
                        <Col >
                            <Form.Label className='rs_label'>{'Shipping Charges'}</Form.Label>
                            <InputGroup className='center'>
                                <Form.Label>{'Rs. '}{shipping_charges}</Form.Label>
                            </InputGroup>
                        </Col>
                        <Col >
                            <Form.Label className='rs_label'>{'total'}</Form.Label>
                            <InputGroup className='center'>
                                <Form.Label>{'Rs. '}{props.sub_total + shipping_charges}</Form.Label>
                            </InputGroup>
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group as={Card.Body}>
                    <Row className='p-0 m-0'>
                        <Col>
                            <CustomButton
                                onClick={props.cancel}
                                block={true}
                                title={'Cancel'}
                            ></CustomButton>
                        </Col>
                        <Col>
                            <CustomButton
                                title={loading ? 'Placing Order' : 'Confirm Order'}
                                onClick={confirmOrder} block={true}
                                loading={loading}
                            >
                            </CustomButton>
                        </Col>
                    </Row>
                </Form.Group>

            </Card>
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
                .proced_order .error {
                    color: ${theme.COLORS.ERROR};
                    margin-left: 2px;
                    font-size: 12px;
                    width: 100%;
                }
            `}</style>
        </div>
    )
}
