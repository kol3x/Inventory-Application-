const express = require("express");
const router = express.Router();

const hotel_controller = require("../controllers/hotelController");
const category_controller = require("../controllers/categoryController");

router.get("/hotels", hotel_controller.hotel_list);

router.get("/hotels/add", hotel_controller.hotel_add_get);

router.post("/hotels/add", hotel_controller.hotel_add_post);

router.get("/hotels/:id", hotel_controller.hotel_detail);

router.get("/categories", category_controller.category_list);

router.get("/categories/add", category_controller.category_add_get);

router.post("/categories/add", category_controller.category_add_post);

router.get("/categories/:id", category_controller.category_detail);

router.get("/hotels/:id/delete", hotel_controller.hotel_delete_get);

router.post("/hotels/:id/delete", hotel_controller.hotel_delete_post);

router.get("/hotels/:id/update", hotel_controller.hotel_update_get);

router.post("/hotels/:id/update", hotel_controller.hotel_update_post);

router.get("/categories/:id/update", category_controller.category_update_get);

router.post("/categories/:id/update", category_controller.category_update_post);

router.get("/categories/:id/delete", category_controller.category_delete_get);

router.post("/categories/:id/delete", category_controller.category_delete_post);

module.exports = router;
