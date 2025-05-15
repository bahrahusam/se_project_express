const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/constants");

const auth = (req, res, next) => {
  // Check if the Authorization header is present
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authorization token is missing" });
  }

  // Extract the token from the Bearer scheme
  const token = authorization.replace("Bearer ", "");

  try {
    // Verify the token using the secret key
    const payload = jwt.verify(token, JWT_SECRET);

    // Attach the payload (user data) to the request object
    req.user = payload;

    // Call the next middleware/route handler
    return next();
  } catch (err) {
    // If the token verification fails, return 401
    return res.status(UNAUTHORIZED).send({ message: "Unauthorized" });
  }
};

module.exports = auth;
