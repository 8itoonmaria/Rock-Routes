const mongoose = require("mongoose");

const CragSchema = new mongoose.Schema({
  route_name: {
    // e.g., "Monkey Face"
    type: String,
    default: "Unknown Crag",
  },
  parent_sector: {
    // e.g., "Smith Rock - Monkey Face"
    type: String,
  },
  type_string: {
    // e.g., "Sport", "Trad", "Bouldering"
    type: String,
  },
  YDS: {
    // e.g., "5.10a", Yosemite Decimal System grade
    type: String,
  },
  Vermin: {
    //e.g., V-scale grade (used for bouldering)
    type: String,
  },
  parent_loc: {
    // [latitude, longitude]
    type: [Number],
  },
  description: {
    // e.g., "A classic sport route with a steep overhang and great holds."
    type: String,
  },
});

module.exports = mongoose.model("Crag", CragSchema);
