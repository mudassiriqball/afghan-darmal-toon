import { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import urls from '../../utils/urls/index'
import Router from 'next/router'

export default function getInvertrySearch(refresh_count, fieldName, query, pageNumber, limit, start_date, end_date) {
    const [INVENTRY_SEARCH_LOADING, setLoading] = useState(false)
    const [admin_inventory_query_error, setError] = useState('')
    const [INVENTRY_SEARCH_PRODUCTS, setProducts] = useState([])
    const [admin_inventory_query_hasMore, setHasMore] = useState(false)
    const [INVENTRY_SEARCH_PAGES, setPages] = useState(0)
    const [INVENTRY_SEARCH_TOTAL, setTotal] = useState(0)

    useEffect(() => {
        setProducts([])
        return () => {

        }
    }, [query, start_date, end_date])

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            if (query != '') {
                setLoading(true)
                setError(false)
                let cancle
                axios({
                    method: 'GET',
                    url: urls.GET_REQUEST.INVENTRY_QUERY_SEARCH,
                    params: {
                        field: fieldName, q: query, page: pageNumber, limit: limit,
                        start_date: moment(start_date).format('YYYY-MM-DD'), end_date: moment(end_date).format('YYYY-MM-DD')
                    },
                    cancelToken: new axios.CancelToken(c => cancle = c)
                }).then(res => {
                    if (unmounted) {
                        setLoading(false)
                        setProducts(prevPro => {
                            return [...new Set([...prevPro, ...res.data.data])]
                        })
                        setHasMore(res.data.data.length > 0)
                        setTotal(res.data.total)
                        let count = res.data.total / 20
                        let rounded = Math.floor(count);
                        let decimal = count - rounded;
                        if (decimal > 0) {
                            setPages(rounded + 1)
                        } else {
                            setPages(rounded)
                        }
                    }
                }).catch(err => {
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
    }, [query, pageNumber, , start_date, end_date])

    return {
        INVENTRY_SEARCH_LOADING,
        INVENTRY_SEARCH_PRODUCTS,
        INVENTRY_SEARCH_PAGES,
        INVENTRY_SEARCH_TOTAL,
    }
}