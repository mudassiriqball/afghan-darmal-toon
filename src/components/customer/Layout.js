import React, { useState, useEffect, useRef } from 'react'
import { Card, Col, Dropdown, Nav, Navbar, Row } from 'react-bootstrap'
import theme from '../../constants/theme'
import { BiDotsVertical } from 'react-icons/bi';
import { ImCart } from 'react-icons/im';
import CssTransition from './CssTransition'
import Toolbar from './toolbar';

export default function Layout(props) {
    const { user } = props;
    // 2nd Nav
    const [pagesHover, setpagesHover] = useState(false);
    const [homeHover, sethomeHover] = useState(false);
    const [servicesHover, setservicesHover] = useState(false);
    const [showHomeDropDown, setshowHomeDropDown] = useState(false);
    const [showPagesDropDown, setshowPagesDropDown] = useState(false);
    const [showServicesDropDown, setshowServicesDropDown] = useState(false);

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
            <Toolbar user={user} />
            {/* Nav Links */}
            <div className={`sticky-wrapper${isSticky ? ' sticky' : ''}`} ref={ref}>
                <Navbar collapseOnSelect expand="lg" className='sticky-inner' style={{ justifyContent: 'center' }} variant='light'>
                    <Nav className="justify-content-center flex-row" style={{ flex: 1 }}>
                        <Nav.Link href="/home" className='afghandarmaltoon' style={{ color: theme.COLORS.MAIN, fontWeight: 'bolder' }}>AFGHAN DARMAL TOON</Nav.Link>
                    </Nav>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav right" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="justify-content-center" style={{ flex: 1 }}>
                            {/* HOME */}
                            <Dropdown show={showHomeDropDown}
                                flip={"true"}
                                onMouseEnter={() => setshowHomeDropDown(true)}
                                onMouseLeave={() => setshowHomeDropDown(false)}>
                                <Dropdown.Toggle as={Nav.Link}
                                    onMouseEnter={() => sethomeHover(true)}
                                    onMouseLeave={() => sethomeHover(false)}
                                    style={{ background: theme.COLORS.WHITE, fontWeight: 'bold', background: homeHover ? theme.COLORS.MAIN : theme.COLORS.WHITE, padding: '20px 30px' }}
                                >
                                    {'HOME'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='dropdown-menu' style={{ border: 'none', paddingTop: '27px', background: 'none' }} >
                                    <Card style={{ boxShadow: `1px 0px 7px lightgray` }}>
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
                                    style={{ background: theme.COLORS.WHITE, fontWeight: 'bold', background: pagesHover ? theme.COLORS.MAIN : theme.COLORS.WHITE, padding: '20px 30px' }}
                                >
                                    {'PAGES'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='dropdown-menu' style={{ border: 'none', paddingTop: '27px', background: 'none' }} >
                                    <Card style={{ boxShadow: `1px 0px 7px lightgray` }}>
                                        <div className='link_div'>
                                            <Nav.Link href="/cart" style={{ fontWeight: 'bold', padding: '10px 30px', fontSize: '14px', borderBottom: `1px solid #e6e6e6` }}>CART</Nav.Link>
                                        </div>
                                        <div className='link_div'>
                                            <Nav.Link href="#" style={{ fontWeight: 'bold', padding: '10px 30px', fontSize: '14px' }}>LOL</Nav.Link>
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
                                    style={{ background: theme.COLORS.WHITE, fontWeight: 'bold', background: servicesHover ? theme.COLORS.MAIN : theme.COLORS.WHITE, padding: '20px 30px' }}
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
                        <Nav className="justify-content-center flex-row" style={{ flex: 1 }}>
                            <div className='cart'>
                                <Nav.Link href="#" onClick={() => setDotsView(!dotsView)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px' }}>
                                    <BiDotsVertical style={styles.cart} />
                                </Nav.Link>
                            </div>
                            <div className='cart'>
                                <Nav.Link href="/cart" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px' }}>
                                    <ImCart style={styles.cart} />
                                </Nav.Link>
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
            <CssTransition show={dotsView} hide={() => setDotsView(false)} />
            {props.children}
            <style type="text/css">{`
                ._layout .cart {
                    width: 60px;
                    height: 60px;
                    margin-left: 5%;
                    background: ${theme.COLORS.MAIN};
                }
                ._layout .cart:hover {
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
                    padding: 1% 6%;
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
                    padding: 1.7% 6%;
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
                    ._layout .sticky-inner {
                        padding: 2% 4%;
                    }
                    ._layout .afghandarmaltoon { 
                        font-size: 25px;
                    }
                }
                @media (max-width: 767px) {
                    ._layout .sticky-inner {
                        padding: 0.5% 4%;
                    }
                    ._layout .afghandarmaltoon { 
                        font-size: 15px;
                    }
                }
                @media (max-width: 575px) {
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
    cart: {
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
    }

}