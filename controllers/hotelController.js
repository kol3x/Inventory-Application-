const Hotel = require("../models/hotel");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.hotel_list = asyncHandler(async (req, res, next) => {
  const allHotels = await Hotel.find()
    .sort({ name: 1 })
    .populate("category")
    .exec();
  res.render("hotel_list", {
    title: "Hotel List",
    hotel_list: allHotels,
  });
});

exports.hotel_detail = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id).populate("category").exec();

  if (hotel === null) {
    const err = new Error("Hotel not found");
    err.status = 404;
    return next(err);
  }
  res.render("hotel_detail", {
    title: hotel.name,
    hotel: hotel,
  });
});

exports.hotel_add_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().exec();

  res.render("hotel_form", {
    title: "Add hotel",
    categories: categories,
  });
});

exports.hotel_add_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("free_rooms", "Free rooms must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const hotel = new Hotel({
      name: req.body.name,
      description: req.body.description,
      free_rooms: req.body.free_rooms,
      price_per_night: req.body.price,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find().exec();

      res.render("hotel_form", {
        title: "Add hotel",
        categories: categories,
        hotel: hotel,
        errors: errors.array(),
      });
    } else {
      await hotel.save();
      res.redirect(hotel.url);
    }
  }),
];

exports.hotel_delete_get = asyncHandler(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);
  res.render("hotel_delete", {
    title: "Delete hotel",
    hotel: hotel,
  });
});

exports.hotel_delete_post = asyncHandler(async (req, res, next) => {
  await Hotel.findByIdAndRemove(req.body.hotelid);
  res.redirect("/inventory/hotels");
});

exports.hotel_update_get = asyncHandler(async (req, res, next) => {
  const [categories, hotel] = await Promise.all([
    Category.find().exec(),
    Hotel.findById(req.params.id).exec(),
  ]);

  res.render("hotel_form", {
    title: "Add hotel",
    hotel: hotel,
    categories: categories,
  });
});

exports.hotel_update_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("free_rooms", "Free rooms must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const hotel = new Hotel({
      name: req.body.name,
      description: req.body.description,
      free_rooms: req.body.free_rooms,
      price_per_night: req.body.price,
      category: req.body.category,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find().exec();

      res.render("hotel_form", {
        title: "Add hotel",
        categories: categories,
        hotel: hotel,
        errors: errors.array(),
      });
    } else {
      const updatedHotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        hotel,
        {}
      );
      res.redirect(updatedHotel.url);
    }
  }),
];
