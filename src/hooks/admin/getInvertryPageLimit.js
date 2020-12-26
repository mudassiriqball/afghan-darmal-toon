import { useEffect, useState } from 'react'
import axios from 'axios'
import urls from '../../utils/urls/index'

export default function getInvertryPageLimit(refresh_count, pageNumber, limit) {
    const [INVENTRY_PAGE_LIMIT_LOADING, setLoading] = useState('')
    const [admin_inventory_error, setError] = useState('')
    const [INVENTRY_PAGE_LIMIT_PRODUCTS, setProducts] = useState([])
    const [admin_inventory_hasMore, setHasMore] = useState(false)
    const [INVENTRY_PAGE_LIMIT_PAGES, setPages] = useState(0)
    const [INVENTRY_PAGE_LIMIT_TOTALS, setTotal] = useState(0)

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            // setLoading(true)
            // setError(false)
            // let cancle
            // axios({
            //     method: 'GET',
            //     url: urls.GET_REQUEST.INVENTRY_PAGE_LIMIT,
            //     params: { page: pageNumber, limit: limit },
            //     cancelToken: new axios.CancelToken(c => cancle = c)
            // }).then(res => {
            //     if (unmounted) {
            //         setLoading(false)
            //         setProducts(prevProducts => {
            //             return [...new Set([...prevProducts, ...res.data.data])]
            //         })
            //         setHasMore(res.data.data.length > 0)
            //         setTotal(res.data.total)
            //         let count = res.data.total / 20
            //         let rounded = Math.floor(count);
            //         let decimal = count - rounded;
            //         if (decimal > 0) {
            //             setPages(rounded + 1)
            //         } else {
            //             setPages(rounded)
            //         }
            //     }
            // }).catch(err => {
            //     if (unmounted) {
            //         setLoading(false)
            //         if (axios.isCancel(err)) return
            //         setError(true)
            //     }
            // })
        }
        getData()
        return () => {
            unmounted = false
            source.cancel();
        };
    }, [pageNumber, limit])

    return {
        INVENTRY_PAGE_LIMIT_LOADING,
        INVENTRY_PAGE_LIMIT_PRODUCTS,
        INVENTRY_PAGE_LIMIT_PAGES,
        INVENTRY_PAGE_LIMIT_TOTALS,
    }
}