import { useEffect, useState } from 'react';
import axios from 'axios';
import urls from '../../utils/urls/index';

export default function getInventoryPageLimit(refresh_count, page, limit) {
    const [INVENTORY_PRODUCTS_LOADING, setLoading] = useState(false);
    const [INVENTORY_PRODUCTS_ERROR, setError] = useState(false);
    const [INVENTORY_PRODUCTS, setProducts] = useState([]);
    const [INVENTRY_PAGES, setPages] = useState(0);
    useEffect(() => {
        setProducts([]);
        return () => {
        }
    }, [refresh_count]);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            setLoading(true);
            setError(false);
            axios({
                method: 'GET',
                url: urls.GET_REQUEST.INVENTRY_PAGE_LIMIT,
                params: {
                    page: page,
                    limit: limit,
                },
                cancelToken: source.token
            }).then(res => {
                setLoading(false);
                setProducts(prevPro => {
                    return [...new Set([...prevPro, ...res.data.data])]
                });
                setPages(Math.ceil(res.data.data && res.data.data / limit));
            }).catch(err => {
                console.log('Get products by search:', err);
                setLoading(false)
                if (axios.isCancel(err)) return
                setError(true)
            })
        }
        getData()
        return () => {
            source.cancel();
            getData;
        };
    }, [page, refresh_count]);

    return {
        INVENTORY_PRODUCTS_LOADING,
        INVENTORY_PRODUCTS_ERROR,
        INVENTORY_PRODUCTS,
        INVENTRY_PAGES
    }
}