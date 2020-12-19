import { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import urls from '../utils/urls/index'

export default function getUsersBySearch(token, refresh, role, status, fieldName, query, pageNumber, limit, start_date, end_date) {
    const [USERS_SEARCH_LOADING, setLoading] = useState(false)
    const [USERS_SEARCH_ERROR, setError] = useState('')
    const [USERS_SEARCH_USERS, setUsers] = useState([])
    const [USERS_SEARCH_PAGES, setPages] = useState('')
    const [USERS_SEARCH_TOTAL, setTotal] = useState(0)

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
                    url: urls.GET_REQUEST.USERS_SEARCH_BY_STATUS + role,
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

    return {
        USERS_SEARCH_LOADING,
        USERS_SEARCH_ERROR,
        USERS_SEARCH_USERS,
        USERS_SEARCH_PAGES,
        USERS_SEARCH_TOTAL
    }
}