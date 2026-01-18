const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
require("./cron.js")

const blogRoutes = require("./routes/blog.routes.js");
const userRouter = require("./routes/user.routes.js");
const hospRoutes = require("./routes/hosp.routes.js");

const rescRoutes = require("./routes/resc.routes.js")
const orderRoutes = require("./routes/order.routes.js");
const productRoutes = require("./routes/product.routes.js");
const petRoutes = require("./routes/pet.routes.js")


const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,               
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


app.use("/blogs", blogRoutes);
app.use("/blogs", blogRoutes);
app.use("/users", userRouter);
app.use("/hospital", hospRoutes);
// app.use("/admin", adminRoutes);
app.use("/order", orderRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/product", productRoutes);
app.use("/resc", rescRoutes);
app.use("/pets",petRoutes);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});



module.exports = app;

