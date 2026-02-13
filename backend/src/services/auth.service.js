import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import validator from "validator";
import { UserModel } from "../models/index.js";

// Env Variables
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;

export const createUser = async (userData) => {
  const { name, email, picture, status, password } = userData;

  if (!name || !email || !password) {
    throw createHttpError.BadRequest("Please fill all the fields.");
  }

  // Check name length
  if (
    !validator.isLength(name, {
      min: 2,
      max: 16,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please make sure, your name is between 2 and 16 characters.",
    );
  }

  // Check status length
  if (status && status.length > 64) {
    throw createHttpError.BadRequest(
      "Please make sure, your status is less than 64 characters.",
    );
  }

  // Check if email address is valid
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest(
      "Please make sure to provide a valid email address",
    );
  }

  // Check if user already exists
  const checkDb = await UserModel.findOne({ email });
  if (checkDb) {
    throw createHttpError.Conflict(
      "Please try again with a different email address. This email already exists",
    );
  }

  // Check password length
  if (
    !validator.isLength(password, {
      min: 6,
      max: 128,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please make sure, your password is between 6 and 128 characters",
    );
  }

  // Hash Password -> Password is hashed automatically using Middleware in the UserModel

  // Save user to db
  const user = await new UserModel({
    name,
    email,
    picture: picture || DEFAULT_PICTURE,
    status: status || DEFAULT_STATUS,
    password, // This will be automatically hashed in the UserModel
  }).save();

  return user;
};

export const signUser = async (email, password) => {
  // Check if user exists
  const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
  if (!user) throw createHttpError.NotFound("Invalid credentials");

  // Compare password
  let passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) throw createHttpError.NotFound("Invalid credentials");

  return user;
};
