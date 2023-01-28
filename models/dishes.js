const mongoose = require("mongoose");
require('mongoose-currency').loadType(mongoose);
const Schema = mongoose.Schema;
const Currency = mongoose.Types.Currency

const commentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      require: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
  },
  {
    timestamps: true,
  }
);

const dishScheme = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },

    label: {
      type: String,
      default: "",
    },

    price: {
      type: Currency,
      require: true,
      min: 0
    },
    feartured: {
      type: Boolean,
      default: false
    },

    comments: [commentSchema]
  },
  {
    timestamps: true,
  }
);

var Dishes = mongoose.model("Dish", dishScheme);

module.exports = Dishes;
