import React, { useState } from 'react';
import { Form, Col, Row, Card, InputGroup, Button, Tab, Nav, Accordion } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faExclamationTriangle, faSlidersH, faStoreAlt, faTruck, faTools, faListAlt,
} from '@fortawesome/free-solid-svg-icons'

import CreatableSelect from 'react-select/creatable'
import theme from '../../../../constants/theme'

import Select, { components } from 'react-select'
// import AddNewFieldNameModal from './add-new-field-name-model'
import AlertModal from '../../../alert-modal'

const groupStyles = {
    border: `1px solid ${theme.COLORS.ADMIN_MAIN}`,
    borderRadius: '5px',
    background: 'white',
    color: `${theme.COLORS.ADMIN_MAIN}`,
}
const Group = props => (
    <div style={groupStyles}>
        <components.Group {...props} />
    </div>
)

const ProductData = props => {
    const [imgError, setImgError] = useState('')
    const { values, onChange, errors, touched } = props;

    return (
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
                                onChange={onChange}
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
                                onChange={onChange}
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
                            onChange={onChange}
                            isInvalid={errors.stock}
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
                                onChange={onChange}
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
                            multiple onChange={props.fileSelectedHandler}
                            name="image" accept="image/*"
                        />
                        <Form.Label style={styles.label}>
                            <span>{imgError}</span>
                        </Form.Label>
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    {(props.imagePreviewArray || []).map((element, index) => (
                        <div className="show-image" key={index}>
                            <img style={{ height: '100px', width: '100px', margin: '1%' }} src={element.url} alt="..." />
                            <input className="deleteImage" type="button" onClick={() => props.deleteImage(index)} value="Delete" />
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
                                onChange={onChange}
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
                                onChange={onChange}
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
                                onChange={onChange}
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
                                onChange={onChange}
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
                                onChange={onChange}
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
                                onChange={onChange}
                                isInvalid={errors.purchaseNote}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.purchaseNote}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
            </Card.Body >
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
            <style jsx>
                {`
                    span {
                        color: red
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
                `}
            </style>
        </Card >
    )
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
        border: '1px solid lightgray'
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
}

export default ProductData