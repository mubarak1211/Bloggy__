const { ApiError } = require("../utils/ApiError");
const { verifyToken } = require("../utils/token");

const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json(new ApiError(401, "Sign in to continue."));
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    return next();
  } catch (error) {
    return res.status(401).json(new ApiError(401, "Your session is invalid or expired. Please sign in again."));
  }
};

module.exports = { requireAuth };
