
import React, { Component, useRef, useState } from 'react';
import { Accordion, Form, Col, Row, Card, Modal, InputGroup, Button, Toast, Alert, Nav, Tabs, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import {
    faPlus, faArrowLeft, faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import Select from 'react-select';
import AlertModal from '../../../alert-modal';
import TitleRow from '../../../title-row';
import CardAccordion from '../../../card-accordion';
import theme from '../../../../constants/theme';
import urls from '../../../../utils/urls';

import Specifications from './specifications';

import Scanner from '../../../../utils/scanner/scanner';

// Yup Schema for validation fields
const schema = yup.object({
    id: yup.string().required('Required *'),
    name: yup.string().required('Required *')
        .min(2, "Must have at least 2 characters")
        .max(40, "Can't be longer than 40 characters"),

    description: yup.string()
        .min(5, "Must have at least 5 characters")
        .max(200, "Can't be longer than 200 characters"),
    // Product Data
    sku: yup.string()
        .min(0, 'Enter Between 0-100')
        .max(100, 'Enter Between 0-100'),
    price: yup.number().required('Required *')
        .integer("Enter Only Numbers")
        .positive('Enter Between 1-1000000')
        .max(1000000, 'Enter Between 1-1000000'),
    stock: yup.number().required('Required *')
        .integer("Enter Only Numbers")
        .positive('Enter Between 1-1000000')
        .max(1000000, "Can't be longer than 1000000"),
    brand: yup.string()
        .min(2, "Must have at least 2 characters")
        .max(40, "Can't be longer than 40 characters"),
    imagesUrl: yup.string(),
    warranty: yup.number().integer("Enter Only Numbers")
        .min(0, 'Enter Between 0-1000')
        .max(1000, 'Enter Between 0-1000'),
    warrantyType: yup.string(),
    discount: yup.number().integer("Enter Only Numbers")
        .min(0, 'Enter Between 0-100')
        .max(100, 'Enter Between 0-100'),
    purchaseNote: yup.string(),
    shippingCharges: yup.number("Enter Only Numbers")
        .positive('Enter Between 0-10000')
        .max(10000, 'Enter Between 0-10000'),
    handlingFee: yup.number()
        .integer("Enter Only Numbers")
        .positive('Enter Between 0-10000')
        .max(10000, "Can't be longer than 1000"),
    specifications: yup.string(),
    categoryId: yup.string(),
    subCategoryId: yup.string(),
});

class AddNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userStatusAlert: false,
            statusAlertMessage: '',
            isUpdateProduct: false,
            _id: this.props._id,
            clearFields: false,
            isLoading: false,
            showToast: false,
            toastMessage: '',
            showImgLinkErrorrAlert: false,

            productCategory: '',
            productSubCategory: '',
            categoryId: '',
            subCategoryId: '',
            token: this.props.token,
            categories_list: this.props.categories_list,
            sub_categories_list: this.props.sub_categories_list,
            sub_category_options: [],

            subCategoryDisabled: true,
            categoryErrorDiv: 'BorderDiv',
            subCategoryErrorDiv: 'BorderDiv',
            warrantyType: '',
            inputValue: '',

            // Specifications
            customFieldsArray: [],

            files: [],
            imagePreviewArray: [],
            imgError: '',
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            categories_list: nextProps.categories_list,
            sub_categories_list: nextProps.sub_categories_list,
            token: nextProps.token
        });
    }

    // Product Category
    handleProductCategoryChange = (value) => {
        let array = []
        let _id = null
        if (value != null) {
            this.state.categories_list.forEach(element => {
                if (value.label == element.label) {
                    _id = element._id
                }
            })
            this.state.sub_categories_list.forEach(element => {
                if (element.categoryId == _id) {
                    array.push(element)
                }
            })
            this.setState({
                productCategory: value,
                sub_category_options: array,
                productSubCategory: [],
                subCategoryDisabled: false,
                categoryErrorDiv: 'BorderDiv',
                categoryId: _id
            });
        }
    }
    handleProductSubCategoryChange = (value) => {
        let _id = null
        if (value != null) {
            this.state.sub_category_options.forEach(element => {
                if (value.label == element.label) {
                    _id = element._id
                }
            })
            this.setState({
                productSubCategory: value,
                subCategoryErrorDiv: 'BorderDiv',
                subCategoryId: _id
            });
        }
    }

    // 
    async fileSelectedHandler(e) {
        await this.setState({ files: [...this.state.files, ...e.target.files], imgError: '' })
        let array = []
        this.state.files.forEach(element => {
            array.push({ 'url': URL.createObjectURL(element) })
        })
        this.setState({ imagePreviewArray: array })
    }

    deleteImage = (index) => {
        const copyArray = Object.assign([], this.state.files)
        const imgCopyArray = Object.assign([], this.state.imagePreviewArray)
        copyArray.splice(index, 1)
        imgCopyArray.splice(index, 1)
        this.setState({ files: copyArray, imagePreviewArray: imgCopyArray })
    }

    render() {
        return (
            <Formik
                validationSchema={schema}
                initialValues={
                    {
                        id: '',
                        name: '',
                        price: '',
                        stock: '',
                        description: '',
                        sku: '',
                        brand: '',
                        imagesUrl: '',
                        warranty: 0,
                        warrantyType: 'No Warranty',
                        discount: 0,
                        purchaseNote: '',
                        shippingCharges: '',
                        handlingFee: '',
                        specifications: '',
                        categoryId: '',
                        subCategoryId: '',
                    }
                }
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    const currentComponent = this
                    if (this.props.status == 'disapproved') {
                        this.setState({
                            userStatusAlert: true,
                            statusAlertMessage: 'You can\'t upload product, Your account is not approved yet'
                        })
                    } else if (this.props.status == 'restricted') {
                        this.setState({
                            userStatusAlert: true,
                            statusAlertMessage: 'You can\'t upload product, Your account has blocked, Contact to Admin'
                        })
                    } else {
                        //  Category & Sub-Category Checking
                        if (this.state.productCategory == '' || this.state.productSubCategory == '' || this.state.files == '') {
                            if (this.state.productCategory == '') {
                                this.setState({ categoryErrorDiv: 'RedBorderDiv' });
                            }
                            if (this.state.productSubCategory == '') {
                                this.setState({ subCategoryErrorDiv: 'RedBorderDiv' });
                            }
                            if (this.state.files == '') {
                                this.setState({ imgError: 'Required *' });
                            }
                        } else {
                            values.categoryId = this.state.categoryId;
                            values.subCategoryId = this.state.subCategoryId;
                            values.imagesUrl = this.state.files;
                            values.specifications = this.state.customFieldsArray;

                            let uploaded = false;
                            let secure_urls = [];
                            this.setState({ isLoading: true });
                            this.state.files && this.state.files.forEach(element => {
                                const data = new FormData();
                                data.append('file', element);
                                data.append('upload_preset', 'afghandarmaltoon');
                                fetch('https://api.cloudinary.com/v1_1/dhm7n3lg7/image/upload', {
                                    method: 'POST',
                                    body: data,
                                }).then(async res => {
                                    uploaded = true;
                                    let dataa = await res.json();
                                    secure_urls.push({ 'imageUrl': dataa.secure_url });
                                    console.log('ImageUrl:', dataa.secure_url)
                                    this.setState({ isLoading: false });
                                }).catch(err => {
                                    uploaded = false;
                                    console.log('error:', err)
                                    this.setState({ isLoading: false });
                                    alert("Error", "An Error Occured While Uploading")
                                    return;
                                })
                            })
                            values.imageUrl = secure_urls;
                            if (uploaded) {
                                setTimeout(() => {
                                    const config = {
                                        headers: {
                                            'authorization': this.props.token,
                                        }
                                    };
                                    axios.post(urls.POST_REQUEST.NEW_PRODUCT + this.props.user._id, values, config).then((res) => {
                                        resetForm()
                                        currentComponent.setState({
                                            userStatusAlert: false,
                                            statusAlertMessage: '',
                                            isUpdateProduct: false,
                                            _id: this.props._id,
                                            clearFields: false,
                                            isLoading: false,
                                            showToast: false,
                                            toastMessage: '',
                                            showImgLinkErrorrAlert: false,
                                            productCategory: '',
                                            productSubCategory: '',
                                            categoryId: '',
                                            subCategoryId: '',
                                            sub_category_options: [],
                                            subCategoryDisabled: true,
                                            categoryErrorDiv: 'BorderDiv',
                                            subCategoryErrorDiv: 'BorderDiv',
                                            warrantyType: '',
                                            inputValue: '',
                                            customFieldsArray: [],
                                            files: [],
                                            imagePreviewArray: [],
                                            imgError: '',
                                        });
                                    }).catch((error) => {
                                        console.log('error:', error)
                                        currentComponent.setState({ isLoading: false });
                                        alert('Product Upload failed')
                                    });
                                    setSubmitting(false);
                                }, 500);
                            }
                        }
                    }
                }}>
                {({
                    handleSubmit, handleChange, values, touched, isValid, errors, handleBlur, isSubmitting, setFieldValue
                }) => (
                    <div>
                        <TitleRow icon={faPlus} title={this.props.title} />
                        {this.props.isUpdateProduct ?
                            <Form.Row style={{ margin: ' 1% 2%', display: 'flex', alignItems: 'center' }} >
                                <Button variant='outline-primary' size='sm' className="mr-auto" onClick={this.props.back}>Back</Button>
                                <div className="mr-auto" style={{ fontSize: '14px' }}> {this.props.name || '-'}</div>
                                <Button variant='outline-primary' size='sm' className="mr-3" onClick={this.props.view}>View</Button>
                                <Button variant='outline-danger' size='sm' onClick={this.props.delete}>Delete</Button>
                            </Form.Row>
                            :
                            null
                        }
                        {this.props.status == 'disapproved' ?
                            <Alert variant='danger' style={{ fontSize: '14px' }}>
                                You can't upload product, Your account is not approved yet
                                </Alert>
                            :
                            null
                        }
                        {this.props.status == 'restricted' ?
                            <Alert variant='danger' style={{ fontSize: '14px' }}>
                                You can't upload product, Your account is blocked, Contact to Admin
                                </Alert>
                            :
                            null
                        }
                        <Form noValidate onSubmit={handleSubmit}>
                            <AlertModal
                                onHide={() => this.setState({ userStatusAlert: false })}
                                show={this.state.userStatusAlert}
                                header={'Error'}
                                message={this.state.statusAlertMessage}
                                iconname={faExclamationTriangle}
                                color={"#ff3333"}
                            />
                            <AlertModal
                                onHide={(e) => this.setState({ showToast: false })}
                                show={this.state.showToast}
                                header={'Success'}
                                message={this.state.toastMessage}
                                iconname={faThumbsUp}
                                color={"#00b300"}
                            />
                            <AlertModal
                                onHide={(e) => this.setState({ showImgLinkErrorrAlert: false })}
                                show={this.state.showImgLinkErrorrAlert}
                                header={'Error'}
                                message={'Enter Price/Stock/Image(s) in General Tab First'}
                                iconname={faExclamationTriangle}
                                color={"#ff3333"}
                            />
                            <Row noGutters style={{ paddingTop: '1%' }}>
                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <Form.Group as={Row} style={{ margin: '0.5% 2% 2% 2%', padding: '0%' }}>
                                        <Scanner setScanerCode={(val) => setFieldValue('id', val)} />
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <Form.Group as={Row} style={{ margin: '0.5% 2% 2% 2%', padding: '0%' }}>
                                        <Form.Label style={styles.label}>{'Product Id '}<span>*</span></Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                placeholder="Scan Barcode or Choose File"
                                                name="id"
                                                value={values.id}
                                                onChange={handleChange}
                                                isInvalid={errors.id && touched.id}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.id}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                    {/* Product Name */}
                                    <Form.Group as={Row} style={{ margin: '0.5% 2% 2% 2%', padding: '0%' }}>
                                        <Form.Label style={styles.label}>Product Name<span>*</span></Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Product Name"
                                                name="name"
                                                value={values.name}
                                                onChange={handleChange}
                                                isInvalid={errors.name && touched.name}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                    {/* End of Product Name */}

                                    {/* Product Data Row */}
                                    <CardAccordion title={'Product Data'}>
                                        <Card style={styles.card}>
                                            <Card.Body style={{ padding: '0.5%', margin: '0px' }}>
                                                <Form.Row>
                                                    <Form.Group as={Col} lg={6} md={6} sm={12} xs={12} >
                                                        <Form.Label style={styles.label}>Product SKU</Form.Label>
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="text"
                                                                size="sm"
                                                                placeholder="Enter SKU (Stock Keeping Unit)"
                                                                name="sku"
                                                                value={values.sku}
                                                                onChange={handleChange}
                                                                isInvalid={errors.sku}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.sku}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    <Form.Group as={Col} lg={6} md={6} sm={12} xs={12}>
                                                        <Form.Label style={styles.label}>Product Price <span> * </span></Form.Label>
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="number"
                                                                size="sm"
                                                                placeholder="Enter Product Price"
                                                                name="price"
                                                                value={values.price}
                                                                onChange={handleChange}
                                                                isInvalid={errors.price && touched.price}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.price}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Form.Row>

                                                <Form.Row>
                                                    <Form.Group as={Col} lg={4} md={4} sm={12} xs={12}>
                                                        <Form.Label style={styles.label}>Product in Stock<span> * </span></Form.Label>
                                                        <Form.Control type="number"
                                                            size="sm"
                                                            name="stock"
                                                            placeholder="Enter Product In Stock"
                                                            value={values.stock}
                                                            onChange={handleChange}
                                                            isInvalid={errors.stock && touched.stock}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.stock}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                    <Form.Group as={Col} lg={4} md={4} sm={12} xs={12}>
                                                        <Form.Label style={styles.label}>Brand Name</Form.Label>
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="text"
                                                                size="sm"
                                                                placeholder="Enter Brand Name"
                                                                name="brand"
                                                                value={values.brand}
                                                                onChange={handleChange}
                                                                isInvalid={errors.brand}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.brand}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    <Form.Group as={Col} lg={4} md={4} sm={12} xs={12} style={{ marginBottom: '5px' }}>
                                                        <Form.Label style={{ width: '100%', fontSize: `${theme.SIZES.LABEL}` }}>Product Images <span> * </span></Form.Label>
                                                        <input type="file" style={{ padding: '0.6% 2%', width: '100%', fontSize: '13px', border: '1px solid lightgray', borderRadius: '1px' }}
                                                            multiple onChange={this.fileSelectedHandler.bind(this)}
                                                            name="image" accept="image/*"
                                                        />
                                                        <Form.Label style={styles.label}>
                                                            <span>{this.state.imgError}</span>
                                                        </Form.Label>
                                                    </Form.Group>
                                                </Form.Row>

                                                <Form.Row>
                                                    {(this.state.imagePreviewArray || []).map((element, index) => (
                                                        <div className="show-image" key={index}>
                                                            <img style={{ height: '100px', width: '100px', margin: '1%' }} src={element.url} alt="..." />
                                                            <input className="deleteImage" type="button" onClick={() => this.deleteImage(index)} value="Delete" />
                                                        </div>
                                                    ))}
                                                </Form.Row>

                                                <Form.Row className='mt-3'>
                                                    <Form.Group as={Col} lg={4} md={4} sm={12} xs={12}>
                                                        <Form.Label style={styles.label}>Product Warranty (months) </Form.Label>
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="number"
                                                                size="sm"
                                                                placeholder="Enter Product Warranty"
                                                                name="warranty"
                                                                value={values.warranty}
                                                                onChange={handleChange}
                                                                isInvalid={errors.warranty}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.warranty}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    <Form.Group as={Col} lg={4} md={4} sm={12} xs={12}>
                                                        <Form.Label style={styles.label}> Warranty Type </Form.Label>
                                                        <InputGroup>
                                                            <Form.Control
                                                                as="select"
                                                                name="warrantyType"
                                                                size="sm"
                                                                value={values.warrantyType}
                                                                onChange={handleChange}
                                                                isInvalid={errors.warrantyType}
                                                            >
                                                                <option>Waranty Type</option>
                                                                <option> No Warranty </option>
                                                                <option> Brand Warranty </option>
                                                                <option> Local Warranty </option>
                                                                <option> Local Seller Warranty </option>
                                                                <option> Non-Local Warranty </option>
                                                                <option> Internationsl Warranty </option>
                                                                <option> Internationsl Seller Warranty </option>
                                                                <option> International Manufacturer Warranty </option>
                                                            </Form.Control>
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.warrantyType}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    <Form.Group as={Col} lg={4} md={4} sm={12} xs={12}>
                                                        <Form.Label style={styles.label}>Product Discount</Form.Label>
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="number"
                                                                size="sm"
                                                                placeholder="Enter Discount on on Product(%)"
                                                                name="discount"
                                                                value={values.discount}
                                                                onChange={handleChange}
                                                                isInvalid={errors.discount}
                                                            />
                                                            <InputGroup.Prepend>
                                                                <Button variant='primary' size="sm">%</Button>
                                                            </InputGroup.Prepend>
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.discount}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Form.Row>

                                                <Form.Row className='mt-3'>
                                                    <Form.Group as={Col} lg={6} md={6} sm={12} xs={12}>
                                                        <Form.Label style={styles.label}>Product Shipping Charges</Form.Label>
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="text"
                                                                size="sm"
                                                                placeholder="Enter Product Shipping Charges"
                                                                name="shippingCharges"
                                                                value={values.shippingCharges}
                                                                onChange={handleChange}
                                                                isInvalid={errors.shippingCharges}
                                                            />
                                                            <InputGroup.Prepend>
                                                                <Button variant='primary' size="sm">PKR</Button>
                                                            </InputGroup.Prepend>
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.shippingCharges}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    <Form.Group as={Col} lg={6} md={6} sm={12} xs={12}>
                                                        <Form.Label style={styles.label}>Product Handling Fee</Form.Label>
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="text"
                                                                size="sm"
                                                                placeholder="Enter Product Handling Fee"
                                                                name="handlingFee"
                                                                value={values.handlingFee}
                                                                onChange={handleChange}
                                                                isInvalid={errors.handlingFee}
                                                            />
                                                            <InputGroup.Prepend>
                                                                <Button variant='primary' size="sm">PKR</Button>
                                                            </InputGroup.Prepend>
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.handlingFee}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Form.Group as={Col} lg={12} md={12} sm={12} xs={12}>
                                                        <Form.Label style={styles.label}>Purchase Note</Form.Label>
                                                        <InputGroup>
                                                            <Form.Control
                                                                type="text"
                                                                size="sm"
                                                                placeholder="Enter Purchase Notes"
                                                                name="purchase_note"
                                                                value={values.purchaseNote}
                                                                onChange={handleChange}
                                                                isInvalid={errors.purchaseNote}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.purchaseNote}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Form.Row>
                                            </Card.Body >
                                        </Card >
                                    </CardAccordion>
                                    {/* End of Product Data Row */}

                                    {/* Specifications Row */}
                                    <CardAccordion title={'Product Specifications'}>
                                        <Specifications
                                            {...this.props}
                                            customFieldsArray={this.state.customFieldsArray}
                                            setFieldsArrayHandler={(arr) => this.setState({ customFieldsArray: arr })}
                                        />
                                    </CardAccordion>
                                    {/* End of Specifications Row */}
                                </Col>
                            </Row>
                            <Row noGutters style={{ padding: '1%' }}>
                                {/* Product Discription */}
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <CardAccordion title={'Product Description'}>
                                        <Form.Group>
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Enter Product Description"
                                                name="description"
                                                value={values.description}
                                                rows="14"
                                                onChange={handleChange}
                                                isInvalid={errors.description && touched.description}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.description}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </CardAccordion>
                                </Col>
                                {/* Product Category */}
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <CardAccordion title={'Product Categories'}>
                                        <Form.Group>
                                            <Form.Label style={styles.label}>Category</Form.Label>
                                            <div className={this.state.categoryErrorDiv}>
                                                <Select
                                                    id={'1'}
                                                    instanceId={'1'}
                                                    inputId={'1'}

                                                    styles={theme.REACT_SELECT_STYLES}
                                                    onChange={this.handleProductCategoryChange}
                                                    options={this.state.categories_list}
                                                    value={this.state.productCategory}
                                                    isSearchable={true}
                                                    isCreateable={false}
                                                    placeholder="Select Category"
                                                />
                                            </div>
                                            <Form.Label style={styles.label}>
                                                <span>{this.state.categoryErrorDiv == 'RedBorderDiv' && 'Required *'}</span>
                                            </Form.Label>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label style={styles.label}>Sub Category</Form.Label>
                                            <div className={this.state.subCategoryErrorDiv}>
                                                <Select
                                                    id={'1'}
                                                    instanceId={'1'}
                                                    inputId={'1'}
                                                    styles={theme.REACT_SELECT_STYLES}
                                                    onChange={this.handleProductSubCategoryChange}
                                                    options={this.state.sub_category_options}
                                                    value={this.state.productSubCategory}
                                                    isSearchable={true}
                                                    isCreateable={false}
                                                    placeholder="Select Sub Category"
                                                    isDisabled={this.state.subCategoryDisabled}
                                                />
                                            </div>
                                            <Form.Label style={styles.label}>
                                                <span>{this.state.subCategoryErrorDiv == 'RedBorderDiv' && 'Required *'}</span>
                                            </Form.Label>
                                            <div style={{ minHeight: '150px' }}></div>
                                        </Form.Group>
                                    </CardAccordion>
                                    {/* End of Product ategory */}
                                </Col>
                            </Row>

                            {/* Form Submit Btn Row */}
                            <Row style={styles.row}>
                                <Button type="submit" onSubmit={handleSubmit} disabled={this.state.isLoading} block>
                                    {this.state.isLoading ? 'Uploading' : 'Upload'}
                                    {this.state.isLoading ? <Spinner animation="grow" size="sm" /> : <div></div>}
                                </Button>
                            </Row>
                            {/* End of Form Submit Btn Row */}
                        </Form>
                        <style type="text/css">{`
                            .card_toggle{
                                background: ${theme.COLORS.ADMIN_MAIN};
                                font-size: 13px;
                                color: white;
                                cursor: pointer;
                                display: inline-flex;
                                align-items: center;
                            }
                            .card_toggle:hover{
                                background: ${theme.COLORS.SEC_HOVER};
                            }
                        `}</style>
                        <style jsx> {`
                            .RedBorderDiv{
                                border: 0.5px solid #DC3545;
                                padding: 1px;
                                border-radius: 2px;
                                width: 100%;
                            }
                            .BorderDiv{
                                border: none;
                                width: 100%;
                            }
                            span {
                                color: red;
                            }
                            .nav_link {
                                background: ${theme.COLORS.ADMIN_MAIN};
                                border-top: 0.5px solid #434556;
                                border-bottom: 0.5px solid #434556;
                                margin: 1.5px 0px;
                                border-radius: 4px
                            }
                            p {
                                text-align: center; 
                                margin: 0px;
                            }
                            @media (max-width: 991px) {
                                .linkName {
                                    display: none
                                }
                            }
                            div.show-image {
                                position: relative;
                                float:left;
                                margin:5px;
                            }
                            div.show-image:hover img{
                                opacity:0.5;
                            }
                            div.show-image:hover input {
                                display: block;
                            }
                            div.show-image input {
                                position:absolute;
                                display:none;
                            }
                            div.show-image input.deleteImage {
                                top:0;
                                left:0;
                                color: red;
                                font-size: 13px
                            }
                        `}</style>
                    </div>
                )
                }
            </Formik >
        );
    }
}

const styles = {
    nav_link: {
        color: 'white',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        height: '45px',
    },
    row: {
        margin: '2%',
        padding: '0%'
    },
    card: {
        width: '100%',
        border: 'none',
        background: theme.COLORS.SECONDARY,
    },
    card_header: {
        display: 'flex',
        alignItems: 'center',
        fontSize: `${theme.SIZES.HEADER}`,
        background: `${theme.COLORS.ADMIN_MAIN}`,
    },
    label: {
        fontSize: `${theme.SIZES.LABEL}`,
    },
    fontawesome: {
        color: `${theme.COLORS.WHITE}`,
        width: '15px',
        height: '15px',
        maxHeight: '15px',
        maxWidth: '15px',
    },
    product_fontawesome: {
        color: `${theme.COLORS.WHITE}`,
        marginRight: '10%',
        width: '15px',
        height: '15px',
        maxHeight: '15px',
        maxWidth: '15px',
    },
    slider_fontawesome: {
        color: 'white',
        width: '15px',
        height: '15px',
        maxHeight: '15px',
        maxWidth: '15px',
    },
    buttons: {
        background: `${theme.COLORS.MAIN}`,
        border: 'none',
        fontSize: '10px',
    },
    label: {
        fontSize: `${theme.SIZES.LABEL}`,
    },
    term_condition_label: {
        width: '100%',
        fontSize: `${theme.SIZES.LABEL}`,
        paddingTop: '-10px',
        marginTop: '-10px',
    },
    fontawesome: {
        color: `${theme.COLORS.TEXT}`,
        width: '15px',
        height: '15px',
        maxHeight: '15px',
        maxWidth: '15px',
    },
    product_fontawesome: {
        color: `${theme.COLORS.TEXT}`,
        marginRight: '10%',
        width: '17px',
        height: '17px',
        maxHeight: '17px',
        maxWidth: '17px',
    },
    variations_fontawesome: {
        color: `${theme.COLORS.ADMIN_MAIN}`,
        marginRight: '10%',
        width: '15px',
        height: '15px',
        maxHeight: '15px',
        maxWidth: '15px',
    },
}
export default AddNew;