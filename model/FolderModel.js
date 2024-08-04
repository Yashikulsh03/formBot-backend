const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
  formname: { type: String, required: true },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
});
const folderSchema = new mongoose.Schema({
  foldername: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  forms: [FormSchema],
});

const Folder = mongoose.model("Folder", folderSchema);
module.exports = Folder;