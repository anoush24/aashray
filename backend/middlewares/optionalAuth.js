const jwt = require("jsonwebtoken");
const {UserModel} = require("../models/user.model.js")
const {HospMod} = require("../models/hospital.model.js")

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    let user =
      (await UserModel.findById(decoded._id).select("-password")) ||
      (await HospMod.findById(decoded._id).select("-password"));

    if (!user) {
      req.user = null
      return next()
    }

    req.user = user;
    req.role = user.role || "unknown";
    next();
  } catch (err) {
    req.user = null
    next()
  }
};

module.exports = {optionalAuth};
