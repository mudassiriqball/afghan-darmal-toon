import baseUrl from './baseUrl'

export default {
    // Customers
    DISCARD_NEW_CUSTOMER: baseUrl + '/users/discard/new-customer/by-id/',
    DELETE_SLIDER: baseUrl + '/sliders/slider/id/remove/by-id/',

    // Category
    DELETE_HOME_CATEGORY: baseUrl + '/categories/home-category/',

    // Sub Category
    DELETE_SUB_CATEGORY: baseUrl + '/categories/sub-category/',

    // Cart
    DELETE_CART: baseUrl + '/delete-cart/id/delete-cart-by-id/',
}