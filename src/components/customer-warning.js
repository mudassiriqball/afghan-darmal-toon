import React, { useState } from 'react';
import { Row, Col, Toast, Button, Modal, Form } from 'react-bootstrap'
import translate from '../../i18n/translate';


// export default function CustomerWarningAlert(props) {
//     const [show, setShow] = useState(false);

//     return (
//         <div
//             style={{
//                 position: 'absolute',
//                 width: '100%',
//                 top: '10',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 zIndex: props.show ? '100' : '-1',
//             }}
//         >
//             <Row className='w-100 d-flex align-items-center justify-content-center'>
//                 <Col lg={6} md={4} sm={8} xs={10}>
//                     <Toast className='toast_body' onClose={props.onClose} show={props.show} delay={props.delay} autohide >
//                         <Toast.Body>{translate('combination_not_found')}</Toast.Body>
//                     </Toast>
//                 </Col>
//             </Row>
//             <style type="text/css">{`
//                 .toast_body {
//                      background: transparent;
//                     // color: white;
//                     padding: 4%;
//                 }
//             `}</style>
//         </div>
//     );
// }

function AlertModal(props) {
    return (
        <Modal
            {...props}
            size="md"
            centered
        >
            <div style={{ borderRadius: '5px', padding: '3%' }}>
                <Modal.Body className='d-flex align-items-center justify-content-center'>
                    <Form.Label style={{ fontSize: '14px', padding: '0%', margin: '0%' }}>
                        {translate('combination_not_found')}
                    </Form.Label>
                </Modal.Body>
            </div>
        </Modal>
    );
}

export default AlertModal;