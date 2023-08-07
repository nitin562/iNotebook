let url = "mongodb://127.0.0.1:27017/iNotebook"; //this is url for mongodb and localhost nhi user karna, iski jagah 127.0.0.1 use karna vrna error.

const mongoose = require("mongoose"); //import mongoose

const connectToMongo = async () => {
  // to connect to mongodb using url where iNotebook will get created automatically as database
  await mongoose.connect(url); //asynchronous in nature
};
module.exports = { connectionfunc: connectToMongo, sk: "sssh" }; //export the function
