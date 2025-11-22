import Product from "../models/Product.js";

// ==========================================
// FULL SEARCH (paginated, sorted)
// GET /search?q=ssd&page=1&sort=rating-dsc
// ==========================================
export const searchProducts = async (req, res) => {
  try {
    const { q = "", page = 1, limit = 20, sort = "Default" } = req.query;

    // Sorting logic (matches your backend)
    let sortOption = {};
    switch (sort) {
      case "price-asc":
        sortOption = { price: 1, rating_number: -1 };
        break;
      case "price-desc":
        sortOption = { price: -1, rating_number: -1 };
        break;
      case "rating-asc":
        sortOption = { average_rating: 1, rating_number: -1 };
        break;
      case "rating-dsc":
      case "rating-desc":
        sortOption = { average_rating: -1, rating_number: -1 };
        break;
      default:
        sortOption = { rating_number: -1, average_rating: -1 };
        break;
    }

    // Main search query
    let query = {};
    if (q) {
      query = {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { title: { $regex: q, $options: "i" } },
        ],
      };
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      products,
      page: Number(page),
      totalPages,
      total,
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
};

// ==========================================
// SUGGESTIONS
// GET /search/suggestions?q=ssd
// Return lightweight list of strings
// ==========================================
export const searchSuggestions = async (req, res) => {
  try {
    const { q = "" } = req.query;

    if (!q || q.trim().length < 2) return res.json({ suggestions: [] });

    const products = await Product.find(
      {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { title: { $regex: q, $options: "i" } },
        ],
      },
      { name: 1, title: 1 } // lightweight fields only
    ).limit(8);

    const suggestions = [
      ...new Set(products.map((p) => p.name || p.title).filter(Boolean)),
    ];

    res.json({ suggestions });
  } catch (err) {
    console.error("Suggestion error:", err);
    res.status(500).json({ error: "Suggestion failed" });
  }
};
