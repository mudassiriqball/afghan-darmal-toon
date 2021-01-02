import { Modal, Form } from 'react-bootstrap';
import consts from '../constants';

import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { VscError } from 'react-icons/vsc';
import { useEffect } from 'react';

function AlertModal(props) {
    const { onHide, show, alertType, message } = props;

    useEffect(() => {
        setTimeout(() => {
            onHide();
        }, 5000);
        return () => {

        }
    }, [show]);

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="alert-modal"
            centered
        >
            {/* <div style={{ border: `1px solid ${color}`, borderRadius: '5px' }}> */}
            <Modal.Header closeButton className='d-flex justify-content-center align'
                style={{
                    color: alertType == 'success' ? consts.COLORS.SUCCESS : consts.COLORS.DANGER,
                    borderBottom: `1px solid ${alertType == 'success' ? consts.COLORS.SUCCESS : consts.COLORS.DANGER}`
                }}>
                <Modal.Title id="alert-modal" style={{ textAlign: 'center', alignSelf: 'center', fontWeight: 'bold' }}>
                    {alertType === 'success' ? 'Success' : 'Error'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='d-flex flex-column justify-content-center align-items-center' style={{ padding: '5%' }}>
                {alertType == 'success' ?
                    <IoIosCheckmarkCircleOutline style={{ fontSize: '100px', color: consts.COLORS.SUCCESS }} />
                    :
                    <VscError style={{ fontSize: '100px', color: consts.COLORS.DANGER }} />
                }
                <Form.Label style={{ fontSize: '14px', padding: '0%', margin: '2% 0%', textAlign: 'center', minWidth: '100%' }}>
                    {message}
                </Form.Label>
            </Modal.Body>
            {/* </div> */}
        </Modal>
    );
}

export default AlertModal;