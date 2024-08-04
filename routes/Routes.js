const express = require("express");
const router = express.Router();
const userRoute = require("../controllers/Controller");
const folderRoute = require("../controllers/Folder");
const itemRoute = require("../controllers/Item");
const { authenticateToken } = require("../middleware/authenticate");

//user route
router.post("/register", userRoute.register);
router.post("/login", userRoute.login);
router.get("/dashboard", authenticateToken, userRoute.dashboard);

//folder and form routes
router.get("/folder", authenticateToken, folderRoute.allFolder);
router.post("/newfolder", authenticateToken, folderRoute.createFolder);
router.delete("/delete/:id", authenticateToken, folderRoute.deleteFolder);
router.post("/:id/createform", authenticateToken, folderRoute.createForm);
router.delete(
  "/:id/deleteform/:formId",
  authenticateToken,
  folderRoute.deleteForm
);

//itemform
router.post("/createformitem", authenticateToken, itemRoute.createform);
router.get("/items/:formId", authenticateToken, itemRoute.getItemsByForm);
router.delete("/deleteitem/:id", authenticateToken, itemRoute.deleteItem);
module.exports = router;