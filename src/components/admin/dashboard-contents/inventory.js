import React, { useState, useEffect } from 'react';
import { Row, Table, Button, Nav, Col, Image, Card, Form, InputGroup, Accordion, } from 'react-bootstrap'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes, faChevronLeft, faChevronRight, faSlidersH, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons'
import CardAccordion from '../../card-accordion';
import urls from '../../../utils/urls/index'
import consts from '../../../constants'
import TitleRow from '../../title-row';
// import AddNew from '../../../vendor/dashboard/dashboard-contents/product-contents/add-new'

import getInvertryPageLimit from '../../../hooks/admin/getInvertryPageLimit';
import getInvertrySearch from '../../../hooks/admin/getInvertrySearch';

import useDimensions from "react-use-dimensions";
import ConfirmModal from '../../confirm-modal'
import AlertModal from '../../alert-modal';
import PaginationRow from '../../pagination-row'
import Loading from '../../loading';
import CardSearchAccordion from '../../card-search-accordion'

export default function Inventory(props) {
    const [page, setPage] = useState(1)
    const [queryPage, setQueryPage] = useState(1)

    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const [viewProduct, setViewProduct] = useState(false)
    const [data, setData] = useState({})

    const [isSearch, setIsSearch] = useState(false)
    const [refresh_count, setRefresh_count] = useState(0)

    const [fieldName, setFieldName] = useState('')
    const [limitPageNumber, setlimitPageNumber] = useState(1)
    const [queryPageNumber, setQueryPageNumber] = useState(1)
    const [query, setQuery] = useState('')

    const [start_date, setStart_date] = useState(new Date("2020/01/01"))
    const [end_date, setEnd_date] = useState(new Date())

    const { INVENTRY_PAGE_LIMIT_LOADING, INVENTRY_PAGE_LIMIT_PRODUCTS, INVENTRY_PAGE_LIMIT_PAGES, INVENTRY_PAGE_LIMIT_TOTALS } =
        getInvertryPageLimit(refresh_count, limitPageNumber, '20')

    const { INVENTRY_SEARCH_LOADING, INVENTRY_SEARCH_PRODUCTS, INVENTRY_SEARCH_PAGES, INVENTRY_SEARCH_TOTAL } =
        getInvertrySearch(refresh_count, fieldName, query, queryPageNumber, '20', start_date, end_date)

    async function handleSearch(searchType, searchValue, start, end) {
        if (searchValue != '') {
            setFieldName(searchType)
            setQuery(searchValue)
            setStart_date(start)
            setEnd_date(end)
            setIsSearch(true)
        } else {
            setIsSearch(false)
        }
    }

    function handleSetPage(ppage) {
        if (ppage > page) {
            setPage(ppage)
            setlimitPageNumber(ppage)
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

    function handleEditProduct(element) {
        if (element.product_type != 'simple-product') {
            let array = [];
            let variations = element.product_variations
            variations.forEach((element, i) => {
                array.push({
                    item: element.item, price: element.price, stock: element.stock, image_link: element.image_link,
                    price_error: '', stock_error: '', image_link_error: '', custom_fields: element.custom_fields
                })
            })
            element.product_variations = array
        } else {
            element.product_variations = []
        }
        setData(element)
        setViewProduct('edit')
    }

    function handleShowConfirmModal(element) {
        setData(element)
        setShowConfirmDeleteModal(true)
    }

    async function handleDeleteProduct(element) {
        setShowConfirmDeleteModal(false)
        await axios.put(urls.PUT_REQUEST.DELETE_PRODUCT + data._id, {}, {
            headers: {
                'authorization': props.token
            }
        }).then(function (response) {
            setShowModal(true)
            setRefresh_count(refresh_count + 1)
        }).catch(function (error) {
            console.log(error)
            alert('Error: ');
        });
    }

    function renderSwitch(param) {
        switch (param) {
            case 'view':
                return <ViewProduct
                    data={data}
                    back={() => { setViewProduct(false), setData({}) }}
                    isVariableProduct={data.product_type != "simple-product"}
                    handleShowConfirmModal={() => handleShowConfirmModal(-1)}
                    edit={() => handleEditProduct(-1)}
                />
                break;
            case 'edit':
                // return <AddNew
                //     title={'Vendor Dashboard / All Products / Update'}
                //     isUpdateProduct={true}
                //     _id={data._id}
                //     isVariableProduct={data.product_type != 'simple-product'}

                //     back={() => { setViewProduct(false), setData({}) }}
                //     view={() => setViewProduct('view')}
                //     handleShowConfirmModal={() => handleShowConfirmModal(-1)}

                //     productCategory={data.category}
                //     // productSubCategories={data.sub_category}

                //     productTags={data.product_tags}
                //     warrantyType={data.warranty_type}
                //     simple_product_image_link={data.product_image_link}
                //     variationsArray={data.product_variations}
                //     dangerousGoodsArray={data.dangerous_goods}

                //     product_name={data.product_name}
                //     product_description={data.product_description}
                //     product_type={'variable-product'}
                //     product_type={data.product_type}
                //     sku={data.sku}
                //     product_price={data.product_price}
                //     product_in_stock={data.product_in_stock}
                //     product_brand_name={data.product_brand_name}

                //     product_warranty={data.product_warranty}
                //     warranty_type={data.warranty_type}
                //     product_discount={data.product_discount}
                //     purchase_note={data.purchase_note}
                //     product_weight={data.product_weight}
                //     dimension_length={data.dimension_length}
                //     dimension_width={data.dimension_width}
                //     dimension_height={data.dimension_height}
                //     shipping_charges={data.shipping_charges}
                //     handling_fee={data.handling_fee}
                // />
                break;
            default:
                return <>
                    <TitleRow icon={faPlus} title={' Vendor Dashboard / All Products'} />
                    <CardSearchAccordion
                        title={'Inventory'}
                        option={'inventory'}
                        value={query}
                        handleSearch={handleSearch}
                        setIsSearch={() => setIsSearch(false)}
                    >
                        {!isSearch ?
                            INVENTRY_PAGE_LIMIT_LOADING ?
                                <Loading />
                                :
                                INVENTRY_PAGE_LIMIT_TOTALS > 0 ?
                                    <>
                                        <ProductTable
                                            list={INVENTRY_PAGE_LIMIT_PRODUCTS}
                                            pageNumber={page}
                                            setViewProduct={(element) => { setData(element), setViewProduct('view') }}
                                            handleEditProduct={(element) => handleEditProduct(element)}
                                            handleShowConfirmModal={(element) => handleShowConfirmModal(element)}
                                        />
                                        <hr />
                                        <PaginationRow
                                            totalPages={INVENTRY_PAGE_LIMIT_PAGES}
                                            activePageNumber={page}
                                            setActivePageNumber={(ppage) => handleSetPage(ppage)}
                                        />
                                    </>
                                    :
                                    <Row className='_div'>No Data Found</Row>
                            :
                            INVENTRY_SEARCH_LOADING ?
                                <Loading />
                                :
                                INVENTRY_SEARCH_TOTAL > 0 ?
                                    <>
                                        <ProductTable
                                            list={INVENTRY_SEARCH_PRODUCTS}
                                            pageNumber={queryPage}
                                            setViewProduct={(element) => { setData(element), setViewProduct('view') }}
                                            handleEditProduct={(index) => handleEditProduct(element)}
                                            handleShowConfirmModal={(element) => handleShowConfirmModal(element)}
                                        />
                                        <hr />
                                        <PaginationRow
                                            totalPages={INVENTRY_SEARCH_PAGES}
                                            activePageNumber={queryPage}
                                            setActivePageNumber={(ppage) => handleSetQueryPage(ppage)}
                                        />
                                    </>
                                    :
                                    <Row className='_div'>No Data Found</Row>
                        }
                    </CardSearchAccordion >
                </>
        }
    }

    return (
        <div className='adin_inventory'>
            <AlertModal
                onHide={() => setShowModal(false)}
                show={showModal}
                alertType={'success'}
                message={'Product Deleted Successfully'}
            />
            <ConfirmModal
                onHide={() => setShowConfirmDeleteModal(false)}
                show={showConfirmDeleteModal}
                iconname={faTrash}
                color={'red'}
                title={'Delete Product?'}
                _id={data._id}
                name={data.product_name}
                confirm={handleDeleteProduct}
            />

            {renderSwitch(viewProduct)}

            <style type="text/css">{`
                .adin_inventory ._div{
                    display: flex;
                    justify-content: center;
                    margin: 5%;
                }
                .adin_inventory .form_label{
                    font-size: 12px;
                }
                @media (max-width: 575px){
                    .adin_inventory .search_col{
                        padding-top: 1%;
                    }
                }
            `}</style>
            <style jsx >{`
                th{
                    font-size: 14px;
                }
            `}</style>
        </div>
    )
}

function ProductTable(props) {
    const [lower_limit, setlower_limit] = useState(0)
    const [upper_limit, setupper_limit] = useState(0)

    useEffect(() => {
        setlower_limit(props.pageNumber * 20 - 20)
        setupper_limit(props.pageNumber * 20)
    }, [props.pageNumber])

    return (
        <div className='admin_product_table'>
            <Table responsive bordered hover size="sm">
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center' }}>#</th>
                        <th style={{ textAlign: 'center' }}>ID</th>
                        <th style={{ textAlign: 'center' }}>Name</th>
                        <th style={{ textAlign: 'center' }}>Type</th>
                        <th style={{ textAlign: 'center' }}>Price</th>
                        <th style={{ textAlign: 'center' }}>Stock</th>
                        <th style={{ textAlign: 'center' }}>Category</th>
                        <th style={{ textAlign: 'center' }}>Sub Category</th>
                        <th style={{ textAlign: 'center' }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {props.list && props.list.map((element, index) =>
                        index >= lower_limit && index < upper_limit ?
                            element.product_type == "simple-product" ?
                                <tr key={index}>
                                    <td align="center" >{index + 1}</td>
                                    <td >
                                        {element._id}
                                        <div className="td">
                                            <Nav.Link style={styles.nav_link} className='pt-0' onClick={() => props.setViewProduct(element)} >View</Nav.Link>
                                            {/* <Nav.Link style={styles.nav_link} className='pt-0' onClick={() => props.handleEditProduct(element)}>Edit</Nav.Link> */}
                                            {/* <Nav.Link style={styles.nav_link} className='pt-0 delete' onClick={() => props.handleShowConfirmModal(element)}>Delete</Nav.Link> */}
                                        </div>
                                    </td>
                                    <td align="center" >{element.product_name}</td>
                                    <td align="center" >{element.product_type == "simple-product" ? 'Simple' : 'Variable'}</td>
                                    <td align="center" >
                                        {element.product_price}
                                    </td>
                                    <td align="center" >
                                        {element.product_in_stock}
                                    </td>
                                    <td align="center" >
                                        {element.category.value}
                                    </td>
                                    <td align="center" >
                                        {element.sub_category.value}
                                    </td>
                                    <td align="center" >
                                        {element.entry_date.substring(0, 10)}
                                    </td>
                                </tr>
                                :
                                <tr key={index}>
                                    <td align="center" >{index + 1}</td>
                                    <td>
                                        {element._id}
                                        <div className="td">
                                            <Nav.Link style={styles.nav_link} className='pt-0' onClick={() => props.setViewProduct(element)} >View</Nav.Link>
                                            {/* <Nav.Link style={styles.nav_link} className='pt-0' onClick={() => props.handleEditProduct(element)}>Edit</Nav.Link> */}
                                            {/* <Nav.Link style={styles.nav_link} className='pt-0 delete' onClick={() => props.handleShowConfirmModal(element)}>Delete</Nav.Link> */}
                                        </div>
                                    </td>
                                    <td align="center" >{element.product_name}</td>
                                    <td align="center" >{element.product_type == "simple-product" ? 'Simple' : 'Variable'}</td>
                                    <td align="center" >
                                        {element.product_variations[0].price} ...
                                </td>
                                    <td align="center" >
                                        {element.product_variations[0].stock} ...
                                </td>
                                    <td align="center" >
                                        {element.category.value}
                                    </td>
                                    <td align="center" >
                                        {element.sub_category.value}
                                    </td>
                                    <td align="center" >
                                        {element.entry_date.substring(0, 10)}
                                    </td>
                                </tr>
                            :
                            null
                    )}
                </tbody>
            </Table >
            <style type="text/css">{`
                .admin_product_table .delete{
                    color: #ff4d4d;
                }
                .admin_product_table .delete:hover{
                    color: #e60000;
                }
                .vendor_inventory .form-control:disabled {
                    background: none;
                    font-size: 14px;
                }
            `}</style>
            <style jsx >
                {`
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
            `}
            </style>
        </div>
    )
}

const ViewProduct = props => {
    const [ref, { x, y, width }] = useDimensions();

    const [imgPreview, setImgPreview] = React.useState(false);
    const [currentImgIndex, setCurrentImgIndex] = React.useState('')
    const [imgData, setImgData] = React.useState([])

    // const len = props.data.product_image_link.length;

    function prevImage() {
        if (currentImgIndex > 0) {
            setCurrentImgIndex(currentImgIndex - 1)
        }
    }
    function nextImage() {
        if (currentImgIndex < (imgData.length - 1)) {
            setCurrentImgIndex(currentImgIndex + 1)
        }
    }

    return (
        <div className='admin_view_product'>
            <TitleRow icon={faPlus} title={` Vendor Dashboard / All Products / ${props.data.product_name}`} />
            <Form.Row style={{ margin: ' 1% 2%', display: 'flex', alignItems: 'center' }} >
                <Button variant='outline-primary' size='sm' className="mr-auto" onClick={props.back}>Back</Button>
                <div className="mr-auto" style={{ fontSize: '14px' }}> {props.data.product_name || '-'}</div>
                {/* <Button variant='outline-primary' size='sm' className="mr-3" onClick={props.edit}>Edit</Button> */}
                {/* <Button variant='outline-danger' size='sm' onClick={props.handleShowConfirmModal}>Delete</Button> */}
            </Form.Row>
            <CardAccordion title={'General Info'}>
                <Row>
                    <Form.Group as={Col} lg={props.isVariableProduct ? 6 : 4} md={props.isVariableProduct ? 6 : 4} sm={props.isVariableProduct ? 6 : 6} xs={12}>
                        <Form.Label className='form_label'>Product ID:</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={props.data._id} disabled={true} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} lg={props.isVariableProduct ? 6 : 4} md={props.isVariableProduct ? 6 : 4} sm={props.isVariableProduct ? 6 : 6} xs={12}>
                        <Form.Label className='form_label'>Product Name:</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={props.data.product_name} disabled={true} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} lg={props.isVariableProduct ? 6 : 4} md={props.isVariableProduct ? 6 : 4} sm={props.isVariableProduct ? 6 : 6} xs={12}>
                        <Form.Label className='form_label'>SKU:</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={props.data.sku || '-'} disabled={true} />
                        </InputGroup>
                    </Form.Group>

                    {props.isVariableProduct ?
                        null
                        :
                        <>
                            <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                                <Form.Label className='form_label'>Brand Name:</Form.Label>
                                <InputGroup>
                                    <Form.Control type="text" size="sm" value={props.data.product_brand_name || '-'} disabled={true} />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                                <Form.Label className='form_label'>Price:</Form.Label>
                                <InputGroup>
                                    <Form.Control type="text" size="sm" value={props.data.product_price} disabled={true} />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                                <Form.Label className='form_label'>Product In Stock:</Form.Label>
                                <InputGroup>
                                    <Form.Control type="text" size="sm" value={props.data.product_in_stock} disabled={true} />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                                <Form.Label className='form_label'>Warranty (month):</Form.Label>
                                <InputGroup>
                                    <Form.Control type="text" size="sm" value={props.data.product_warranty || 'No Warranty'} disabled={true} />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                                <Form.Label className='form_label'>Warranty Type:</Form.Label>
                                <InputGroup>
                                    <Form.Control type="text" size="sm" value={props.data.warranty_type || '-'} disabled={true} />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                                <Form.Label className='form_label'>Discount (%):</Form.Label>
                                <InputGroup>
                                    <Form.Control type="text" size="sm" value={props.data.product_discount || '0%'} disabled={true} />
                                </InputGroup>
                            </Form.Group>
                        </>
                    }

                    <Form.Group as={Col} lg={props.isVariableProduct ? 6 : 4} md={props.isVariableProduct ? 6 : 4} sm={props.isVariableProduct ? 6 : 6} xs={12}>
                        <Form.Label className='form_label'>Purchase Note(s):</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={props.data.purchase_note || '-'} disabled={true} />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group as={Col} lg={12} md={12} sm={12} xs={12}>
                        <Form.Label className='form_label'>Description:</Form.Label>
                        <InputGroup>
                            <Form.Control as="textarea" row='8' value={props.data.product_description || 'No Description'} disabled={true} />
                        </InputGroup>
                    </Form.Group>
                </Row>
            </CardAccordion>

            {props.isVariableProduct ?
                <CardAccordion title={'Variations'}>
                    {props.data.product_variations && props.data.product_variations.map((element, index) =>
                        <Accordion key={index} defaultActiveKey='0' className='pb-2'>
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey='1' className='accordian_toggle'>
                                    <Form.Label className='p-0 mb-0 ml-0 mr-auto'>ID: {element._id}</Form.Label>
                                    <FontAwesomeIcon size="xs" icon={faSlidersH} style={styles.slider_fontawesome} />
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey='1' style={{ padding: '1%' }}>
                                    <>
                                        <Row noGutters >
                                            <label className='haeder_label'>Variations</label>
                                            <Form.Group as={Col} lg={2} md={2} sm={4} xs={6} className='pl-1 pr-1'>
                                                <Form.Label className='form_label'>Price</Form.Label>
                                                <InputGroup>
                                                    <Form.Control type="text" size="sm" value={element.price || '-'} disabled={true} />
                                                </InputGroup>
                                            </Form.Group>
                                            <Form.Group as={Col} lg={2} md={2} sm={4} xs={6} className='pl-1 pr-1'>
                                                <Form.Label className='form_label'>Stock</Form.Label>
                                                <InputGroup>
                                                    <Form.Control type="text" size="sm" value={element.stock || '-'} disabled={true} />
                                                </InputGroup>
                                            </Form.Group>
                                            {element.item && element.item.map((e, i) =>
                                                <Form.Group key={i} as={Col} lg={2} md={2} sm={4} xs={6} className='pl-1 pr-1'>
                                                    <Form.Label className='form_label'>{e.name}</Form.Label>
                                                    <InputGroup>
                                                        <Form.Control type="text" size="sm" value={e.value} disabled={true} />
                                                    </InputGroup>
                                                </Form.Group>
                                            )}

                                        </Row>
                                        <Row noGutters>
                                            <label className='haeder_label'>Specifications</label>
                                            {element.custom_fields && element.custom_fields.map((e, i) =>
                                                <Form.Group key={i} as={Col} lg={2} md={2} sm={4} xs={6} className='pl-1 pr-1'>
                                                    <Form.Label className='form_label'>{e.name}</Form.Label>
                                                    <InputGroup>
                                                        <Form.Control type="text" size="sm" value={e.value} disabled={true} />
                                                    </InputGroup>
                                                </Form.Group>
                                            )}
                                        </Row>

                                    </>
                                </Accordion.Collapse>
                            </Card>
                            <Row noGutters className='w-100'>
                                {element.image_link && element.image_link.map((img, i) =>
                                    <Col key={i} lg={1} md={2} sm={3} xs={3} >
                                        <div className='my_img_div'>
                                            <Image ref={ref} thumbnail
                                                style={{ width: '100%', maxHeight: width + 10 || '200px', minHeight: width + 10 || '200px' }}
                                                onClick={() => { setImgPreview(true), setCurrentImgIndex(i), setImgData(element.image_link) }} src={img.url} />
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </Accordion>
                    )}
                </CardAccordion>
                :
                <>
                    <CardAccordion title={'Custom Fields'}>
                        <Row noGutters>
                            {props.data.custom_fields && props.data.custom_fields.map((element, index) =>
                                <Form.Group key={index} as={Col} lg={2} md={2} sm={4} xs={12} className='pl-1 pr-1'>
                                    <Form.Label className='form_label'>{element.name}</Form.Label>
                                    <InputGroup>
                                        <Form.Control type="text" size="sm" value={element.value} disabled={true} />
                                    </InputGroup>
                                </Form.Group>
                            )}
                        </Row>
                    </CardAccordion>
                    <CardAccordion title={'Product Images'}>
                        <Row noGutters>
                            {props.data.product_image_link && props.data.product_image_link.map((img, index) =>
                                <Col key={index} lg={1} md={2} sm={3} xs={3} >
                                    <div className='my_img_div'>
                                        <Image ref={ref} thumbnail
                                            style={{ width: '100%', maxHeight: width + 10 || '200px', minHeight: width + 10 || '200px' }}
                                            onClick={() => { setImgPreview(true), setCurrentImgIndex(i), setImgData(element.image_link) }} src={img.url} />
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </CardAccordion>
                </>
            }
            <CardAccordion title={'Shipping Details'}>
                <Row>
                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Length (cm):</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={props.data.dimension_length || '-'} disabled={true} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Width (cm):</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={props.data.dimension_width || '-'} disabled={true} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Height (cm):</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={props.data.dimension_height || '-'} disabled={true} />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Weight (kg):</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={props.data.product_weight || '-'} disabled={true} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Shipping Charges:</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={props.data.shipping_charges || '-'} disabled={true} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Handlink Fee:</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={props.data.handling_fee || '-'} disabled={true} />
                        </InputGroup>
                    </Form.Group>
                </Row>
            </CardAccordion>
            <CardAccordion title={'Product Categories'}>
                <Form.Group>
                    <Form.Label className='heading_label'>Product Category:</Form.Label>
                    <InputGroup>
                        <Form.Label className='form_label'>
                            {props.data.category.value}
                        </Form.Label>
                    </InputGroup>
                </Form.Group >
                <hr />
                <Form.Group>
                    <Form.Label className='heading_label'>Product Category:</Form.Label>
                    <InputGroup>
                        <Form.Label className='form_label'>
                            {props.data.sub_category.value}
                        </Form.Label>
                    </InputGroup>
                </Form.Group >
                <hr />
                <Form.Group>
                    <Form.Label className='heading_label'>Product Tags:</Form.Label>
                    <InputGroup>
                        {props.data.product_tags && props.data.product_tags.map((element, index) =>
                            <Form.Label key={index} className='form_label'>
                                {element.value}
                            </Form.Label>
                        )}
                    </InputGroup>
                </ Form.Group >
                <hr />
                <Form.Group>
                    <Form.Label className='heading_label'>Dangerous Goods:</Form.Label>
                    <InputGroup>
                        {props.data.dangerous_goods && props.data.dangerous_goods.map((element, index) =>
                            <Form.Label key={index} className='form_label'>
                                {element.value}
                            </Form.Label>
                        )}
                    </InputGroup>
                </Form.Group>
            </CardAccordion >

            {/* Image Preview */}
            {imgPreview && <ImagePreview
                imgData={imgData}
                index={currentImgIndex}
                prevImage={prevImage}
                nextImage={nextImage}
                setImgPreview={() => setImgPreview(false)}
            />}
            <style type="text/css">{`
                .admin_view_product .heading_label{
                    font-size: 13px;
                    font-weight: bold;
                }
                .admin_view_product .my_img_div{
                    padding: 2%;
                    cursor: pointer;
                    background: white;
                    cursor: pointer;
                }
                .admin_view_product .my_img_div:hover{
                    box-shadow: 0px 0px 10px 0.01px gray;
                    transition-timing-function: ease-in;
                    transition: 0.5s;
                    padding: 0% 2% 4% 2%;
                }
                .admin_view_product .haeder_label{
                    font-size: 13px;
                    font-weight: bold;
                    width: 100%;
                }
                .admin_view_product .accordian_toggle{
                    background: #9a9db1;
                    font-size: 12px;
                    color: white;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                }
                .admin_view_product .accordian_toggle:hover{
                    background: #7d819b;
                }
                .admin_view_product .field_col{
                    padding: 0% 2%;
                }
                
            `}</style>
        </div>
    )
}

function ImagePreview(props) {
    const [ref, { x, y, width }] = useDimensions();
    return (
        <div className='admin_img_preview'>
            <div className="modal-overlay">
                <div className="modal-body">
                    <div className="close-modal">
                        <div className="mr-auto"></div>
                        <div className="mr-auto"></div>
                        <FontAwesomeIcon className="mr-auto" icon={faChevronLeft} style={styles.img_preview_fontawesome}
                            onClick={props.prevImage} />
                        <FontAwesomeIcon className="mr-auto" icon={faChevronRight} style={styles.img_preview_fontawesome}
                            onClick={props.nextImage} />
                        <div className="mr-auto"></div>
                        <FontAwesomeIcon icon={faTimes} style={styles.img_preview_fontawesome}
                            onClick={props.setImgPreview} />
                    </div>
                    <div className="image-container">
                        <img ref={ref}
                            thumbnail
                            src={props.imgData[props.index].url}
                            style={{ width: '100%', maxHeight: width + 90, minHeight: width + 90, margin: 'auto' }}
                        />
                    </div>
                </div>
            </div>
            <style jsx>
                {`
                   .admin_img_preview .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        right: 0;
                        z-index: 10;
                        width: 100%;
                        height: 100%;
                        background: rgba(21, 21, 21, 0.75);
                    }
                    .admin_img_preview .modal-body {
                        position: relative;
                        z-index: 11;
                        margin: 2.5%;
                        overflow: hidden;
                        max-width: 100%;
                        max-height: 100%;
                    }
                    .admin_img_preview .close-modal {
                        position: fixed;
                        display: flex;
                        top: 10px;
                        left: 0;
                        right: 0;
                        width: 100%;
                    }
                    .admin_img_preview .image-container {
                        margin: 2% 30%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    @media (max-width: 1299px){
                        .admin_img_preview .image-container {
                            margin: 2% 25%;
                        }
                    }
                    @media (max-width: 1199px){
                        .admin_img_preview .image-container {
                            margin: 2% 20%;
                        }
                    }
                    @media (max-width: 991px){
                        .admin_img_preview .image-container {
                            margin: 2% 15%;
                        }
                    }
                    @media (max-width: 767px){
                        .admin_img_preview .image-container {
                            margin: 2% 10%;
                        }
                    }
                    @media (max-width: 575px){
                        .admin_img_preview .image-container {
                            margin: 10% 2%;
                        }
                    }
                `}
            </style>
        </div>
    )
}

const styles = {
    label: {
        fontSize: `${consts.SIZES.LABEL}`
    },
    nav_link: {
        paddingLeft: '10px',
        paddingRight: '5px',
    },
    label: {
        fontSize: `${consts.SIZES.LABEL}`,
        color: `${consts.COLORS.SEC}`,
        marginRight: '2%'
    },
    row: {
        margin: '2%', padding: '0%'
    },
    img_preview_fontawesome: {
        cursor: 'pointer',
        color: 'white',
        fontWeight: 'lighter',
        width: '30px',
        height: '30px',
        maxHeight: '30px',
        maxWidth: '30px',
    },
    fontawesome: {
        color: `${consts.COLORS.SEC}`,
        marginRight: '10%',
        width: '17px',
        height: '17px',
        maxHeight: '17px',
        maxWidth: '17px',
    },
    general_info_label: {
        fontSize: `${consts.SIZES.LABEL}`,
        width: '100%',
        borderBottom: '1px solid gray'
    },
    field_label: {
        border: `1px solid ${consts.COLORS.SECONDARY}`,
        color: `${consts.COLORS.SEC}`,
        margin: '0%',
        width: '100%',
        padding: '2px 5px'
    },
    card: {
        width: '100%',
        border: '1px solid lightgray'
    },
    card_header: {
        alignItems: 'center',
        fontSize: `${consts.SIZES.HEADER}`,
        background: `${consts.COLORS.MUTED}`,
    },
    slider_fontawesome: {
        color: 'white',
        width: '15px',
        height: '15px',
        maxHeight: '15px',
        maxWidth: '15px',
    },
}

