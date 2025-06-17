const brand= require('../Model/brandmodel')
const upload = require("../Middileware/Multer")

//create product
const createbrand = async (req, res) => {
  const { brand_name, categoryId } = req.body;

  // Validate input
  if (!brand_name || !categoryId) {
    return res.status(400).json({ message: "Both 'brand_name' and 'categoryId' are required" });
  }

  try {
    // Create a new brand instance
    const newBrand = new brand({
      brand_name,
      category: categoryId,
    });

    // Save the new brand object
    const data = await newBrand.save();  // Save the instance, not the model

    if (data) {
      return res.status(201).json({ message: "Brand created successfully", success: true, data });
    } else {
      return res.status(400).json({ message: "Brand creation failed" });
    }
  } catch (error) {
    console.error("Error while creating brand:", error);
    
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



//get product
 const getbrand= async(req,res)=>{
  const response= await brand.find({}).populate('category', 'category_name').sort({ createdAt: 1 });
    try{
      if(response){
        return res.status(200).json({ message: "brand fetch successfully",success:true, data:response });
      }else{
        return res.status(400).json({ message: "error" });
      }
    }catch(error){
      console.log(error)
      return res.status(500).json({ message: "internal server error" });
    }
}


//get single product
 const singlebrand = async(req,res)=>{
  const response= await brand.findOne({_id:req.params.sid}).populate('category', 'category_name')
  // console.log(response)
    try{
      if(response){
        return res.status(200).json({ message: "brand fetch successfully", success:true, data:response });
      }else{
        return res.status(400).json({ message: "error" });
      }
    }catch(error){
      console.log(error)
      return res.status(500).json({ message: "internal server error" });
    }
}

//delete product
const deletebrand=async(req,res)=>{
  const response= await brand.findByIdAndDelete({_id:req.params.id})
  // console.log(response)
    try {
      if(response){
        return res.status(200).json({ message: "brand Delete successfully", success:true, data:response });
      }else{
        return res.status(400).json({ message: "error" });
      }
    } catch(error){
      console.log(error)
      return res.status(500).json({ message: "internal server error" });
    }
}

//update product
const Updatebrand = async (req, res) => {
  const { id } = req.params;
  const { brand_name, categoryId } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Brand ID is required" });
  }

  // Create an update object dynamically
  const updateFields = {};
  if (brand_name) updateFields.brand_name = brand_name;
  if (categoryId) updateFields.category = categoryId;

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "No valid fields provided for update" });
  }

  try {
    const updatedBrand = await brand.findByIdAndUpdate(
      id,
      { $set: updateFields }, // Dynamically update fields
      { new: true, runValidators: true }
    );

    if (updatedBrand) {
      return res.status(200).json({ message: "Brand updated successfully", success: true, data: updatedBrand });
    } else {
      return res.status(404).json({ message: "Brand not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { createbrand ,getbrand, singlebrand, deletebrand,Updatebrand};
