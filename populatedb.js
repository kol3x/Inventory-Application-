#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Hotel = require("./models/hotel");
const Category = require("./models/category");

const hotels = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createHotels();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function hotelCreate(
  index,
  name,
  description,
  price_per_night,
  free_rooms,
  category
) {
  const hotel = new Hotel({
    name: name,
    description: description,
    price_per_night: price_per_night,
    free_rooms: free_rooms,
    category: category,
  });
  await hotel.save();
  hotels[index] = hotel;
  console.log(`Added hotel: ${name}`);
}

async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });

  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function createHotels() {
  console.log("Adding hotels");
  await Promise.all([
    hotelCreate(
      0,
      "The Fantasy Inn",
      "Escape into a world of magic and wonder",
      150,
      10,
      categories[0]
    ),
    hotelCreate(
      1,
      "The Sci-Fi Suite",
      "Experience the future today",
      200,
      20,
      categories[1]
    ),
    hotelCreate(
      2,
      "The Mystery Motel",
      "A thrilling stay full of unexpected surprises",
      250,
      30,
      categories[2]
    ),
    hotelCreate(
      3,
      "The Romance Retreat",
      "Perfect for couples seeking a romantic getaway",
      300,
      40,
      categories[3]
    ),
    hotelCreate(
      4,
      "The Horror Hostel",
      "A chilling, unforgettable experience",
      350,
      50,
      categories[4]
    ),
    hotelCreate(
      5,
      "The Adventure Abode",
      "For those who crave excitement and adventure",
      400,
      60,
      categories[5]
    ),
    hotelCreate(
      6,
      "The Drama Dwelling",
      "Immerse yourself in a world of compelling stories",
      450,
      70,
      categories[6]
    ),
  ]);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Fantasy", "A realm where magic is the norm"),
    categoryCreate(1, "Sci-Fi", "Step into the world of advanced technology"),
    categoryCreate(2, "Mystery", "Unravel the secrets and solve the enigmas"),
    categoryCreate(3, "Romance", "Ignite the flame of love and passion"),
    categoryCreate(4, "Horror", "Dare to face your darkest fears"),
    categoryCreate(
      5,
      "Adventure",
      "Embark on a journey full of thrill and excitement"
    ),
    categoryCreate(
      6,
      "Drama",
      "Experience the highs and lows of intricate narratives"
    ),
  ]);
}
