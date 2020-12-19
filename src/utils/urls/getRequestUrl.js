import baseUrl from './baseUrl'

export default {
    // USERS
    VARIFY_MOBILE_NUMBER: baseUrl + '/users/auth/verify/mobile-number/',
    // USER_BY_ID: baseUrl + '/users/get-user/id/user-by-id/',
    // APPROVED_CUSTOMERS: baseUrl + '/users/customers/all/approved',
    // DIS_APPROVED_CUSTOMERS: baseUrl + '/users/customers/all/dis-approved',
    // RESTRICTED_CUSTOMERS: baseUrl + '/users/customers/all/restricted',

    USERS_BY_STATUS: baseUrl + '/users/all-users/page/limit/by-status/',
    USERS_SEARCH_BY_STATUS: baseUrl + '/users/all-users/search/by-status/',

    // CATEGORIES
    CATEGORIES: baseUrl + '/categories/get-all/categories-subcategories',

    ALL_CUSTOMER_COUNT: baseUrl + '/users/all/user/count',
    ALL_ORDERS_COUNT: baseUrl + '/orders/all-orders-count',

    // PRODUCTS
    GET_PRODUCT_BY_ID: baseUrl + '/products/product/id/product-by-id/',

    SLIDERS: baseUrl + '/sliders/sliders',
    HOME_CATEGORIES: baseUrl + '/categories/home-categories',
    USER_PAGE_LIMIT: baseUrl + '/users/',
    USERS_QUERY_SEARCH: baseUrl + '/users/getUsersBySearching/',
    INVENTRY_PAGE_LIMIT: baseUrl + '/products/all-products',
    INVENTRY_QUERY_SEARCH: baseUrl + '/products/admin-products-query-search',
    ALL_ORDERS_PAGE_LIMIT_BY_STATUS: baseUrl + '/orders/all-orders/',
    ALL_ORDERS_SEARCH_BY_STATUS: baseUrl + '/orders/all-getAllOrdersSearch/'
}
