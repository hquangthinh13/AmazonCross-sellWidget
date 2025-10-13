import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    thumb: { type: String },
    large: { type: String },
    variant: { type: String },
    hi_res: { type: String }, // null values are fine
  },
  { _id: false }
); // disable automatic _id for subdocs if not needed

const productSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // ASIN as the primary key - parent asin
  title: { type: String, required: true },
  average_rating: { type: Number, required: true },
  rating_number: { type: Number, required: true },
  features: { type: [String], required: true },
  description: { type: [String], required: true },
  price: { type: Number, required: true },
  images: { type: [ImageSchema], required: true },
  categories: { type: [String], required: true },
  related: { type: [String], ref: "Product" }, // Array of ASINs referencing other products
});

const Product = mongoose.model("Product", productSchema);

export default Product;
