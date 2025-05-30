const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectdb = require('./Config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = require('./app'); 

dotenv.config();
connectdb();


app.use(bodyParser.json()); 
app.use(express.json({ limit: "500mb" })); 
app.use(express.urlencoded({ limit: "500mb", extended: true }));

app.use(cookieParser());
app.use(morgan('dev'));
//app.use(cors({ origin: "*", credentials: true }));
// Proper CORS Setup
app.use(
    cors({
      origin: "*", //Change this to your frontend URL
      credentials: true,
      methods: "GET,POST,PUT, PATCH,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    })
  );

app.get("/", (req, res) => {
    res.send("Welcome to the Pos Backend API! Everything is working properly.");
  
});


app.use(router);

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}..🖐🖐`);
});
