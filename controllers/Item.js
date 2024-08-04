const Item = require("../model/itemModel");
const mongoose = require("mongoose");

const createform = async (req, res) => {
  try {
    const { items, formId } = req.body;

    if (!formId || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({ error: "Invalid formId" });
    }

    const itemsWithFormIdAndNumber = await Promise.all(
      items.map(async (item) => {
        const count = await Item.countDocuments({ formId, type: item.type });
        return {
          ...item,
          formId,
          name: `${item.type} ${count + 1}`,
        };
      })
    );

    const savedItems = await Item.insertMany(itemsWithFormIdAndNumber);

    res.status(200).json({ message: "Items created successfully", savedItems });
  } catch (error) {
    console.error("Error creating items:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getItemsByForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const items = await Item.find({ formId });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createform, getItemsByForm, deleteItem };