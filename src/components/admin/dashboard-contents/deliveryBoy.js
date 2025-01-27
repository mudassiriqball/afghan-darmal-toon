import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col, Card, Nav, Table, Form, Button, InputGroup, Image } from 'react-bootstrap'
import { faUsers, faUserPlus, faPersonBooth, faBan } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp, faCheckCircle } from '@fortawesome/free-regular-svg-icons';

import consts from '../../../constants'
import TitleRow from '../../title-row';
import ConfirmModal from '../../confirm-modal'
import AlertModal from '../../alert-modal'
import urls from '../../../utils/urls/index'
import CardSearchAccordion from '../../card-search-accordion';
import PaginationRow from '../../pagination-row'
import Loading from '../../loading'

import getUsersPageLimit from '../../../hooks/getUsersPageLimit'
import getUsersBySearch from '../../../hooks/getUsersBySearch'
import constants from '../../../constants';

class deliveryBoy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh_count: 0,
            isViewUser: false,
            isNewUser: false,
            single_user: {},

            method: '',
            showViewConfirmModal: false,
            viewConfirmModalMsg: '',
            viewModalIconname: null,
            viewConfirmModalColor: '',
            viewConfirmModalLoading: false,

            viewShowAlertModal: false,
            viewAlertModalMsg: '',
        }
    }

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     this.setState({
    //         token: nextProps.token
    //     });
    // }

    async handleViewModalConfirmed() {
        this.setState({ viewConfirmModalLoading: true })
        const currentComponent = this
        let data = []
        if (this.state.method == 'Restricted') {
            data = {
                status: 'restricted'
            }
        } else if (this.state.method == 'Unrestricted') {
            data = {
                status: 'approved'
            }
        }
        await axios.put(urls.PUT_REQUEST.UPDATE_USER_STATUS + currentComponent.state.single_user._id, data, {
            headers: { 'authorization': currentComponent.props.token }
        }).then((res) => {
            currentComponent.setState({
                viewConfirmModalLoading: false,
                showViewConfirmModal: false,
                viewAlertModalMsg: `Customer ${currentComponent.state.method}  successfully`,
                viewShowAlertModal: true,
                refresh_count: currentComponent.state.refresh_count + 1
            })
            let obj = {}
            obj = currentComponent.state.single_user
            obj.status = data.status
            currentComponent.setState({ single_user: obj })
            currentComponent.props.usersReloadCountHandler()
        }).catch((err) => {
            currentComponent.setState({
                viewConfirmModalLoading: false,
                showViewConfirmModal: false,
            })
            alert('Error')
        });
    }

    render() {
        return (
            <div className='customers'>
                <ConfirmModal
                    onHide={() => { this.setState({ showViewConfirmModal: false, viewConfirmModalLoading: false }) }}
                    show={this.state.showViewConfirmModal}
                    title={this.state.viewConfirmModalMsg}
                    iconname={this.state.viewModalIconname}
                    color={this.state.viewConfirmModalColor}
                    _id={this.state.single_user._id}
                    name={this.state.single_user.fullName}
                    confirm={this.handleViewModalConfirmed.bind(this)}
                    loading={this.state.viewConfirmModalLoading}
                />
                <AlertModal
                    onHide={() => this.setState({ viewShowAlertModal: false })}
                    show={this.state.viewShowAlertModal}
                    alerttype={'success'}
                    message={this.state.viewAlertModalMsg}
                />
                {!this.state.isViewUser ?
                    <div >
                        <TitleRow icon={faUsers} title={' Admin Dashboard / Delivery Boy'} />
                        <DeliveryBoyTable
                            header={'All Delivery Boys'}
                            rank={true}
                            setView={(element) => this.setState({
                                isViewUser: true,
                                isNewUser: false,
                                single_user: element,
                            })}
                            token={this.props.token}
                            url={'customers'}
                            role={'customer'}
                            status={'approved'}
                            refresh={this.state.refresh_count}
                            setRefresh={() => this.setState({ refresh_count: this.state.refresh_count + 1 })}
                            usersReloadCountHandler={this.props.usersReloadCountHandler}
                        />
                    </div>
                    :
                    <div>
                        <TitleRow icon={faPersonBooth} title={`Admin Dashboard / Delivery Boys / ${this.state.single_user.fullName}`} />
                        <Form.Row style={{ margin: ' 0% 2%', display: 'flex', alignItems: 'center' }} >
                            <Button size='sm' variant='outline-primary' className="mr-auto mt-2" onClick={() => this.setState({ isViewUser: false })}> Back </Button>
                            {this.state.single_user.status != 'restricted' ?
                                <Button size='sm' variant='outline-danger' className='ml-2 mt-2 mb-2'
                                    onClick={() => this.setState({
                                        showViewConfirmModal: true, viewConfirmModalMsg: 'Restrict Customer?', method: 'Restricted',
                                        viewConfirmModalColor: 'red', viewModalIconname: faCheckCircle
                                    })}
                                > Restrict </Button>
                                :
                                <Button size='sm' variant='outline-success' className='ml-2 mt-2 mb-2'
                                    onClick={() => this.setState({
                                        showViewConfirmModal: true, viewConfirmModalMsg: 'Unrestrict Customer?', method: 'Unrestricted',
                                        viewConfirmModalColor: 'blue', viewModalIconname: faCheckCircle,
                                    })}
                                > Unrestrict </Button>
                            }
                        </Form.Row>
                        <Card className='view_user'>
                            <Card.Body>
                                <Row>
                                    <Form.Group as={Col} lg={12} md={12} sm={12} xs={12} className='d-flex justify-content-center align-items-center pt-3 pb-3' style={{ background: constants.COLORS.SECONDARY }}>
                                        <InputGroup style={{ width: '100px', height: '100px', borderRadius: '50%', background: constants.COLORS.WHITE }}>
                                            <Image src={this.state.single_user && this.state.single_user.avatar && this.state.single_user.avatar}
                                                style={{ width: '100px', height: '100px', borderRadius: '50%', background: constants.COLORS.WHITE }}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <p className='p'><span>Personal Info</span></p>
                                    <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
                                        <Form.Label className='form_label'>ID</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user._id} className='form_control' />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
                                        <Form.Label className='form_label'>Mobile</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.mobile} className='form_control' />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
                                        <Form.Label className='form_label'>Email</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.email || '-'} className='form_control' />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
                                        <Form.Label className='form_label'>Name</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.fullName} className='form_control' />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
                                        <Form.Label className='form_label'>City</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.city} className='form_control' />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
                                        <Form.Label className='form_label'>Date</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.entry_date && this.state.single_user.entry_date.substring(0, 10)} className='form_control' />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} lg={12} md={12} sm={12} xs={12}>
                                        <Form.Label className='form_label'>Address</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.address} className='form_control' />
                                        </InputGroup>
                                    </Form.Group>
                                </Row>
                            </Card.Body>
                        </Card>
                    </div>
                }
                <style type="text/css">
                    {`
                    .customers .Card{
                        margin: 1%;
                    }
                    .customers .view_user{
                        margin: 1% 2%;
                    }
                    .customers .p {
                        width: 100%;
                        text-align: center;
                        border-bottom: 1px solid lightgray;
                        line-height: 0.1em;
                        margin: 20px 20px;
                    }

                    .customers .p span {
                        font-size: 13px;
                        color: gray;
                        background: white;
                        padding:0 10px;
                    }
                    .customers .form_label{
                        color: gray;
                        font-size: ${consts.SIZES.LABEL};
                    }
                    .customers .card_header {
                        font-size: ${consts.SIZES.HEADER};
                        border: none;
                    }
                    .customers .card_text {
                        color: ${consts.COLORS.SEC};
                        font-size: 17px;
                    }
                    .vendors .form_control:disabled {
                        background: none;
                        // border: none;
                        // padding-left: 0%;
                        // padding-top: 0%;
                        font-size: 14px;
                        font-weight: bold;
                    }
                `}
                </style>
            </div>
        )
    }
}

function DeliveryBoyTable(props) {
    const [page, setPage] = useState(1)
    const [queryPage, setQueryPage] = useState(1)
    const [pageNumber, setpageNumber] = useState(1)
    const [queryPageNumber, setQueryPageNumber] = useState(1)
    const [isSearch, setIsSearch] = useState(false)
    const [fieldName, setFieldName] = useState('')
    const [query, setQuery] = useState(null)

    const [single_user, setSingle_customer] = useState({})
    // Confirm Modal
    const [method, setMethod] = useState('')
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmModalMsg, setConfirmModalMsg] = useState('')
    const [iconname, setIconname] = useState(null)
    const [confirmModalColor, setConfirmModalColor] = useState('green')
    const [confirmModalLoading, setConfirmModalLoading] = useState(false)

    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertModalMsg, setAlertModalMsg] = useState(false);

    const { USERS_PAGE_LOADING, USERS_PAGE_ERROR, USERS_PAGE_USERS, USERS_PAGE_PAGES, USERS_PAGE_TOTAL } =
        getUsersPageLimit(props.token, props.refresh, 'delivery', null, pageNumber, '20');
    const { USERS_SEARCH_LOADING, USERS_SEARCH_ERROR, USERS_SEARCH_USERS, USERS_SEARCH_PAGES, USERS_SEARCH_TOTAL } =
        getUsersBySearch(props.token, props.refresh, 'delivery', null, fieldName, query, queryPageNumber, '20');

    async function handleSearch(type, value, start, end) {
        if (value != '') {
            setFieldName(type)
            setQuery(value)
            setIsSearch(true)
        } else {
            setIsSearch(false)
        }
    }

    function handleSetPage(ppage) {
        if (ppage > page) {
            setPage(ppage)
            setpageNumber(ppage)
        } else {
            setPage(ppage)
        }
    }

    function handleSetQueryPage(ppage) {
        if (ppage > page) {
            setQueryPage(ppage)
            setQueryPageNumber(ppage)
        } else {
            setQueryPage(ppage)
        }
    }

    async function handleConfirmed() {
        let data = []
        if (method == 'Restricted') {
            setConfirmModalLoading(true)
            data = {
                status: 'restricted'
            }
        } else if (method == 'Unrestricted') {
            setConfirmModalLoading(true)
            data = {
                status: 'approved'
            }
        }
        await axios.put(urls.PUT_REQUEST.UPDATE_USER_STATUS + single_user._id, data, {
            headers: { 'authorization': props.token }
        }).then(function (response) {
            setConfirmModalLoading(false)
            setShowConfirmModal(false)
            setAlertModalMsg(`Customer ${method}  successfully`)
            setShowAlertModal(true)
            setpageNumber(1)
            setQueryPageNumber(1)
            setPage(1)
            setQueryPage(1)
            props.setRefresh()
            props.usersReloadCountHandler()
        }).catch(function (error) {
            setConfirmModalLoading(false)
            setShowConfirmModal(false)
            alert('Error')
        });
    }

    return (
        <div className='customers'>
            <CardSearchAccordion
                title={props.header}
                option={'delivery'}
                handleSearch={handleSearch}
                setIsSearch={() => setIsSearch(false)}
            >
                <ConfirmModal
                    onHide={() => { setShowConfirmModal(false), setConfirmModalLoading(false) }}
                    show={showConfirmModal}
                    title={confirmModalMsg}
                    iconname={iconname}
                    color={confirmModalColor}
                    _id={single_user._id}
                    name={single_user.fullName}
                    confirm={handleConfirmed}
                    loading={confirmModalLoading}
                />
                <AlertModal
                    onHide={(e) => setShowAlertModal(false)}
                    show={showAlertModal}
                    alerttype={'success'}
                    message={alertModalMsg}
                />
                {!isSearch ?
                    USERS_PAGE_LOADING ?
                        <Loading />
                        :
                        USERS_PAGE_TOTAL > 0 ?
                            <>
                                <DeliveryBoyTableBody
                                    pageNumber={page}
                                    list={USERS_PAGE_USERS}
                                    setView={props.setView}
                                />
                                <hr />
                                <PaginationRow
                                    totalPages={USERS_PAGE_PAGES}
                                    activePageNumber={page}
                                    setActivePageNumber={(ppage) => handleSetPage(ppage)}
                                />
                            </>
                            :
                            <Row className='no_data'>No Data Found</Row>
                    :
                    USERS_SEARCH_LOADING ?
                        <Loading />
                        :
                        USERS_SEARCH_TOTAL ?
                            <>
                                <DeliveryBoyTableBody
                                    pageNumber={queryPage}
                                    list={USERS_SEARCH_USERS}
                                    setView={props.setView}
                                />
                                <hr />
                                <PaginationRow
                                    totalPages={USERS_SEARCH_PAGES}
                                    activePageNumber={queryPage}
                                    setActivePageNumber={(ppage) => handleSetQueryPage(ppage)}
                                />
                            </>
                            :
                            <Row className='no_data'>No Data Found</Row>
                }
            </CardSearchAccordion>
            <style type="text/css">{`
                .customers .no_data {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 5% 0%;
                }
            `}</style>
        </div>
    )
}

function DeliveryBoyTableBody(props) {
    const [lower_limit, setlower_limit] = useState(0)
    const [upper_limit, setupper_limit] = useState(0)

    useEffect(() => {
        setlower_limit(props.pageNumber * 20 - 20)
        setupper_limit(props.pageNumber * 20)
    }, [props.pageNumber])

    return (
        <div className='customer_table'>
            <Table responsive bordered hover size="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Mobile</th>
                        <th>Name</th>
                        <th>City</th>
                        <th>Address</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {props.list && props.list.map((element, index) =>
                        index >= lower_limit && index < upper_limit && <tr key={index}>
                            <td align="center" >{index + 1}</td>
                            <td>
                                {element._id}
                                <div className="td">
                                    <Nav.Link className='pt-0' onClick={() => props.setView(element)} > View </Nav.Link>
                                </div>
                            </td>
                            <td align="center" >{element.mobile}</td>
                            <td align="center" >{element.fullName}</td>
                            <td align="center" >{element.city}</td>
                            <td align="center" >{element.address}</td>
                            <td align="center" >{element.entry_date.substring(0, 10)}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <style jsx>{`
               th {
                    text-align: center;
                    font-size: 14px;
                    white-space: nowrap;
                }
                .td {
                    display: flex;
                    flex-direction: row;
                    font-size: 12px;
                    float: right;
                    padding: 0%;
                    margin: 0%;
                }
                td {
                    font-size: 12px;
                }
            `} </style>
            <style type="text/css">{`
                .customer_table .delete{
                    color: #ff4d4d;
                }
                .customer_table .delete:hover{
                    color: #cc0000;
                }
            `}</style>
        </div>
    )
}


const styles = {
    fontawesome: {
        color: `${consts.COLORS.SEC} `,
        width: '30px',
        height: '30px',
        maxHeight: '30px',
        maxWidth: '30px',
        float: 'right'
    },
    accordin_fontawesome: {
        color: `${consts.COLORS.SEC} `,
        marginRight: '10%',
        width: '15px',
        height: '15px',
        maxHeight: '15px',
        maxWidth: '15px',
    },
}

export default deliveryBoy;