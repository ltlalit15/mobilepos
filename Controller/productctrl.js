const Product = require("../Model/productmodel");

const upload = require("../Middileware/Multer")

//create product
const createproduct = async (req, res) => {
  console.log("---------------------------", req.body);
  try {
    const {
      shop_id,
      name, category, price, device, brand, warrantyPeriod,
      description, quantity, status, IMEI, warranty, taxid
    } = req.body;


     // ✅ Check if product name already exists
     const existingProduct = await Product.findOne({ name: name.trim() });
     if (existingProduct) {
       return res.status(409).json({
         success: false,
         message: "Product with this name already exists."
       });
     }

    const images = req.files ? req.files.map(file => file.path) : [];

    
    // Create new product
    const newProduct = new Product({
      shop_id,
      name: name.trim(),
      category,  // Must be a valid ObjectId from frontend if using references
      price,
      //sku,
      device,
      brand,  // Must be a valid ObjectId from frontend if using references
      warrantyPeriod,
      description,
      quantity,
      status,
      IMEI,
      warranty,
      taxid : taxid ==""? null: taxid,
      images
    });

    const data = await newProduct.save();
    console.log(data,"0000000000000000000000000000");

    return res.status(201).json({ message: "Product created successfully", success: true, data });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


//get product
// const getproduct = async (req, res) => {
//   try {
//     const response = await Product.find({}).populate("taxid","taxClass taxValue"); // Populating tax details

//     if (!response || response.length === 0) {
//       return res.status(400).json({ message: "No products found", success: false });
//     }

//     const products = response.map((product) => {
//       let totalRepairCost = product.repairTypes.reduce((sum, item) => sum + (parseFloat(item.partPrice) || 0), 0);
//       let totalAccessoriesCost = product.accessories.reduce((sum, item) => sum + (parseFloat(item.accessoriesPrice) || 0), 0);
//       let totalServiceCost = product.serviceCharges.reduce((sum, item) => sum + (parseFloat(item.serviceprice) || 0), 0);
      
//       let totalPrice = totalRepairCost + totalAccessoriesCost + totalServiceCost;
      
//       // Fetch tax value if available
//       let taxValue = product.taxid ? product.taxid.taxValue : 0;
//       let totalPriceWithTax = totalPrice + (totalPrice * (taxValue / 100));

//       return {
//         ...product._doc, // Spread to include existing product details
//         totalRepairCost,
//         totalAccessoriesCost,
//         totalServiceCost,
//         totalPrice,
//         totalPriceWithTax,
//       };
//     });

//     return res.status(200).json({
//       message: "Products fetched successfully",
//       count: products.length,
//       success: true,
//       data: products,
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };


const getproduct = async (req, res) => {
  try {
    const response = await Product.find({}).populate("taxid", "taxClass taxValue"); // Populating tax details

    if (!response || response.length === 0) {
      return res.status(400).json({ message: "No products found", success: false });
    }

    return res.status(200).json({
      message: "Products fetched successfully",
      count: response.length,
      success: true,
      data: response,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



//get single product
//  const singleproduct =async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Find product by ID and populate tax details
//     const product = await Product.findById(id).populate("taxid","taxClass taxValue");

//     if (!product) {
//       return res.status(404).json({ message: "Product not found", success: false });
//     }

//     let totalRepairCost = product.repairTypes.reduce((sum, item) => sum + (parseFloat(item.partPrice) || 0), 0);
//     let totalAccessoriesCost = product.accessories.reduce((sum, item) => sum + (parseFloat(item.accessoriesPrice) || 0), 0);
//     let totalServiceCost = product.serviceCharges.reduce((sum, item) => sum + (parseFloat(item.serviceprice) || 0), 0);

//     let totalPrice = totalRepairCost + totalAccessoriesCost + totalServiceCost;
    
//     // Fetch tax value if available
//     let taxValue = product.taxid ? product.taxid.taxValue : 0;
//     let totalPriceWithTax = totalPrice + (totalPrice * (taxValue / 100));

//     return res.status(200).json({
//       message: "Product fetched successfully",
//       success: true,
//       data: {
//         ...product._doc, 
//         totalRepairCost,
//         totalAccessoriesCost,
//         totalServiceCost,
//         totalPrice,
        
//         totalPriceWithTax,
//       },
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

const singleproduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find product by ID and populate tax details
    const product = await Product.findById(id).populate("taxid", "taxClass taxValue");

    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      success: true,
      data: product,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


//delete product
const deleteproduct=async(req,res)=>{
  const response= await Product.findByIdAndDelete({_id:req.params.id})
  
    try {
      if(response){
        return res.status(200).json({ message: "product Delete successfully", success:true, data:response });
      }else{
        return res.status(400).json({ message: "error" });
      }
    } catch(error){
      console.log(error)
      return res.status(500).json({ message: "internal server error" });
    }
}

//update product
const UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      shop_id,
      name, category, price, device, brand, warrantyPeriod,
      description, quantity, status, IMEI, warranty
    } = req.body;

    const images = req.files ? req.files.map(file => file.path) : [];

    // // Ensure the fields are parsed correctly
    // const parsedRepairTypes = typeof repairTypes === "string" ? JSON.parse(repairTypes) : repairTypes || [];
    // const parsedAccessories = typeof accessories === "string" ? JSON.parse(accessories) : accessories || [];
    // const parsedServiceCharges = typeof serviceCharges == "string" ? JSON.parse(serviceCharges) : serviceCharges || [];

    // Find and update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        shop_id,
        name,
        category, 
        price,
        //sku,
        device,
        brand,  
        warrantyPeriod,
        description,
        quantity,
        status,
        IMEI,
        warranty,
        images: images.length > 0 ? images : undefined 
      },
      { new: true, runValidators: true } 
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product updated successfully", success: true, data: updatedProduct });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const getProductSalesReport = async (req, res) => {
  try {
      // ✅ Current month ka first aur last date nikalo
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      console.log("Fetching products for date range:", firstDayOfMonth, "to", lastDayOfMonth);

      // ✅ Products fetch karo jo is month me create hue
      const products = await Product.find({
          createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
      });

      // ✅ Agar koi product nahi mila toh error return karo
      if (!products.length) {
          return res.status(404).json({ message: "No products found for this month", success: false });
      }

      // ✅ Response format with shop_id
      const report = products.map(product => ({
          productId: product._id,
          shopId: product.shop_id, // ✅ shop_id added
          name: product.name,
          price: product.price,
          totalQuantity: product.quantity,
          soldQuantity: product.soldQuantity || 0,
          unsoldQuantity: product.quantity - (product.soldQuantity || 0),
      }));

      return res.status(200).json({
          message: "Product sales report fetched successfully",
          success: true,
          report
      });

  } catch (error) {
      console.error("Error fetching product sales report:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


module.exports = { createproduct ,getproduct, singleproduct,deleteproduct, UpdateProduct, getProductSalesReport};
