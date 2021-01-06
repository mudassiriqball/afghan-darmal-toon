const OrdersController = {};
// const Payment = require("../models/payment.model");
// Stripe
const stripe = require("stripe")("sk_test_51I4uMrHe2QzPDxzG9uiYxeMSyOSo2Q0PK9c1r30ZVt4IVNo5yGmv0873Go5XeLNGmyZMWoyTAd3fuzm3aRhtmWRc00UHyon6a1");
// const uuid = require("uuid/v4");
const { v4: uuidv4 } = require('uuid');
const Orders = require('../models/order.model');
const Product = require('../models/product.model');
var QRCode = require('qrcode');
var JsBarcode = require('jsbarcode');
const mongoose = require("mongoose");

// Post Methods
// OrdersController.make_transaction = async (req, res) => {
//     const body = req.body;
//     var datetime = new Date();
//     console.log('Body:', body);
//     debugger
//     const idempontencyKey = uuidv4();
//     return stripe.customers.create({
//         email: body.token.email,
//         source: body.token.id
//     }).then(customer => {
//         stripe.charges.create({
//             amount: body.price * 100,
//             currency: body.currency,
//             customer: customer.id,
//             receipt_email: body.token.email,
//             description: `Purchase of ${res.params._id}`,
//             shipping: {
//                 name: body.token.card.name,
//                 address: {
//                     country: body.token.card.address_country
//                 }
//             }
//         }, { idempontencyKey });
//     }).then(result => {
//         res.status(200).send(result);
//     }).catch(error => {
//         console.log('error in make ransaction:', error)
//         return res.status(500).send(error);
//     })
// };

// QRCode.toDataURL(req.params._id)
//     .then(url => {
//         console.log('QR Code:', url)
//         res.status(200).send({
//             code: 200,
//             message: "QR Generated SUccessfully",
//             data: url,
//         });
//     })
//     .catch(err => {
//         console.error("Generate QR Code Error:", err)
//         res.status(500).send({
//             code: 500,
//             message: "No Products Found",
//         });
//     })

OrdersController.place_order = async (req, res) => {
    let data = [];
    var found = false;
    var saveorder = false;
    var paymentResult = null;
    try {
        const body = req.body;
        if (!body.products) {
            res.status(500).send({
                code: 500,
                message: "No Products Found",
            });
        }
        for (let index = 0; index < body.products.length; index++) {
            const search = await Product.find(
                { _id: body.products[index].p_id },
                { stock: 1 }
            );
            if (search[0].stock < body.products[index].quantity) {
                found = true;
                let array1 = {
                    index: index,
                    p_id: body.products[index].p_id,
                    quantity: body.products[index].quantity,
                    stock: search[0].stock,
                };
                data.push(array1);
            }
        }
        if (found === true) {
            res.status(201).send({
                code: 201,
                message: "You Have To Change Quantity Of Some Products",
                data: data,
            });
        } else if (found === false) {
            // Payment
            if (body.paymentType === 'online') {
                const idempontencyKey = uuidv4();
                try {
                    stripe.customers.create({
                        email: body.token.email,
                        source: body.token.id
                    }).then(customer => {
                        stripe.charges.create({
                            amount: body.price,
                            currency: body.currency,
                            customer: customer.id,
                            receipt_email: body.token.email,
                            description: `Purchase of ${req.params._id}`,
                        }, { idempontencyKey });
                    }).then(result => {
                        // res.status(200).send(result);
                        console.log('\n\n\npayment successfull:', result);
                        paymentResult = result;
                    }).catch(error => {
                        console.log('\n\n\nerror in make ransaction:', error)
                        // return res.status(500).send(error);
                        return res.status(500).send({
                            code: 500,
                            message: "Error in payment:" + error,
                        });
                    })
                } catch (err) {
                    console.log('\n\n\n Error in make method:', err);
                }
            }
            for (let index = 0; index < body.products.length; index++) {
                const new_stock = await Product.findOneAndUpdate(
                    {
                        _id: body.products[index].p_id,
                    },
                    {
                        $inc: { stock: -body.products[index].quantity },
                    }
                );
                const check = await Product.find(
                    { _id: body.products[index].p_id },
                    { stock: 1 }
                );
                if (check[0].stock === 0) {
                    // TODO Set isDeleted: true instead of deleteing product
                    // Product.findByIdAndDelete(check[0]._id, function (err) {
                    // });
                }
                saveorder = true;
            }
        }
        if (saveorder === true) {
            var datetime = new Date();
            body.entry_date = datetime;
            body.status = "pending";
            body.c_id = req.params._id;
            body.sub_total = body.sub_total;
            const orders = new Orders(body);
            const result = await orders.save();
            res.status(200).send({
                code: 200,
                message: "orders Added Successfully",
                result: paymentResult
            });
        }
    } catch (error) {
        console.log('Place order Error:', error)
        res.status(500).send({
            code: 500,
            message: "Error",
            error: error
        });
    }
}

OrdersController.get_admin_orders_page_limit_by_status = async (req, res) => {
    let orders;
    try {
        orders = await Orders.paginate(
            { status: req.params._status },
            {
                limit: parseInt(req.query.limit),
                page: parseInt(req.query.page),
            }
        );
        res.status(200).send({
            code: 200,
            message: "Successful",
            data: orders,
        });
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: "Error",
            error: error,
        });
    }
}

OrdersController.get_customer_orders_page_limit_by_id = async (req, res) => {
    try {
        const order = await Orders.paginate(
            { c_id: req.params._id, status: req.query.status },
            {
                limit: parseInt(req.query.limit),
                page: parseInt(req.query.page),
            }
        );
        res.status(200).send({
            code: 200,
            message: "Successful",
            data: order,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}

module.exports = OrdersController;