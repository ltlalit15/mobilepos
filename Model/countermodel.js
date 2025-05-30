const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  field: { type: String, unique: true }, // Kis field ka counter maintain karna hai
  count: { type: Number, default: 0 }, // Starting value
});

const Counter = mongoose.model("CounterModel", counterSchema);
module.exports = Counter;
