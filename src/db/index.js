const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully to DB");
  } catch (error) {
    console.error("Connection failed to DB", error);
    process.exit(1);
  }
};
module.exports = connectDB;