const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL); //connection to MongoDB

const connection = mongoose.connection;

// to check if the connection is successful or not using on().
connection.on("connected", () => {
  console.log("MongoDB is connected");
});

connection.on("error", (error) => {
  console.log("Error in MongoDB connection", error);
});

module.exports = mongoose;
