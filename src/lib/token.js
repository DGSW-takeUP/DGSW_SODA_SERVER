require('dotenv').config();

const jwt = require('jsonwebtoken');

const { JWT_SECRET: secret } = process.env;

// expiresIn format 7 days, 10h, 7d, 3min, 100 => 100ms

// Create Token
exports.createToken = async (memberId, auth) => {
  const payload = {
    memberId, auth,
  };

  const option = { expiresIn: '5 days', issuer: 'dgswbamboo.com', subject: 'token' };

  // eslint-disable-next-line no-useless-catch
  try {
    return jwt.sign(payload, secret, option);
  } catch (error) {
    throw error;
  }
};

// Create Refresh Token
exports.createRefreshToken = async (memberId, auth) => {
  const payload = {
    memberId, auth,
  };
  const option = { expiresIn: '7 days', issuer: 'dgswbamboo.com', subject: 'refreshToken' };

  // eslint-disable-next-line no-useless-catch
  try {
    return jwt.sign(payload, secret, option);
  } catch (error) {
    throw error;
  }
};

// Verify Token
exports.verifyToken = async (token) => {
  try {
    return await jwt.verify(token, secret);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
