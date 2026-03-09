const express = require("express");
const router = express.Router();
const Crag = require("../models/Crags");
const verifyToken = require("../middleware/authMiddleware");

// GET ROUTE (Public - Anyone can see crags)
router.get("/", async (req, res) => {
  try {
    //const crags = await Crag.find().limit(3);
    const crags = await Crag.find();
    res.json(crags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST ROUTE (protected - only logged in users)
router.post("/", verifyToken, async (req, res) => {
  const crag = new Crag({
    route_name: req.body.route_name,
    parent_sector: req.body.parent_sector,
    type_string: req.body.type_string,
    YDS: req.body.yds,
    Vermin: req.body.vermin,
    parent_loc: req.body.parent_loc,
    description: req.body.description,
  });

  try {
    const newCrag = await crag.save();
    res.status(201).json(newCrag);
    console.log(newCrag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE ROUTE (protected - only logged in users)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Crag.findByIdAndDelete(req.params.id);
    res.json({ message: "Crag deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
