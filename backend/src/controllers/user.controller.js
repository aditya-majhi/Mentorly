import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { User } from "../models/user.model";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const emailRegEx = /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;

  if ([name, email, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields needs to be there");
  }

  if (!emailRegEx.test(email)) {
    throw new ApiError(400, "Enter a valid Email");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "This account already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering user.Please try Again"
    );
  }

  return res
    .status(200)
    .send(new ApiResponse(200, "Registered Successfully", createdUser));
});

export { registerUser };
