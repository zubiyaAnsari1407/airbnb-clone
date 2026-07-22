// init/seedWithGeocoding.js

// Ye script sample listings ko Mapbox se geocode karke Atlas database mein save karta hai.

// Run karne ka tareeka: node init/seedWithGeocoding.js

if (process.env.NODE_ENV !== "production") {

  require("dotenv").config();

}

const mongoose = require("mongoose");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const Listing = require("../models/listing.js");

const { data: sampleListings } = require("./data.js"); // tumhari existing data.js file

const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const dbUrl = process.env.ATLASDB_URL;

// Tumhara owner user ID

const OWNER_ID = "6a5fbf38a8ea5d15f336e7f7";

// Chhota delay function taaki Mapbox API rate-limit na kare

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {

  await mongoose.connect(dbUrl);

  console.log("Connected to MongoDB (Atlas)");

  // Pehle purani listings clear kar do (agar dobara run karna ho to duplicate na banein)

  await Listing.deleteMany({});

  console.log("Old listings cleared");

  let successCount = 0;

  let failCount = 0;

  for (let i = 0; i < sampleListings.length; i++) {

    const item = sampleListings[i];

    try {

      const query = `${item.location}, ${item.country}`;

      const response = await geocodingClient

        .forwardGeocode({

          query: query,

          limit: 1,

        })

        .send();

      if (!response.body.features.length) {

        console.log(`⚠️  Geocoding failed for: ${query} — skipping geometry`);

        failCount++;

        continue;

      }

      const geometry = response.body.features[0].geometry;

      const newListing = new Listing({

        ...item,

        owner: OWNER_ID,

        geometry: geometry,

      });

      await newListing.save();

      successCount++;

      console.log(`✅ Saved: ${item.title} (${query}) → [${geometry.coordinates}]`);

    } catch (err) {

      failCount++;

      console.log(`❌ Error for "${item.title}":`, err.message);

    }

    // Mapbox free tier rate limit se bachne ke liye chhota delay

    await sleep(300);

  }

  console.log(`\nDone! ✅ ${successCount} saved, ❌ ${failCount} failed.`);

  await mongoose.connection.close();

  process.exit(0);

}

main().catch((err) => {

  console.log("Fatal error:", err);

  process.exit(1);

});