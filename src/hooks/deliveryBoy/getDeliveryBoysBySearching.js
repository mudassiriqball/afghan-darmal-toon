import { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import urls from '../../utils/urls'

export default function usersQuerySearch(token, refresh, role, status, fieldName, query, pageNumber, limit, start_date, end_date) {
    const [users_query_loading, setLoading] = useState(false)
    const [users_query_error, setError] = useState('')
    const [query_users, setUsers] = useState([])
    const [users_query_pages, setPages] = useState('')
    const [users_query_total, setTotal] = useState(0)

    useEffect(() => {
        setUsers([])
    }, [fieldName, query, refresh, start_date, end_date])

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            if (query != null) {
                setLoading(true)
                setError(false)
                axios({
                    method: 'GET',
                    url: urls.GET_REQUEST.USERS_QUERY_SEARCH + role,
                    headers: {
                        'authorization': token
                    },
                    params: {
                        status: status, field: fieldName, q: query, page: pageNumber, limit: limit,
                        start_date: moment(start_date).format('YYYY-MM-DD'), end_date: moment(end_date).format('YYYY-MM-DD')
                    },
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
    }, [fieldName, query, pageNumber, refresh, start_date, end_date])

    return { users_query_loading, users_query_error, query_users, users_query_pages, users_query_total }
}