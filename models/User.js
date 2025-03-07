import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Use "String" instead of "string"
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    cartItems: { type: Array, default: [] }, // Use "Array" instead of "Object"
  },
  { minimize: false } // Optional: Only include if you need to store empty objects
);

// Check for existing model to avoid OverwriteModelError
const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;
