const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose)
const Schema = mongoose.Schema;
const Currency = mongoose.Types.Currency


const promotionSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        abbr: {
            type: String,
            required: true
        },
        designation: {
            type: String,
            required: true
        },
        featured: {
            type: Boolean,
            default: false
        }

    }
);
var Promotions = mongoose.model("Promotion", promotionSchema)

module.export = Promotions