const mongoose = require("mongoose");

const RepairProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    warrantyType: { type: String },
    warrantyPeriod: { type: String },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },
    description: { type: String },
    problem: { type: String },
    quantity: { type: Number, default: 1 },
    supplier: { type: String },
    upccode: { type: String },
    sku: { type: String },
    // pricing: { type: Number },
    averagejobtime: { type: String },
    status: { type: String, },
    repairprice: { type: Number },
    tax: { type: Number },
    images: { type: String }, // Base64 image stored as string
}, { timestamps: true });


const RepairProduct = mongoose.model("RepairProduct", RepairProductSchema);
module.exports = RepairProduct;
