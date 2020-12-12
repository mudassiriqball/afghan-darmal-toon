import { Accordion, Card, Button, InputGroup, Row, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';

import DatePicker from "react-datepicker";
import moment from "moment"
import theme from '../constants/theme';

export default function CardSearchAccordion(props) {
    const [options, setOptions] = useState([])

    const [searchType, setSearchType] = useState('_id')
    const [searchValue, setSearchValue] = useState(props.value)

    const [start_date, setStart_date] = useState(new Date("2020/01/01"))
    const [end_date, setEnd_date] = useState(new Date())

    function handleSearchEnterPress(e) {
        var key = e.keyCode || e.which;
        if (key == 13) {
            props.handleSearch(searchType, searchValue, start_date, end_date)
        }
    }

    function onSearchValueChange(val) {
        setSearchValue(val)
        if (val == '') {
            props.handleSearch(searchType, '', start_date, end_date)
        }
    }

    function handleSearchClearBtnClick() {
        setSearchValue('')
        props.handleSearch(searchType, '', start_date, end_date)
    }

    function handleSearchBtnClick(value) {
        props.handleSearch(searchType, value, start_date, end_date)
    }


    function handleSetStartDate(date) {
        setStart_date(date)
    }
    function handleSetEndDate(date) {
        setEnd_date(date)
    }
    const ref = React.createRef();
    const DatePickerBtn = React.forwardRef((props, ref) => (
        <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{props.tooltip}</Tooltip>}
        >
            <Button size='sm' variant='light' onClick={props.onClick}>
                <div style={{ whiteSpace: 'nowrap' }}>{props.value}</div>
            </Button>
        </OverlayTrigger>
    ))

    useEffect(() => {
        // const datePicker = document.getElementsByClassName("react-datepicker__input-container")[0];
        // datePicker.childNodes[0].setAttribute("readOnly", true);

        setOptions([])
        setOptions(prevPro => {
            return [...new Set([...prevPro, { value: '_id', name: 'ID' }])]
        })
        if (props.option == 'inventory') {
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'product_name', name: 'Product Name' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'category', name: 'Category' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'sub-category', name: 'Sub Category' }])]
            })

        } else if (props.option == 'vendor') {
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'mobile', name: 'Mobile' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'full_name', name: 'Name' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'city', name: 'City' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'shop_name', name: 'Shop Name' }])]
            })

        } else if (props.option == 'customer') {
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'mobile', name: 'Mobile' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'full_name', name: 'Name' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'city', name: 'City' }])]
            })

        } else if (props.option == 'order') {
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'c_id', name: 'Cutomer ID' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'c_name', name: 'Name' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'mobile', name: 'Mobile' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'city', name: 'City' }])]
            })
        }
    }, [props.option])



    return (
        <>
            <Accordion as={Row} defaultActiveKey="0" style={{ margin: '2%' }} noGutters >
                <Card className='p-0 m-0 w-100'>
                    <Card.Header as={Row} className='card_toggle_header'>
                        <Col lg={12} md={12} sm={12} sm={12}>
                            <Accordion.Toggle as={Card.Header} eventKey="0" className='searc_accordian_card_toggle'>
                                <Form.Label className='p-0 mr-auto'>{props.title}</Form.Label>
                                <FontAwesomeIcon icon={faSlidersH} className='search_accordian_fontawesome' />
                            </Accordion.Toggle>
                        </Col>

                        <Col lg={12} md={12} sm={12} xs={12} className='accordian_col md_padding'>
                            <Row noGutters>
                                <Col lg='auto' md='auto' sm={12} xs={12}>
                                    <Row className='m-0 p-0 date_row' noGutters>
                                        <Col className='date_col'>
                                            <DatePicker
                                                className='start_date_picker'
                                                dateFormat={'yyyy-MM-dd'}
                                                minDate={new Date("2020/01/01")}
                                                maxDate={end_date}
                                                selected={start_date}
                                                onChange={handleSetStartDate}
                                                customInput={<DatePickerBtn ref={ref} tooltip={'Start Date'} />}
                                                popperPlacement="bottom-start"
                                            />
                                        </Col>
                                        <Col lg='auto' md='auto' sm='auto' xs='auto' className='d-flex align-items-center justify-content-center p-2'>
                                            to
                                        </Col>
                                        <Col className='date_col'>
                                            <DatePicker
                                                dateFormat={'yyyy-MM-dd'}
                                                minDate={start_date}
                                                maxDate={new Date()}
                                                selected={end_date}
                                                todayButton="Today"
                                                onChange={handleSetEndDate}
                                                customInput={<DatePickerBtn ref={ref} tooltip={'End Date'} />}
                                                popperPlacement="auto"
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className='ml-1' lg='auto' md='auto' sm='auto' xs='auto'>
                                    <Form.Control as="select"
                                        variant="dark"
                                        size='sm'
                                        value={props.searchType}
                                        onChange={(e) => setSearchType(e.target.value)}>
                                        {options.map((element, index) =>
                                            <option value={element.value} key={index}>{element.name}</option>
                                        )}
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <InputGroup>
                                        <Form.Control
                                            size='sm'
                                            type="text"
                                            placeholder="Search here"
                                            name="search"
                                            onKeyPress={(e) => handleSearchEnterPress(e)}
                                            value={searchValue}
                                            onChange={(e) => onSearchValueChange(e.target.value)}
                                        />
                                        {searchValue && <InputGroup.Append >
                                            <Button size='sm' variant='danger' onClick={() => handleSearchClearBtnClick('')}>
                                                {' x '}
                                            </Button>
                                        </InputGroup.Append>
                                        }
                                        <Button size='sm' variant='light' onClick={() => handleSearchBtnClick(searchValue)}>
                                            {'Search'}
                                        </Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body className='w-100'>
                            {props.children}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            <style type="text/css">{`
                .react-datepicker-popper {
                    z-index: 3;
                }
                .date_row {
                    padding-right: 5%;
                }
                .accordian_col{
                    padding: 0%;
                    margin: 0%;
                }
                .date_col {
                    display: block;
                }
                .card_toggle_header{
                    background: ${theme.COLORS.SEC};
                    font-size: 13px;
                    color: white;
                    display: inline-flex;
                    align-items: center;
                    width: 100;
                    padding: 1%;
                    margin: 0%;
                }
                .searc_accordian_card_toggle{
                    color: #d4d5de;
                    padding: 1% 0%;
                    margin: 0%;
                    border: none;
                    align-self: center;
                    background: ${theme.COLORS.SEC};
                    font-size: 13px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    width: 100%
                }
                .searc_accordian_card_toggle:hover{
                    color: white;
                }
                .search_accordian_fontawesome{
                    min-width: 20px;
                    max-width: 20px;
                    min-height: 20px;
                    max-height: 20px;
                    margin-left: auto;
                }

                .display_in_sm_xs{
                    display: none;
                }
                .display_in_lg_md{
                    display: flex;
                    align-items: center;
                }
                @media (max-width: 767px){
                    .display_in_sm_xs{
                        display: flex;
                    }
                    .display_in_lg_md{
                        display: none;
                    }
                    .md_padding{
                        padding-top: 1%;
                    }
                }
                @media (max-width: 575px){
                    .date_row {
                        padding-left: 0%;
                    }
                    .date_col {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        white-space: nowrape;
                    }
                    .search_accordian_fontawesome{
                        min-width: 15px;
                        max-width: 15px;
                        min-height: 15px;
                        max-height: 15px;
                    }
                    .md_padding{
                        padding-top: 2%;
                    }
                }
           `}</style>
        </>
    )
}