const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose)
const Schema = mongoose.Schema;
const Currency = mongoose.Types.Currency

const leaderSchema = new Schema(
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
        label: {
            type: String,
            default: "New"
        },
        price: {
            type: Currency,
            require: true,
            min: 0
        },
        description: {
            type: String,
            required: true
        },
        featured: {
            type: Boolean,
            default: false
        }

    }
);
var Leaders = mongoose.model("Leader", leaderSchema)

module.export = Leaders