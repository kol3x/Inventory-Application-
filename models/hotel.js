const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HotelSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 100 },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  price_per_night: { type: Number },
  free_rooms: { type: Number },
});

HotelSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/inventory/hotels/${this._id}`;
});

// Export model
module.exports = mongoose.model("Hotel", HotelSchema);
