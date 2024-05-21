const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Schema } = require("mongoose");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000;

const productSchema = new Schema({
  imgsrc: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
});
dotenv.config();
const Product = mongoose.model("Product", productSchema);
app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.status(200).send(products);
});
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const products = await Product.findById(id);
  res.status(200).send(products);
});

app.post("/products", (req, res) => {
  const { imgsrc, title, description } = req.body;
  const product = new Product({
    imgsrc,
    title,
    description,
  });
  res.status(201).send(product);
});
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  res.status(200).send(product);
});
app.put("/products/:id", async (req, res) => {
  const { imgsrc, title, description } = req.body;
  const { id } = req.params;
  const findProduct = await Product.findById(id);
  if (!findProduct) {
    res.status(404).json({ message: "Product not found" });
  }
  const product = await Product.findByIdAndUpdate(
    id,
    { imgsrc, title, description },
    { new: true }
  );
  res.status(200).send(product);
});

app.listen(port);
console.log("Server started! At http://localhost:" + port);
const PORT = process.env.PORT;
const DB = process.env.DB_URL;
mongoose.connect(DB).then(() => console.log("connected"));
