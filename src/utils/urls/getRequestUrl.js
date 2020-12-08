import baseUrl from './baseUrl'


export default {
    VARIFY_MOBILE_NUMBER: baseUrl + '/users/verify/mobile-number',
    ALL_CUSTOMER_COUNT: baseUrl + '/users/users-count',
    ALL_ORDERS_COUNT: baseUrl + '/orders/all-orders-count',
    SLIDERS: baseUrl + '/sliders/sliders',
    CATEGORIES: baseUrl + 'categories/categories',
    HOME_CATEGORIES: baseUrl + '/categories/home-categories',
    USER_BY_ID: baseUrl + '/users/user-by-id',
    USER_PAGE_LIMIT: baseUrl + '/users/',
    USERS_QUERY_SEARCH: baseUrl + '/users/getUsersBySearching/',
    INVENTRY_PAGE_LIMIT: baseUrl + '/products/all-products',
    INVENTRY_QUERY_SEARCH: baseUrl + '/products/admin-products-query-search',
    ALL_ORDERS_PAGE_LIMIT_BY_STATUS: baseUrl + '/orders/all-orders/',
    ALL_ORDERS_SEARCH_BY_STATUS: baseUrl + '/orders/all-getAllOrdersSearch/'
}
