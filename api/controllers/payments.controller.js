const PaymentsController = {};
// const Payment = require("../models/payment.model");
// Stripe
const stripe = require("stripe")("sk_test_51I4uMrHe2QzPDxzG9uiYxeMSyOSo2Q0PK9c1r30ZVt4IVNo5yGmv0873Go5XeLNGmyZMWoyTAd3fuzm3aRhtmWRc00UHyon6a1");
// const uuid = require("uuid/v4");
const { v4: uuidv4 } = require('uuid');

// Post Methods
PaymentsController.make_transaction = async (req, res) => {
    const body = req.body;
    var datetime = new Date();
    console.log('Body:', body);

    const idempontencyKey = uuidv4();
    return stripe.customers.create({
        email: body.token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: body.price * 100,
            currency: body.currency,
            customer: customer.id,
            receipt_email: token.email,
            description: `Purchase of ${res.params._id}`,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        }, { idempontencyKey });
    }).then(result => {
        res.status(200).send(result);
    }).catch(error => {
        console.log('error in make ransaction:', error)
        return res.status(500).send(error);
    })
};

// Post Methods


// Delete Methods

module.exports = PaymentsController;