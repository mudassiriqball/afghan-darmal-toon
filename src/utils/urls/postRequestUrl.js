import baseUrl from './baseUrl'

export default {
    // USERS
    LOGIN: baseUrl + '/users/auth/login-user',
    SIGNUP: baseUrl + '/users/auth/register/register-user',
    CHANGE_CUSTOMER_STATUS: baseUrl + '/users/customer/status/change-customer-status/',
    // PRODUCTS
    NEW_PRODUCT: baseUrl + '/products//add-new/product/',

    // SLIDERS
    ADD_SLIDER: baseUrl + '/sliders/add-new/slider',

    // CATEGORIES
    ADD_CATEGORY: baseUrl + '/categories/add/new/category-subcategory',
    ADD_HOME_CATEGORY: baseUrl + '/categories/home-category',

    // ORDERS
    PLACE_ORDER: baseUrl + '/orders/place/order/user-order/',
}
