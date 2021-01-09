const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const orderController = require('../controllers/orders.controller');

// post Requests
router.post("/add-new/slider", orderController.add_slider);

// get Requests
router.get("/single/order/by/id/search/:_id", orderController.get_order_by_id);
router.get("/customer/all/orders/count/:_id", orderController.get_count_order);
router.get("/admin/all/search/query/page/limit/:_status", orderController.get_order_query_search);

// put Requests
router.put("/slider/:_id", checkAuth, orderController.update_slider);

// delete Requests
router.delete("/slider/id/remove/by-id/:_id", orderController.delete_slider);

module.exports = router;