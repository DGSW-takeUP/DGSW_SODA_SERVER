const request = require('request-promise-native');
const facebook = require('../../config/facebook.json');

const uploadImage = (url) => new Promise((resolve, reject) => {
  const option = {
    uri: `https://graph.facebook.com/${facebook.pageId}/photos/`,
    method: 'POST',
    body: {
      url,
      access_token: facebook.pageToken,
      published: false,
    },

    json: true,
  };

  request.post(option, (error, res, body) => {
    if (error) throw new Error(error);
    return body;
  })
    .then((response) => resolve(response.id))
    .catch((error) => reject(error));
});

// 사진 없이 게시물 등록
exports.uploadPostWithOutPhoto = (contentsData, name, date, bambooCount) => {
  let contents = '';

  contents += `\n\n\n\n #대소고_${bambooCount + 1}번째_게시글`;
  contents += `\n\n\n\n ${date} 게시`;
  contents += `\n\n\n\n ${contentsData}`;
  if (name === null) {
    contents += '\n\n\n\n 익명 제보';
  } else {
    contents += `\n\n\n\n ${name}님 제보`;
  }

  const option = {
    uri: `https://graph.facebook.com/${facebook.pageId}/feed/`,
    method: 'POST',
    body: {
      access_token: facebook.pageToken,
      message: contents,
    },

    json: true,
  };

  request.post(option, (error, res, body) => {
    if (error) throw error;
  });
};

// 사진과 함께 게시물 등록
// eslint-disable-next-line consistent-return
exports.uploadPostWithPhoto = async (url, contentsData, name, date, bambooCount) => {
  let contents = '';


  contents += `\n\n\n\n #대소고_${bambooCount + 1}번째_게시글`;
  contents += `\n\n\n\n ${date} 게시`;
  contents += `\n\n\n\n ${contentsData}`;

  if (name === null) {
    contents += '\n\n\n\n 익명 제보';
  } else {
    contents += `\n\n\n\n ${name}님 제보`;
  }

  const fbid = [];
  try {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < url.length; i++) {
    // eslint-disable-next-line no-await-in-loop
      const res = await uploadImage(url[i]);

      fbid.push({ media_fbid: res });
    }
  } catch (error) {
    return 'error';
  }

  const option = {
    uri: `https://graph.facebook.com/${facebook.pageId}/feed/`,
    method: 'POST',
    body: {
      attached_media: fbid,
      access_token: facebook.pageToken,
      message: contents,
    },

    json: true,
  };
  request.post(option, (error, res, body) => {
    if (error) throw new Error(error);
  });
};
