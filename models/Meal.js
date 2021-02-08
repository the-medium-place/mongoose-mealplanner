const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MealSchema = new Schema({
    name: String,
    servings: Number,
    isTasty: Boolean,
    isHotDog: Boolean,
    spicyLevel: Number


})


const Meal = mongoose.model("Meal", MealSchema);

module.exports = Meal;