// migrate.js
const { BlogPost } = require("../app"); // Import the model
const mongoose = require("mongoose");

async function up() {
  // Connect to db
  await mongoose.connect();

  // Migration commands
  await mongoose.connection.db.createCollection("blogposts");

  console.log("Migration up complete!");
}

async function down() {
  // Undo migration changes
  await mongoose.connection.db.dropCollection("blogposts");

  console.log("Migration down complete!");
}

module.exports = { up, down };

// Allow running directly
if (require.main === module) {
  const option = process.argv[2]; // get cmd option
  if (option === "up") {
    up();
  } else {
    down();
  }
}
