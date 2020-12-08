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

    return (
        <Accordion as={Row} style={{ margin: '2%' }} defaultActiveKey="0">
            <Card style={styles.card}>
                <Card.Header className='card_toggle'>
                    <Form.Label className='p-0 mb-0 ml-0 mr-auto'> Product Data</Form.Label>
                    <Form.Control
                        className='mr-auto'
                        style={{ width: '50%' }}
                        as="select"
                        name="product_type"
                        size="sm"
                        value={props.product_type_values}
                        onChange={(e) => { props.onChange(e), props.productTypeHandler(e) }}
                    >
                        <option value='simple-product'> Simple Product </option>
                        <option value='variable-prouct'> Variable Product </option>
                    </Form.Control>

                    <Accordion.Toggle eventKey="0" style={{ background: 'none' }}>
                        <FontAwesomeIcon size="xs" icon={faSlidersH} style={styles.slider_fontawesome} />
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body style={{ padding: '0.5%', margin: '0px' }}>
                        <Tab.Container id="left-tabs-example" defaultActiveKey="Inventory">
                            <Row style={{ margin: '0px', minHeight: '300px' }} noGutters>
                                <Col lg="auto" md="auto" sm="auto" xs="auto" style={{ background: `${theme.COLORS.ADMIN_MAIN}` }}>
                                    <Nav variant="pills" className="flex-column" style={{ margin: '0px' }}>
                                        <Nav.Item>
                                            <div className="nav_link">
                                                <Nav.Link eventKey="Inventory" style={styles.nav_link}>
                                                    <FontAwesomeIcon size="xs" icon={faStoreAlt} style={styles.product_fontawesome} />
                                                    <div className="linkName"> Inventory </div>
                                                </Nav.Link>
                                            </div>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <div className="nav_link">
                                                <Nav.Link eventKey="General" style={styles.nav_link}>
                                                    <FontAwesomeIcon size="xs" icon={faSlidersH} style={styles.product_fontawesome} />
                                                    <div className="linkName"> General </div>
                                                </Nav.Link>
                                            </div>
                                        </Nav.Item>
                                        {props.isVariableProduct ?
                                            <>
                                                <Nav.Item>
                                                    <div className="nav_link">
                                                        <Nav.Link eventKey="Attributes" style={styles.nav_link}>
                                                            <FontAwesomeIcon size="xs" icon={faListAlt} style={styles.product_fontawesome} />
                                                            <div className="linkName"> Attributes </div>
                                                        </Nav.Link>
                                                    </div>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <div className="nav_link">
                                                        <Nav.Link eventKey="Variations" style={styles.nav_link}>
                                                            <FontAwesomeIcon size="xs" icon={faListAlt} style={styles.product_fontawesome} />
                                                            <div className="linkName"> Variations </div>
                                                        </Nav.Link>
                                                    </div>
                                                </Nav.Item>
                                            </>
                                            :
                                            null
                                        }

                                        <Nav.Item>
                                            <div className="nav_link">
                                                <Nav.Link eventKey="Shipping" style={styles.nav_link}>
                                                    <FontAwesomeIcon size="xs" icon={faTruck} style={styles.product_fontawesome} />
                                                    <div className="linkName"> Shipping </div>
                                                </Nav.Link>
                                            </div>
                                        </Nav.Item>

                                        <Nav.Item>
                                            <div className="nav_link">
                                                <Nav.Link eventKey="Advanced" style={styles.nav_link}>
                                                    <FontAwesomeIcon size="xs" icon={faTools} style={styles.product_fontawesome} />
                                                    <div className="linkName"> Advanced </div>
                                                </Nav.Link>
                                            </div>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                                <Col style={{ padding: '2%', maxHeight: '80vh', overflow: 'auto' }}>
                                    <Tab.Content >
                                        <Tab.Pane eventKey="General">
                                            {props.isVariableProduct ?
                                                <Form.Group as={Col} lg={4} md={4} sm={12} xs={12}>
                                                    <Form.Label style={styles.label}>Brand Name</Form.Label>
                                                    <InputGroup>
                                                        <Form.Control
                                                            type="text"
                                                            size="sm"
                                                            placeholder="Enter Brand Name"
                                                            name="product_brand_name"
                                                            value={props.product_brand_name_values}
                                                            onChange={props.onChange}
                                                            isInvalid={props.product_brand_name_errors}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {props.product_brand_name_errors}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>
                                                :
                                                <>
                                                    <Form.Row>
                                                        <Form.Group as={Col} lg={4} md={4} sm={12} xs={12}>
                                                            <Form.Label style={styles.label}>Product Price <span> * </span></Form.Label>
                                                            <InputGroup>
                                                                <Form.Control
                                                                    type="number"
                                                                    size="sm"
                                                                    placeholder="Enter Product Price"
                                                                    name="product_price"
                                                                    value={props.product_price_values}
                                                                    onChange={props.onChange}
                                                                    isInvalid={props.product_price_touched && props.product_price_errors}
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {props.product_price_errors}
                                                                </Form.Control.Feedback>
                                                            </InputGroup>
                                                        </Form.Group>
                                                        <Form.Group as={Col} lg={4} md={4} sm={12} xs={12}>
                                                            <Form.Label style={styles.label}>Product in Stock<span> * </span></Form.Label>
                                                            <Form.Control type="number"
                                                                size="sm"
                                                                name="product_in_stock"
                                                                placeholder="Enter Product In Stock"
                                                                value={props.product_in_stock_values}
                                                                onChange={props.onChange}
                                                                isInvalid={props.product_in_stock_errors}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {props.product_in_stock_errors}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Form.Group as={Col} lg={4} md={4} sm={12} xs={12}>
                                                            <Form.Label style={styles.label}>Brand Name</Form.Label>
                                                            <InputGroup>
                                                                <Form.Control
                                                                    type="text"
                                                                    size="sm"
                                                                    placeholder="Enter Brand Name"
                                                                    name="product_brand_name"
                                                                    value={props.product_brand_name_values}
                                                                    onChange={props.onChange}
                                                                    isInvalid={props.product_brand_name_errors}
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {props.product_brand_name_errors}
                                                                </Form.Control.Feedback>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col} lg={12} md={12} sm={12} xs={12} style={{ marginBottom: '5px' }}>
                                                            <Form.Label style={styles.label}>Product Images <span> * </span></Form.Label>
                                                            <input type="file" style={{ margin: '0% 2%', fontSize: '13px' }}
                                                                multiple onChange={props.fileSelectedHandler}
                                                                name="image" accept="image/*"
                                                            />
                                                            <Form.Label style={styles.label}>
                                                                <span>{imgError}</span>
                                                            </Form.Label>
                                                            {/* </InputGroup> */}
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
                                                    <Form.Row>
                                                        <Form.Group as={Col} lg={4} md={4} sm={12} xs={12}>
                                                            <Form.Label style={styles.label}>Product Warranty (months) </Form.Label>
                                                            <InputGroup>
                                                                <Form.Control
                                                                    type="number"
                                                                    size="sm"
                                                                    placeholder="Enter Product Warranty"
                                                                    name="product_warranty"
                                                                    value={props.product_warranty_values}
                                                                    onChange={props.onChange}
                                                                    isInvalid={props.product_warranty_errors}
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {props.product_warranty_errors}
                                                                </Form.Control.Feedback>
                                                            </InputGroup>
                                                        </Form.Group>
                                                        <Form.Group as={Col} lg={4} md={4} sm={12} xs={12}>
                                                            <Form.Label style={styles.label}> Warranty Type </Form.Label>
                                                            <InputGroup>
                                                                <InputGroup.Prepend>
                                                                    <Form.Control
                                                                        as="select"
                                                                        name="warranty_type"
                                                                        size="sm"
                                                                        value={props.warranty_type_values}
                                                                        onChange={props.onChange}
                                                                        isInvalid={props.warranty_type_errors}
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
                                                                </InputGroup.Prepend>
                                                                <Form.Control.Feedback type="invalid">
                                                                    {props.product_warranty_errors}
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
                                                                    name="product_discount"
                                                                    value={props.product_discount_values}
                                                                    onChange={props.onChange}
                                                                    isInvalid={props.product_discount_errors}
                                                                />
                                                                <InputGroup.Prepend>
                                                                    <Button variant='primary' size="sm">%</Button>
                                                                </InputGroup.Prepend>
                                                                <Form.Control.Feedback type="invalid">
                                                                    {props.product_discount_errors}
                                                                </Form.Control.Feedback>
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Form.Row>
                                                </>
                                            }
                                        </Tab.Pane>

                                        <Tab.Pane eventKey="Inventory">
                                            <Form.Row>
                                                <Form.Group as={Col} lg={12} md={12} sm={12} xs={12} >
                                                    <Form.Label style={styles.label}>Product SKU</Form.Label>
                                                    <InputGroup>
                                                        <Form.Control
                                                            type="text"
                                                            size="sm"
                                                            placeholder="Enter SKU (Stock Keeping Unit)"
                                                            name="sku"
                                                            value={props.sku_values}
                                                            onChange={props.onChange}
                                                            isInvalid={props.sku_errors}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {props.sku_errors}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>
                                            </Form.Row>
                                        </Tab.Pane>

                                        <Tab.Pane eventKey="Shipping">
                                            <Form.Group as={Row} noGutters>
                                                <Form.Label style={styles.label}>Weight (kg)</Form.Label>
                                                <Form.Control type="number"
                                                    name="product_weight"
                                                    size="sm"
                                                    value={props.product_weight_values}
                                                    onChange={props.onChange}
                                                    isInvalid={props.product_weight_errors}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {props.product_weight_errors}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Row} noGutters>
                                                <Form.Label style={styles.label}>Dimensions (cm)</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Prepend>
                                                        <Form.Control
                                                            type="number"
                                                            name="dimension_length"
                                                            size="sm"
                                                            value={props.dimension_length_values}
                                                            onChange={props.onChange}
                                                            placeholder="Length"
                                                            isInvalid={props.dimension_length_errors}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {props.dimension_length_errors}
                                                        </Form.Control.Feedback>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        type="number"
                                                        name="dimension_width"
                                                        size="sm"
                                                        value={props.dimension_width_values}
                                                        placeholder="Width"
                                                        onChange={props.onChange}
                                                        isInvalid={props.dimension_width_errors}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {props.dimension_width_errors}
                                                    </Form.Control.Feedback>
                                                    <InputGroup.Prepend>
                                                        <Form.Control
                                                            type="number"
                                                            name="dimension_height"
                                                            size="sm"
                                                            value={props.dimension_height_values}
                                                            placeholder="Height"
                                                            onChange={props.onChange}
                                                            isInvalid={props.dimension_height_errors}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {props.dimension_height_errors}
                                                        </Form.Control.Feedback>
                                                    </InputGroup.Prepend>
                                                </InputGroup>
                                            </Form.Group>
                                            <Form.Row>
                                                {/* <Form.Group as={Col} lg={6} md={6} sm={12} xs={12}>
                                                    <Form.Label style={styles.label}>Product Shipping Charges</Form.Label>
                                                    <InputGroup>
                                                        <Form.Control
                                                            type="text"
                                                            size="sm"
                                                            placeholder="Enter Product Shipping Charges"
                                                            name="shipping_charges"
                                                            value={props.shipping_charges_values}
                                                            onChange={props.onChange}
                                                            isInvalid={props.shipping_charges_errors}
                                                        />
                                                        <InputGroup.Prepend>
                                                            <Button variant='primary' size="sm">Riyal</Button>
                                                        </InputGroup.Prepend>
                                                        <Form.Control.Feedback type="invalid">
                                                            {props.shipping_charges_errors}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group> */}
                                                {/* <Form.Group as={Col} lg={6} md={6} sm={12} xs={12}>
                                                    <Form.Label style={styles.label}>Product Handling Fee</Form.Label>
                                                    <InputGroup>
                                                        <Form.Control
                                                            type="text"
                                                            size="sm"
                                                            placeholder="Enter Product Handling Fee"
                                                            name="handling_fee"
                                                            value={props.handling_fee_values}
                                                            onChange={props.onChange}
                                                            isInvalid={props.handling_fee_errors}
                                                        />
                                                        <InputGroup.Prepend>
                                                            <Button variant='primary' size="sm">Riyal</Button>
                                                        </InputGroup.Prepend>
                                                        <Form.Control.Feedback type="invalid">
                                                            {props.handling_fee_errors}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>*/}
                                            </Form.Row>
                                        </Tab.Pane>

                                        <Tab.Pane eventKey="Attributes">
                                            <ProductAttributes
                                                {...props}
                                                setVariationsArray={props.setVariationsArray}
                                                variationsArray={props.variationsArray}
                                                fields_list={props.fields_list}
                                            />
                                        </Tab.Pane>

                                        <Tab.Pane eventKey="Variations">
                                            <Variations
                                                variationsArray={props.variationsArray}
                                                setVariationsArray={props.setVariationsArray}
                                                setVariationsSaved={props.setVariationsSaved}
                                                isVariationsArrayEmpty={props.variationsArray == ''}
                                            />
                                        </Tab.Pane>

                                        <Tab.Pane eventKey="Advanced">
                                            <Form.Row>
                                                <Form.Group as={Col} lg={6} md={6} sm={12} xs={12}>
                                                    <Form.Label style={styles.label}>Purchase Note</Form.Label>
                                                    <InputGroup>
                                                        <Form.Control
                                                            type="text"
                                                            size="sm"
                                                            placeholder="Enter Purchase Notes"
                                                            name="purchase_note"
                                                            value={props.purchase_note_values}
                                                            onChange={props.onChange}
                                                            isInvalid={props.purchase_note_errors}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {props.purchase_note_errors}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>
                                            </Form.Row>
                                        </Tab.Pane>
                                        {/* <Tab.Pane eventKey="Commission">
                                    Commission
                                    </Tab.Pane> */}
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <style type="text/css">{`
                .card_toggle{
                    background: #595c73;
                    font-size: 13px;
                    color: white;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                }
                .card_toggle:hover{
                    background: #4e5065;
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
        </Accordion >
    )
}


function ProductAttributes(props) {
    const [attributeName, setAttributeName] = useState('')
    const [attributeValue, setAttributeValue] = useState('')

    const [error, setError] = useState('')
    const [modalShow, setModalShow] = useState(false)
    const [message, setMessage] = useState('')
    const [attributesArray, setAttributesArray] = useState([])

    const [userStatusAlert, setUserStatusAlert] = useState(false);
    const [statusAlertMessage, setStatusAlertMessage] = useState('');

    function handleAddProductAttributeClick() {
        setMessage('')
        if (attributeName != '' && attributeValue != '') {
            setError('')
            const copyArray = Object.assign([], attributesArray)
            copyArray.push({
                attributeName: attributeName.value,
                attributeValue: attributeValue,
            })
            setAttributeName('')
            setAttributeValue('')
            setAttributesArray(copyArray)
        } else {
            setError('Enter Field Name and Value')
        }
    }

    function handleDeleteProductAttributeClick(index) {
        const copyArray = Object.assign([], attributesArray)
        copyArray.splice(index, 1)
        setAttributesArray(copyArray)
    }

    function handleCreateVariationsClick() {
        if (attributesArray != '') {
            var allArrays = []
            attributesArray.forEach(element => {
                var item = []
                element.attributeValue.map(e => {
                    item.push(e.value)
                })
                allArrays.push(item)
            })

            const array = allPossibleCases(allArrays)

            var data = []
            array.forEach((element, index) => {
                const split = element.split('-')
                let item = []
                split.forEach((e, i) => {
                    item.push({ name: attributesArray[i].attributeName, value: e })
                })
                data.push({
                    item: item, price: '', stock: '', image_link: [], imagePreviewArray: '',
                    price_error: '', stock_error: '', image_link_error: '', custom_fields: [],
                    discount: 0, warranty: 0, warranty_type: 'No Warranty',
                })
            })
            setMessage('Variations Created Successfully')
            props.setVariationsArray(data)
        } else {
            setError('Add some attributes first')
        }
    }

    function allPossibleCases(arr) {
        if (arr.length == 1) {
            return arr[0]
        } else {
            var result = []
            var allCasesOfRest = allPossibleCases(arr.slice(1))  // recur with the rest of array
            for (var i = 0; i < allCasesOfRest.length; i++) {
                for (var j = 0; j < arr[0].length; j++) {
                    result.push(arr[0][j] + "-" + allCasesOfRest[i])
                }
            }
            return result
        }
    }

    function handleAddCustomFieldBtnClick() {
        if (fieldName != '' && fieldValue != '') {
            const copyArray = Object.assign([], props.customFieldsArray)
            copyArray.push({
                name: fieldName.value,
                value: fieldValue,
            })
            props.setFieldsArrayHandler(copyArray)
            setError('');
            setFieldName('');
            setFieldValue('');
        } else {
            setError('Enter Field Name and Value');
        }
    }

    function handleShowModal() {
        if (props.user_status == 'disapproved') {
            setUserStatusAlert(true)
            setStatusAlertMessage('You can\'t upload product, Your account is not approved yet')
        } else if (props.user_status == 'restricted') {
            setUserStatusAlert(true)
            setStatusAlertMessage('You can\'t upload product, Your account has blocked, Contact to Admin')
        } else {
            setModalShow(true)
        }
    }

    return (
        <>
            <AlertModal
                onHide={(e) => setUserStatusAlert(false)}
                show={userStatusAlert}
                header={'Error'}
                message={statusAlertMessage}
                iconname={faExclamationTriangle}
                color={"#ff3333"}
            />
            <Form.Row >
                <Form.Group as={Col} lg={5} md={5} sm={12} xs={12} style={{ marginBottom: '0%', paddingBottom: '0%' }}>
                    <Form.Label style={styles.label}>Field Name</Form.Label>
                    <Select
                        id={'1'}
                        instanceId={'1'}
                        inputId={'1'}
                        styles={theme.REACT_SELECT_STYLES}
                        options={props.fields_list}
                        components={{ Group }}
                        value={attributeName}
                        onChange={(e) => setAttributeName(e)}
                    />
                    {/* <Nav.Link style={{ padding: '0%', margin: '0%', fontSize: '14px' }} onClick={handleShowModal}>
                        Add New
                    </Nav.Link> */}
                    {/* <AddNewFieldNameModal
                        {...props}
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                    /> */}
                </Form.Group>
                <Form.Group as={Col} lg={7} md={7} sm={12} xs={12} style={{ marginBottom: '0%', paddingBottom: '0%' }}>
                    <Form.Label style={styles.label}>Field Value </Form.Label>
                    <CreatableSelect
                        id={'1'}
                        instanceId={'1'}
                        inputId={'1'}
                        isMulti
                        value={attributeValue || ''}
                        components={{ DropdownIndicator: null }}
                        styles={theme.REACT_SELECT_STYLES}
                        onChange={(value) => setAttributeValue(value)}
                        placeholder="Press enter to add more"
                    />
                </Form.Group>
            </Form.Row>
            <Row noGutters className='w-100'>
                <Form.Label style={styles.label}>
                    <span style={{ color: '#DC3545' }}>{error}</span>
                </Form.Label>
            </Row>
            <Row noGutters className='pt-2'>
                <Button variant="outline-primary" size='sm' onClick={handleAddProductAttributeClick} style={{ marginRight: '2%' }}>Add</Button>
                <Button variant="outline-success" size="sm" onClick={handleCreateVariationsClick}>Create Variations</Button>
            </Row>
            <hr />
            <Form.Label style={styles.label}>
                {message}
            </Form.Label>
            {attributesArray && attributesArray.map((element, index) =>
                <Form.Row style={{ padding: '0%' }} key={index}>
                    <Form.Group as={Col} lg={5} md={5} sm={12} xs={12}>
                        <Form.Control
                            as="select"
                            size="sm"
                            value={element.attributeName}
                            onChange={() => element.attributeName}
                            disabled
                        >
                            <option>{element.attributeName}</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} lg={7} md={7} sm={12} xs={12}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                size="sm"
                                name="sku"
                                value={element.attributeValue.map((e) => (e.value))}
                                disabled
                            />
                            <Button variant="outline-danger" size="sm" style={{ marginLeft: '1%' }}
                                onClick={() => handleDeleteProductAttributeClick(index)}> delete</Button>
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
            )}
        </>
    )
}

const createOption = (label) => ({
    value: label,
    label,
})


function Variations(props) {
    const [samePrice, setSamePrice] = useState('')
    const [samePriceError, setSamePriceError] = useState('')

    const [sameStock, setSameStock] = useState('')
    const [sameStockError, setSameStockError] = useState('')

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const [sameDiscount, setSameDiscount] = useState('')
    const [sameWarranty, setSameWarranty] = useState('')
    const [sameWarrantyType, setsSameWarrantyType] = useState('')

    // Same Price For All Variations
    function handleSamePriceApplyBtnClick() {
        if (samePrice != '') {
            setSamePriceError('')
            const copyArray = Object.assign([], props.variationsArray)
            copyArray.forEach(element => {
                element.price = samePrice
            })
            props.setVariationsArray(copyArray)
        } else {
            setSamePriceError('Enter Value')
        }
    }
    // Same Stock For All Variations
    function handleSameStockApplyBtnClick() {
        if (sameStock != '') {
            setSameStockError('')
            const copyArray = Object.assign([], props.variationsArray)
            copyArray.forEach(element => {
                element.stock = sameStock
            })
            props.setVariationsArray(copyArray)
        } else {
            setSameStockError('Enter Value')
        }
    }




    function handleSameDiscountApplyBtnClick() {
        if (sameDiscount != '') {
            const copyArray = Object.assign([], props.variationsArray)
            copyArray.forEach(element => {
                element.discount = sameDiscount
            })
            props.setVariationsArray(copyArray)
        }
    }
    function handleSameWarrantyApplyBtnClick() {
        if (sameWarranty != '') {
            const copyArray = Object.assign([], props.variationsArray)
            copyArray.forEach(element => {
                element.warranty = sameWarranty
            })
            props.setVariationsArray(copyArray)
        }
    }
    function handleSameWarrantyTypeApplyBtnClick(e) {
        setsSameWarrantyType(e.target.value)
        const copyArray = Object.assign([], props.variationsArray)
        copyArray.forEach(element => {
            element.warranty_type = e.target.value
        })
        props.setVariationsArray(copyArray)
    }

    function handlenPriceChange(e, index) {
        const copyArray = Object.assign([], props.variationsArray)
        let object = copyArray[index]
        if (e.target.value >= 0) {
            object.price = e.target.value
            object.price_error = ''
            copyArray[index] = object
            props.setVariationsArray(copyArray)
        }
    }
    function handleInStockChang(e, index) {
        const copyArray = Object.assign([], props.variationsArray)
        let object = copyArray[index]
        if (e.target.value >= 0) {
            object.stock = e.target.value
            object.stock_error = ''
            copyArray[index] = object
            props.setVariationsArray(copyArray)
        }
    }


    function handleDiscountChang(e, index) {
        const copyArray = Object.assign([], props.variationsArray)
        let object = copyArray[index]
        if (e.target.value >= 0) {
            object.discount = e.target.value
            copyArray[index] = object
            props.setVariationsArray(copyArray)
        }
    }
    function handleWarrantyChang(e, index) {
        const copyArray = Object.assign([], props.variationsArray)
        let object = copyArray[index]
        if (e.target.value >= 0) {
            object.warranty = e.target.value
            copyArray[index] = object
            props.setVariationsArray(copyArray)
        }
    }
    function handleWarrantyTypeChang(e, index) {
        const copyArray = Object.assign([], props.variationsArray)
        let object = copyArray[index]
        object.warranty_type = e.target.value
        copyArray[index] = object
        props.setVariationsArray(copyArray)
    }



    function handleDeleteVariationClick(index) {
        const copyArray = Object.assign([], props.variationsArray)
        copyArray.splice(index, 1)
        props.setVariationsArray(copyArray)
    }
    function handleDeleteSingleAttribute(index, i) {
        const copyArray = Object.assign([], props.variationsArray)
        if (copyArray[index].item.length == 1) {
            copyArray.splice(index, 1)
        } else {
            let obj = copyArray[index].item
            obj.splice(i, 1)
            copyArray[index].item = obj
        }
        props.setVariationsArray(copyArray)
    }

    function handleDeleteCustomFieldClick(index, i) {
        const copyArray = Object.assign([], props.variationsArray)
        copyArray[index].custom_fields.splice(i, 1)
        props.setVariationsArray(copyArray)
    }
    function handleCustomFieldValueChage(value, index, i) {
        const copyArray = Object.assign([], props.variationsArray)
        copyArray[index].custom_fields[i].value = value
        props.setVariationsArray(copyArray)
    }

    function handleSaveVariationsClick() {
        const copyArray = Object.assign([], props.variationsArray)
        let flag = true
        copyArray.forEach(element => {
            if (element.price == '' || element.stock == '' || element.image_link.length == 0) {
                flag = false
                if (element.price == '') {
                    element.price_error = 'Enter price'
                }
                if (element.stock == '') {
                    element.stock_error = 'Enter stock'
                }
                if (element.image_link.length == 0) {
                    element.image_link_error = 'Enter image Link'
                }
            } else {
                element.price_error = ''
                element.stock_error = ''
                element.image_link_error = ''
            }
        })
        if (flag == true) {
            props.setVariationsSaved(true)
            setMessage('Variations saved Successfully')
            setError('')
        } else {
            setMessage('Please fill all required fields')
            setError('red')
        }
        props.setVariationsArray(copyArray)
    }

    function handleVariationsErrorCheck(element) {
        if (element.price_error != '' || element.image_link_error != '') {
            return '1px solid red'
        }
        else {
            return 'none'
        }
    }

    function handleItemValueChange(event, index, i) {
        const copyArray = Object.assign([], props.variationsArray)
        let obj = copyArray[index].item
        obj[i].value = event.target.value
        props.setVariationsArray(copyArray)
    }

    async function fileSelectedHandler(e, index) {
        const copyArray = Object.assign([], props.variationsArray)
        let object = copyArray[index]

        if (e.target.files != '') {
            object.image_link = [...object.image_link, ...e.target.files]
            let array = []
            object.image_link.forEach(element => {
                try {
                    array.push({ 'url': URL.createObjectURL(element) })
                } catch (err) {
                }
            })
            object.imagePreviewArray = array
            object.image_link_error = ''
            copyArray[index] = object
            props.setVariationsArray(copyArray)
        }
    }
    function deleteImage(index, i) {
        const copyArray = Object.assign([], props.variationsArray)
        let obj = copyArray[index]

        obj.image_link.splice(i, 1)
        obj.imagePreviewArray.splice(i, 1)
        copyArray[index] = obj
        props.setVariationsArray(copyArray)
    }

    return (
        <>
            {props.isVariationsArrayEmpty ?
                <div style={{ width: '100%', textAlign: 'center', marginTop: '10%' }}>
                    <Form.Label>Please First add Attributes from Attributes Tab</Form.Label>
                </div>
                :
                <>
                    <Form.Row>
                        {/* Same Price */}
                        <Form.Group as={Col} lg={4} md={4} sm={6} xs={6}>
                            <Form.Label style={styles.label}> Same Price</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    size="sm"
                                    placeholder="Enter Price"
                                    name="samePrice"
                                    value={samePrice}
                                    onChange={(e) => {
                                        if (e.target.value >= 0) {
                                            setSamePrice(e.target.value)
                                            setSamePriceError('')
                                        }
                                    }}
                                    isInvalid={samePriceError}
                                />
                                <InputGroup.Prepend>
                                    <Button variant='outline-dark' style={styles.label} onClick={handleSamePriceApplyBtnClick} size="sm">Apply</Button>
                                </InputGroup.Prepend>
                                <Form.Control.Feedback type="invalid">
                                    {props.samePriceError}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        {/* Same Stock */}
                        <Form.Group as={Col} lg={4} md={4} sm={6} xs={6}>
                            <Form.Label style={styles.label}> Same Stock</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    size="sm"
                                    placeholder="Enter Stock"
                                    name="sameStock"
                                    value={sameStock}
                                    onChange={(e) => {
                                        if (e.target.value >= 0) {
                                            setSameStock(e.target.value)
                                            setSameStockError('')
                                        }
                                    }}
                                    isInvalid={sameStockError}
                                />
                                <InputGroup.Prepend>
                                    <Button variant='outline-dark' style={styles.label} onClick={handleSameStockApplyBtnClick} size="sm">Apply</Button>
                                </InputGroup.Prepend>
                                <Form.Control.Feedback type="invalid">
                                    {props.sameStockError}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} lg={4} md={4} sm={6} xs={6}>
                            <Form.Label style={styles.label}> Same Discount</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    size="sm"
                                    placeholder="Enter Discount"
                                    name="samePrice"
                                    value={sameDiscount}
                                    onChange={(e) => {
                                        if (e.target.value >= 0) {
                                            setSameDiscount(e.target.value)
                                        }
                                    }}
                                />
                                <InputGroup.Prepend>
                                    <Button variant='outline-dark' style={styles.label} onClick={handleSameDiscountApplyBtnClick} size="sm">Apply</Button>
                                </InputGroup.Prepend>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} lg={4} md={4} sm={6} xs={6}>
                            <Form.Label style={styles.label}> Same Warranty</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    size="sm"
                                    placeholder="Enter Warranty"
                                    name="samePrice"
                                    value={sameWarranty}
                                    onChange={(e) => {
                                        if (e.target.value >= 0) {
                                            setSameWarranty(e.target.value)
                                        }
                                    }}
                                />
                                <InputGroup.Prepend>
                                    <Button variant='outline-dark' style={styles.label} onClick={handleSameWarrantyApplyBtnClick} size="sm">Apply</Button>
                                </InputGroup.Prepend>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} lg={3} md={4} sm={6} xs={6}>
                            <Form.Label style={styles.label}> Warranty Type </Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <Form.Control
                                        as="select"
                                        name="warranty_type"
                                        size="sm"
                                        value={sameWarrantyType}
                                        onChange={handleSameWarrantyTypeApplyBtnClick}
                                    >
                                        <option> No Warranty </option>
                                        <option> Brand Warranty </option>
                                        <option> Local Warranty </option>
                                        <option> Local Seller Warranty </option>
                                        <option> Non-Local Warranty </option>
                                        <option> Internationsl Warranty </option>
                                        <option> Internationsl Seller Warranty </option>
                                        <option> International Manufacturer Warranty </option>
                                    </Form.Control>
                                </InputGroup.Prepend>
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    <hr style={{ marginTop: '0%' }} />
                    {props.variationsArray && props.variationsArray.map((element, index) =>
                        <div key={index}>
                            <Accordion>
                                <Row noGutters className='d-inline-flex align-items-center w-100 p-2 mb-3' style={{ background: 'lightgray', borderRadius: '3px' }}>
                                    <Form.Label className='mr-auto p-0 m-0'>
                                        {index > 100 ? '' : index > 9 ? '0' : '00'}{index + 1}
                                    </Form.Label>
                                    <Accordion.Toggle as={Form.Group} eventKey="0" className='p-0 m-0'>
                                        <Button variant="outline-primary" size="sm" style={{ marginRight: '10px' }}>
                                            <FontAwesomeIcon size="xs" icon={faSlidersH} style={styles.slider_fontawesome} />
                                        </Button>
                                    </Accordion.Toggle>
                                    <Button variant="outline-danger" size="sm" style={{ marginLeft: '1%' }}
                                        onClick={() => handleDeleteVariationClick(index)}> delete</Button>
                                </Row>
                                <Row noGutters style={{ border: handleVariationsErrorCheck(element) }}>
                                    {element.item && element.item.map((e, i) =>
                                        <Form.Group as={Col} lg={3} md={3} sm={4} xs={6} key={i} className='pr-1 variation_value_col'>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    size="sm"
                                                    placeholder="Enter Value"
                                                    name="sku"
                                                    value={e.value}
                                                    onChange={(event) => handleItemValueChange(event, index, i)}
                                                />
                                                {/* <InputGroup.Append>
                                                    <Button size='sm' variant='outline-danger' onClick={() => handleDeleteSingleAttribute(index, i)}>
                                                        Delete
                                                    </Button>
                                                </InputGroup.Append> */}
                                            </InputGroup>
                                        </Form.Group>
                                    )}
                                </Row>
                                <Accordion.Collapse eventKey="0">
                                    <>
                                        <Form.Row>
                                            <Form.Group as={Col} lg={4} md={4} sm={6} xs={6}>
                                                <Form.Label style={styles.label}>Price <span> * </span></Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    size="sm"
                                                    placeholder="Enter Product Price"
                                                    name="product_price"
                                                    value={element.price}
                                                    onChange={(e) => handlenPriceChange(e, index)}
                                                    isInvalid={element.price_error}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {element.price_error}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} lg={4} md={4} sm={6} xs={6}>
                                                <Form.Label style={styles.label}>Stock <span> * </span></Form.Label>
                                                <Form.Control type="number"
                                                    size="sm"
                                                    name="product_in_stock"
                                                    placeholder="Enter Product In Stock"
                                                    value={element.stock}
                                                    onChange={(e) => handleInStockChang(e, index)}
                                                    isInvalid={element.stock_error}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {element.stock_error}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group as={Col} lg={4} md={4} sm={6} xs={6}>
                                                <Form.Label style={styles.label}>Discount <span> * </span></Form.Label>
                                                <Form.Control type="number"
                                                    size="sm"
                                                    name="product_in_stock"
                                                    placeholder="Enter Discount"
                                                    value={element.discount}
                                                    onChange={(e) => handleDiscountChang(e, index)}
                                                    isInvalid={element.stock_error}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {element.stock_error}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} lg={4} md={4} sm={6} xs={6}>
                                                <Form.Label style={styles.label}>Warranty (months) <span> * </span></Form.Label>
                                                <Form.Control type="number"
                                                    size="sm"
                                                    name="product_in_stock"
                                                    placeholder="Enter Warranty"
                                                    value={element.warranty}
                                                    onChange={(e) => handleWarrantyChang(e, index)}
                                                    isInvalid={element.stock_error}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {element.stock_error}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} lg={4} md={4} sm={12} xs={12}>
                                                <Form.Label style={styles.label}> Warranty Type </Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Prepend>
                                                        <Form.Control
                                                            as="select"
                                                            name="warranty_type"
                                                            size="sm"
                                                            value={element.warranty_type}
                                                            onChange={(e) => handleWarrantyTypeChang(e, index)}
                                                        >
                                                            <option> No Warranty </option>
                                                            <option> Brand Warranty </option>
                                                            <option> Local Warranty </option>
                                                            <option> Local Seller Warranty </option>
                                                            <option> Non-Local Warranty </option>
                                                            <option> Internationsl Warranty </option>
                                                            <option> Internationsl Seller Warranty </option>
                                                            <option> International Manufacturer Warranty </option>

                                                        </Form.Control>
                                                    </InputGroup.Prepend>
                                                    <Form.Control.Feedback type="invalid">
                                                        {props.product_warranty_errors}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>

                                            <Form.Group as={Col} lg={4} md={4} sm={12} xs={12}>
                                                <Form.Label style={styles.label}>Product Images <span> * </span></Form.Label>
                                                <input type="file" style={{ margin: '0% 2%', fontSize: '13px' }}
                                                    multiple onChange={(e) => fileSelectedHandler(e, index)}
                                                    name="image" accept="image/*"
                                                />
                                                <Form.Label style={styles.label}>
                                                    <span>{element.image_link_error}</span>
                                                </Form.Label>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            {(element.imagePreviewArray || []).map((element, i) => (
                                                <div className="show-image" key={i}>
                                                    <img style={{ height: '100px', width: '100px', margin: '1%' }} src={element.url} alt="..." />
                                                    <input className="deleteImage" type="button" onClick={() => deleteImage(index, i)} value="Delete" />
                                                </div>
                                            ))}
                                        </Form.Row>
                                        <Form.Row>
                                            {element.custom_fields && element.custom_fields.map((e, i) =>
                                                <Form.Group as={Col} lg={3} md={3} sm={6} xs={6} key={i} >
                                                    <Form.Label style={styles.label}>{e.name}</Form.Label>
                                                    <InputGroup>
                                                        <Form.Control
                                                            type="text"
                                                            size="sm"
                                                            placeholder="Enter Value"
                                                            name="sku"
                                                            value={e.value}
                                                            onChange={(e) => handleCustomFieldValueChage(e.target.value, index, i)}
                                                        />
                                                        <InputGroup.Prepend>
                                                            <Button variant="outline-danger" size="sm" style={{ marginLeft: '1%' }}
                                                                onClick={() => handleDeleteCustomFieldClick(index, i)}> delete</Button>
                                                        </InputGroup.Prepend>
                                                    </InputGroup>
                                                </Form.Group>
                                            )}
                                        </Form.Row>
                                    </>
                                </Accordion.Collapse>
                            </Accordion>
                            <hr style={{ marginTop: '0%' }} />
                        </div>
                    )}
                    <Form.Label style={{ fontSize: `${theme.SIZES.LABEL}`, width: '100%', color: `${error}` }}>{message}</Form.Label>
                    <Button variant="outline-success" size="sm" block onClick={handleSaveVariationsClick}> Save Variations</Button>
                </>
            }
            <style type="text/css">{`
                @media (max-width: 1299px){
                    .variation_value_col{
                        min-width: 33.33333333333333%;
                        max-width: 33.33333333333333%;
                    }
                }
                @media (max-width: 1100px){
                    .variation_value_col{
                        min-width: 50%;
                        max-width: 50%;
                    }
                }
            `}</style>
            <style jsx>
                {`
                    span{
                        color: red
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
        </>
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
        fontSize: `${theme.SIZES.Header}`,
        background: `${theme.COLORS.HEADER_BACKGROUND}`,
    },
    label: {
        fontSize: `${theme.SIZES.LABEL}`,
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