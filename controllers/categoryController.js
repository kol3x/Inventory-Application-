const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const Hotel = require("../models/hotel");
const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("category_list", {
    title: "Category List",
    category_list: allCategories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, hotelsByCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Hotel.find({ category: req.params.id }).exec(),
  ]);

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }
  res.render("category_detail", {
    title: category.name,
    category: category,
    hotels: hotelsByCategory,
  });
});

exports.category_add_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create category" });
});

exports.category_add_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create category",
        category: category,
        errors: errors.array(),
      });
    } else {
      await category.save();
      res.redirect(category.url);
    }
  }),
];

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  res.render("category_form", { title: "Create category", category: category });
});

exports.category_update_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create category",
        category: category,
        errors: errors.array(),
      });
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        {}
      );
      res.redirect(updatedCategory.url);
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  res.render("category_delete", {
    title: "Delete category",
    category: category,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndRemove(req.body.id);
  res.redirect("/inventory/categories");
});
