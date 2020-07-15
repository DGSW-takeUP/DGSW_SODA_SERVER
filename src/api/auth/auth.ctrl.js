/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const crypto = require('crypto');
const log = require('../../lib/log');
const models = require('../../models');
const tokenLib = require('../../lib/token');
const validate = require('../../lib/Validate/member');
const emailLib = require('../../lib/email');

const { EMAIL_CODE_SECRET: emailSecret } = process.env;

exports.login = async (req, res) => {
  const { id, pw } = req.body;

  if (!id) {
    const result = {
      status: 400,
      message: 'id를 입력하세요!',
    };

    res.status(400).json(result);

    return;
  }
  if (!pw) {
    const result = {
      status: 400,
      message: 'pw를 입력하세요!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const member = await models.Member.findMemberForLogin(id, pw);

    if (!member) {
      const result = {
        status: 403,
        message: 'id 혹은 pw가 잘못 되었습니다!',
      };

      res.status(403).json(result);

      return;
    }

    const token = await tokenLib.createToken(member.memberId, member.auth);
    const refreshToken = await tokenLib.createRefreshToken(member.memberId, member.auth);

    const result = {
      status: 200,
      message: '로그인 성공!',
      data: {
        token,
        refreshToken,
        member,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    log.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.registerAccount = async (req, res) => {
  const { body } = req;
  const requestAddress = req.get('host');
  if (!body.profileImage) {
    body.profileImage = null;
  }
  try {
    await validate.validateRegisterUser(body);
  } catch (error) {
    log.error(error);

    const result = {
      status: 400,
      message: '회원가입 양식을 확인 해주세요!',
    };

    res.status(400).json(result);

    return;
  }

  if (body.certification === false) {
    const result = {
      status: 403,
      message: '이메일 검증이 필요합니다.',
    };

    res.status(403).json(result);

    return;
  }

  if (body.consent === false) {
    const result = {
      status: 403,
      message: '개인정보 동의를 해주세요!',
    };

    res.status(403).json(result);

    return;
  }

  try {
    const memberId = await models.Member.findRegisterMemberId(body.memberId);

    if (memberId) {
      const result = {
        status: 409,
        message: '이미 회원가입이 된 id입니다!',
      };

      res.status(409).json(result);

      return;
    }

    if (body.profileImage !== null) {
      body.profileImage = `https://${requestAddress}/image/${body.profileImage.type}/${body.profileImage.uploadName}.${body.profileImage.type}`;
    }

    await models.Member.registerMember(body.memberId, body.pw, 1, body.name, body.certification, body.profileImage, body.email, body.consent);

    const result = {
      status: 200,
      message: '회원가입 성공!',
      body,
    };

    res.status(200).json(result);
  } catch (error) {
    log.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.findId = async (req, res) => {
  const { body } = req;

  try {
    await validate.validateUserEmail(body);
  } catch (error) {
    log.error(error);

    const result = {
      status: 400,
      message: '이메일 검증 에러!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const member = await models.Member.findMemberByEmail(body.email);

    if (!member) {
      const result = {
        status: 403,
        message: '해당 이메일로 가입된 데이터가 없습니다!',
      };

      res.status(403).json(result);

      return;
    }

    await emailLib.sendEmailUserId(body.email, member.memberId);

    const result = {
      status: 200,
      message: '사용자 id 정보 이메일 보내기 성공!',
    };

    res.status(200).json(result);
  } catch (error) {
    log.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.findPwSendEmail = async (req, res) => {
  const { email } = req.body;

  try {
    await validate.validateUserEmail(req.body);
  } catch (error) {
    const result = {
      status: 400,
      message: '유효하지 않은 이메일 입니다!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const member = await models.Member.findMemberByEmail(email);

    if (!member) {
      const result = {
        status: 403,
        message: '가입된 데이터가 없음!',
      };

      res.status(403).json(result);
      return;
    }

    const verify = await models.EmailVerify.findeEmailCode(email);
    if (verify) {
      await models.EmailVerify.destroy({
        where: {
          email,
        },
      });
    }

    let emailCode = await emailLib.createEmailCode();
    emailCode = String(emailCode);

    await emailLib.sendEmailCode(email, emailCode);

    await models.EmailVerify.create({
      email,
      code: emailCode,
    });

    const result = {
      status: 200,
      message: '이메일 코드 보내기 성공!',
    };

    res.status(200).json(result);
  } catch (error) {
    log.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.resetPw = async (req, res) => {
  const { memberId, pw } = req.body;

  if (!pw) {
    const result = {
      status: 400,
      message: '비밀번호를 입력하세요!',
    };

    res.status(400).json(result);

    return;
  }
  try {
    await models.Member.update({
      pw,
    }, {
      where: {
        memberId,
      },
    });

    const result = {
      status: 200,
      message: '비밀번호 변경 성공!',
    };

    res.status(200).json(result);
  } catch (error) {
    log.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.sendEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    const result = {
      status: 400,
      message: '이메일을 입력해주세요!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    await validate.validateUserEmail(req.body);
  } catch (error) {
    const result = {
      status: 403,
      message: '유효하지 않은 이메일 입니다!',
    };

    res.status(403).json(result);

    return;
  }

  try {
    const emailData = await models.Member.findMemberByEmail(email);
    if (emailData) {
      const result = {
        status: 400,
        message: '이미 회원가입 처리된 이메일 입니다!',
      };

      res.status(400).json(result);

      return;
    }

    const verify = await models.EmailVerify.findeEmailCode(email);
    if (verify) {
      await models.EmailVerify.destroy({
        where: {
          email,
        },
      });
    }

    let emailCode = await emailLib.createEmailCode();

    try {
      emailCode = String(emailCode);

      await emailLib.sendEmailCode(email, emailCode);
    } catch (error) {
      log.error('이메일 전송 중 에러 발생', error);

      const result = {
        status: 503,
        message: '이메일 전송 중 에러 발생!',
      };

      res.status(503).json(result);

      return;
    }

    await models.EmailVerify.create({
      email,
      code: emailCode,
    });

    const result = {
      status: 200,
      message: '이메일 코드 보내기 성공!',
    };

    res.status(200).json(result);
  } catch (error) {
    log.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    const result = {
      status: 400,
      message: '이메일 혹은 코드를 보내주세요!',
    };

    res.status(400).json(result);
    return;
  }
  try {
    // 코드 복호화
    // emailSecretCode = crypto.createHash('sha256').update(String(emailSecret)).digest('base64').substr(0, 32);
    // const textParts = code.split(':'); // 암호화된 코드로 부터 iv길이 할당 text == 암호
    // const iva = Buffer.from(textParts.shift(), 'hex');// 암호화된 코드로 부터 iv길이 할당 ASCII CODE
    // const encryptedText = Buffer.from(textParts.join(':'), 'hex');// 암호화 된 코드 가져오기 ASCII CODE
    // const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(emailSecretCode), iva); // 복호화
    // let decrypted = decipher.update(encryptedText); // 복호화
    // decrypted = Buffer.concat([decrypted, decipher.final()]); // Buffer 형식 바꾸기

    // const decryptCode = decrypted.toString(); // 복호화 된 암호 코드

    const verify = await models.EmailVerify.verifyCode(email, code);

    if (!verify) {
      const result = {
        status: 403,
        message: '코드 검증 실패!',
      };

      res.status(403).json(result);

      return;
    }

    const result = {
      status: 200,
      message: '검증 성공!!',
    };

    res.status(200).json(result);
  } catch (error) {
    log.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

exports.checkMemberId = async (req, res) => {
  const { memberId } = req.body;

  if (!memberId) {
    const result = {
      status: 400,
      message: 'memberId값을 입력 하세요',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const member = await models.Member.findRegisterMemberId(memberId);

    if (member) {
      const result = {
        status: 400,
        message: '이미 사용중인 memberId!',
      };

      res.status(400).json(result);

      return;
    }

    const result = {
      status: 200,
      message: '사용 가능한 memberId!',
    };

    res.status(200).json(result);
  } catch (error) {
    log.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};
