const models = require('../../../models');
const colorConsole = require('../../../lib/log');

exports.sympathize = async (req, res) => {
  const { memberId } = req.decoded;
  const { empathyType, bambooIdx } = req.body;

  if (!empathyType || !bambooIdx) {
    const result = {
      status: 400,
      message: '요청 오류',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const member = await models.BambooEmpathy.findEmpathyUser(memberId, bambooIdx);
    if (member) {
      await models.BambooEmpathy.cancleEmpathy(bambooIdx, memberId);
    } else {
      await models.BambooEmpathy.sympathizeBamboo(bambooIdx, memberId, empathyType);
    }

    const result = {
      status: 200,
      message: '공감/공감 취소 성공!',
    };

    res.status(200).json(result);
  } catch (error) {
    colorConsole.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};
