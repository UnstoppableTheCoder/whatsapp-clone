import createHttpError from "http-errors";
import { createUser, signUser } from "../services/auth.service.js";
import { generateToken, verifyToken } from "../services/token.service.js";
import { findUser } from "../routes/user.service.js";

// Todo: Know more about the flow of accessToken & refreshToken

export const register = async (req, res, next) => {
  try {
    const { name, email, picture, status, password } = req.body;

    const newUser = await createUser({
      name,
      email,
      picture,
      status,
      password,
    });

    const accessToken = await generateToken(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      "1d",
    );

    const refreshToken = await generateToken(
      { userId: newUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      "30d",
    );

    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      path: "/api/v1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days
    });

    console.table({ accessToken, refreshToken });

    return res.json({
      message: "User registered successfully",
      accessToken,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        status: newUser.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await signUser(email, password);

    const accessToken = await generateToken(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      "1d",
    );

    const refreshToken = await generateToken(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      "30d",
    );

    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      path: "/api/v1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days
    });

    console.table({ accessToken, refreshToken });

    return res.json({
      message: "User registered successfully",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/v1/auth/refreshtoken" });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// Returns the accessToken + user
export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshtoken;
    if (!refreshToken) throw createHttpError.Unauthorized("Please login.");

    const check = await verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await findUser(check.userId);

    const accessToken = await generateToken(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      "1d",
    );

    res.json({
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
