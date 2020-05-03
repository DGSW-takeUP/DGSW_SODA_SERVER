const models = require('../../models');
const validate = require('../../lib/Validate/member');
const colorConsole = require('../../lib/log');

exports.getMyInfo = async (req, res) => {
  const { memberId } = req.decoded;

  try {
    const member = await models.Member.findRegisterMemberId(memberId);

    delete member.pw;
    delete member.auth;
    delete member.consent;
    delete member.certification;

    const result = {
      status: 200,
      message: '내 정보 조회 성공!',
      data: {
        member,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.modifyInfo = async (req, res) => {
  const { memberId } = req.decoded;
  const { body } = req;
  const requestAddress = req.get('host');

  try {
    await validate.validateModifyUser(body);
  } catch (error) {
    const result = {
      status: 400,
      message: '검증 에러!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const member = await models.Member.findRegisterMemberId(memberId);

    if (!member) {
      const result = {
        status: 403,
        message: '가입 된 멤버 없음!',
      };

      res.status(403).json(result);

      return;
    }

    if (body.profileImage !== null) {
      body.profileImage = `https://${requestAddress}/image/${body.profileImage.type}/${body.profileImage.uploadName}.${body.profileImage.type}`;
    }

    await models.Member.update({
      ...body,
    }, {
      where: {
        memberId,
      },
    });

    const result = {
      status: 200,
      message: '멤버 정보 수정 완료!',
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

exports.pwCheck = async (req, res) => {
  const { memberId } = req.decoded;
  const { pw } = req.body;

  if (!pw) {
    const result = {
      status: 400,
      message: '비밀번호를 입력 하세요!',
    };

    res.status(400).json(result);

    return;
  }


  try {
    const member = await models.Member.findMemberByPw(memberId, pw);

    if (!member) {
      const result = {
        status: 403,
        message: '검증 실패!',
      };

      res.status(403).json(result);

      return;
    }

    const result = {
      status: 200,
      message: '비밀번호 검증 성공!',
    };

    res.status(200).json(result);
  } catch (error) {
    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};
