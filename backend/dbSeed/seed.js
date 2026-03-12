/**
 * seed.js
 * location: /dbSeed/seed.js
 * run: node dbSeed/seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const Route = require("../models/Crags"); // your Route schema

const MONGO_URI = process.env.MONGO_URI;

const SYSTEM_USER_ID = "69a8859f33a8b33b4e1bcca7";

const CSV_FILE_PATH = path.join(__dirname, "data_first20.csv");

function parseArray(str) {
  if (!str) return [];
  try {
    return JSON.parse(str.replace(/'/g, '"'));
  } catch {
    return [];
  }
}

function parseRatings(str) {
  if (!str) return [];

  try {
    const cleaned = str.replace(/\(/g, "[").replace(/\)/g, "]");
    const arr = JSON.parse(cleaned.replace(/'/g, '"'));

    return arr.map((r) => ({
      user_hash: r[0],
      rating: Number(r[1]),
    }));
  } catch {
    return [];
  }
}

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to Database.");

    console.log("Clearing existing routes...");
    await Route.deleteMany({});
    console.log("Collection cleared.");

    const routesToInsert = [];

    if (!fs.existsSync(CSV_FILE_PATH)) {
      console.error(`❌ File not found: ${CSV_FILE_PATH}`);
      process.exit(1);
    }

    console.log("Reading CSV...");

    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on("data", (row) => {
        routesToInsert.push({
          owner: SYSTEM_USER_ID,

          route_name: row.route_name,
          parent_sector: row.parent_sector,

          route_ID: Number(row.route_ID),
          sector_ID: Number(row.sector_ID),

          type_string: row.type_string,
          fa: row.fa,

          YDS: row.YDS,
          Vermin: row.Vermin,

          nopm_YDS: row.nopm_YDS,
          nopm_Vermin: row.nopm_Vermin,

          YDS_rank: Number(row.YDS_rank) || null,
          Vermin_rank: Number(row.Vermin_rank) || null,

          safety: row.safety,

          parent_loc: parseArray(row.parent_loc),

          description: parseArray(row.description),

          location: row.location,

          protection: parseArray(row.protection),

          corrected_users_ratings: parseRatings(row.corrected_users_ratings),
        });
      })

      .on("end", async () => {
        try {
          const result = await Route.insertMany(routesToInsert, {
            ordered: false,
          });

          console.log(`✅ Successfully inserted ${result.length} routes.`);
          mongoose.connection.close();
          process.exit(0);
        } catch (err) {
          console.error("❌ Insert failed:", err);
          process.exit(1);
        }
      });
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
}

seedDatabase();
