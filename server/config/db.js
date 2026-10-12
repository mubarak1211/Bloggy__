const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Blog";
  await mongoose.connect(mongoUri);
  console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
  return mongoose.connection;
};

module.exports = connectDB;
