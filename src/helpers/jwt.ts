import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt";
const createError = require("http-errors");
// import TokenModel from '../models/Token';


function signAccessToken(payload): Promise<any> {
  return new Promise((resolve, reject) => {
    const secret = jwtConfig.appKey;

    const options = {
      expiresIn: "24h",
      issuer: "lms",
      audience: payload.id,
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(createError.InternalServerError());
        return;
      }
      resolve(token);
    });
  });
}

function signRefreshToken(payload): Promise<any> {
  return new Promise((resolve, reject) => {
    const secret = jwtConfig.refreshTokenKey;

    const options = {
      expiresIn: "1y",
      issuer: "lms",
      audience: payload.id,
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(createError.InternalServerError());
        return;
      }

      // TokenModel.create({ userId: payload.id, value: token })
      //   .then(_tokenObject => {
      //     resolve(token);
      //   })
      //   .catch(err => {
      //     console.log('RefreshTokenStorageError', err);
      //     reject(createError.InternalServerError());
      //   })

    });
  });
}

function verifyAccessToken(req, res, next) {
  if (!req.headers["authorization"]) return next(createError.Unauthorized());
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  jwt.verify(token, jwtConfig.appKey, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
}

function verifyRefreshToken(refreshToken): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, jwtConfig.refreshTokenKey, (err, payload) => {
      if (err) return reject(createError.Unauthorized());
      const userId = payload.aud;
      resolve(payload);
    });
  });
}
function genToken(payload) {
  const secret = jwtConfig.appKey;
  const token = jwt.sign(
    { ... payload, date: Date.now() },
    secret,
    { expiresIn: '90d' }
  );
  return token
}


export {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  genToken
};
