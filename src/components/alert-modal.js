import { Modal, Form } from 'react-bootstrap';
import useDimensions from "react-use-dimensions";
import theme from '../constants/theme';

import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { VscError } from 'react-icons/vsc';

function AlertModal(props) {
    const { onHide, show, alertType, message } = props;
    const [ref, { x, y, width }] = useDimensions();

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
                    color: alertType == 'success' ? theme.COLORS.SUCCESS : theme.COLORS.DANGER,
                    borderBottom: `1px solid ${alertType == 'success' ? theme.COLORS.SUCCESS : theme.COLORS.DANGER}`
                }}>
                <Modal.Title id="alert-modal" style={{ textAlign: 'center', alignSelf: 'center', fontWeight: 'bold' }}>
                    {alertType === 'success' ? 'Success' : 'Error'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body ref={ref} className='d-flex flex-column justify-content-center align-items-center' style={{ padding: '5%' }}>
                {alertType == 'success' ?
                    <IoIosCheckmarkCircleOutline style={{ fontSize: '100px', color: theme.COLORS.SUCCESS }} />
                    :
                    <VscError style={{ fontSize: '100px', color: theme.COLORS.DANGER }} />
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