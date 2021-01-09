const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders.controller');

// get Requests
router.get("/single/order/by/id/search/:_id", OrdersController.get_order_by_id);
router.get("/customer/all/orders/count/:_id", OrdersController.get_count_order);
router.get("/admin/all/search/query/page/limit/:_status", OrdersController.get_order_query_search);

// post Requests
router.post("/place/order/id/user-order/:_id", OrdersController.place_order);

// get Requests
router.get("/admin/all/page/limit/orders/:_status", OrdersController.get_admin_orders_page_limit_by_status);
router.get("/customer/page/limit/orders/by-status/:_id", OrdersController.get_customer_orders_page_limit_by_id);

// put Requests
// router.put("/:_id", OrdersController.updateUser);

// delete Requests
// router.delete("/user/:_id", checkAuth, OrdersController.deleteUser);

module.exports = router;