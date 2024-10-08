const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/product.controller")

router.get("/", controller.index);

router.get("/:slugProduct", controller.detail);

router.get("/:slugCategory", controller.category);


module.exports = router;
