import mongoose from "mongoose";
const { Schema, Types } = mongoose;

/** Small subdocs */
const ImageSchema = new Schema(
  {
    thumb: { type: String, default: null },
    large: { type: String, default: null },
    variant: { type: String, default: null },
    hi_res: { type: String, default: null },
  },
  { _id: false }
);

const ScoresSchema = new Schema(
  {
    co_purchase: { type: Number, default: 0 },
    same_louvain: { type: Number, default: 0 },
    same_spectral: { type: Number, default: 0 },
    category: { type: Number, default: 0 },
    title: { type: Number, default: 0 },
    node2vec: { type: Number, default: 0 },
    gcn: { type: Number, default: 0 },
  },
  { _id: false }
);

const RelatedEnrichedSchema = new Schema(
  {
    asin: { type: String, required: true },
    title: { type: String, default: null },
    final_score: { type: Number, default: 0 },
    scores: { type: ScoresSchema, default: {} },
    raw_w: { type: Number, default: 0 },
    reasons: { type: [String], default: [] },
    louvain_comm: { type: Number, default: null },
    spectral_comm: { type: Number, default: null },
    category_match: { type: Number, default: 0 },
  },
  { _id: false }
);

/** meta_all details are heterogeneous (strings, nested objects), so use Mixed/Map */
const MetaAllSchema = new Schema(
  {
    main_category: { type: String, default: null },
    title: { type: String, default: null },
    average_rating: { type: Number, default: null },
    rating_number: { type: Number, default: null },
    features: { type: [String], default: [] },
    description: { type: String, default: null },
    price: { type: Number, default: null }, // null in sample; keep numeric when present
    images: { type: [ImageSchema], default: [] },
    videos: { type: [Schema.Types.Mixed], default: [] },
    store: { type: String, default: null },
    categories: { type: [String], default: [] },
    /** `details` contains variable keys (e.g., "Best Sellers Rank" object). Use Mixed or Map. */
    details: { type: Schema.Types.Mixed, default: {} },
    parent_asin: { type: String, default: null },
    bought_together: { type: Schema.Types.Mixed, default: null },
    brand: { type: String, default: "" },
    image_url: { type: String, default: null },
  },
  { _id: false }
);

/** Root schema */
const ProductSchema = new Schema(
  {
    _id: { type: String, required: true }, // e.g., "B00737H0KQ" (ASIN-like key)

    average_rating: { type: Number, default: null },
    brand: { type: String, default: "" },
    categories: { type: [String], default: [] },
    description: { type: String, default: null },
    image_url: { type: String, default: null },

    louvain_comm: { type: Number, default: null },
    spectral_comm: { type: Number, default: null },

    meta_all: { type: MetaAllSchema, default: {} },

    price: { type: Number, default: null }, // null in sample
    rating_number: { type: Number, default: null },

    related_enriched: { type: [RelatedEnrichedSchema], default: [] },

    stats: {
      degree: { type: Number, default: 0 },
      num_related_enriched: { type: Number, default: 0 },
    },

    title: { type: String, required: true },

    // Using a plain Date; Mongoose will parse {"$date": "..."} coming from Mongo dumps.
    updated_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    strict: true,
  }
);

/** Helpful indexes */
ProductSchema.index({ title: "text", brand: "text" });
ProductSchema.index({ "meta_all.categories": 1 });
ProductSchema.index({ categories: 1 });
ProductSchema.index({ louvain_comm: 1, spectral_comm: 1 });
ProductSchema.index({ "related_enriched.asin": 1 });

const Product = mongoose.model("Product", ProductSchema, "productC");

export default Product;
