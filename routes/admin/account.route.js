const express = require("express");
const router = express.Router();
const multer = require("multer");
const validate = require("../../validates/admin/account.validate")


const uploadCloudinary = require("../../middlewares/admin/uploadCloud.middleware");

const upload = multer();

const controller = require("../../controllers/admin/account.controller")

router.get("/", controller.index); 

router.get("/create", controller.create);

router.post("/create", upload.single('avatar'),
uploadCloudinary.uploadCloud,
validate.createPost ,controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", upload.single('avatar'), uploadCloudinary.uploadCloud, validate.createPost, controller.editPatch);

module.exports = router;
