import baseUrl from './baseUrl'
import axios from 'axios'
export default {
    // USERS
    CHANGE_CUSTOMER_STATUS: baseUrl + '/users/status/id/customer-only/',

    DELETE_PRODUCT: baseUrl + '/products/delete-product/',
    UPDATE_Order_STATUS: baseUrl + '/orders/user-order-status/',
    UPDATE_USER_STATUS: baseUrl + '/users/user-status/',
    UPDATE_USER_PROFILE: baseUrl + '/users/profile/id/update-all/',
    REMOVE_ITEM_TO_WISHLIST: baseUrl + '/users/remove/id/wishlist/obj-id/',

    // Slider
    UPDATE_SLIDER: baseUrl + '/sliders/slider/',

    // Category
    UPDATE_CATEGORY: baseUrl + '/categories/category/id/update/by-id/',

    // Sub Category
    UPDATE_SUB_CATEGORY: baseUrl + '/categories/sub-category/update/by-id/',

    // Cart
    CLEAR_CART: baseUrl + '/clear-cart-obj/id/clear-by-id/',

    // Rating Review
    ADD_RATING_REVIEW: baseUrl + '/products/add/review/rating/',
}
