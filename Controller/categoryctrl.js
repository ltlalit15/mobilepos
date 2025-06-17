const Category= require('../Model/categorymodel')
const upload = require("../Middileware/Multer")
const fs = require('fs');
const path = require('path');

//create product
const createcategory = async (req, res) => {

  
  try{
    const { category_name, p_image } = req.body;

    if (!category_name) {
      return res.status(400).json( { message: "Category name is required!"});
    }

   
    const existingCategory = await Category.findOne({ category_name });
    if (existingCategory) {
        return res.status(400).json( { message: "Category already exists!"});
    }

    let imagePath = p_image ? p_image : getDefaultImageBase64();
    
    const data = await Category.create({ 
      category_name, 
        p_image: imagePath 
    });

    if (data) {
      return res.status(200).json({ message: "category created successfully", success: true, data: data, });
    } else {
      return res.status(400).json({ message: "category creation error" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// const createcategory = async (req, res) => {
//   try {
//     const { category_name, p_image } = req.body;

//     if (!category_name) {  // ✅ Fixed condition
//       return res.status(400).json({ message: "Category name is required!" });
//     }

//     const existingCategory = await category.findOne({ category_name });
//     if (existingCategory) {
//       return res.status(400).json({ message: "Category already exists!" });
//     }

//     let imagePath = req.file ? req.file.path : p_image; // ✅ Use either Cloudinary or provided URL

//     const data = await category.create({ 
//       category_name, 
//       p_image: imagePath 
//     });

//     return res.status(200).json({ message: "Category created successfully", success: true, data });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

//get product
 const getcategory = async (req, res) => {
  try {
    // Fetch categories and sort by createdAt in descending order (most recent first)
    const response = await Category.find().sort({ createdAt: 1 });

    if (response.length > 0) {
      return res.status(200).json({
        message: "Categories fetched successfully",
        success: true,
        data: response
      });
    } else {
      return res.status(404).json({
        message: "No categories found",
        success: false
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

//get single product
 const singlecategory = async(req,res)=>{
  const response= await Category.findOne({_id:req.params.id})
  
    try{
      if(response){
        return res.status(200).json({ message: "category fetch successfully", success:true, data:response });
      }else{
        return res.status(400).json({ message: "error" });
      }
    }catch(error){
      console.log(error)
      return res.status(500).json({ message: "internal server error" });
    }
}

//delete product
const deletecategory=async(req,res)=>{
  const response= await Category.findByIdAndDelete({_id:req.params.id})
  
    try {
      if(response){
        return res.status(200).json({ message: "category Delete successfully", success:true, data:response });
      }else{
        return res.status(400).json({ message: "error" });
      }
    } catch(error){
      console.log(error)
      return res.status(500).json({ message: "internal server error" });
    }
}

//update product
const Updatecategory = async (req, res) => {
  const { category_name , p_image } = req.body;
    const { id } = req.params;
   console.log(id)
  if (!id) {
    return res.status(400).json({ message: "category ID is required" });
  }

  try {
    const updateFields = {};
    if (category_name) updateFields.category_name =category_name;
    if (p_image) updateFields.p_image = p_image;

    
    const updateCategory = await Category.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
    );

    if (!updateCategory) {
        throw new ApiError(404, "Category not found");
    }

    if (updateCategory) {
      return res.status(200).json({ message: "category updated successfully", success: true, data:updateCategory });
    } else {
      return res.status(400).json({ message: "Error updating category" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = { createcategory ,getcategory, singlecategory,deletecategory,Updatecategory};
