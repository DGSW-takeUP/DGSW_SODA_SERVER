const moment = require('moment-timezone');
const models = require('../../models');
const FB = require('../../repo/facebook');
const colorConsole = require('../../lib/log');
const file = require('../../lib/file');
const { asyncForeach } = require('../../lib/method');

exports.isAllowBamboo = async (req, res) => {
  const { isAllow, idx } = req.body;
  const { auth } = req.decoded;
  const requestAddress = req.get('host');

  if (auth !== 0) {
    const result = {
      status: 403,
      message: '권한 없음',
    };

    res.status(403).json(result);

    return;
  }

  try {
    // 게시물 수락 및 페이스북 페이지 업로드
    const bamboo = await models.Bamboo.getByIdx(idx);
    const bambooFile = await models.BambooFile.getFiles(bamboo.idx);
    const bambooCount = await models.Bamboo.getAllowedBamboo();
    let allowDate = Date.now();
    allowDate = moment(allowDate).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm');

    // 게시물 거절
    if (isAllow === 0) {
      await models.Bamboo.update({
        isAllow: 2,
      }, {
        where: {
          idx: bamboo.idx,
        },
      });

      const result = {
        status: 200,
        message: '게시물 거절 성공!',
      };

      res.status(200).json(result);

      return;
    }

    if (bambooFile[0] !== undefined) {
      const imageFile = [];

      // 첨부할 이미지 url 만들기
      await file.creatImageUrl(bambooFile, requestAddress);

      bambooFile.forEach((value) => {
        imageFile.push(value.url);
      });

      // 게시물 페이스북 업로드
      const errorCode = await FB.uploadPostWithPhoto(imageFile, bamboo.contents, bamboo.name, allowDate, bambooCount.length);

      if (errorCode === 'error') {
        const result = {
          status: 500,
          message: '페이스북 업로드 중 에러!',
        };

        res.status(500).json(result);

        return;
      }

      await models.Bamboo.update({
        isAllow: 1,
        allowDate: Date.now(),
      }, {
        where: {
          idx: bamboo.idx,
        },
      });

      const result = {
        status: 200,
        message: '게시물 수락 성공! (이미지 첨부)',
      };

      res.status(200).json(result);

      return;
    }

    await FB.uploadPostWithOutPhoto(bamboo.contents, bamboo.name, allowDate, bambooCount.length);

    await models.Bamboo.update({
      isAllow: 1,
      allowDate: Date.now(),
    }, {
      where: {
        idx: bamboo.idx,
      },
    });

    const result = {
      status: 200,
      message: '게시물 수락 성공!',
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

exports.getNotAllowBamboo = async (req, res) => {
  const { auth } = req.decoded;
  const requestAddress = req.get('host');

  if (auth !== 0) {
    const result = {
      status: 403,
      message: '권한 없음',
    };

    res.status(403).json(result);

    return;
  }

  try {
    const bamboo = await models.Bamboo.getIsAllowBamboo(0);
    await asyncForeach(bamboo, async (value) => {
      const { idx } = value;

      const fileData = await models.BambooFile.getFiles(idx);

      await file.creatImageUrl(fileData, requestAddress);

      if (fileData.length > 0) {
        value.picture = fileData;
      } else {
        value.picture = null;
      }
    });
    const result = {
      status: 200,
      message: '승인 되지 않은 게시물 조회 성공!',
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

exports.deleteBamboo = async (req, res) => {
  const { idx } = req.query;
  const { auth } = req.decoded;

  if (auth !== 0) {
    const result = {
      status: 403,
      message: '권한 없음',
    };

    res.status(403).json(result);

    return;
  }

  try {
    await models.Bamboo.destroy({
      where: { idx },
    });

    await models.BambooFile.deleteFile(idx);

    const result = {
      status: 200,
      message: '게시물 삭제 성공!',
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
