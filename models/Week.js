const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WeekSchema = new Schema({
    name: String,
    meals: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Meal'
        }
    ]

})


const Week = mongoose.model("Week", WeekSchema);

module.exports = Week;