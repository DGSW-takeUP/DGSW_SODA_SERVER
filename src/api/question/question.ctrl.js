const models = require('../../models');
const validate = require('../../lib/Validate/question');
const file = require('../../lib/file');
const colorConsole = require('../../lib/log');
const { asyncForeach } = require('../../lib/method');

// 문의 작성
exports.writeQuestion = async (req, res) => {
  const { body } = req;
  const { memberId } = req.decoded;

  try {
    await validate.validateWriteQuestion(body);
  } catch (error) {
    const result = {
      status: 400,
      message: '작성 양식 오류!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const addData = {
      ...body,
    };

    if (addData.picture !== null && Array.isArray(addData.picture)) {
      const { picture } = addData;

      // 파일 검증
      try {
        await validate.validateQuestionFile(body.picture[0]);
      } catch (error) {
        const result = {
          status: 400,
          message: '파일 양식 오류!',
        };

        res.status(400).json(result);

        return;
      }

      // 게시물 저장 이미지 O
      const questionData = await models.Question.create({
        ...addData,
        memberId,

        raw: true,
      });

      await file.questionPostCreatImageUrlDB(picture, questionData.idx);

      const result = {
        status: 200,
        message: '작성 성공!',
        addData,
      };

      res.status(200).json(result);
    } else {
      await models.Question.create({
        ...addData,
        memberId,
      });

      const result = {
        status: 200,
        message: '작성 성공!',
        addData,
      };

      res.status(200).json(result);
    }
  } catch (error) {
    colorConsole.error(error);

    const result = {
      status: 500,
      message: '서버 에러!',
    };

    res.status(500).json(result);
  }
};

// 문의 조회
exports.getQuestions = async (req, res) => {
  const { page } = req.query;
  let { limit } = req.query;

  if (!page || !limit) {
    const result = {
      status: 400,
      message: 'page 혹은 limit를 지정하지 않았어요!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const requestPage = (page - 1) * limit;
    limit = Number(limit);

    const question = await models.Question.getIsComplateQuestion(requestPage, limit);
    const questionAll = await models.Question.getAllQuestionForData();
    console.log(questionAll.length / limit);

    const totalPage = Math.ceil(questionAll.length / limit);

    const result = {
      status: 200,
      message: '문의 리스트 조회 성공!',
      data: {
        question,
        totalPage,
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

exports.getAdminQuestion = async (req, res) => {
  const { auth } = req.decoded;
  const { page } = req.query;
  let { limit } = req.query;

  if (auth !== 0) {
    const result = {
      status: 403,
      message: '권한 없음!',
    };

    res.status(403).json(result);

    return;
  }

  if (!page || !limit) {
    const result = {
      status: 400,
      message: 'page 혹은 limit를 지정하지 않았어요!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const requestPage = (page - 1) * limit;
    limit = Number(limit);

    const question = await models.Question.getNotComplateQuestion(requestPage, limit);
    const allQuestion = await models.Question.getAllQuestionAdmin();
    // const allQuestion = await models.Question.getAllQuestion(requestPage, limit);

    const totalPage = Math.ceil(allQuestion.length / limit);
    // await asyncForeach(question, async (value) => {
    //   const { idx } = value;

    //   const fileData = await models.QuestionFile.getByQuestionIdx(idx);

    //   await file.creatImageUrl(fileData);

    //   if (fileData.length > 0) {
    //     value.picture = fileData;
    //   } else {
    //     value.picture = null;
    //   }
    // });

    // await asyncForeach(allQuestion, async (value) => {
    //   const { idx } = value;

    //   const fileData = await models.QuestionFile.getByQuestionIdx(idx);

    //   await file.creatImageUrl(fileData);

    //   if (fileData.length > 0) {
    //     value.picture = fileData;
    //   } else {
    //     value.picture = null;
    //   }
    // });

    const result = {
      status: 200,
      message: '조회 성공!',
      data: {
        question,
        // allQuestion,
        totalPage,
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

exports.getByCategory = async (req, res) => {
  const { category, page } = req.query;
  let { limit } = req.query;

  if (!page || !limit || !category) {
    const result = {
      status: 400,
      message: 'page or limit or category를 지정 하세요!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const requestPage = (page - 1) * limit;
    limit = Number(limit);

    const question = await models.Question.getByCategory(category, requestPage, limit);
    const questionAll = await models.Question.getByCategoryAllQuestion(category);

    const totalPage = Math.ceil(questionAll.length / limit);

    await asyncForeach(question, async (value) => {
      const { idx } = value;

      const fileData = await models.QuestionFile.getByQuestionIdx(idx);

      await file.creatImageUrl(fileData);

      if (fileData.length > 0) {
        value.picture = fileData;
      } else {
        value.picture = null;
      }
    });

    const result = {
      status: 200,
      message: '카테고리별 조회 성공!',
      data: {
        question,
        totalPage,
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

exports.getMyQuestion = async (req, res) => {
  const { memberId } = req.decoded;
  const { page } = req.query;
  let { limit } = req.query;

  try {
    const requestPage = (page - 1) * limit;
    limit = Number(limit);

    const question = await models.Question.getMyQuestion(memberId, requestPage, limit);

    await asyncForeach(question, async (value) => {
      const { idx } = value;

      const fileData = await models.QuestionFile.getByQuestionIdx(idx);

      await file.creatImageUrl(fileData);

      if (fileData.length > 0) {
        value.picture = fileData;
      } else {
        value.picture = null;
      }
    });

    const questionAll = await models.Question.getAllQuestionForData();

    const totalPage = Math.ceil(questionAll.length / limit);

    const result = {
      status: 200,
      message: '내가 작성한 질문 조회 성공!',
      data: {
        question,
        totalPage,
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

exports.getByAdminCategory = async (req, res) => {
  const { auth } = req.decoded;
  const { category, page } = req.query;
  let { limit } = req.query;

  if (auth !== 0) {
    const result = {
      status: 403,
      message: '권한 없음!',
    };

    res.status(403).json(result);

    return;
  }

  if (!page || !limit || !category) {
    const result = {
      status: 400,
      message: 'page or limit or category를 지정 하세요!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const requestPage = (page - 1) * limit;
    limit = Number(limit);

    const question = await models.Question.getByCategoryAllQuestionAdmin(category, requestPage, limit);
    const questionAll = await models.Question.getByCategoryAllQuestionAdmin(category);

    // await asyncForeach(question, async (value) => {
    //   const { idx } = value;

    //   const fileData = await models.QuestionFile.getByQuestionIdx(idx);

    //   await file.creatImageUrl(fileData);

    //   if (fileData.length > 0) {
    //     value.picture = fileData;
    //   } else {
    //     value.picture = null;
    //   }
    // });

    const totalPage = Math.ceil(questionAll.length / limit);

    const result = {
      status: 200,
      message: '카테고리별 조회 성공! (어드민)',
      data: {
        question,
        totalPage,
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

exports.getDetailQuestion = async (req, res) => {
  const { idx } = req.query;

  if (!idx) {
    const result = {
      status: 400,
      message: 'idx를 지정하세요!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const questionData = await models.Question.getByIdx(idx);

    if (!questionData) {
      const result = {
        status: 404,
        message: '존재하지 않는 문의!',
      };

      res.status(404).json(result);

      return;
    }

    await asyncForeach(questionData, async (value) => {
      const fileData = await models.QuestionFile.getByQuestionIdx(idx);

      await file.creatImageUrl(fileData);

      if (fileData.length > 0) {
        value.picture = fileData;
      } else {
        value.picture = null;
      }
    });

    const answer = await models.Answer.getByQuestionIdx(idx);

    const question = questionData[0];

    const result = {
      status: 200,
      message: '상세 정보 조회 성공!',
      data: {
        question,
        answer,
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

// 문의 수정
exports.updateQuestion = async (req, res) => {
  const { body } = req;
  const { memberId } = req.decoded;

  try {
    await validate.validateQuestionUpdate(body);
  } catch (error) {
    colorConsole.error(error);
    const result = {
      status: 400,
      message: '양식 에러!',
    };

    res.status(400).json(result);

    return;
  }
  const updateData = {
    ...body,
  };

  try {
    const member = await models.Question.getQuestionForConfirm(memberId, updateData.idx);

    if (!member) {
      const result = {
        status: 403,
        message: '권한 없음!',
      };

      res.status(400).json(result);

      return;
    }

    const { picture } = updateData;

    // 수정 파일 검증
    if (picture && Array.isArray(picture)) {
      // 기존 파일 삭제
      await models.QuestionFile.removeFileByIdx(updateData.idx);

      try {
        await validate.validateQuestionFile(picture[0]);
      } catch (error) {
        const result = {
          status: 400,
          message: '파일 양식 에러!',
        };

        res.status(400).json(result);

        return;
      }

      await file.questionPostCreatImageUrlDB(picture, updateData.idx);
    } else {
      updateData.picture = null;
    }
  } catch (error) {
    colorConsole.error(error);

    const result = {
      status: 500,
      message: '파일 저장 중 서버 에러!',
    };

    res.status(500).json(result);

    return;
  }

  try {
    // update qeustion
    await models.Question.update({
      ...updateData,
    }, {
      where: {
        idx: updateData.idx,
      },

      raw: true,
    });

    const newData = await models.Question.getByIdx(updateData.idx);

    const fileData = await models.QuestionFile.getByQuestionIdx(updateData.idx);

    if (fileData.length > 0) {
      newData.picture = fileData;
    } else {
      newData.picture = null;
    }

    const result = {
      status: 200,
      message: '수정 성공!',
      data: {
        newData,
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

// 문의 삭제
exports.deleteQuestion = async (req, res) => {
  const { idx } = req.query;
  const { memberId, auth } = req.decoded;

  if (!idx) {
    const result = {
      status: 400,
      message: 'idx를 지정 하세요!',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const questionData = await models.Question.getByIdx(idx);

    if (!questionData) {
      const result = {
        status: 400,
        message: '존재하지 않는 문의입니다!',
      };

      res.status(400).json(result);

      return;
    }

    if (auth === 0) {
      await models.Question.deleteQuestion(idx);

      const result = {
        status: 200,
        message: '문의 삭제 성공! (어드민)',
      };

      res.status(200).json(result);

      return;
    }

    const member = await models.Question.getQuestionForConfirm(memberId, idx);

    if (!member) {
      const result = {
        status: 403,
        message: '권한 없음!',
      };

      res.status(400).json(result);

      return;
    }

    await models.Question.deleteQuestion(idx);

    const result = {
      status: 200,
      message: '문의 삭제 성공!',
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
