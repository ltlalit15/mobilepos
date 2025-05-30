const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectdb = () => {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log('Database connect successfully.👌🖐')
    }).catch(() => {
        console.log("database connect faild")
    })
}
module.exports = connectdb