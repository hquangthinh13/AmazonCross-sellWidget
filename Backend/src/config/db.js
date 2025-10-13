import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Database connection failed");
    process.exit(1);
  }
};
