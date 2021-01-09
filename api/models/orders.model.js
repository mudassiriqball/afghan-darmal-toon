const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

const orders = new Schema({
  imageUrl: {
    type: String,
  },
  category: {
    type: String,
  },
  sub_category: {
    type: String,
  },
  entry_date: {
    type: Date,
  },
});

orders.plugin(mongoosePaginate);
module.exports = mongoose.model("Order", orders);
