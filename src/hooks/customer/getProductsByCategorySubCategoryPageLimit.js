import { useEffect, useState } from 'react';
import axios from 'axios';
import urls from '../../utils/urls/index';

export default function getProductsByCategorySubCategoryPageLimit(category, subCategory, page, limit) {
    const [PRODUCTS_PAGE_LIMIT_LOADING, setLoading] = useState(false);
    const [PRODUCTS_PAGE_LIMIT_ERROR, setError] = useState('');
    const [PRODUCTS_PAGE_LIMIT_PRODUCTS, setProducts] = useState([]);
    const [PRODUCTS_PAGE_LIMIT_HAS_MORE, setHasMore] = useState(true);

    useEffect(() => {
        setProducts([])
    }, [category, subCategory])

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const getData = () => {
            if (category !== '') {
                setLoading(true)
                setError(false)
                axios({
                    method: 'GET',
                    url: urls.GET_REQUEST.PRODUCTS_BY_CATEGORY_SUB_CATEGORY_PAGE_LIMIT,
                    params: {
                        category: category,
                        subCategory: subCategory,
                        page: page,
                        limit: limit,
                    },
                    cancelToken: source.token
                }).then(res => {
                    if (unmounted) {
                        setLoading(false)
                        setProducts(prevPro => {
                            return [...new Set([...prevPro, ...res.data.data.docs])]
                        });
                        setHasMore(res.data.data && res.data.data.docs && res.data.data.docs.length > 0);
                    }
                }).catch(err => {
                    console.log('PRODUCTS_BY_CATEGORY_SUB_CATEGORY_PAGE_LIMIT ERROR:', err);
                    if (unmounted) {
                        setLoading(false)
                        if (axios.isCancel(err)) return
                        setError(true)
                    }
                })
            }
        }
        getData()
        return () => {
            unmounted = false
            source.cancel();
        };
    }, [category, subCategory, page, limit])

    return {
        PRODUCTS_PAGE_LIMIT_LOADING,
        PRODUCTS_PAGE_LIMIT_ERROR,
        PRODUCTS_PAGE_LIMIT_PRODUCTS,
        PRODUCTS_PAGE_LIMIT_HAS_MORE
    }
}