const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  user_hash: String,
  rating: Number,
});

const RouteSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // points to the User collection
    required: true,
  },

  route_name: {
    type: String,
    required: true,
  },

  parent_sector: String,

  route_ID: {
    type: Number,
    unique: true,
  },

  sector_ID: { type: Number },

  type_string: { type: String },

  fa: { type: String },

  YDS: { type: String },

  Vermin: { type: String },

  nopm_YDS: { type: String },

  nopm_Vermin: { type: String },

  YDS_rank: { type: Number },

  Vermin_rank: { type: Number },

  safety: { type: String },

  parent_loc: {
    type: [Number], // [longitude, latitude]
  },

  description: { type: [String] },

  location: { type: String },

  protection: { type: [String] },

  corrected_users_ratings: [RatingSchema],
});

module.exports = mongoose.model("Crag", RouteSchema);
// const mongoose = require("mongoose");

// const CragSchema = new mongoose.Schema({
//   // new Owner field:
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // points to the User collection
//     required: true,
//   },
//   route_name: {
//     // e.g., "Monkey Face"
//     type: String,
//     default: "Unknown Route Name",
//   },
//   parent_sector: {
//     // e.g., "Smith Rock - Monkey Face"
//     type: String,
//     default: "Unknown Sector",
//   },
//   type_string: {
//     // e.g., "Sport", "Trad", "Bouldering"
//     type: String,
//     default: "Unknown Type",
//   },
//   YDS: {
//     // e.g., "5.10a", Yosemite Decimal System grade
//     type: String,
//     default: "Unknown YDS Grade",
//   },
//   Vermin: {
//     //e.g., V-scale grade (used for bouldering)
//     type: String,
//     default: "Unknown Vermin Grade",
//   },
//   parent_loc: {
//     // [latitude, longitude]
//     type: String,
//     default: "Unknown Location",
//   },
//   description: {
//     // e.g., "A classic sport route with a steep overhang and great holds."
//     type: String,
//     default: "Unknown Description",
//   },
//   location: {
//     // e.g., "A classic sport route with a steep overhang and great holds."
//     type: String,
//     default: "Unknown Description",
//   },
// });

// module.exports = mongoose.model("Crag", CragSchema);
