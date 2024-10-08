import { jwt } from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";

const verifyAccessToken = asyncHandler(async (req, _, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized token");
    }

    const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (!user) {
      throw new ApiError(401, "Unauthorized Token");
    }

    const loggedInUser = User.findById(user?._id).select(
      "-password -refreshToken"
    );

    req.user = loggedInUser;
    next();
  } catch (err) {
    throw new ApiError(401, "Unauthorized Token");
  }
});

export { verifyAccessToken };
