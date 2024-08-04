const Folder = require("../model/FolderModel");

const allFolder = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user.id });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: "error in fetching the folder" });
  }
};

const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const existingFolder = await Folder.findOne({
      foldername: name,
      userId: req.user.id,
    });
    if (existingFolder) {
      return res
        .status(400)
        .json({ message: "A folder with this name already exists" });
    }
    const newFolder = new Folder({
      foldername: name,
      userId: req.user.id,
      forms: [],
    });
    const savedFolder = await newFolder.save();
    res.json(savedFolder);
  } catch (error) {
    res.status(500).json({ message: "error in creating the folder" });
  }
};

const deleteFolder = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(`Deleting folder with ID ${id}`);
    const folder = await Folder.findById(id);
    if (!folder) {
      //   console.log(`Folder with ID ${id} not found`);
      return res.status(404).json({ message: "folder not found" });
    }
    // console.log(`Folder found: ${folder.foldername}`);
    if (folder.userId.toString() !== req.user.id) {
      console.log(
        `Unauthorized access: folder userId ${folder.userId} does not match req.user.id ${req.user.id}`
      );
      return res.status(401).json({ message: "unauthorized" });
    }
    await Folder.deleteOne({ _id: id });
    res.json({ message: "folder removed" });
  } catch (error) {
    console.error(`Error deleting folder: ${error}`);
    res.status(500).json({ message: "server error in deleting the folder" });
  }
};
const createForm = async (req, res) => {
  try {
    const { formname } = req.body;
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: "folder not found" });
    }
    if (folder.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "unauthorized" });
    }
    if (folder.forms.some((form) => form.formname === formname)) {
      return res
        .status(400)
        .json({ message: "form with same name already exists" });
    }
    folder.forms.push({ formname, items: [] });
    await folder.save();
    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: "server error in creating the form" });
  }
};
const deleteForm = async (req, res) => {
  try {
    const { id, formId } = req.params;
    const folder = await Folder.findById(id);
    if (!folder) {
      return res.status(404).json({ message: "folder not found" });
    }
    if (folder.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "unauthorized" });
    }

    folder.forms = folder.forms.filter(
      (form) => form._id.toString() !== formId
    );
    await folder.save();
    res.json(folder);
  } catch (error) {
    console.error(`Error deleting form: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({ message: "server error in deleting the form" });
  }
};

module.exports = {
  allFolder,
  createFolder,
  deleteFolder,
  createForm,
  deleteForm,
};