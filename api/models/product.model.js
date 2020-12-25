const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

const Product = new Schema({
  vendor_id: {
    type: Schema.Types.ObjectId,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
  },
  subCategoryId: {
    type: Schema.Types.ObjectId,
  },
  name: {
    type: String,
  },
  product_weight: {
    type: Number,
  },

  handlingFee: {
    type: Number,
  },

  description: {
    type: String,
  },
  brand: {
    type: String,
  },
  price: {
    type: Number,
  },

  purchaseNote: {
    type: String,
  },
  stock: {
    type: Number,
  },
  warranty: {
    type: String,
  },
  warrantyType: {
    type: String,
  },
  discount: {
    type: String,
  },
  sku: {
    type: String,
  },
  shippingCharges: {
    type: Number,
  },
  imagesUrl: [
    {
      imageurl: {
        type: String,
      },
    },
  ],

  specifications: [
    {
      name: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],

  entry_date: {
    type: Date,
  },

  isdeleted: {
    type: Boolean,
  },
});

Product.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", Product);
