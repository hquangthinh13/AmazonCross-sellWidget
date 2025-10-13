import Product from "../models/Product.js";

export async function getProducts(req, res) {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createProduct(req, res) {
  const {
    _id,
    title,
    average_rating,
    rating_number,
    features,
    description,
    price,
    images,
    categories,
    related,
  } = req.body;

  try {
    const newProduct = new Product({
      _id,
      title,
      average_rating,
      rating_number,
      features,
      description,
      price,
      images,
      categories,
      related,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
