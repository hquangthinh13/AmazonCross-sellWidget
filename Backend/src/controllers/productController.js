import Product from "../models/Product.js";

export async function getProducts(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 20, 1),
      100
    );

    const search = (req.query.search || "").trim();
    const rawSort = (req.query.sort || "default").toLowerCase();
    const hasExplicitSort = rawSort !== "default";

    // build filter
    let filter = {};
    let useTextRelevance = false;

    if (search) {
      filter = { $text: { $search: search } };
      // only use text relevance when NO explicit sort option
      if (!hasExplicitSort) {
        useTextRelevance = true;
      }
    }

    // build sort object
    let sort = {};
    switch (rawSort) {
      case "price-asc":
        sort = { price: 1, rating_number: -1 };
        break;
      case "price-desc":
        sort = { price: -1, rating_number: -1 };
        break;
      case "rating-asc":
        sort = { average_rating: 1, rating_number: -1 };
        break;
      case "rating-dsc":
      case "rating-desc":
        sort = { average_rating: -1, rating_number: -1 };
        break;
      default:
        sort = { rating_number: -1, average_rating: -1 };
        break;
    }

    let query = Product.find(filter);

    if (useTextRelevance) {
      // search with no explicit sort -> sort by relevance
      query = query
        .select({ score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } });
    } else {
      // either no search, or user chose sort -> apply your sort only
      query = query.sort(sort);
    }

    const totalProducts = await Product.countDocuments(filter);
    const products = await query.skip((page - 1) * limit).limit(limit);

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      totalProducts,
      currentPage: page,
      totalPages,
      products,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// export async function getProductById(req, res) {
//   const { id } = req.params;
//   try {
//     const product = await Product.findById(id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.status(200).json(product);
//   } catch (error) {
//     console.error("Error fetching product by ID:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// GET /api/products/:id/related?limit=10
export async function getRelatedProducts(req, res) {
  const { id } = req.params;
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

  try {
    // Only pull what we need
    const product = await Product.findById(id)
      .select({ _id: 1, related_enriched: 1 })
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const rel = Array.isArray(product.related_enriched)
      ? [...product.related_enriched]
      : [];

    if (rel.length === 0) {
      return res.status(200).json({ productId: id, related: [] });
    }

    // Sort by model-provided relevance score, then trim to limit
    rel.sort((a, b) => (b.final_score ?? 0) - (a.final_score ?? 0));
    const topRel = rel.slice(0, limit);

    // Unique list of ASINs to fetch
    const asins = [...new Set(topRel.map((r) => r.asin))];

    // Fetch related product docs in one go (lean + projection for speed)
    const relatedProducts = await Product.find(
      { _id: { $in: asins } },
      {
        _id: 1,
        title: 1,
        image_url: 1,
        price: 1,
        average_rating: 1,
        rating_number: 1,
        categories: 1,
        meta_all: 1,
      }
    ).lean();

    // Map for O(1) joins
    const byId = new Map(relatedProducts.map((p) => [String(p._id), p]));

    // Merge relationship metadata with product fields (with sensible fallbacks)
    const related = topRel.map((r) => {
      const p = byId.get(String(r.asin));
      return {
        asin: r.asin,
        // prefer live product fields, fall back to relationship snapshot
        title: p?.title ?? r.title ?? null,
        // image_url: p?.image_url ?? p?.meta_all?.image_url ?? null,
        // price: p?.price ?? p?.meta_all?.price ?? null,
        // average_rating:
        //   p?.average_rating ?? p?.meta_all?.average_rating ?? null,
        // rating_number: p?.rating_number ?? p?.meta_all?.rating_number ?? null,
        categories: p?.categories ?? null,
        meta_all: p?.meta_all ?? null,
        // relationship signals
        raw_w: r.raw_w ?? 0,
        final_score: r.final_score ?? null,
        scores: r.scores ?? null,
        reasons: r.reasons ?? [],
        louvain_comm: r.louvain_comm ?? null,
        spectral_comm: r.spectral_comm ?? null,
        category_match: r.category_match ?? null,
      };
    });

    res.status(200).json({ productId: id, related });
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// Example route:
// GET /products/:id/related/signals?limit=10
export async function getRelatedProductsBySignals(req, res) {
  const { id } = req.params;
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

  try {
    const product = await Product.findById(id)
      .select({ _id: 1, related_enriched: 1 })
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const rel = Array.isArray(product.related_enriched)
      ? [...product.related_enriched]
      : [];

    if (rel.length === 0) {
      return res.status(200).json({
        productId: id,
        spectral: [],
        louvain: [],
        category: [],
        gcn: [],
        node2vec: [],
        title: [],
      });
    }

    // --- Helpers -------------------------------------------------------------

    const byScoreDesc = (key) => (a, b) =>
      (b?.scores?.[key] ?? 0) - (a?.scores?.[key] ?? 0);

    // Build list of relationships for each group
    const spectralRel = rel
      .filter((r) => r?.scores?.same_spectral === 1)
      .sort(byScoreDesc("same_spectral"))
      .slice(0, limit);

    const louvainRel = rel
      .filter((r) => r?.scores?.same_louvain === 1)
      .sort(byScoreDesc("same_louvain"))
      .slice(0, limit);

    const categoryRel = rel
      .filter((r) => r?.scores?.category === 1)
      .sort(byScoreDesc("category"))
      .slice(0, limit);

    const gcnRel = rel
      .filter((r) => (r?.scores?.gcn ?? 0) >= 0.5)
      .sort(byScoreDesc("gcn"))
      .slice(0, limit);

    const node2vecRel = rel
      .filter((r) => (r?.scores?.node2vec ?? 0) >= 0.5)
      .sort(byScoreDesc("node2vec"))
      .slice(0, limit);

    const titleRel = rel
      .filter((r) => (r?.scores?.title ?? 0) >= 0.5)
      .sort(byScoreDesc("title"))
      .slice(0, limit);

    // Collect unique ASINs across all groups so we can fetch product docs once
    const allRels = [
      ...spectralRel,
      ...louvainRel,
      ...categoryRel,
      ...gcnRel,
      ...node2vecRel,
      ...titleRel,
    ];

    const asins = [...new Set(allRels.map((r) => r.asin))];

    if (asins.length === 0) {
      return res.status(200).json({
        productId: id,
        spectral: [],
        louvain: [],
        category: [],
        gcn: [],
        node2vec: [],
        title: [],
      });
    }

    const relatedProducts = await Product.find(
      { _id: { $in: asins } },
      {
        _id: 1,
        title: 1,
        image_url: 1,
        price: 1,
        average_rating: 1,
        rating_number: 1,
        categories: 1,
        meta_all: 1,
      }
    ).lean();

    const byId = new Map(relatedProducts.map((p) => [String(p._id), p]));

    // Helper to merge relationship metadata with product fields
    const mergeRel = (relArray) =>
      relArray.map((r) => {
        const p = byId.get(String(r.asin));
        return {
          asin: r.asin,
          title: p?.title ?? r.title ?? null,
          categories: p?.categories ?? null,
          meta_all: p?.meta_all ?? null,
          raw_w: r.raw_w ?? 0,
          final_score: r.final_score ?? null,
          scores: r.scores ?? null,
          reasons: r.reasons ?? [],
          louvain_comm: r.louvain_comm ?? null,
          spectral_comm: r.spectral_comm ?? null,
          category_match: r.category_match ?? null,
        };
      });

    const response = {
      productId: id,
      spectral: mergeRel(spectralRel), // a. same_spectral = 1
      louvain: mergeRel(louvainRel), // b. same_louvain = 1
      category: mergeRel(categoryRel), // c. category = 1
      gcn: mergeRel(gcnRel), // d. gcn >= 0.5, desc
      node2vec: mergeRel(node2vecRel), // e. node2vec >= 0.5, desc
      title: mergeRel(titleRel), // f. title >= 0.5, desc
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching related products by signals:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/products/:id
export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    // Find by the document's string _id (ASIN)
    const product = await Product.findById(id).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Optionally: populate related data or limit nested arrays
    // Example: return only top 5 related_enriched items
    if (Array.isArray(product.related_enriched)) {
      product.related_enriched = product.related_enriched.slice(0, 5);
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
