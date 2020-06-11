const log = require('../../../lib/log');

exports.uploadImgs = (req, res) => {
  const imgs = [];
  const { files } = req;

  if (files.length === 0) {
    const result = {
      status: 400,
      message: '이미지를 첨부 하세요',
    };
    res.status(400).json(result);

    return;
  }

  req.files.forEach((file) => {
    const uploadName = file.filename;
    const fileData = uploadName.split('.');
    imgs.push({ fileName: fileData[0], fileType: fileData[1] });
  });

  const result = {
    status: 200,
    message: '이미지 업로드 성공',
    data: {
      imgs,
    },
  };
  res.status(200).json(result);

  log.green('이미지 업로드 성공');
};
