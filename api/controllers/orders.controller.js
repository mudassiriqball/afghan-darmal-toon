const sliderController = {};
const Order = require("../models/orders.model");


// Post Methods
sliderController.add_slider = async (req, res) => {

  const body = req.body;
  var datetime = new Date();
  try {
    body.entry_date = datetime;
    const slider = new Slider(body);
    const result = await slider.save();
    res.status(200).send({
      code: 200,
      message: "Slider Added Successfully",
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Post Methods
sliderController.get_order_by_id = async (req, res) => {
  let order;
  try {
    order = await Order.find({});
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: order,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};


sliderController.get_order_query_search = async (req, res) => {
    let order;
    const field = req.query.field;
    const search = {};
    search[field] = req.query.q;
    search["status"] = req.params._status;
    try {
      order = await Order.paginate(search,{
        limit: parseInt(req.query.limit),
        page: parseInt(req.query.page),
      });
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: order,
      });
    } catch (error) {
      console.log("error", error);
      return res.status(500).send(error);
    }
  };


sliderController.get_count_order = async (req, res) => {
    let order;
    try {
      order = await Order.find({});
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: order,
      });
    } catch (error) {
      console.log("error", error);
      return res.status(500).send(error);
    }
  };


// Put Methods
sliderController.update_slider = async (req, res) => {
  const _id = req.params._id;

  const slider = await Slider.findOne({ _id: _id });
  const token = slider.url;
  const filenameToRemove = token.split("/").slice(-1)[0];

  const body = req.body;

  if (!_id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  } else {
    try {
      s3.deleteObject(
        {
          Bucket: "slider-images",
          Key: filenameToRemove,
        },
        function (err, data) {}
      );

      var url = req.files[0].location;
      Slider.findOneAndUpdate(
        { _id: _id },
        {
          $set: { url: url },
        },
        {
          returnNewDocument: true,
        },
        function (error, result) {
          res.status(200).send({
            code: 200,
            message: "Slider Updated Successfully",
          });
        }
      );
    } catch (error) {
      console.log("error", error);
      return res.status(500).send(error);
    }
  }
};

// Delete Methods
sliderController.delete_slider = async (req, res) => {
  const _id = req.params._id;

  if (!_id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  } else {
    Slider.findByIdAndDelete(_id, function (err) {
      res.status(200).send({
        code: 200,
        message: "deleted Successful",
      });
    });
  }
};

module.exports = sliderController;