const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  name: String,
  data: Buffer,
  contentType: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", fileSchema);
