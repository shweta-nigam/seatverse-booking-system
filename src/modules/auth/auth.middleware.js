import ApiError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";

export const isLogged = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw ApiError.unauthorized("No token provided");
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      throw ApiError.unauthorized("Invalid or expired token");
    }
    req.user = decoded;

    next();
  } catch (error) {
    // not using ApiError because - it is better not use it here

    res.status(401).json({
      success: false,
      message: error.message || "Unauthorized",
    });
  }
};
