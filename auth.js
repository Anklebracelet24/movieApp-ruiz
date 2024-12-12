const jwt = require("jsonwebtoken");

require("dotenv").config(); // Load environment variables from .env file

//[Token Creation]
module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  // Access JWT_SECRET_KEY from environment variables
  const jwtSecret = process.env.JWT_SECRET_KEY;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET_KEY is not set in the environment variables");
  }

  // Create a JWT token using the secret from environment
  return jwt.sign(data, jwtSecret, { expiresIn: "1h" }); // Optional expiry time
};

module.exports.verify = (req, res, next) => {
  console.log(req.headers.authorization);

  let token = req.headers.authorization;

  if (typeof token === "undefined") {
    return res.status(403).send({ auth: "Failed. No Token" });
  } else {
    // Remove 'Bearer ' prefix if it exists
    token = token.slice(7, token.length);

    const jwtSecret = process.env.JWT_SECRET_KEY;

    if (!jwtSecret) {
      return res.status(500).send({
        message: "JWT_SECRET_KEY is missing in environment variables",
      });
    }

    // Verify token using the secret from environment variables
    jwt.verify(token, jwtSecret, function (err, decodedToken) {
      if (err) {
        return res.status(403).send({
          auth: "Failed",
          message: err.message,
        });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  }
};

//Verify Admin
module.exports.verifyAdmin = (req, res, next) => {
  console.log("result from verifyAdmin method");
  console.log(req.user);

  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({
      auth: "Failed",
      message: "Action Forbidden",
    });
  }
};
