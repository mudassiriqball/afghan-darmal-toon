import baseUrl from './baseUrl'

export default {
    // Users
    LOGIN: baseUrl + '/users/auth/login-user',
    SIGNUP: baseUrl + '/users/auth/register/register-user',
    CHANGE_CUSTOMER_STATUS: baseUrl + '/users/customer/status/change-customer-status/',

    // Sliders
    ADD_SLIDER: baseUrl + '/sliders/add-slider',

    // Categories
    ADD_CATEGORY: baseUrl + '/categories/add/new/category-subcategory',
    ADD_HOME_CATEGORY: baseUrl + '/categories/home-category',

    // orders
    PLACE_ORDER: baseUrl + '/orders/place/order/user-order/',
}
