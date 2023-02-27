require("dotenv").config();

const productData = require("./data/products");
const connectDB = require("./config/db");
const { Product } = require("./models/Product");

connectDB();

const importData = async () => {
  try {
    await Product.deleteMany({});

    await Product.insertMany(productData);

    console.log("Data Import Success");
  } catch (error) {
    console.error("Error with data import", error);
  }
};

importData();
