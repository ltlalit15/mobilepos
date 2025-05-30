  const mongoose = require("mongoose");
  const categorySchema = new mongoose.Schema({
    category_name : {
      type : String,
      require : [true, "p_name is required"]
  },
  p_image : {
      type :String,
  }
  },
  {
  timestamps : true
  }
  
  );

  const Category = new mongoose.model("category", categorySchema);
  module.exports = Category;
