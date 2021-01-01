// import { Form, Row, Accordion, Col, Card, InputGroup, Button, Spinner } from 'react-bootstrap'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPlus, faListAlt, faSlidersH } from '@fortawesome/free-solid-svg-icons'
// import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons'
// import React, { Component } from 'react';
// import MuhalikConfig from '../../../../../../sdk/muhalik.config'
// import theme from '../../../../.././../styleSheet'
// import axios from 'axios';
// import AlertModal from '../../../../alert-modal';
// import TitleRow from '../../../../title-row';
// import CardAccordion from '../../../../card_accordion';

// let tagArray = [];
// class ProducTags extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             token: '',
//             isLoading: false,
//             showToast: false,
//             tagValue: '',
//             error: '',
//             tagList: [],
//             tagRequestList: [],

//             editRequestedTag: '',
//             showModalMessage: '',
//             showModal: false,

//             filterStr: '',
//         }
//     }

//     UNSAFE_componentWillReceiveProps(nextProps) {
//         this.setState({
//             token: nextProps.token
//         });
//     }

//     async addTag(tagValue, currentComponent) {
//         const url = MuhalikConfig.PATH + '/api/categories/tag';
//         let data = []
//         data = { label: tagValue, value: tagValue }
//         await axios.post(url,data, {
//             headers: { 'authorization': this.state.token }
//         }).then(function (response) {
//             currentComponent.setState({ isLoading: false })
//             currentComponent.setState({ showModalMessage: 'Product Tag Added Successfully' })
//             currentComponent.setState({ showModal: true })
//         }).catch(function (error) {
//             currentComponent.setState({ isLoading: false });
//             console.log('Error: ', error.response.data.message);
//         });
//     }

//     handleFilterStrChange(e) {
//         this.setState({ filterStr: e.target.value });
//         if (e.target.value == '') {
//             this.setState({ tagList: tagArray });
//         } else {
//             let array = [];
//             this.state.tagList.filter(function (data) {
//                 // var value = data.value.toLowerCase;
//                 if (data.value.includes(e.target.value)) {
//                     array.push(data);
//                 }
//             })
//             this.setState({ tagList: array });
//         }
//     }

//     async handleSubmit() {
//         if (this.state.tagValue == '') {
//             this.setState({ error: 'Enter Value First' })
//         } else {
//             this.setState({ isLoading: true })
//             this.setState({ error: '' })
//             this.addTag(this.state.tagValue, this)
//         }
//     }



//     // Tag Request 
//     // => Field Value 
//     handleTagRequestChange = (e, index) => {
//         let copyArray = [];
//         copyArray = Object.assign([], this.state.tagRequestList);
//         copyArray[index].value = e.target.value;

//         if (e.target.value != '' && e.target.value.length <= 20 && e.target.value.length >= 3) {
//             copyArray[index].error = ''
//         } else {
//             copyArray[index].error = 'Value must be 3-20 characters'
//         }
//         this.setState({ tagRequestList: copyArray })
//     }
//     //  => Edit
//     async handleEditTagRequestClick(index) {
//         let copyArray = [];
//         copyArray = Object.assign([], this.state.tagRequestList);
//         var obj = {};
//         obj['value'] = copyArray[index].value;
//         obj['label'] = false;
//         obj['prevVal'] = copyArray[index].value;
//         obj['error'] = '';
//         copyArray[index] = obj
//         await this.setState({ tagRequestList: copyArray })
//     }
//     //  => Cancle
//     handleCancelTagRequestClick(index) {
//         let copyArray = [];
//         copyArray = Object.assign([], this.state.tagRequestList);
//         copyArray[index].value = copyArray[index].prevVal;
//         copyArray[index].label = true;
//         copyArray[index].error = '';
//         this.setState({ tagRequestList: copyArray })
//     }
//     // Update
//     handleUpdateTagRequestClick(index) {
//         let copyArray = [];
//         copyArray = Object.assign([], this.state.tagRequestList);
//         if (copyArray[index].value == copyArray[index].prevVal) {
//             copyArray[index].error = 'Enter Different Value';
//             this.setState({ tagRequestList: copyArray });
//         } else {
//             if (copyArray[index].error == '') {
//                 copyArray[index].label = true;
//                 this.setState({ tagRequestList: copyArray, showModalMessage: 'Product Tag Updated Successfully', showModal: true });
//             }
//         }
//     }
//     //  => Add
//     handleAddTagRequestClick(index) {
//         let copyArray = [];
//         copyArray = Object.assign([], this.state.tagRequestList);
//         copyArray.splice(index, 1);
//         this.setState({ tagRequestList: copyArray, showModalMessage: 'Product Tag Added Successfully', showModal: true })
//         this.addTag(copyArray[index].value, this)
//     }
//     //  => Delete
//     handleDeleteTagRequestClick(index) {
//         let copyArray = [];
//         copyArray = Object.assign([], this.state.tagRequestList);
//         copyArray.splice(index, 1);
//         this.setState({ tagRequestList: copyArray, showModalMessage: 'Product Tag Deleted', showModal: true })
//     }






//     // All tags
//     //  => Chane
//     handleTagChange = (e, index) => {
//         let copyArray = [];
//         copyArray = Object.assign([], this.state.tagList);
//         copyArray[index].value = e.target.value;

//         if (e.target.value != '' && e.target.value.length <= 20 && e.target.value.length >= 3) {
//             copyArray[index].error = ''
//         } else {
//             copyArray[index].error = 'Value must be 3-20 characters'
//         }
//         this.setState({ tagList: copyArray })
//     }

//     //  => Edit
//     async handleEditTagClick(index) {
//         let copyArray = [];
//         copyArray = Object.assign([], this.state.tagList);
//         var obj = {};
//         obj['value'] = copyArray[index].value;
//         obj['label'] = false;
//         obj['prevVal'] = copyArray[index].value;
//         obj['error'] = '';
//         copyArray[index] = obj
//         await this.setState({ tagList: copyArray })
//     }
//     //  => Cancle
//     handleCancelTagClick(index) {
//         let copyArray = [];
//         copyArray = Object.assign([], this.state.tagList);
//         copyArray[index].value = copyArray[index].prevVal;
//         copyArray[index].error = '';
//         copyArray[index].label = true;
//         this.setState({ tagList: copyArray })
//     }
//     //  => Update
//     handleUpdateTagClick(index) {
//         let copyArray = [];
//         copyArray = Object.assign([], this.state.tagList);
//         if (copyArray[index].value == copyArray[index].prevVal) {
//             copyArray[index].error = 'Enter Different Value';
//             this.setState({ tagRequestList: copyArray });
//         } else {
//             if (copyArray[index].error == '') {
//                 copyArray[index].label = true;
//                 tagArray.forEach((element, i) => {
//                     if (copyArray[index].prevVal == element.value) {
//                         element.value = copyArray[index].value;
//                     }
//                 });
//                 this.setState({ tagList: copyArray, showModalMessage: 'Product Tag Updated Successfully', showModal: true });
//             }
//         }
//     }
//     //  => Delete
//     handleDeleteTagClick = (index) => {
//         let copyArray = [];
//         copyArray = Object.assign([], this.state.tagList);
//         tagArray.forEach((element, i) => {
//             if (copyArray[index].value == element.value) {
//                 tagArray.splice(index, 1);
//             }
//         });
//         copyArray.splice(index, 1);
//         this.setState({ tagList: copyArray, showModalMessage: 'Product Tag Deleted', showModal: true })
//     }

//     render() {
//         return (
//             <>
//                 <AlertModal
//                     onHide={(e) => this.setState({ showModal: false })}
//                     show={this.state.showModal}
// alertType = { 'success'}
//                     message={this.state.showModalMessage}
//                 />

//                 <TitleRow icon={faListAlt} title={' Admin Dashboard / Product Tags'} />

//                 {/* Add New Tag */}
//                 <CardAccordion title={'Add New Tag'}>
//                     <Form.Group>
//                         <InputGroup>
//                             <Form.Control
//                                 type="text"
//                                 size="sm"
//                                 placeholder="Enter Tag Value"
//                                 name="sku"
//                                 value={this.state.tagValue}
//                                 onChange={(e) => this.setState({ tagValue: e.target.value })}
//                                 isInvalid={this.state.error}
//                             />
//                             <Form.Control.Feedback type="invalid">
//                                 {this.state.error}
//                             </Form.Control.Feedback>
//                         </InputGroup>
//                     </Form.Group>
//                     <Form.Group>
//                         <Button type="submit" size="sm" onClick={this.handleSubmit.bind(this)} disabled={this.state.isLoading} block style={styles.submit_btn}>
//                             {this.state.isLoading ? 'Uploading' : 'Add Tag'}
//                             {this.state.isLoading ? <Spinner animation="grow" size="sm" /> : null}
//                         </Button>
//                     </Form.Group>
//                 </CardAccordion>

//                 {/* Add Tag Requests */}
//                 <CardAccordion title={'Add Tag Requests'}>
//                     {this.state.tagRequestList.map((element, index) =>
//                         <Form.Row>
//                             <Form.Group as={Col} lg={2} md={2} sm={3} xs={12}>
//                                 <Form.Control
//                                     type="text"
//                                     size="sm"
//                                     name="sku"
//                                     value={element.entry_date}
//                                     disabled={true}
//                                 />
//                             </Form.Group>
//                             <Form.Group as={Col} lg={2} md={2} sm={3} xs={12}>
//                                 <Form.Control
//                                     type="text"
//                                     size="sm"
//                                     name="sku"
//                                     value={element.entry_date}
//                                     disabled={true}
//                                 />
//                             </Form.Group>
//                             <div className="mr-auto"></div>
//                             <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
//                                 <InputGroup>
//                                     <Form.Control
//                                         type="text"
//                                         size="sm"
//                                         placeholder="Enter Tag Value"
//                                         name="sku"
//                                         value={element.value}
//                                         onChange={(e) => this.handleTagRequestChange(e, index)}
//                                         isInvalid={element.error}
//                                         disabled={element.label}
//                                     />
//                                     <Form.Control.Feedback type="invalid">
//                                         {element.error}
//                                     </Form.Control.Feedback>
//                                 </InputGroup>
//                             </Form.Group>
//                             <div className="mr-auto"></div>
//                             <Form.Group as={Col} lg="auto" md="auto" sm="auto" xs="auto">
//                                 <Button type="submit" variant="outline-success" size="sm" block style={styles.submit_btn}
//                                     onClick={() => element.label ? this.handleEditTagRequestClick(index) : this.handleUpdateTagRequestClick(index)} >
//                                     <div>{element.label ? 'Edit' : 'Update'}</div>
//                                 </Button>
//                             </Form.Group>
//                             <Form.Group as={Col} lg="auto" md="auto" sm="auto" xs="auto">
//                                 <Button type="submit" variant="outline-primary" size="sm" block style={styles.submit_btn}
//                                     onClick={() => { element.label ? this.handleAddTagRequestClick(index) : this.handleCancelTagRequestClick(index) }}>
//                                     <div>{element.label ? 'Add' : 'Cancel'}</div>
//                                 </Button>
//                             </Form.Group>
//                             <div className="mr-auto"></div>
//                             <Form.Group as={Col} lg="auto" md="auto" sm="auto" xs="auto">
//                                 <Button type="submit" variant="outline-danger" size="sm" block style={styles.submit_btn}
//                                     onClick={() => this.handleDeleteTagRequestClick(index)}>
//                                     <div>Discard</div>
//                                 </Button>
//                             </Form.Group>

//                         </Form.Row>
//                     )}
//                 </CardAccordion>

//                 {/* All Tags */}
//                 <CardAccordion title={'All Tags'}>
//                     <Form.Row style={{ margin: '0% 5%' }}>
//                         <Form.Group as={Col}>
//                             <InputGroup>
//                                 <Form.Control
//                                     type="text"
//                                     size="sm"
//                                     placeholder="Enter Tag Value"
//                                     name="sku"
//                                     value={this.state.filterStr}
//                                     onChange={(e) => this.handleFilterStrChange(e)}
//                                 />
//                             </InputGroup>
//                         </Form.Group>
//                     </Form.Row>
//                     <hr />
//                     {this.state.tagList.map((element, index) =>
//                         <Form.Row>
//                             <Form.Group as={Col} lg={2} md={2} sm={6} xs={12}>
//                                 <Form.Control
//                                     type="text"
//                                     size="sm"
//                                     name="sku"
//                                     value={element.entry_date}
//                                     disabled={true}
//                                 />
//                             </Form.Group>
//                             <div className="mr-auto"></div>
//                             <Form.Group as={Col} lg={6} md={6} sm={6} xs={12}>
//                                 <InputGroup>
//                                     <Form.Control
//                                         type="text"
//                                         size="sm"
//                                         placeholder="Enter Tag Value"
//                                         name="sku"
//                                         value={element.value}
//                                         onChange={(e) => this.handleTagChange(e, index)}
//                                         disabled={element.label}
//                                         isInvalid={element.error}
//                                     />
//                                     <Form.Control.Feedback type="invalid">
//                                         {element.error}
//                                     </Form.Control.Feedback>
//                                 </InputGroup>
//                             </Form.Group>
//                             <div className="mr-auto"></div>
//                             <Form.Group as={Col} lg="auto" md="auto" sm="auto" xs="auto">
//                                 <Button type="submit" variant="outline-success" size="sm" block style={styles.submit_btn}
//                                     onClick={element.label ? () => this.handleEditTagClick(index) : () => this.handleUpdateTagClick(index)} >
//                                     <div>{element.label ? 'Edit' : 'Update'}</div>
//                                 </Button>
//                             </Form.Group>
//                             <div className="mr-auto"></div>
//                             <Form.Group as={Col} lg="auto" md="auto" sm="auto" xs="auto">
//                                 <Button type="submit" variant={element.label ? "outline-danger" : "outline-primary"} size="sm" block style={styles.submit_btn}
//                                     onClick={element.label ? () => this.handleDeleteTagClick(index) : () => this.handleCancelTagClick(index)}>
//                                     <div>{element.label ? 'Delete' : 'Cancel'}</div>
//                                 </Button>
//                             </Form.Group>

//                         </Form.Row>
//                     )}
//                 </CardAccordion>
//             </>
//         )
//     }
// }

// const styles = {
//     title_row: {
//         borderBottom: '1px solid gray',
//         padding: '1.5% 4%'
//     },
//     title_fontawesome: {
//         color: 'gray',
//         marginRight: '3%',
//         width: '26px',
//         height: '26px',
//         maxHeight: '26px',
//         maxWidth: '26px',
//     },
//     title: {
//         color: 'gray'
//     },

//     card: {
//         // width: '100%',
//         margin: '2%'
//     },
//     card_body: {
//         // padding: '5%'
//     },
//     label: {
//         fontSize: `${theme.form_label_fontsize}`
//     },
//     error: {
//         width: '100%',
//         textAlign: 'center',
//         color: '#DC3545',
//         fontSize: '14px',
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
// export default ProducTags

const ProducTags = () => {
    return <div>Comented</div>
}
export default ProducTags
