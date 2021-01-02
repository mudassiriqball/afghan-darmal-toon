const express = require("express");
const router = express.Router();
const PaymentsController = require('../controllers/payments.controller');
const checkAuth = require('../middleware/check-auth');

// post Requests
router.post("/add-payment/make-transaction/:_id", checkAuth, PaymentsController.make_transaction);

// get Requests
// router.get("/:_id",UserController.getSingleUser);

// put Requests
// router.put("/:_id", UserController.updateUser);

// delete Requests
// router.delete("/user/:_id", checkAuth, UserController.deleteUser);

module.exports = router;