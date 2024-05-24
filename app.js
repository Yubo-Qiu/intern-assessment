require("dotenv").config();
const express = require("express");
const sequelize = require("./database");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const taskRoutes = require("./routes/tasks");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Check DB connection
async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    console.log("Database connection OK!");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error.message);
    process.exit(1);
  }
}

assertDatabaseConnectionOk();

// Render the home page
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/", taskRoutes); // Include task routes

// Synchronize models with the database
sequelize
  .sync({ alter: true, logging: false })
  .then(() => {
    console.log("Database & tables created!");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });
