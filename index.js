//[Dependencies and Modules]
const express = require("express");
const mongoose = require("mongoose");
//allows our backend app to be available to our frontend app
//allows to control the app's CORS settings
const cors = require("cors");

//Routes Middleware
//allows access to routes defined within our app
const userRoutes = require("./routes/user");
const movieRoutes = require("./routes/movie");

//[Environment Setup]
//loads variables from env files
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//will allow s to customize CORS options to meet our specific requirements
const corsOptions = {
  origin: [`http://localhost:3000`], //allows request from this origin (client's URL)
  //methods: ['GET','POST'],
  credentials: true, //allow credentials (e.g. authorization headers)
  optionsSuccessStatus: 200, //provides status code to use for successful OPTIONS requests
};
// app.use(cors(corsOptions));
app.use(cors());

const port = 4001;

// [Database Connection]
// Connect to our MongoDB
mongoose.connect(process.env.MONGODB_STRING);
//prompts a message once the connection is 'open' and we are connected successfully to the db
mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas")
);

//[Backend Routes]
app.use("/users", userRoutes);
app.use("/movies", movieRoutes);

if (require.main === module) {
  app.listen(process.env.PORT || port, () => {
    console.log(`API is now online on port ${process.env.PORT || port}`);
  });
}

module.exports = { app, mongoose };
