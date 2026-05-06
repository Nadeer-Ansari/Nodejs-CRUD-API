const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  place: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
const Schema = mongoose.Schema;

const BlogPost = new Schema({
  name: String,
  age: Number,
  place: String,
});
const MyModel = mongoose.model("users", BlogPost);
module.exports = MyModel;
