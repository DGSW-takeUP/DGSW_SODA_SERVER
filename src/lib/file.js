const { asyncForeach } = require('../lib/method');
const models = require('../models');
const baseConfig = require('../../config/base.json');

// url 설정 함수
const urlData = (fileData) => {
  const requestAddress = baseConfig.base.replace;

  const fileType = fileData.type;

  const { uploadName } = fileData;

  const url = `${requestAddress}/image/${fileType}/${uploadName}.${fileType}`;

  return {
    fileType,
    url,
  };
};

// url 작성 및 DB저장 대숲
exports.bambooCreatImageUrlDB = async (picture, idx) => {
  await asyncForeach(picture, (value) => {
    const fileData = {
      bambooIdx: idx,
      ...value,
    };

    // 파일 DB 저장
    models.BambooFile.create(fileData);

    const { url, fileType } = urlData(fileData);

    value.url = url;
    value.type = fileType;
  });
};

// 소다 게시물 이미지 파일 저장
exports.sodaPostCreatImageUrlDB = async (picture, idx) => {
  await asyncForeach(picture, (value) => {
    const fileData = {
      sodaIdx: idx,
      ...value,
    };

    // 파일 DB 저장
    models.SodaFile.create(fileData);

    const { url, fileType } = urlData(fileData);

    value.url = url;
    value.type = fileType;
  });
};

exports.questionPostCreatImageUrlDB = async (picture, idx) => {
  await asyncForeach(picture, (value) => {
    const fileData = {
      questionIdx: idx,
      ...value,
    };

    // 파일 DB 저장
    models.QuestionFile.create(fileData);

    const { url, fileType } = urlData(fileData);

    value.url = url;
    value.type = fileType;
  });
};

// 조회시 url 설정
exports.creatImageUrl = async (picture) => {
  await asyncForeach(picture, (value) => {
    const fileData = {
      ...value,
    };

    const { url, fileType } = urlData(fileData);

    value.url = url;
    value.type = fileType;
  });
};
