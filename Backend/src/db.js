import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MongoDB = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected!", MongoDB.connection.name);
  } catch (error) {
    console.log("MongoDB error-->", error);
    process.exit(1);
  }
};

export default connectDB;
