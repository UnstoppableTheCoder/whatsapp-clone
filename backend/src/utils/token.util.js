import jwt from "jsonwebtoken";
import logger from "../configs/logger.config.js";

// We are using a Promise here, because by default jwt sign function is not asynchronous
// - So using Promise - we make asynchronous
// - we will resolve when we get the token or
// - if there's any error, we will reject

export const sign = async (payload, secret, expiresIn) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn: expiresIn }, (error, token) => {
      if (error) {
        logger.error(error);
        reject(error);
      } else {
        resolve(token);
      }
    });
  });
};

export const verify = async (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, payload) => {
      if (error) {
        logger.error(error);
        resolve(null);
      } else {
        resolve(payload);
      }
    });
  });
};
