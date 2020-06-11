const models = require('../../models');
const colorConsole = require('../../lib/log');
const validate = require('../../lib/Validate/bamboo');
const file = require('../../lib/file');
const { asyncForeach } = require('../../lib/method');

exports.writeBamboo = async (req, res) => {
  const { body } = req;

  try {
    await validate.validateWriteBamboo(body);
  } catch (error) {
    colorConsole.warn(error);

    const result = {
      status: 400,
      message: '게시물 양식을 확인 하세요!',
    };

    res.status(400).json(result);

    return;
  }

  const addData = {
    ...body,
  };

  try {
    // 게시물 DB저장 (이미지 O)
    if (addData.picture !== null && Array.isArray(addData.picture)) {
      const { picture } = addData;

      // 파일 검증
      try {
        await validate.validateBambooFile(body.picture[0]);
      } catch (error) {
        colorConsole.warn(error);

        const result = {
          status: 400,
          message: '파일 검증 오류!',
        };

        res.status(400).json(result);

        return;
      }

      // DB 저장 (게시물)
      const bambooData = await models.Bamboo.create(addData);

      // IMAGE URL 발급 && 파일 DB 저장
      await file.bambooCreatImageUrlDB(picture, bambooData.idx);

      const result = {
        status: 200,
        message: '게시물 저장 성공! (pitcure !== null)',
        addData,
      };

      res.status(200).json(result);
    } else {
      // 게시물 DB저장 (이미지 X)
      await models.Bamboo.create({
        ...body,
      });

      colorConsole.green('[BAMBOO] 게시물 작성 API 호출');

      const result = {
        status: 200,
        message: '게시물 저장 성공! (pitcure === null)',
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

exports.getAllowBamboo = async (req, res) => {
  const { query } = req;
  let { limit } = query;
  const { page } = query;

  try {
    if (!limit || !page) {
      const result = {
        status: 400,
        message: 'limit 혹은 page를 지정해주세요.',
      };

      res.status(400).json(result);

      return;
    }

    const requestPage = (page - 1) * limit;
    limit = Number(limit);

    const bamboo = await models.Bamboo.getIsAllowBamboo(1, requestPage, limit);

    await asyncForeach(bamboo, async (value) => {
      const { idx } = value;

      const fileData = await models.BambooFile.getFiles(idx);

      await file.creatImageUrl(fileData);

      if (fileData.length > 0) {
        value.picture = fileData;
      } else {
        value.picture = null;
      }
    });

    const result = {
      status: 200,
      message: '승인 된 게시물 조회 성공!',
      data: {
        bamboo,
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
