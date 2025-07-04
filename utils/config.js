module.exports.JWT_SECRET = "secretkey123";

const { JWT_SECRET = "super-strong-secret" } = process.env;

module.exports = {
  JWT_SECRET,
};
