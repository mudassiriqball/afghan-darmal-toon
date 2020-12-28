import React, { useEffect, useState, useRef } from 'react'
import { Button, Col, Form, Navbar, Row } from 'react-bootstrap';
import Toolbar from '../components/customer/toolbar'
import theme from '../constants/theme';
import { getDecodedTokenFromStorage } from '../utils/services/auth';
import urls from '../utils/urls';

import { RiSearch2Line } from 'react-icons/ri';
import getSearchProducts from '../hooks/customer/getSearchProducts';
import Loading from '../components/loading';
import NoDataFound from '../components/no-data-found';
import ProductCard from '../components/customer/product-card';

export default function Search(props) {
    const [user, setUser] = useState({ _id: '', fullName: '', mobile: '', city: '', licenseNo: '', address: '', email: '', status: '', role: '', wishList: '', cart: '', entry_date: '' })
    const [cart_count, setsetCart_count] = useState(0);

    useEffect(() => {
        const getDecodedToken = async () => {
            const decodedToken = await getDecodedTokenFromStorage();
            if (decodedToken !== null) {
                setUser(decodedToken);
                getUser(decodedToken._id);
            }
        }
        getDecodedToken();
        return () => { }
    }, []);

    async function getUser(id) {
        await axios.get(urls.GET_REQUEST.USER_BY_ID + id).then((res) => {
            setUser(res.data.data[0])
            if ('cart' in res.data.data[0])
                setCart_count(res.data.data[0].cart.length);
        }).catch((err) => {
            console.log('Get user error in profile', err);
        })
    }

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
    // End of sticky

    // Search
    const [query, setQuery] = useState('');
    const [search, setSearch] = useState('');
    const { SEARCH_PRODUCTS_LOADING, SEARCH_PRODUCTS_ERROR, SEARCH_PRODUCTS } = getSearchProducts(search);

    const handleSearch = () => {
        if (query !== '')
            setSearch(query);
    }
    // End of search

    return (
        <div className='_search'>
            <Toolbar user={user} />
            <Navbar className='sticky-inner' style={{ justifyContent: 'center' }} variant='light'>
                <Form inline style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', display: 'flex' }}>
                    <Form.Control
                        type="text"
                        placeholder="Search here"
                        style={{ minWidth: '50%', maxWidth: '85%' }}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button variant="outline-success" onClick={() => handleSearch()}>
                        <RiSearch2Line style={{ fontSize: '20px' }} />
                    </Button>
                </Form>
            </Navbar>
            {SEARCH_PRODUCTS_LOADING ?
                <Loading />
                :
                SEARCH_PRODUCTS && SEARCH_PRODUCTS.length > 0 ?
                    <Row noGutters>
                        {SEARCH_PRODUCTS.map((element, index) => (
                            <Col lg={3} md={3} sm={12} xs={12} key={index}>
                                <ProductCard element={element} />
                            </Col>
                        ))}
                    </Row>
                    :
                    <NoDataFound />
            }
            <style type="text/css">{`
                ._search .sticky-wrapper {
                    position: relative;
                }
                ._search .sticky .sticky-inner {
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
                    border-bottom: 0.1px solid #f2f2f2;
                    z-index: 1000000;
                }
                ._search .sticky-inner {
                    align-items: center;
                    padding: 1.7% 10%;
                    margin: 0;
                    width: 100%;
                    background: ${theme.COLORS.WHITE};
                    border-bottom: 0.5px solid #f2f2f2;
                }
                @media (max-width: 1199px) {
                    ._search .sticky-inner{
                        padding: 2% 4%;
                    }
                }
                @media (max-width: 991px) {
                     ._search .sticky .sticky-inner {
                        padding: 1% 2%;
                    }
                    ._search .sticky-inner {
                        padding: 1.7% 2%;
                    }
                    ._search .afghandarmaltoon { 
                        font-size: 25px;
                    }
                }
                @media (max-width: 767px) {
                    ._search .sticky-inner {
                        padding: 1% 4%;
                    }
                }
                @media (max-width: 575px) {
                    ._search .sticky-inner{
                        padding: 2%;
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
