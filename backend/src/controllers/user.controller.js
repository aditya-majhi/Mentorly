import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { User } from "../models/user.model";
import { jwt } from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary";

//Function to get the access and refresh token
const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: "false" });

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  try {
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
      .json(new ApiResponse(200, "Registered Successfully", createdUser));
  } catch (err) {
    throw new ApiError(500, "Internal Server Error");
  }
});

const logInUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "Email is not registered");
    }

    const isValidPassword = await User.isCorrectPassword(password);

    if (!isValidPassword) {
      throw new ApiError(401, "Wrong Credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?._id
    );

    const loggedInUser = await User.findById(user?._id).select(
      "-password -refreshToken"
    );

    //opions for sending cookies that won't be editable by client side
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "User logged in successfully", {
          user: loggedInUser,
          accessToken,
          refreshToken,
        })
      );
  } catch (err) {
    throw new ApiError(500, "Internal Server Error");
  }
});

const logOutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        refreshToken: null,
        accessToken: null,
      },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, "User logged out successfully", {}));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

const updateRefreshToken = asyncHandler(async (req, res) => {
  try {
    const currRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!currRefreshToken) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(
      currRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    console.log({ decodedToken });

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Unauthorized Request");
    }

    if (currRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Token is not valid");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "Access Token Updated successfully", {
          accessToken,
          user,
        })
      );
  } catch (error) {
    throw new ApiError(401, "Unauthorized Request");
  }
});

const updateUserProfilePicture = asyncHandler(async (req, res) => {
  try {
    const imageUrl = await uploadOnCloudinary(req.file?.path);

    console.log({ ResponseAfterImageUpload: imageUrl });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          profileImg: imageUrl.url,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Profile Picture Updated Successfully", user));
  } catch (error) {}
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const { email, fullName } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          fullName,
          email,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    res
      .status(200)
      .json(new ApiResponse(200, "Profile Updated Successfully", user));
  } catch (error) {}
});

export {
  registerUser,
  logInUser,
  logOutUser,
  updateRefreshToken,
  updateUser,
  updateUserProfilePicture,
};
