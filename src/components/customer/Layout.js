import React, { useState, useEffect, useRef } from 'react'
import { Card, Col, Dropdown, Nav, Navbar, Row, Form } from 'react-bootstrap'
import theme from '../../constants/theme'
import CssTransition from './CssTransition'
import Toolbar from './toolbar';
import Link from 'next/link'
import { removeTokenFromStorage } from '../../utils/services/auth'
import Router from 'next/router';

import { BiDotsVertical } from 'react-icons/bi';
import { ImCart } from 'react-icons/im';
import { RiSearch2Line } from 'react-icons/ri';

export default function Layout(props) {
    const { user } = props;

    // Acccount
    const logoutUser = async () => {
        const loggedOut = await removeTokenFromStorage();
        if (loggedOut) {
            Router.replace('/');
        }
    }
    // End Of Acccount

    // 2nd Nav
    const [pagesHover, setpagesHover] = useState(false);
    const [homeHover, sethomeHover] = useState(false);
    const [servicesHover, setservicesHover] = useState(false);
    const [showHomeDropDown, setshowHomeDropDown] = useState(false);
    const [showPagesDropDown, setshowPagesDropDown] = useState(false);
    const [showServicesDropDown, setshowServicesDropDown] = useState(false);

    // Category
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [hoverCategory, setHoverCategory] = useState(false);
    const [category_id, setCategory_id] = useState('');
    function categoryMouseEnter(index) {
        const copyArray = Object.assign([], props.categories_list)
        setCategory_id(copyArray[index])
    }
    function categoryMouseLeave() {
        setCategory_id('')
    }

    // Dots View
    const [dotsView, setDotsView] = useState(false);

    // Sticky
    const [isSticky, setSticky] = useState(false);
    const ref = useRef(null);
    const handleScroll = () => {
        if (ref.current) {
            setSticky(ref.current.getBoundingClientRect().top < 0);
        }
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', () => handleScroll);
        };
    }, []);

    return (
        <div className='_layout'>
            <div className='xl_md'>
                <Toolbar user={user} />
            </div>
            {/* Nav Links */}
            <div className={`sticky-wrapper${isSticky ? ' sticky' : ''}`} ref={ref}>
                <Navbar collapseOnSelect expand="md" className='sticky-inner' style={{ justifyContent: 'center' }} variant='light'>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{ marginTop: '10px', marginBottom: '10px', marginRight: 'auto' }} />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        {/* Categories lg md*/}
                        <Nav className='sm_xs_display_none'>
                            <Dropdown
                                onMouseOver={() => { setIsCategoryOpen(true), setHoverCategory(true) }}
                                onMouseLeave={() => { setIsCategoryOpen(false), setHoverCategory(false) }}
                                show={isCategoryOpen}
                            >
                                <Dropdown.Toggle as={Nav.Link} className='d-flex flex-row align-items-center'
                                    style={{ fontWeight: 'bold', background: hoverCategory ? theme.COLORS.MAIN : theme.COLORS.WHITE, padding: '20px 30px' }}
                                >
                                    {'CATEGORIES'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='dropdown-menu dropdown_menue' style={{ border: 'none', paddingTop: '27px', background: 'none' }}>
                                    <Row noGutters onMouseLeave={() => categoryMouseLeave()} style={{ boxShadow: `0px 0px 5px #e6e6e6`, paddingTop: '20px', background: theme.COLORS.WHITE }}>
                                        <Col style={{ overflowY: 'auto', zIndex: 1, minHeight: '500px', maxHeight: '500px' }}>
                                            {props.categories_list && props.categories_list.map((element, index) =>
                                                <Link key={index} href='/products/category/[category]' as={`/products/category/${element.value}`} >
                                                    {props.active_category == element.value ?
                                                        <a style={{ color: 'blue' }} className="category_list_item" onMouseOver={() => categoryMouseEnter(index)} onClick={() => { setIsCategoryOpen(false), setHoverCategory(false) }}>
                                                            {element.value}
                                                        </a>
                                                        :
                                                        <a className="category_list_item" onMouseOver={() => categoryMouseEnter(index)} onClick={() => { setIsCategoryOpen(false), setHoverCategory(false) }}>
                                                            {element.value}
                                                        </a>
                                                    }
                                                </Link>
                                            )}
                                        </Col>
                                        {/* {category_id ? */}
                                        <Col style={{ minHeight: '500px', maxHeight: '50px', overflowY: 'auto' }}>
                                            {props.sub_categories_list && props.sub_categories_list.map((element, index) =>
                                                element.category_id == category_id._id ?
                                                    <Link href='/products/category/[category]/[sub_category]' as={`/products/category/${category_id.value}/${element.value}`} key={index} >
                                                        {props.active_sub_category == element.value ?
                                                            <a style={{ color: 'blue' }} className="category_list_item" onClick={() => { setIsCategoryOpen(false), setHoverCategory(false) }}>
                                                                {element.value}
                                                            </a>
                                                            :
                                                            <a className="category_list_item" onClick={() => { setIsCategoryOpen(false), setHoverCategory(false) }}>
                                                                {element.value}
                                                            </a>
                                                        }
                                                    </Link>
                                                    :
                                                    null
                                            )}
                                        </Col>
                                    </Row>
                                </Dropdown.Menu>
                            </ Dropdown>
                        </Nav>
                        {/* End of categories */}
                        <Nav className="justify-content-center mr-auto ml-auto" >
                            {/* HOME */}
                            <Dropdown show={showHomeDropDown}
                                flip={"true"}
                                onMouseEnter={() => setshowHomeDropDown(true)}
                                onMouseLeave={() => setshowHomeDropDown(false)}>
                                <Dropdown.Toggle as={Nav.Link}
                                    onMouseEnter={() => sethomeHover(true)}
                                    onMouseLeave={() => sethomeHover(false)}
                                    style={{ fontWeight: 'bold', background: homeHover ? theme.COLORS.MAIN : theme.COLORS.WHITE, padding: '20px 30px' }}
                                >
                                    {'HOME'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='dropdown-menu' style={{ border: 'none', paddingTop: '27px', background: 'none' }} >
                                    <Card style={{ boxShadow: `0px 0px 5px #e6e6e6` }}>
                                        <div className='link_div'>
                                            <Nav.Link href="/" style={{ fontWeight: 'bold', padding: '10px 30px', fontSize: '14px' }}>HOME</Nav.Link>
                                        </div>
                                    </Card>
                                </Dropdown.Menu>
                            </Dropdown>
                            {/* PAGES */}
                            <Dropdown show={showPagesDropDown}
                                flip={"true"}
                                onMouseEnter={() => setshowPagesDropDown(true)}
                                onMouseLeave={() => setshowPagesDropDown(false)}>
                                <Dropdown.Toggle as={Nav.Link}
                                    onMouseEnter={() => setpagesHover(true)}
                                    onMouseLeave={() => setpagesHover(false)}
                                    style={{ fontWeight: 'bold', background: pagesHover ? theme.COLORS.MAIN : theme.COLORS.WHITE, padding: '20px 30px' }}
                                >
                                    {'PAGES'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='dropdown-menu' style={{ border: 'none', paddingTop: '27px', background: 'none' }} >
                                    <Card style={{ boxShadow: `0px 0px 5px #e6e6e6` }}>
                                        {user.role == 'admin' &&
                                            <div className='link_div'>
                                                <Nav.Link href="/admin" style={{ fontWeight: 'bold', padding: '10px 30px', fontSize: '14px' }}>DASHBOARD</Nav.Link>
                                            </div>
                                        }
                                        <div className='link_div'>
                                            <Nav.Link href="/profile" style={{ fontWeight: 'bold', padding: '10px 30px', fontSize: '14px', borderBottom: `1px solid #e6e6e6` }}>PROFILE</Nav.Link>
                                        </div>
                                        <div className='link_div'>
                                            <Nav.Link href="/cart" style={{ fontWeight: 'bold', padding: '10px 30px', fontSize: '14px' }}>CART</Nav.Link>
                                        </div>
                                    </Card>
                                </Dropdown.Menu>
                            </Dropdown>
                            {/* SERVICES */}
                            <Dropdown show={showServicesDropDown}
                                flip={"true"}
                                onMouseEnter={() => setshowServicesDropDown(true)}
                                onMouseLeave={() => setshowServicesDropDown(false)}>
                                <Dropdown.Toggle as={Nav.Link}
                                    onMouseEnter={() => setservicesHover(true)}
                                    onMouseLeave={() => setservicesHover(false)}
                                    style={{ fontWeight: 'bold', background: servicesHover ? theme.COLORS.MAIN : theme.COLORS.WHITE, padding: '20px 30px' }}
                                >
                                    {'SERVICES'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='dropdown-menu' style={{ border: 'none', paddingTop: '27px', background: 'none' }} >
                                    <Card style={{ boxShadow: `0px 0px 5px #e6e6e6` }}>
                                        <div className='link_div'>
                                            <Nav.Link href="/" style={{ fontWeight: 'bolder', padding: '10px 30px' }}>HOME</Nav.Link>
                                        </div>
                                    </Card>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                        <Nav className="justify-content-center flex-row m-0 p-0 sm_xs_display_none">
                            <div className='coloreBoxIcon'>
                                <Nav.Link href="/search" onClick={() => setDotsView(!dotsView)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px' }}>
                                    <RiSearch2Line style={styles.coloreBoxIcon} />
                                </Nav.Link>
                            </div>
                            <div className='coloreBoxIcon'>
                                <Nav.Link href="/cart" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px' }}>
                                    <ImCart style={styles.coloreBoxIcon} />
                                </Nav.Link>
                            </div>
                            <div className='coloreBoxIcon'>
                                <Nav.Link href="#" onClick={() => setDotsView(!dotsView)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px' }}>
                                    <BiDotsVertical style={styles.coloreBoxIcon} />
                                </Nav.Link>
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
            <CssTransition show={dotsView} hide={() => setDotsView(false)} />
            { props.children}
            <style type="text/css">{`
                ._layout .xl_md {
                    display: block;
                }
                ._layout .sm_xs_display_none{
                    display: flex;
                }
                ._layout .dropdown_menue {
                    min-width: 700px; 
                    min-height: 500px;
                    max-height: 500px; 
                    border-top: none; 
                    border-top-left-radius: 0px;
                }
                ._layout .category_list_item {
                    cursor: pointer;
                    width: 96%;
                    display: inline-flex;
                    align-items: center;
                    font-size: 16px;
                    padding: 1.5% 4%;
                    margin: 0% 2% 0% 2%;
                    color: gray;
                }
                ._layout .category_list_item:hover{
                    z-index: 100;
                    color: #005ce6;
                    background: ${theme.COLORS.MAIN};
                }

                ._layout .coloreBoxIcon {
                    width: 60px;
                    height: 60px;
                    margin-left: 5%;
                    background: ${theme.COLORS.MAIN};
                }
                ._layout .coloreBoxIcon:hover {
                    background: ${theme.COLORS.SEC};
                }
                ._layout .link_div {
                    color: ${theme.COLORS.SEC};
                }
                ._layout .link_div:hover {
                    background: ${theme.COLORS.MAIN};
                    color: ${theme.COLORS.WHITE};
                }

                ._layout .sticky-wrapper {
                    position: relative;
                }
                ._layout .sticky .sticky-inner {
                    background: ${theme.COLORS.WHITE};
                    padding: 1% 10%;
                    border-bottom: 1px solid white;
                    box-shadow: 0px 0px 10px 0.5px #e6e6e6;
                    position: fixed;
                    align-items: center;
                    top: 0;
                    left: 0;
                    right: 0;
                    margin: 0;
                    z-index: 1000000;
                }
                ._layout .sticky-inner {
                    align-items: center;
                    padding: 1.7% 10%;
                    margin: 0;
                    width: 100%;
                    background: ${theme.COLORS.WHITE};
                    border-bottom: 0.1px solid #f2f2f2;
                }
                @media (max-width: 1199px) {
                    ._layout .sticky-inner{
                        padding: 2% 4%;
                    }
                }
                @media (max-width: 991px) {
                     ._layout .sticky .sticky-inner {
                        padding: 1% 2%;
                    }
                    ._layout .sticky-inner {
                        padding: 1.7% 2%;
                    }
                    ._layout .afghandarmaltoon { 
                        font-size: 25px;
                    }
                }
                @media (max-width: 767px) {
                    ._layout .sm_xs_display_none {
                        display: none;
                    }
                    ._layout .xl_md {
                        display: none;
                    }
                    ._layout .sticky-inner {
                        padding: 0.5% 4%;
                    }
                    ._layout .afghandarmaltoon { 
                        font-size: 15px;
                    }
                }
                @media (max-width: 575px) {
                    ._layout .xl_md {
                        display: none;
                    }
                    ._layout .sticky-inner{
                        padding: 0.5% 2%;
                    }
                }
                // Animation
                ._layout .afghandarmaltoon { 
                    font-size: 25px;
                    animation: bounce 1s; 
                    animation-direction: alternate; 
                    animation-timing-function: cubic-bezier(.05, 0.05, 1, .05); 
                    animation-iteration-count: infinite; 
                } 
                @keyframes bounce { 
                    from { 
                        transform: translate3d(0, -20px, 0); 
                    } 
                    to { 
                        transform: translate3d(0, 5px, 0); 
                    } 
                } 
            `}</style>
            <style jsx global>{`
                * {
                    font-family: Oswald,sans-serif;
                }
            `}</style>
        </div >
    )
}

const styles = {
    coloreBoxIcon: {
        color: theme.COLORS.WHITE,
        fontSize: '30px',
        alignSelf: 'center'
    },
    dotsIcon: {
        color: theme.COLORS.MAIN,
        fontSize: '30px',
        alignSelf: 'center',
        marginRight: '15px',
    },
    dotsSocialIcon: {
        color: theme.COLORS.SEC,
        fontSize: '50px',
        margin: '15px',
    },
    dotsSocialIconFB: {
        color: theme.COLORS.SEC,
        fontSize: '47px',
        margin: '15px',
    },
    category_fontawesome: {
        marginRight: '15px',
        width: '18px',
        height: '18px',
        maxHeight: '18px',
        maxWidth: '18px',
        padding: '0px',
    },
}