// import React, { useState, useEffect, useRef, useCallback } from 'react'
// import axios from 'axios'
// import { Card, Form, Col, Row, Image, InputGroup, Button, Spinner } from 'react-bootstrap'
// import { getTokenFromStorage } from '../../../sdk/core/authentication-service'
// import GlobalStyleSheet from '../../../styleSheet'
// import MyButton from '../buttons/my-btn'
// import MuhalikConfig from '../../../sdk/muhalik.config'
// import userOrdersPageLimit from '../../../user-orders-page-limit'
// import useDimensions from "react-use-dimensions";

// import translate from '../../../i18n/translate'
// import Loading from '../loading'
// import NoDataFound from '../no-data-found'

// export default function Orders(props) {
//     const [pageNumber, setpageNumber] = useState(1)
//     const [orders, setOrders] = useState([])
//     const [unmounted, setunmounted] = useState(true)

//     const { user_orders_loading, user_orders_error, user_orders, user_orders_pages, user_orders_total, user_order_hasMore } =
//         userOrdersPageLimit(props.token, props._id, props.status, pageNumber, '5')

//     const observer = useRef()
//     const lastProducrRef = useCallback((node) => {
//         if (user_orders_loading) return
//         if (observer.current) observer.current.disconnect()
//         observer.current = new IntersectionObserver(entries => {
//             if (entries[0].isIntersecting && user_order_hasMore) {
//                 if (unmounted) {
//                     setpageNumber(pageNumber + 1)
//                 }
//             }
//         })
//         if (node) observer.current.observe(node)
//     }, [user_orders_loading, user_order_hasMore])

//     useEffect(() => {
//         setOrders([])
//         user_orders.forEach((element, index) => {
//             getProducts(element, index)
//         })
//         return () => {
//             setOrders([])
//             setunmounted(false)
//         }
//     }, [user_orders])

//     async function getProducts(element, index) {
//         let _order = {}
//         _order['_id'] = element._id
//         _order['sub_total'] = element.sub_total
//         _order['shipping_charges'] = element.shipping_charges
//         _order['entry_date'] = element.entry_date
//         let array = []

//         for (const e of element.products) {
//             let obj = {}
//             const url = MuhalikConfig.PATH + `/api/products/any/product-by-id/${e.p_id}`;
//             await axios.get(url).then(res => {
//                 let data = res.data.data[0]
//                 obj['product'] = data
//                 obj['quantity'] = e.quantity
//                 obj['price'] = e.price

//                 if (data.product_type != "simple-product") {
//                     data.product_variations.forEach((ee, ii) => {
//                         if (ee._id == e.variation_id) {
//                             obj['variation'] = ee
//                             return
//                         }
//                     })
//                 }
//             }).catch((error) => {
//                 // console.log('Error', error)
//             })
//             array.push(obj)
//         }
//         _order['products'] = array

//         setOrders(prevOrder => {
//             return [...new Set([...prevOrder, _order])]
//         })
//     }


//     return (
//         <div className='orders_style'>
//             {!props.isMobile && <label className='heading'>{
//                 props.status == 'pending' ?
//                     translate('pending_orders')
//                     :
//                     props.status == 'cancelled' ?
//                         translate('cancelled_orders')
//                         :
//                         props.status == 'delivered' ?
//                             translate('delivered_orders')
//                             :
//                             translate('returned_orders')
//             }</label>}
//             {user_orders_total > 0 ?
//                 <>
//                     {props.status == 'pending' &&
//                         <Row className='p-0 m-0 d-flex justify-content-center'>
//                             <Form.Label style={{ fontSize: '14px', color: `${GlobalStyleSheet.primry_color}` }}>{translate('for_cancel_order')}</Form.Label>
//                         </Row>
//                     }
//                     {orders && orders.map((element, index) =>
//                         orders.length == (index + 1) ?
//                             <Card key={index} ref={lastProducrRef} >
//                                 <CardBody element={element} status={props.status} index={index} />
//                             </Card>
//                             :
//                             <Card key={index} >
//                                 <CardBody element={element} status={props.status} index={index} />
//                             </Card>
//                     )}
//                     {user_orders_loading && <Loading />}
//                 </>
//                 :
//                 user_order_hasMore ?
//                     <Loading />
//                     :
//                     <NoDataFound />
//             }
//             <style type="text/css">{`
//                 .orders_style .card {
//                     border: none;
//                     background: rgb(165,64,162);
//                     background: linear-gradient(135deg, ${GlobalStyleSheet.primry_color} 0%, ${GlobalStyleSheet.primry_light_color} 100%);
//                     margin-bottom: 1.5%;
//                 }
//                 .orders_style .img {
//                     width: 100%;
//                 }
//                 .orders_style ._padding {
//                     display: flex;
//                     align-items: center;
//                     justify-content: center
//                     margin: 0%;
//                     font-size: 13px;
//                 }
//                 .orders_style .card-header {
//                     display: inline-flex;
//                     align-items: center;
//                     font-size: 15px;
//                     font-weight: bold;
//                     color: ${GlobalStyleSheet.primary_text_light_color};
//                     border: none;
//                     padding-bottom: 0%;
//                     background: none;
//                 }
//                 .orders_style .heading {
//                     font-size: 18px;
//                     padding-top: 10px;
//                     width: 100%;
//                 }

//                 .orders_style .form_label {
//                     font-size: 11px;
//                     color: ${GlobalStyleSheet.primary_text_light_color};
//                 }
//                 .orders_style .form_control:disabled {
//                     background: none;
//                     color: ${GlobalStyleSheet.primary_text_light_color};
//                     border: none;
//                     padding-left: 0%;
//                     padding-top: 0%;
//                     font-size: 14px;
//                     font-weight: bold;
//                 }
//                 @media (max-width: 1199px){
//                     .orders_style .order_col {
//                         padding-left: 0.5%;
//                         padding-right: 0.5%;
//                     }
//                 }
//                 @media (max-width: 767px){
//                     .orders_style {
//                         padding: 1.5%;
//                     }
//                     .orders_style .order_col {
//                         padding: 0%;
//                         margin: 0%;
//                     }
//                     .orders_style .card-body {
//                         padding: 2%;
//                     }
//                 }
//             `}</style>
//         </div >
//     )
// }

// function CardBody(props) {
//     const [ref, { x, y, width }] = useDimensions();
//     let element = props.element
//     let index = element.index
//     return (
//         <Card.Body>
//             <Row className='p-0 m-0'>
//                 <Form.Group as={Col} lg={4} md={4} sm={12} xs={12} className='order_col'>
//                     <Form.Label className='form_label'>{translate('order_id')}</Form.Label>
//                     <InputGroup>
//                         <Form.Control
//                             className='form_control'
//                             value={element._id}
//                             disabled={true}
//                         />
//                     </InputGroup>
//                 </Form.Group>
//                 <Form.Group as={Col} lg={4} md={4} sm={6} xs={6} className='order_col'>
//                     <Form.Label className='form_label'>{translate('sub_total')}</Form.Label>
//                     <InputGroup>
//                         <Form.Control
//                             className='form_control'
//                             value={element.sub_total}
//                             disabled={true}
//                         />
//                     </InputGroup>
//                 </Form.Group>
//                 <Form.Group as={Col} lg={4} md={4} sm={6} xs={6} className='order_col'>
//                     <Form.Label className='form_label'>{translate('placed_on')}</Form.Label>
//                     <InputGroup>
//                         <Form.Control
//                             className='form_control'
//                             value={element.entry_date.substring(0, 10)}
//                             disabled={true}
//                         />
//                     </InputGroup>
//                 </Form.Group>
//             </Row>
//             {element.products && element.products.map((e, i) =>
//                 <Card key={i} style={{ background: 'white', padding: '1%' }}>
//                     {e.product.product_type == "simple-product" ?
//                         <Row className='w-100 p-0 m-0'>
//                             <Col lg={1} md={2} sm={2} xs={3} style={{ paddingLeft: '0%' }} className='_padding'>
//                                 <Image ref={ref} className='img' thumbnail
//                                     style={{ maxHeight: width + 15 || '200px', minHeight: width + 15 || '200px' }}
//                                     src={e.product.product_image_link[0].url}
//                                 />
//                             </Col>
//                             <Col className='_padding'>
//                                 <div className='p-0 m-0'>{e.product.product_name}</div>
//                             </Col>
//                             <Col className='_padding' lg='auto' md='auto' sm='auto' xs='auto' style={{ color: 'blue' }}>
//                                 <label>{translate('rs')}{e.price}</label>
//                             </Col>
//                             <Col style={{ paddingRight: '0%' }} className='_padding' lg={2} md='auto' sm='auto' xs='auto'>
//                                 <label >{translate('quan')}: {e.quantity}</label>
//                             </Col>
//                         </Row>
//                         :
//                         <Row className='w-100 p-0 m-0'>
//                             <Col lg={2} md={2} sm={2} xs={3} style={{ paddingLeft: '0%' }} className='_padding'>
//                                 <Image ref={ref} className='img' thumbnail
//                                     style={{ maxHeight: width + 15 || '200px', minHeight: width + 15 || '200px' }}
//                                     src={e.variation.image_link[0].url}
//                                 />
//                             </Col>
//                             <Col className='_padding'>
//                                 <div className='p-0 m-0'>{e.product.product_name}</div>
//                             </Col>
//                             <Col className='_padding' lg='auto' md='auto' sm='auto' xs='auto' style={{ color: 'blue' }}>
//                                 <label>{translate('rs')}{e.variation.price * e.quantity}</label>
//                             </Col>
//                             <Col style={{ paddingRight: '0%' }} className='_padding' lg={2} md='auto' sm='auto' xs='auto'>
//                                 <label >{translate('quan')}: {e.quantity}</label>
//                             </Col>
//                         </Row>
//                     }
//                 </Card>
//             )}

//         </Card.Body>
//     )
// }
import React from 'react'

export default function Orders() {
    return (
        <div>

        </div>
    )
}
