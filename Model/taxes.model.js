const mongoose = require("mongoose");
const taxesSchema = new mongoose.Schema({
    taxClass : {
    type : String,
    require : [true, "tax is required"]
},
taxValue: {
    type :Number,
    require : [true, "tax value is required"]
}
},
{
timestamps : true
}
 
);

const Taxes = new mongoose.model("Taxes", taxesSchema);
module.exports = Taxes;