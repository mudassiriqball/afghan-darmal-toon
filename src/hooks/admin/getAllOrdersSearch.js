import { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import urls from '../../utils/urls/index'

export default function getAllOrdersSearch(token, refresh, status, fieldName, query, pageNumber, limit, start_date, end_date) {
    const [ALL_ORDERS_SEARCH_LOADING, setLoading] = useState(false)
    const [ALL_ORDERS_SEARCH_ERROR, setError] = useState('')
    const [ALL_ORDERS_SEARCH_ORDERS, setQueryOrders] = useState([])
    const [ALL_ORDERS_SEARCH_PAGES, setPages] = useState('')
    const [ALL_ORDERS_SEARCH_TOTAL, setTotal] = useState(0)

    useEffect(() => {
        setQueryOrders([])
    }, [fieldName, query, refresh, start_date, end_date])

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            if (query != null) {
                // setLoading(true)
                // setError(false)
                // axios({
                //     method: 'GET',
                //     url: urls.GET_REQUEST.ALL_ORDERS_SEARCH_BY_STATUS + status,
                //     headers: {
                //         'authorization': token
                //     },
                //     params: {
                //         field: fieldName, q: query, page: pageNumber, limit: limit,
                //         start_date: moment(start_date).format('YYYY-MM-DD'), end_date: moment(end_date).format('YYYY-MM-DD')
                //     },
                // }).then(res => {
                //     if (unmounted) {
                //         setLoading(false)
                //         setQueryOrders(prevPro => {
                //             return [...new Set([...prevPro, ...res.data.data.docs])]
                //         })
                //         setPages(res.data.data.pages)
                //         setTotal(res.data.data.total)
                //     }
                // }).catch(err => {
                //     if (unmounted) {
                //         setLoading(false)
                //         if (axios.isCancel(err)) return
                //         setError(true)
                //     }
                // })
            }
        }
        getData()
        return () => {
            unmounted = false
            source.cancel();
        };
    }, [fieldName, query, pageNumber, refresh, , start_date, end_date])

    return {
        ALL_ORDERS_SEARCH_LOADING,
        ALL_ORDERS_SEARCH_ERROR,
        ALL_ORDERS_SEARCH_ORDERS,
        ALL_ORDERS_SEARCH_PAGES,
        ALL_ORDERS_SEARCH_TOTAL
    }
}