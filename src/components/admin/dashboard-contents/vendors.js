// import React, { useState,  useEffect } from 'react'
// import axios from 'axios'
// import { Row, Col, Card, Nav, Table, Form, Button, InputGroup } from 'react-bootstrap'
// import { faUsers, faUserPlus,  faPersonBooth, faBan, faTrash } from '@fortawesome/free-solid-svg-icons';
// import { faThumbsUp, faCheckCircle } from '@fortawesome/free-regular-svg-icons';

// import theme from '../../constants/theme'
// import TitleRow from '../../title-row';
// import ConfirmModal from '../../confirm-modal'
// import AlertModal from '../../alert-modal'
// import MuhalikConfig from '../../../../sdk/muhalik.config'
// import PaginationRow from '../../pagination-row'
// import CardSearchAccordion from '../../card-search-accordion';

// import usersPageLimit from '../../../../../getUserPageLimit'
// import usersQuerySearch from '../../../../../getUsersBySearching'

// import Loading from '../../../loading';
// import CountColoredCard from '../../../count-colored-card';

// class Vendors extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             refresh_count: 0,
//             isViewUser: false,
//             isNewUser: false,

//             single_user: {},

//             method: '',
//             showViewConfirmModal: false,
//             viewConfirmModalMsg: '',
//             viewModalIconname: null,
//             viewConfirmModalColor: '',
//             viewConfirmModalLoading: false,

//             viewShowAlertModal: false,
//             viewAlertModalMsg: '',
//         }
//     }

//     async handleViewModalConfirmed() {
//         this.setState({ viewConfirmModalLoading: true })
//         const currentComponent = this
//         let data = []
//         if (this.state.method == 'Approved') {
//             data = {
//                 status: 'approved'
//             }
//         } else if (this.state.method == 'Discarded') {
//             setConfirmModalLoading(true)
//             const _url = MuhalikConfig.PATH + `/api/users/user/${this.state.single_user._id}`;
//             await axios.delete(_url, {
//                 headers: { 'authorization': currentComponent.props.token }
//             }).then(function (res) {
//                 currentComponent.setState({
//                     viewConfirmModalLoading: false,
//                     showViewConfirmModal: false,
//                     viewAlertModalMsg: 'New Vendor Discarded Successfully',
//                     viewShowAlertModal: true,
//                     refresh_count: currentComponent.state.refresh_count + 1,
//                     isViewUser: false,
//                 })
//                 currentComponent.props.usersReloadCountHandler()
//             }).catch((err) => {
//                 currentComponent.setState({
//                     viewConfirmModalLoading: false,
//                     showViewConfirmModal: false,
//                 })
//                 alert('Error');
//             });
//             return
//         } else if (this.state.method == 'Restricted') {
//             data = {
//                 status: 'restricted'
//             }
//         } else if (this.state.method == 'Unrestricted') {
//             data = {
//                 status: 'approved'
//             }
//         }

//         const url = MuhalikConfig.PATH + `/api/users/user-status/${currentComponent.state.single_user._id}`;
//         await axios.put(url, data, {
//             headers: { 'authorization': currentComponent.props.token }
//         }).then((res) => {
//             currentComponent.setState({
//                 viewConfirmModalLoading: false,
//                 showViewConfirmModal: false,
//                 viewAlertModalMsg: `Vendor ${currentComponent.state.method}  successfully`,
//                 viewShowAlertModal: true,
//                 refresh_count: currentComponent.state.refresh_count + 1
//             })
//             let obj = {}
//             obj = currentComponent.state.single_user
//             obj.status = data.status
//             currentComponent.setState({ single_user: obj })
//             currentComponent.props.usersReloadCountHandler()
//         }).catch((err) => {
//             currentComponent.setState({
//                 viewConfirmModalLoading: false,
//                 showViewConfirmModal: false,
//             })
//             alert('Error'); console.log('jjj:', err)
//         });
//     }

//     // UNSAFE_componentWillReceiveProps(nextProps) {
//     //     this.setState({
//     //         token: nextProps.token
//     //     });
//     // }

//     render() {
//         return (
//             <div className='vendors'>
//                 <ConfirmModal
//                     onHide={() => { this.setState({ showViewConfirmModal: false, viewConfirmModalLoading: false }) }}
//                     show={this.state.showViewConfirmModal}
//                     title={this.state.viewConfirmModalMsg}
//                     iconname={this.state.viewModalIconname}
//                     color={this.state.viewConfirmModalColor}
//                     _id={this.state.single_user._id}
//                     name={this.state.single_user.full_name}
//                     confirm={this.handleViewModalConfirmed.bind(this)}
//                     loading={this.state.viewConfirmModalLoading}
//                 />
//                 <AlertModal
//                     onHide={() => this.setState({ viewShowAlertModal: false })}
//                     show={this.state.viewShowAlertModal}
//                     header={'Success'}
//                     message={this.state.viewAlertModalMsg}
//                     iconname={faThumbsUp}
//                     color={'green'}
//                 />
//                 {!this.state.isViewUser ?
//                     <div>
//                         <TitleRow icon={faUsers} title={' Admin Dashboard / Vendors'} />
//                         <Row className='Card' noGutters>
//                             <Col lg={12} md={12} sm={12} xs={12} className='p-0 m-0'>
//                                 <CountColoredCard
//                                     count={this.props.vendors_count}
//                                     header={'All Vendors'}
//                                     background={'lightblue'}
//                                     iconname={faUsers}
//                                 />
//                             </Col>
//                             <Col lg={4} md={4} sm={12} xs={12} className='p-0 m-0'>
//                                 <CountColoredCard
//                                     count={this.props.vendors_count - this.props.restricted_vendors_count - this.props.new_vendors_count}
//                                     header={'Unrestricted Vendors'}
//                                     background={'lightblue'}
//                                     iconname={faUsers}
//                                 />
//                             </Col>
//                             <Col lg={4} md={4} sm={12} xs={12} className='p-0 m-0'>
//                                 <CountColoredCard
//                                     count={this.props.new_vendors_count}
//                                     header={'New Vendors'}
//                                     background={'lightgreen'}
//                                     iconname={faUserPlus}
//                                 />
//                             </Col>
//                             <Col lg={4} md={4} sm={12} xs={12} className='p-0 m-0'>
//                                 <CountColoredCard
//                                     count={this.props.restricted_vendors_count}
//                                     header={'Restriced Vendors'}
//                                     background={'orange'}
//                                     iconname={faBan}
//                                 />
//                             </Col>
//                         </Row>
//                         <VendorTable
//                             header={'All Vendors'}
//                             rank={true}
//                             setView={(element) => this.setState({
//                                 isViewUser: true,
//                                 isNewUser: false,
//                                 single_user: element,
//                             })}
//                             token={this.props.token}
//                             url={'vendors'}
//                             role={'vendor'}
//                             status={'approved'}
//                             refresh={this.state.refresh_count}
//                             setRefresh={() => this.setState({ refresh_count: this.state.refresh_count + 1 })}
//                             usersReloadCountHandler={this.props.usersReloadCountHandler}
//                         />

//                         <VendorTable
//                             header={'New Vendors'}
//                             rank={false}
//                             setView={(element) => this.setState({
//                                 isViewUser: true,
//                                 isNewUser: true,
//                                 single_user: element,
//                             })}
//                             token={this.props.token}
//                             url={'new-vendors'}
//                             role={'vendor'}
//                             status={'disapproved'}
//                             refresh={this.state.refresh_count}
//                             setRefresh={() => this.setState({ refresh_count: this.state.refresh_count + 1 })}
//                             usersReloadCountHandler={this.props.usersReloadCountHandler}
//                         />
//                         <VendorTable
//                             header={'Restricted Vendors'}
//                             rank={true}
//                             setView={(element) => this.setState({
//                                 isViewUser: true,
//                                 isNewUser: false,
//                                 single_user: element,
//                             })}
//                             token={this.props.token}
//                             url={'restricted-vendors'}
//                             role={'vendor'}
//                             status={'restricted'}
//                             refresh={this.state.refresh_count}
//                             setRefresh={() => this.setState({ refresh_count: this.state.refresh_count + 1 })}
//                             usersReloadCountHandler={this.props.usersReloadCountHandler}
//                         />
//                     </div>
//                     :
//                     <>
//                         <TitleRow icon={faPersonBooth} title={`Admin Dashboard / Vendors / ${this.state.single_user.full_name}`} />
//                         <Form.Row style={{ margin: ' 0% 2%', display: 'flex', alignItems: 'center' }} >
//                             <Button size='sm' variant='outline-primary' className="mr-auto" onClick={() => this.setState({ isViewUser: false })}> Back </Button>
//                             {this.state.isNewUser ?
//                                 <>
//                                     <Button size='sm' variant='outline-success' className='m2'
//                                         onClick={() => this.setState({
//                                             showViewConfirmModal: true, viewConfirmModalMsg: 'Approve New Vendor?', method: 'Approved',
//                                             viewConfirmModalColor: 'green', viewModalIconname: faCheckCircle
//                                         })}
//                                     > Approve </Button>
//                                     <Button size='sm' variant='outline-danger' className=''
//                                         onClick={() => this.setState({
//                                             showViewConfirmModal: true, viewConfirmModalMsg: 'Discard New Vendor?', method: 'Discarded',
//                                             viewConfirmModalColor: 'red', viewModalIconname: faCheckCircle
//                                         })}
//                                     > Discard </Button>
//                                 </>
//                                 :
//                                 <>
//                                     {this.state.single_user.status != 'restricted' ?
//                                         <Button size='sm' variant='outline-danger' className='ml-2 mt-2 mb-2'
//                                             onClick={() => this.setState({
//                                                 showViewConfirmModal: true, viewConfirmModalMsg: 'Restrict Vendor?', method: 'Restricted',
//                                                 viewConfirmModalColor: 'red', viewModalIconname: faCheckCircle
//                                             })}
//                                         > Restrict </Button>
//                                         :
//                                         <Button size='sm' variant='outline-success' className='ml-2  mt-2 mb-2'
//                                             onClick={() => this.setState({
//                                                 showViewConfirmModal: true, viewConfirmModalMsg: 'Unrestrict Vendor?', method: 'Unrestricted',
//                                                 viewConfirmModalColor: 'blue', viewModalIconname: faCheckCircle,
//                                             })}
//                                         > Unrestrict </Button>
//                                     }
//                                 </>
//                             }
//                         </Form.Row>
//                         <Card className='view_user'>
//                             <Card.Body>
//                                 <Row>
//                                     <p className='p'><span>Personal Info</span></p>
//                                     <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
//                                         <Form.Label className='form_label'>ID</Form.Label>
//                                         <InputGroup>
//                                             <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user._id} className='form_control' />
//                                         </InputGroup>
//                                     </Form.Group>
//                                     <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
//                                         <Form.Label className='form_label'>Mobile</Form.Label>
//                                         <InputGroup>
//                                             <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.mobile} className='form_control' />
//                                         </InputGroup>
//                                     </Form.Group>
//                                     <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
//                                         <Form.Label className='form_label'>Email</Form.Label>
//                                         <InputGroup>
//                                             <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.email || '-'} className='form_control' />
//                                         </InputGroup>
//                                     </Form.Group>
//                                     <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
//                                         <Form.Label className='form_label'>Name</Form.Label>
//                                         <InputGroup>
//                                             <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.full_name} className='form_control' />
//                                         </InputGroup>
//                                     </Form.Group>
//                                     <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
//                                         <Form.Label className='form_label'>Country</Form.Label>
//                                         <InputGroup>
//                                             <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.countary} className='form_control' />
//                                         </InputGroup>
//                                     </Form.Group>
//                                     <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
//                                         <Form.Label className='form_label'>City</Form.Label>
//                                         <InputGroup>
//                                             <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.city} className='form_control' />
//                                         </InputGroup>
//                                     </Form.Group>

//                                     <p className='p' style={{ marginTop: '50px' }}><span>Shop Info</span></p>
//                                     <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
//                                         <Form.Label className='form_label'>Shop Name</Form.Label>
//                                         <InputGroup>
//                                             <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.shop_name} className='form_control' />
//                                         </InputGroup>
//                                     </Form.Group>
//                                     <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
//                                         <Form.Label className='form_label'>Shop Category</Form.Label>
//                                         <InputGroup>
//                                             <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.shop_category} className='form_control' />
//                                         </InputGroup>
//                                     </Form.Group>
//                                     <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
//                                         <Form.Label className='form_label'>Date</Form.Label>
//                                         <InputGroup>
//                                             <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.entry_date.substring(0, 10)} className='form_control' />
//                                         </InputGroup>
//                                     </Form.Group>
//                                     <Form.Group as={Col} lg={12} md={12} sm={12} xs={12}>
//                                         <Form.Label className='form_label'>Shop Address</Form.Label>
//                                         <InputGroup>
//                                             <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.shop_address} className='form_control' />
//                                         </InputGroup>
//                                     </Form.Group>
//                                 </Row>
//                             </Card.Body>
//                         </Card>
//                     </>
//                 }
//                 <style type="text/css">
//                     {`
//                         .vendors .Card{
//                             margin: 1%;
//                         }
//                         .vendors .view_user{
//                             margin: 1% 2%;
//                         }
//                         .vendors .p {
//                             width: 100%; 
//                             text-align: center; 
//                             border-bottom: 1px solid lightgray; 
//                             line-height: 0.1em;
//                             margin: 20px 20px;
//                         } 

//                         .vendors .p span {
//                             font-size: 13px;
//                             color: gray;
//                             background: white;
//                             padding:0 10px;
//                         }
//                         .vendors .form_label{
//                             color: gray;
//                             font-size: ${theme.SIZES.LABEL};
//                         }
//                         .vendors .card_header {
//                             font-size: ${theme.SIZES.HEADER};
//                             border: none;
//                         }
//                         .vendors .card_text {
//                             color: ${theme.admin_primry_color};
//                             font-size: 17px;
//                         }
//                         .vendors .form_control:disabled {
//                             background: none;
//                             // border: none;
//                             // padding-left: 0%;
//                             // padding-top: 0%;
//                             font-size: 14px;
//                             font-weight: bold;
//                         }
//                     `}
//                 </style>
//             </div>
//         )
//     }
// }

// function VendorTable(props) {
//     const [page, setPage] = useState(1)
//     const [queryPage, setQueryPage] = useState(1)
//     const [pageNumber, setpageNumber] = useState(1)
//     const [queryPageNumber, setQueryPageNumber] = useState(1)
//     const [isSearch, setIsSearch] = useState(false)
//     const [fieldName, setFieldName] = useState('')
//     const [query, setQuery] = useState('')

//     const [single_user, setSingle_vendor] = useState({})
//     // Confirm Modal
//     const [method, setMethod] = useState('')
//     const [showConfirmModal, setShowConfirmModal] = useState(false)
//     const [confirmModalMsg, setConfirmModalMsg] = useState('')
//     const [confirmModalColor, setConfirmModalColor] = useState('green')
//     const [confirmModalLoading, setConfirmModalLoading] = useState(false)

//     const [showAlertModal, setShowAlertModal] = useState(false)
//     const [alertModalMsg, setAlertModalMsg] = useState(false)

//     const [iconname, setIconname] = useState(null)

//     const [start_date, setStart_date] = useState(new Date("2020/01/01"))
//     const [end_date, setEnd_date] = useState(new Date())


//     const { users_loading, users_error, users, users_pages, users_total } = usersPageLimit(props.token, props.refresh, props.url, pageNumber, '20')
//     const { users_query_loading, users_query_error, query_users, users_query_pages, users_query_total } =
//         usersQuerySearch(props.token, props.refresh, props.role, props.status, fieldName, query, queryPageNumber, '20', start_date, end_date)

//     async function handleSearch(type, value, start, end) {
//         if (value != '') {
//             setFieldName(type)
//             setQuery(value)
//             setStart_date(start)
//             setEnd_date(end)
//             setIsSearch(true)
//         } else {
//             setIsSearch(false)
//         }
//     }

//     function handleSetPage(ppage) {
//         if (ppage > page) {
//             setPage(ppage)
//             setpageNumber(ppage)
//         } else {
//             setPage(ppage)
//         }
//     }

//     function handleSetQueryPage(ppage) {
//         if (ppage > page) {
//             setQueryPage(ppage)
//             setQueryPageNumber(ppage)
//         } else {
//             setQueryPage(ppage)
//         }
//     }

//     async function handleConfirmed() {
//         let data = []
//         if (method == 'Approved') {
//             setConfirmModalLoading(true)
//             data = {
//                 status: 'approved'
//             }
//         } else if (method == 'Discarded') {
//             setConfirmModalLoading(true)
//             const _url = MuhalikConfig.PATH + `/api/users/user/${single_user._id}`;
//             await axios.delete(_url, {
//                 headers: { 'authorization': props.token }
//             }).then(function (res) {
//                 setConfirmModalLoading(false)
//                 setShowConfirmModal(false)
//                 setAlertModalMsg('Vendor deleted successfully')
//                 setShowAlertModal(true)
//                 setpageNumber(1)
//                 setQueryPageNumber(1)
//                 setPage(1)
//                 setQueryPage(1)
//                 props.setRefresh()
//                 props.usersReloadCountHandler()
//             }).catch(function (err) {
//                 setConfirmModalLoading(false)
//                 setShowConfirmModal(false)
//                 alert('User Discard Failed: ');
//                 console.log('User Discard Failed:', err)
//             });
//             return
//         } else if (method == 'Restricted') {
//             setConfirmModalLoading(true)
//             data = {
//                 status: 'restricted'
//             }
//         } else if (method == 'Unrestricted') {
//             setConfirmModalLoading(true)
//             data = {
//                 status: 'approved'
//             }
//         }

//         const url = MuhalikConfig.PATH + `/api/users/user-status/${single_user._id}`;
//         await axios.put(url, data, {
//             headers: { 'authorization': props.token }
//         }).then(function (res) {
//             setConfirmModalLoading(false)
//             setShowConfirmModal(false)
//             setAlertModalMsg(`Vendor ${method}  successfully`)
//             setShowAlertModal(true)
//             setpageNumber(1)
//             setQueryPageNumber(1)
//             setPage(1)
//             setQueryPage(1)
//             props.setRefresh()
//             props.usersReloadCountHandler()
//         }).catch(function (err) {
//             setConfirmModalLoading(false)
//             setShowConfirmModal(false)
//             alert(`User ${method} failed: `);
//             console.log(`User ${method} failed: `, err)
//         });
//     }

//     return (
//         <div className='vendors_table'>
//             <ConfirmModal
//                 onHide={() => { setShowConfirmModal(false), setConfirmModalLoading(false) }}
//                 show={showConfirmModal}
//                 title={confirmModalMsg}
//                 iconname={iconname}
//                 color={confirmModalColor}
//                 _id={single_user._id}
//                 name={single_user.full_name}
//                 confirm={handleConfirmed}
//                 loading={confirmModalLoading}
//             />
//             <AlertModal
//                 onHide={(e) => setShowAlertModal(false)}
//                 show={showAlertModal}
//                 header={'Success'}
//                 message={alertModalMsg}
//                 iconname={faThumbsUp}
//                 color={'green'}
//             />

//             <CardSearchAccordion
//                 title={props.header}
//                 option={'vendor'}
//                 handleSearch={handleSearch}
//                 setIsSearch={() => setIsSearch(false)}
//             >
//                 {!isSearch ?
//                     users_loading ?
//                         <Loading />
//                         :
//                         users_total > 0 ?
//                             <>
//                                 <VendorTableBody
//                                     pageNumber={page}
//                                     list={users}
//                                     rank={props.rank}
//                                     setView={props.setView}
//                                     setApprove={(element) => {
//                                         setMethod('Approved')
//                                         setSingle_vendor(element)
//                                         setShowConfirmModal(true)
//                                         setConfirmModalMsg('Approve Vendor?')
//                                         setConfirmModalColor('green')
//                                         setIconname(faCheckCircle)
//                                     }}
//                                     setDiscard={(element) => {
//                                         setMethod('Discarded')
//                                         setSingle_vendor(element)
//                                         setShowConfirmModal(true)
//                                         setConfirmModalMsg('Discard New Vendor?')
//                                         setConfirmModalColor('red')
//                                         setIconname(faTrash)
//                                     }}
//                                     setRestrict={(element) => {
//                                         setMethod('Restricted')
//                                         setSingle_vendor(element)
//                                         setShowConfirmModal(true)
//                                         setConfirmModalMsg('Restrict Vendor?')
//                                         setConfirmModalColor('red')
//                                         setIconname(faBan)
//                                     }}
//                                     setUnrestrict={(element) => {
//                                         setMethod('Unrestricted')
//                                         setSingle_vendor(element)
//                                         setShowConfirmModal(true)
//                                         setConfirmModalMsg('Unrestrict/Unblock Vendor?')
//                                         setConfirmModalColor('blue')
//                                         setIconname(faCheckCircle)
//                                     }}
//                                 />
//                                 <hr />
//                                 <PaginationRow
//                                     totalPages={users_pages}
//                                     activePageNumber={page}
//                                     setActivePageNumber={(ppage) => handleSetPage(ppage)}
//                                 />
//                             </>
//                             :
//                             <Row className='no_data'>No Data Found</Row>
//                     :
//                     users_query_loading ?
//                         <Loading />
//                         :
//                         users_query_total ?
//                             <>
//                                 <VendorTableBody
//                                     pageNumber={queryPage}
//                                     list={query_users}
//                                     rank={props.rank}
//                                     setView={props.setView}
//                                     setApprove={(element) => {
//                                         setMethod('Approved')
//                                         setSingle_vendor(element)
//                                         setShowConfirmModal(true)
//                                         setConfirmModalMsg('Approve Vendor?')
//                                         setConfirmModalColor('green')
//                                         setIconname(faCheckCircle)
//                                     }}
//                                     setDiscard={(element) => {
//                                         setMethod('Discarded')
//                                         setSingle_vendor(element)
//                                         setShowConfirmModal(true)
//                                         setConfirmModalMsg('Discard New Vendor?')
//                                         setConfirmModalColor('red')
//                                         setIconname(faTrash)
//                                     }}
//                                     setRestrict={(element) => {
//                                         setMethod('Restricted')
//                                         setSingle_vendor(element)
//                                         setShowConfirmModal(true)
//                                         setConfirmModalMsg('Restrict Vendor?')
//                                         setConfirmModalColor('red')
//                                         setIconname(faBan)
//                                     }}
//                                     setUnrestrict={(element) => {
//                                         setMethod('Unrestricted')
//                                         setSingle_vendor(element)
//                                         setShowConfirmModal(true)
//                                         setConfirmModalMsg('Unrestrict/Unblock Vendor?')
//                                         setConfirmModalColor('blue')
//                                         setIconname(faCheckCircle)
//                                     }}
//                                 />
//                                 <hr />
//                                 <PaginationRow
//                                     totalPages={users_query_pages}
//                                     activePageNumber={queryPage}
//                                     setActivePageNumber={(ppage) => handleSetQueryPage(ppage)}
//                                 />
//                             </>
//                             :
//                             <Row className='no_data'>No Data Found</Row>
//                 }
//             </CardSearchAccordion>
//             <style type="text/css">{`
//                 .vendors_table .no_data {
//                     width: 100%;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     padding: 5% 0%;
//                 }
//             `}</style>
//         </div>
//     )
// }

// function VendorTableBody(props) {

//     const [lower_limit, setlower_limit] = useState(0)
//     const [upper_limit, setupper_limit] = useState(0)

//     useEffect(() => {
//         setlower_limit(props.pageNumber * 20 - 20)
//         setupper_limit(props.pageNumber * 20)
//     }, [props.pageNumber])

//     return (
//         <div className='vendor_table'>
//             <Table responsive bordered hover size="sm">
//                 <thead>
//                     <tr>
//                         <th>#</th>
//                         <th>ID</th>
//                         <th>Mobile</th>
//                         <th>Name</th>
//                         <th>Countary</th>
//                         <th>City</th>
//                         <th>Shop Name</th>
//                         <th>Shop Location</th>
//                         {props.rank ?
//                             <th>Rank</th>
//                             : null
//                         }
//                         <th>Date</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {props.list && props.list.map((element, index) =>
//                         index >= lower_limit && index < upper_limit && <tr key={index}>
//                             <td align="center" >{index + 1}</td>
//                             <td>
//                                 {element._id}
//                                 <div className="td">
//                                     <Nav.Link className='pt-0' onClick={() => props.setView(element)} > View </Nav.Link>
//                                     {props.rank ?
//                                         <>
//                                             {element.status == 'restricted' ?
//                                                 <Nav.Link className='pt-0' onClick={() => props.setUnrestrict(element)}>Unrestrict</Nav.Link>
//                                                 :
//                                                 <Nav.Link className='pt-0 delete' onClick={() => props.setRestrict(element)}>Restrict</Nav.Link>
//                                             }
//                                         </>
//                                         :
//                                         <>
//                                             <Nav.Link className='pt-0' onClick={() => props.setApprove(element)}>Approve</Nav.Link>
//                                             <Nav.Link className='pt-0 delete' onClick={() => props.setDiscard(element)}>Discard</Nav.Link>
//                                         </>
//                                     }
//                                 </div>
//                             </td>
//                             <td align="center" >{element.mobile}</td>
//                             <td align="center" >{element.full_name}</td>
//                             <td align="center" >{element.countary}</td>
//                             <td align="center" >{element.city}</td>
//                             <td align="center" >{element.shop_name}</td>
//                             <td align="center" >{element.shop_address}</td>
//                             {props.rank ?
//                                 <td align="center" >{element.rank || '-'}</td>
//                                 :
//                                 null
//                             }
//                             <td align="center" >{element.entry_date.substring(0, 10)}</td>
//                         </tr>
//                     )}
//                 </tbody>
//             </Table>
//             <style jsx>
//                 {`
//                 th {
//                     text-align: center;
//                     font-size: 14px;
//                     white-space: nowrap;
//                 }
//                 .vendor_table .td {
//                     display: flex;
//                     flex-direction: row;
//                     font-size: 12px;
//                     float: right;
//                     padding: 0%;
//                     margin: 0%;
//                 }
//                 .vendor_table td {
//                     font-size: 12px;
//                 }
//             `}
//             </style>
//             <style type="text/css">{`
//                 .vendor_table .delete{
//                     color: #ff4d4d;
//                 }
//                 .vendor_table .delete:hover{
//                     color: #cc0000;
//                 }
//             `}</style>
//         </div>
//     )
// }


// const styles = {
//     fontawesome: {
//         color: `${theme.admin_primry_color}`,
//         width: '30px',
//         height: '30px',
//         maxHeight: '30px',
//         maxWidth: '30px',
//         float: 'right'
//     },
//     accordin_fontawesome: {
//         color: `${theme.admin_primry_color}`,
//         marginRight: '10%',
//         width: '15px',
//         height: '15px',
//         maxHeight: '15px',
//         maxWidth: '15px',
//     },
// }

// export default Vendors;

import React from 'react'

export default function vendors() {
    return (
        <div>

        </div>
    )
}
