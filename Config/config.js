const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'product_images',
    format: async (req, file) => 'png', 
    public_id: (req, file) => file.originalname,
  },
});


// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: file.fieldname === 'p_image' ? 'product_images' : 'category_images', // Added category_images
//       format: async (req, file) => {
//         const allowedFormats = ['png', 'jpg', 'jpeg'];
//         const fileFormat = file.mimetype.split('/')[1]; // Extracting file extension from mimetype
//         return allowedFormats.includes(fileFormat) ? fileFormat : 'png'; // Default to 'png' if invalid
//       },
//       public_id: (req, file) => file.originalname,
//     };
//   },
// });


module.exports = { cloudinary, storage };
