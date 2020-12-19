import { useEffect, useState } from 'react'
import axios from 'axios'
import urls from '../../utils/urls/index'

export default function getDeliveryBoysBySearching(token, refresh, url, pageNumber, limit) {
    const [users_loading, setLoading] = useState(false)
    const [users_error, setError] = useState('')
    const [users, setUsers] = useState([])
    const [users_pages, setPages] = useState(0)
    const [users_total, setTotal] = useState(0)

    useEffect(() => {
        setUsers([])
    }, [refresh])

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            if (token != null) {
                setLoading(true)
                setError(false)
                axios({
                    method: 'GET',
                    url: urls.GET_REQUEST.USER_PAGE_LIMIT + url,
                    headers: {
                        'authorization': token
                    },
                    params: { page: pageNumber, limit: limit },
                    cancelToken: source.token
                }).then(res => {
                    if (unmounted) {
                        setLoading(false)
                        setUsers(prevPro => {
                            return [...new Set([...prevPro, ...res.data.data.docs])]
                        })
                        setPages(res.data.data.pages)
                        setTotal(res.data.data.total)
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
    }, [url, pageNumber, refresh, token])

    return { users_loading, users_error, users, users_pages, users_total }
}