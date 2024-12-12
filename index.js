//[Dependencies and Modules]
const express = require("express");
const mongoose = require("mongoose");
//allows our backend app to be available to our frontend app
//allows to control the app's CORS settings
const cors = require("cors");

//Routes Middleware
//allows access to routes defined within our app
const movieRoutes = require("./routes/movie");
const userRoutes = require("./routes/user");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const port = 4000;

//MongoDB database
mongoose.connect(
  "mongodb+srv://admin:admin123@wdc028-b461.qifgo.mongodb.net/movieApp-API?retryWrites=true&w=majority&appName=WDC028-B461",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas.")
);

//[Backend Routes]
app.use("/movies", movieRoutes);
app.use("/users", userRoutes);

if (require.main === module) {
  app.listen(process.env.PORT || port, () => {
    console.log(`API is now online on port ${process.env.PORT || port}`);
  });
}

module.exports = { app, mongoose };
