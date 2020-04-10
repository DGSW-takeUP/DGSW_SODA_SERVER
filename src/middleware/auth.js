const lib = require('../lib/token');
const log = require('../lib/log');

const authMiddleware = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  console.log(token);
  if (!token) {
    const result = {
      status: 400,
      message: '토큰을 찾을 수 없습니다',
    };

    res.status(400).json(result);

    console.log('토큰 없음');

    return;
  }

  try {
    const decodeToken = await lib.verifyToken(token);

    if (decodeToken.sub !== 'token') {
      const result = {
        status: 403,
        message: '잘못된 토큰 입니다',
      };

      res.status(403).json(result);
      return;
    }

    req.decoded = decodeToken;
  } catch (error) {
    log.warn(`[auth] 잘못된 토큰 : ${error}`);

    let status = null;
    let message = null;

    switch (error.message) {
      case 'jwt must be provided':
        status = 400;
        message = '토큰이 전송되지 않았습니다';
        break;
      case 'jwt malformed':
      case 'invalid token':
      case 'invalid signature':
        status = 401;
        message = '위조된 토큰입니다';
        break;
      case 'jwt expired':
        status = 410;
        message = '토큰이 만료되었습니다';
        break;
      default:
        console.log(error.message);
        status = 500;
        message = '다시 시도해 주세요';
        break;
    }

    const result = {
      status,
      message,
    };

    res.status(status).json(result);
    return;
  }

  await next();
};

module.exports = authMiddleware;
