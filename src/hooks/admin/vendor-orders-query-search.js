import { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'

export default function vendorOrdersQuerySearch(token, vendor_id, refresh, status, fieldName, query, pageNumber, limit, start_date, end_date) {
    const [vendor_orders_query_loading, setLoading] = useState(false)
    const [vendor_orders_query_error, setError] = useState('')
    const [vendor_query_orders, setQueryOrders] = useState([])
    const [vendor_orders_query_pages, setPages] = useState('')
    const [vendor_orders_query_total, setTotal] = useState(0)

    useEffect(() => {
        setQueryOrders([])
    }, [fieldName, query, refresh, start_date, end_date])

    // useEffect(() => {
    //     let unmounted = true
    //     const CancelToken = axios.CancelToken;
    //     const source = CancelToken.source();
    //     const getData = () => {
    //         if (query != '') {
    //             setLoading(true)
    //             setError(false)
    //             const _url = MuhalikConfig.PATH + `/api/orders/vendor-getAllOrdersSearch/${vendor_id}`
    //             axios({
    //                 method: 'GET',
    //                 url: _url,
    //                 headers: {
    //                     'authorization': token
    //                 },
    //                 params: {
    //                     status: status, field: fieldName, q: query, page: pageNumber, limit: limit,
    //                     start_date: moment(start_date).format('YYYY-MM-DD'), end_date: moment(end_date).format('YYYY-MM-DD')
    //                 },
    //             }).then(res => {
    //                 if (unmounted) {
    //                     setLoading(false)
    //                     setQueryOrders(prevOrders => {
    //                         return [...new Set([...prevOrders, ...res.data.data])]
    //                     })
    //                     setTotal(res.data.total)
    //                     let count = res.data.total / 20
    //                     let rounded = Math.floor(count);
    //                     let decimal = count - rounded;
    //                     if (decimal > 0) {
    //                         setPages(rounded + 1)
    //                     } else {
    //                         setPages(rounded)
    //                     }
    //                 }
    //             }).catch(err => {
    //                 if (unmounted) {
    //                     setLoading(false)
    //                     if (axios.isCancel(err)) return
    //                     setError(true)
    //                 }
    //             })
    //         }
    //     }
    //     getData()
    //     return () => {
    //         unmounted = false
    //         source.cancel();
    //     };
    // }, [fieldName, query, pageNumber, refresh, start_date, end_date])

    return { vendor_orders_query_loading, vendor_orders_query_error, vendor_query_orders, vendor_orders_query_pages, vendor_orders_query_total }
}