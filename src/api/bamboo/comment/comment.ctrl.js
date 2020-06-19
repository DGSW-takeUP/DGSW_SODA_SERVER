const models = require('../../../models');
const validate = require('../../../lib/Validate/bamboo');
const colorConsole = require('../../../lib/log');

exports.writeComment = async (req, res) => {
  const { body } = req;
  const { memberId } = req.decoded;

  try {
    await validate.validateBambooComment(body);
  } catch (error) {
    const result = {
      status: 400,
      message: '검증 에러!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const addData = {
      ...body,
      memberId,
    };

    await models.BambooComment.create(addData);

    const result = {
      status: 200,
      message: '댓글 작성 성공!',
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

exports.updateComment = async (req, res) => {
  const { body } = req;
  const { memberId } = req.decoded;

  try {
    await validate.validateBambooCommentUpdate(body);
  } catch (error) {
    const result = {
      status: 400,
      message: '검증 에러!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const comment = await models.BambooComment.findCommentByIdx(body.commentIdx, memberId);

    if (!comment) {
      const result = {
        status: 403,
        message: '권한 없음',
      };

      res.status(403).json(result);

      return;
    }

    await models.BambooComment.update({
      contents: body.contents,
      isUpdate: 1,
    }, {
      where: {
        idx: body.commentIdx,
        memberId,
      },
    });

    const result = {
      status: 200,
      message: '댓글 수정 성공!',
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

exports.getComments = async (req, res) => {
  const { page, bambooIdx } = req.query;
  let { limit } = req.query;

  if (!page || !limit || !bambooIdx) {
    const result = {
      status: 400,
      message: 'page 혹은 limit 혹은 bambooIdx를 지정하지 않았어요!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const requestPage = (page - 1) * limit;
    limit = Number(limit);

    const comments = await models.BambooComment.getComments(bambooIdx, requestPage, limit);

    const result = {
      status: 200,
      message: '댓글 조회 성공!',
      data: {
        comments,
      },
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

exports.deleteComment = async (req, res) => {
  const { commentIdx } = req.query;
  const { auth, memberId } = req.decoded;

  if (!commentIdx) {
    const result = {
      status: 400,
      message: 'commentIdx를 지정하세요!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    if (auth === 0) {
      await models.BambooComment.destroy({
        where: {
          idx: commentIdx,
        },
      });

      const result = {
        status: 200,
        message: '관리자 권한으로 댓글 삭제 성공!',
      };

      res.status(200).json(result);

      return;
    }

    const comment = await models.BambooComment.findCommentByIdx(commentIdx, memberId);

    if (!comment) {
      const result = {
        status: 403,
        message: '권한 없음',
      };

      res.status(403).json(result);

      return;
    }

    await models.BambooComment.destroy({
      where: {
        idx: commentIdx,
        memberId,
      },
    });

    const result = {
      status: 200,
      message: '댓글 삭제 성공!',
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
