import { useEffect, useState } from 'react';
import axios from 'axios';
import urls from '../utils/urls/index';

export default function getUsersPageLimit(token, refresh, status, pageNumber, limit, role) {
    const [USERS_PAGE_LOADING, setLoading] = useState(false)
    const [USERS_PAGE_ERROR, setError] = useState('')
    const [USERS_PAGE_USERS, setUsers] = useState([])
    const [USERS_PAGE_PAGES, setPages] = useState(0)
    const [USERS_PAGE_TOTAL, setTotal] = useState(0)

    useEffect(() => {
        setUsers([])
    }, [refresh])

    useEffect(() => {
        let unmounted = true;
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        // let _url = '';
        // if (url === null) {
        //     _url = urls.GET_REQUEST.APPROVED_CUSTOMERS;
        // } else if (url == 'approved') {
        //     _url = urls.GET_REQUEST.APPROVED_CUSTOMERS;
        // } else if (url === 'disapproved') {
        //     _url = urls.GET_REQUEST.DIS_APPROVED_CUSTOMERS;
        // } else if (url === 'restricted') {
        //     _url = urls.GET_REQUEST.RESTRICTED_CUSTOMERS;
        // }
        const getData = () => {
            if (token != null) {
                setLoading(true)
                setError(false)
                axios({
                    method: 'GET',
                    url: urls.GET_REQUEST.USERS_BY_STATUS + role,
                    headers: {
                        'authorization': token
                    },
                    params: { page: pageNumber, limit: limit, status: status },
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
    }, [status, pageNumber, refresh, token])

    return {
        USERS_PAGE_LOADING,
        USERS_PAGE_ERROR,
        USERS_PAGE_USERS,
        USERS_PAGE_PAGES,
        USERS_PAGE_TOTAL
    }
}