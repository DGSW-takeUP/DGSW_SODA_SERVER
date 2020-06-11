const models = require('../../models');
const lib = require('../../lib/token');

exports.tokenRefresh = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const refresh = await lib.verifyToken(refreshToken);
    const { memberId, sub, iss } = refresh;


    if (sub !== 'refreshToken' || iss !== 'dgswbamboo.com') {
      const result = {
        status: 403,
        message: '접근 할 수 없는 토큰입니다!',
      };

      res.status(403).json(result);

      return;
    }

    const member = await models.Member.findRegisterMemberId(memberId);

    if (!member) {
      const result = {
        status: 404,
        message: '없는 회원 입니다!',
      };

      res.status(404).json(result);

      return;
    }

    const token = await lib.createToken(member.memberId, member.auth);

    const result = {
      status: 200,
      message: '토큰 발급 완료!',
      data: {
        token,
      },
    };

    res.status(200).json(result);
  } catch (error) {
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
  }
};
