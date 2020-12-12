
import React, { Component, useRef } from 'react';
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

// import Specifications from './add-new-contents/custom-fields';
import ProductData from './product-data';
import Specifications from './specifications';

import Scanner from '../../../../utils/scanner/scanner';

// Yup Schema for validation fields
const schema = yup.object({
    id: yup.string().required("Enter Product Name"),
    name: yup.string().required("Enter Product Name")
        .min(2, "Must have at least 2 characters")
        .max(40, "Can't be longer than 40 characters"),

    description: yup.string()
        .min(5, "Must have at least 5 characters")
        .max(200, "Can't be longer than 200 characters"),
    // Product Data
    // => Inventory
    sku: yup.string()
        .min(0, 'Enter Between 0-100')
        .max(100, 'Enter Between 0-100'),
    // => General(Simple-Product)
    price: yup.number()
        .integer("Enter Only Numbers")
        .positive('Enter Between 1-1000000')
        .max(1000000, 'Enter Between 1-1000000'),
    stock: yup.number()
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
    // => Attributes (Variable Product)
    purchaseNote: yup.string(),
    // => Shipping
    shippingCharges: yup.number("Enter Only Numbers")
        .positive('Enter Between 0-10000')
        .max(10000, 'Enter Between 0-10000'),
    handlingFee: yup.number()
        .integer("Enter Only Numbers")
        .positive('Enter Between 0-10000')
        .max(10000, "Can't be longer than 1000"),
    // => Advanve
    purchaseNote: yup.string(),
    // Specifications
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
            token: this.props.token,
            isUpdateProduct: false,
            _id: this.props._id,
            clearFields: false,
            isLoading: false,
            showToast: false,
            toastMessage: '',
            showSimpleProductPriceImgLinkErrorrAlert: false,

            productCategory: '',
            productSubCategory: '',
            categoryId: '',
            subCategoryId: '',
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
            variationImagePreviewArray: [],
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
        await this.setState({ files: [...this.state.files, ...e.target.files] })
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
                        price: '',
                        stock: '',
                        name: '',
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
                        specifications: [],
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
                        if (this.state.productCategory == '' || this.state.productSubCategory == '') {
                            if (this.state.productCategory == '') {
                                this.setState({ categoryErrorDiv: 'RedBorderDiv' });
                            }
                            if (this.state.productSubCategory == '') {
                                this.setState({ subCategoryErrorDiv: 'RedBorderDiv' });
                            }
                        } // Product Price/Stock/Imgages Checking for Simple Product
                        else if (values.price == '' || values.stock == '' || this.state.files == '') {
                            this.setState({ showSimpleProductPriceImgLinkErrorrAlert: true });
                        } else {
                            values.categoryId = this.state.categoryId;
                            values.subCategoryId = this.state.subCategoryId;
                            values.imagesUrl = this.state.files;
                            values.specifications = this.state.customFieldsArray;

                            console.log('Data:', values);
                            // this.setState({ isLoading: true });
                            // setTimeout(() => {
                            //     values.categoryId = this.state.categoryId;
                            //     values.subCategoryId = this.state.subCategoryId;

                            //     values.imagesUrl = this.state.files;
                            //     values.specifications = this.state.customFieldsArray;

                            //     const formData = new FormData();
                            //     formData.append('name', values.name)
                            //     formData.append('description', values.description)
                            //     formData.append('sku', values.sku)
                            //     formData.append('purchaseNote', values.purchaseNote)
                            //     formData.append('shippingCharges', values.shippingCharges)
                            //     formData.append('handlingFee', values.handlingFee)
                            //     formData.append('brand', values.brand)

                            //     formData.append('price', values.price)
                            //     formData.append('stock', values.stock)
                            //     values.imagesUrl && values.imagesUrl.forEach(element => {
                            //         formData.append('myImage', element)
                            //     })
                            //     formData.append('specifications', JSON.stringify(values.specifications))
                            //     formData.append('warranty', values.warranty)
                            //     formData.append('warrantyType', values.warrantyType)
                            //     formData.append('discount', values.discount)

                            //     formData.append('category', values.categoryId)
                            //     formData.append('sub_category', values.subCategoryId)

                            //     let url = urls.PATH + '/api/products/add-product'

                            //     const config = {
                            //         headers: {
                            //             'content-type': 'multipart/form-data',
                            //             'authorization': this.props.token,
                            //         }
                            //     };
                            //     axios.post(url, formData, config).then((res) => {
                            //         resetForm()
                            //         currentComponent.setState({
                            //             isLoading: false,
                            //             showToast: true,
                            //             toastMessage: 'Product Uploaded Successfully',
                            //             showSimpleProductPriceImgLinkErrorrAlert: false,

                            //             productCategory: '',
                            //             productSubCategory: '',

                            //             subCategoryDisabled: true,
                            //             subSubCategoryDisabled: true,

                            //             categoryErrorDiv: 'BorderDiv',
                            //             subCategoryErrorDiv: 'BorderDiv',

                            //             warrantyType: '',
                            //             inputValue: '',
                            //             files: [],
                            //             imagePreviewArray: [],

                            //             // Specifications
                            //             customFieldsArray: [],

                            //         });
                            //     }).catch((error) => {
                            //         console.log('error:', error)
                            //         currentComponent.setState({ isLoading: false });
                            //         alert('Product Upload failed')
                            //     });
                            //     setSubmitting(false);
                            // }, 500);
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
                                onHide={(e) => this.setState({ userStatusAlert: false })}
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
                                onHide={(e) => this.setState({ showSimpleProductPriceImgLinkErrorrAlert: false })}
                                show={this.state.showSimpleProductPriceImgLinkErrorrAlert}
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

                                    {/* Product Discription */}
                                    <CardAccordion title={'Product Description'}>
                                        <Form.Group>
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Enter Product Description"
                                                name="description"
                                                value={values.description}
                                                rows="7"
                                                onChange={handleChange}
                                                isInvalid={errors.description && touched.description}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.description}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </CardAccordion>
                                    {/* Product Data Row */}
                                    <CardAccordion title={'Product Data'}>
                                        <ProductData
                                            {...this.props}
                                            isUpdateProduct={this.props.isUpdateProduct}
                                            fileSelectedHandler={this.fileSelectedHandler.bind(this)}
                                            imagePreviewArray={this.state.imagePreviewArray}
                                            deleteImage={this.deleteImage}
                                            onChange={handleChange}
                                            errors={errors}
                                            touched={touched}
                                            productColorChangeHandler={this.handleProductColorChange}
                                            productSizeChangeHandler={this.handleProductSizeChange}
                                        />
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

                                <Col lg={12} md={12} sm={12} xs={12}>
                                    {/* Product Category */}
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
        fontSize: '13px',
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
        border: '1px solid lightgray'
    },
    card_header: {
        alignItems: 'center',
        fontSize: `${theme.SIZES.HEADER}`,
        background: `${theme.COLORS.ADMIN_MAIN}`,
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