import Product from "../models/Product.js";

export async function getProducts(req, res) {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search?.trim() || "";
    const sortOption = req.query.sort || "default";

    const skip = (page - 1) * limit;

    // 🔍 SEARCH FILTER
    let filter = {};
    if (search) {
      const searchRegex = new RegExp(search, "i"); // case-insensitive
      filter = {
        $or: [{ title: { $regex: searchRegex } }],
      };
    }

    // 🔽 SORTING OPTIONS
    let sort = {};
    switch (sortOption) {
      case "price-asc":
        sort = { price: 1 };
        break;
      case "price-desc":
        sort = { price: -1 };
        break;
      case "rating-asc":
        sort = { average_rating: 1 };
        break;
      case "rating-dsc":
      case "rating-desc": // support both keys
        sort = { average_rating: -1 };
        break;
      default:
        sort = { rating_number: -1 }; //
    }

    // 🧮 FETCH PRODUCTS
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      totalProducts,
      currentPage: page,
      totalPages,
      products,
    });
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
