const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const storySchema = new mongoose.Schema({
  market: { type: String, required: true },
  fname: { type: String, required: true },
  repId: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  langChoice: { type: String, required: true },
  category: String,
  storyInput: String,
  media0: String,
  media1: String,
  media2: String,
  media3: String,

  date: Date
});

module.exports = mongoose.model("Story", storySchema);
