const mongoose = require("mongoose");

const CragSchema = new mongoose.Schema({
  route_name: {
    // e.g., "Monkey Face"
    type: String,
    default: "Unknown Route Name",
  },
  parent_sector: {
    // e.g., "Smith Rock - Monkey Face"
    type: String,
    default: "Unknown Sector",
  },
  type_string: {
    // e.g., "Sport", "Trad", "Bouldering"
    type: String,
    default: "Unknown Type",
  },
  YDS: {
    // e.g., "5.10a", Yosemite Decimal System grade
    type: String,
    default: "Unknown YDS Grade",
  },
  Vermin: {
    //e.g., V-scale grade (used for bouldering)
    type: String,
    default: "Unknown Vermin Grade",
  },
  parent_loc: {
    // [latitude, longitude]
    type: String,
    default: "Unknown Location",
  },
  description: {
    // e.g., "A classic sport route with a steep overhang and great holds."
    type: String,
    default: "Unknown Description",
  },
});

module.exports = mongoose.model("Crag", CragSchema);
