import { Modal, Button, Form, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Loading from './loading';

function ConfirmModal(props) {
    return (
        <Modal
            show={props.show} onHide={props.onHide}
            size="md"
            aria-labelledby="alert-modal"
            centered
        >
            <div style={{
                border: `1px solid ${props.color}`, borderRadius: '5px'
            }}>
                {/* '#ff3333' */}
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
                        {props.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    {props.loading ?
                        <Loading />
                        :
                        <>
                            <Form.Label style={{ fontSize: '14px', padding: '0%', margin: '0%' }}>
                                <span style={{ fontWeight: 'bold' }}> Name: </span>
                                {props.name}
                            </Form.Label>
                            <br />
                            <Form.Label style={{ fontSize: '14px', padding: '0%', margin: '0%' }}>
                                <span style={{ fontWeight: 'bold' }}> ID: </span>
                                {props._id}
                            </Form.Label>
                        </>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button size="sm" className='mr-auto' onClick={props.confirm}
                        disabled={props.loading}
                        variant={props.color == 'red' ? 'outline-danger' : props.color == 'blue' ? 'outline-primary' : 'outline-success'}>Confirm</Button>
                    <Button size="sm" variant='outline-primary' disabled={props.loading} onClick={props.onHide}>Cancel</Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
}

export default ConfirmModal