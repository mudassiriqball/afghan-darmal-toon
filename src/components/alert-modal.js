import { Modal, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function AlertModal(props) {

    // React.useEffect(() => {
    //     setTimeout(() => {
    //         props.onHide()
    //     }, 3000);
    //     return () => {
    //         props.onHide()
    //     }
    // }, [])

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="alert-modal"
            centered
        >
            <div style={{ border: `1px solid ${props.color}`, borderRadius: '5px' }}>
                <Modal.Header closeButton style={{ color: `${props.color}`, borderBottom: `1px solid ${props.color}` }}>
                    <FontAwesomeIcon icon={props.iconname} style={{
                        color: `${props.color}`,
                        marginRight: '10px',
                        width: '35px',
                        height: '35px',
                        maxHeight: '35px',
                        maxWidth: '35px',
                    }} ></FontAwesomeIcon>
                    <Modal.Title id="alert-modal">
                        {props.header}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Form.Label style={{ fontSize: '14px', padding: '0%', margin: '0%' }}>
                        {props.message}
                    </Form.Label>
                </Modal.Body>
                <Modal.Footer>
                    <Button size="sm" onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
}

export default AlertModal;