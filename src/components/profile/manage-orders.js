// import { Card, Row, Col, Nav } from 'react-bootstrap'
// import GlobalStyleSheet from '../../../styleSheet'

// import translate from '../../../i18n/translate'
// import TranslateOption from '../../../i18n/translate-option'

// export default function ManageOrders(props) {
//     return (
//         <div className='manage_orders'>
//             <label className='heading'>{translate('manage_orders')}</label>
//             <Row className='p-0 m-0'>
//                 <Col lg={12} md={12} sm={12} xs={12} className='card_col'>
//                     <Card style={{ minHeight: '150px' }} >
//                         <Card.Header>
//                             <div className='mr-auto'>{translate('pending')}</div>
//                             <Nav.Link onClick={() => { props.setView('pending_orders') }}>{translate('VIEW')}</Nav.Link>
//                         </Card.Header>
//                         <Card.Body className='w-100 d-flex align-items-center justify-content-center'>
//                             <label className='count_label'>{props.pending_orders_count}</label>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col className='card_col'>
//                     <Card style={{ minHeight: '150px' }} >
//                         <Card.Header>
//                             <div className='mr-auto'>{translate('delivered')}</div>
//                             <Nav.Link onClick={() => { props.setView('delivered_orders') }}>{translate('VIEW')}</Nav.Link>
//                         </Card.Header>
//                         <Card.Body className='w-100 d-flex align-items-center justify-content-center'>
//                             <label className='count_label'>{props.delivered_orders_count}</label>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col className='card_col'>
//                     <Card style={{ minHeight: '150px' }} >
//                         <Card.Header>
//                             <div className='mr-auto'>{translate('cancelled')}</div>
//                             <Nav.Link onClick={() => { props.setView('cancelled_orders') }}>{translate('VIEW')}</Nav.Link>
//                         </Card.Header>
//                         <Card.Body className='w-100 d-flex align-items-center justify-content-center'>
//                             <label className='count_label'>{props.cancelled_orders_count}</label>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col className='card_col'>
//                     <Card style={{ minHeight: '150px' }} >
//                         <Card.Header>
//                             <div className='mr-auto'>{translate('returned_orders')}</div>
//                             <Nav.Link onClick={() => { props.setView('returned_orders') }}>{translate('VIEW')}</Nav.Link>
//                         </Card.Header>
//                         <Card.Body className='w-100 d-flex align-items-center justify-content-center'>
//                             <label className='count_label'>{props.returned_orders_count}</label>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>
//             <style type="text/css">{`
//                 .manage_orders .card_col {
//                     padding: 5px;
//                 }
//                 .manage_orders .heading {
//                     font-size: 18px;
//                     margin: 10px 5px;
//                 }
//                 .manage_orders .card {
//                     border: none;
//                     background: rgb(165,64,162);
//                     background: linear-gradient(135deg, ${GlobalStyleSheet.primry_color} 0%, ${GlobalStyleSheet.primry_light_color} 100%);
//                     min-height: 200px;
//                 }
//                 .manage_orders .card-header {
//                     display: inline-flex;
//                     align-items: center;
//                     font-size: 15px;
//                     font-weight: bold;
//                     color: ${GlobalStyleSheet.primary_text_light_color};
//                     border: none;
//                     padding-bottom: 0%;
//                     background: none;
//                 }
//                 .manage_orders .label {
//                     font-size: 13px;
//                     width: 100%;
//                     color: ${GlobalStyleSheet.primary_text_light_color};
//                 }
//                 .manage_orders .address_label {
//                     font-size: 11px;
//                     width: 100%;
//                     color: ${GlobalStyleSheet.primary_text_light_color};
//                 }
//                 .manage_orders .count_label {
//                     color: ${GlobalStyleSheet.primary_text_light_color};
//                     font-size: 20px;
//                 }
//             `}</style>
//         </div>
//     )
// }
import React from 'react'

export default function manageOrders() {
    return (
        <div>

        </div>
    )
}
