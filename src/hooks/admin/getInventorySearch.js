import { useEffect, useState } from 'react';
import axios from 'axios';
import urls from '../../utils/urls/index';

export default function getInventorySearch(refresh_count, fieldName, query, queryPageNumber, limit) {
    const [INVENTORY_SEARCH_LOADING, setLoading] = useState(false);
    const [INVENTORY_SEARCH_ERROR, setError] = useState(false);
    const [INVENTORY_SEARCH_PRODUCTS, setProducts] = useState([]);
    const [INVENTRY_SEARCH_PAGES, setPages] = useState(0);
    useEffect(() => {
        setProducts([]);
        return () => {
        }
    }, [refresh_count])

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            setLoading(true);
            setError(false);
            axios({
                method: 'GET',
                url: urls.GET_REQUEST.INVENTRY_PAGE_LIMIT,
                params: {
                    field: fieldName, q: query, page: queryPageNumber, limit: limit,
                },
                cancelToken: source.token,
            }).then(res => {
                if (unmounted) {
                    setLoading(false);
                    setProducts(prevPro => {
                        return [...new Set([...prevPro, ...res.data.data.docs])]
                    });
                    setPages(Math.ceil(res.data.pages));
                }
            }).catch(err => {
                console.log('Get products by search:', err);
                setLoading(false)
                if (unmounted) {
                    if (axios.isCancel(err)) return
                    setError(true)
                }
            })
        }
        getData()
        return () => {
            unmounted = false
            source.cancel();
        };
    }, [queryPageNumber]);

    return {
        INVENTORY_SEARCH_LOADING,
        INVENTORY_SEARCH_ERROR,
        INVENTORY_SEARCH_PRODUCTS,
        INVENTRY_SEARCH_PAGES
    }
}