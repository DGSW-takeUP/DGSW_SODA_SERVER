const models = require('../../../models');
const validate = require('../../../lib/Validate/answer');
const colorConsole = require('../../../lib/log');

exports.writeAnswer = async (req, res) => {
  const { body } = req;
  const { memberId, auth } = req.decoded;

  if (auth !== 0) {
    const result = {
      status: 403,
      message: '권한 없음!',
    };

    res.status(403).json(result);

    return;
  }

  try {
    await validate.validateWriteAnswer(body);
  } catch (error) {
    const result = {
      status: 400,
      message: '답변 양식 검증 오류!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const answer = await models.Answer.getByQuestionIdx(body.questionIdx);
    if (answer) {
      const result = {
        status: 403,
        message: '이미 답변이 달린 질문입니다!',
      };

      res.status(403).json(result);

      return;
    }

    await models.Answer.create({
      ...body,
      memberId,
    });

    await models.Question.update({
      isComplate: 1,
    }, {
      where: {
        idx: body.questionIdx,
      },
    });

    const result = {
      status: 200,
      message: '답변 작성 성공!',
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

exports.updateAnswer = async (req, res) => {
  const { body } = req;
  const { memberId, auth } = req.decoded;

  if (auth !== 0) {
    const result = {
      status: 403,
      message: '권한 없음!',
    };

    res.status(403).json(result);

    return;
  }

  const updateData = {
    ...body,
  };

  try {
    await validate.validateAnswerUpdate(updateData);
  } catch (error) {
    const result = {
      status: 400,
      message: '답변 양식 검증 오류!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const answer = await models.Answer.getByIdx(body.idx);

    if (!answer) {
      const result = {
        status: 400,
        message: '존재하지 않는 답변입니다!',
      };

      res.status(400).json(result);

      return;
    }

    await models.Answer.update({
      ...body,
      memberId,
    }, {
      where: {
        idx: body.idx,
      },
    });

    const result = {
      status: 200,
      message: '답변 수정 성공!',
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

exports.deleteAnswer = async (req, res) => {
  const { idx } = req.query;
  const { auth } = req.decoded;

  if (auth !== 0) {
    const result = {
      status: 403,
      message: '권한 없음!',
    };

    res.status(403).json(result);

    return;
  }

  if (!idx) {
    const result = {
      status: 400,
      message: 'idx를 지정하세요!',
    };

    res.status(403).json(result);

    return;
  }

  try {
    const answer = await models.Answer.getByIdx(idx);

    if (!answer) {
      const result = {
        status: 400,
        message: '존재하지 않는 답변입니다!',
      };

      res.status(400).json(result);

      return;
    }

    await models.Answer.destroy({
      where: {
        idx,
      },
    });

    const result = {
      status: 200,
      message: '삭제 성공!',
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
