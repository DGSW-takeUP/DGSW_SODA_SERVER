const models = require('../../models');
const validate = require('../../lib/Validate/sodaPost');
const colorConsole = require('../../lib/log');
const file = require('../../lib/file');
const { asyncForeach } = require('../../lib/method');

exports.writePost = async (req, res) => {
  const { body } = req;
  const { memberId } = req.decoded;
  const requestAddress = req.get('host');

  try {
    await validate.validateWriteSodaPost(body);
  } catch (error) {
    const result = {
      status: 400,
      message: '양식을 확인하세요.',
    };

    res.status(400).json(result);
  }

  try {
    const addData = {
      ...body,
    };

    // 게시물 DB 저장 (이미지 O)
    if (addData.picture !== null && Array.isArray(addData.picture)) {
      const { picture } = addData;
      // 파일 검증
      try {
        await validate.validateSodaPostFile(picture[0]);
      } catch (error) {
        colorConsole.warn(error);

        const result = {
          status: 400,
          message: '파일 검증 오류!',
        };

        res.status(400).json(result);

        return;
      }

      // DB 게시물 저장
      const sodaPostData = await models.SodaPost.create({
        ...addData,
        memberId,
      });

      // IMAGE URL 발급
      await file.sodaPostCreatImageUrlDB(picture, requestAddress, sodaPostData.idx);

      const result = {
        status: 200,
        message: '게시물 저장 성공! (pitcure !== null)',
        addData,
      };

      res.status(200).json(result);
    } else {
      // 이미지 없이 게시물 저장
      await models.SodaPost.create({
        ...addData,
        memberId,
      });

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
      message: '서버 에러',
    };

    res.status(500).json(result);
  }
};

exports.getPostCategory = async (req, res) => {
  const { query } = req;
  const { category } = query;
  const requestAddress = req.get('host');

  try {
    if (!category) {
      const result = {
        status: 400,
        message: '카테고리를 적어주세요!',
      };

      res.status(400).json(result);

      return;
    }

    const postDatas = await models.SodaPost.getPostByCategory(category);

    await asyncForeach(postDatas, async (post) => {
      const { idx } = post;
      post.comment = [];

      const fileData = await models.SodaFile.getFiles(idx);
      const comment = await models.PostComment.getCommentsByPostIdx(idx);

      await file.creatImageUrl(fileData, requestAddress);

      if (fileData.length > 0) {
        post.picture = fileData;
      } else {
        post.picture = null;
      }

      // 게시물 댓글 정보 추가
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < comment.length; i++) {
        if (comment[i].sodaIdx === idx) {
          post.comment.push(comment[i]);

          // if (post.comment.length > 2) {
          // return;
          // }
        }
      }
    });

    const result = {
      status: 200,
      message: '카테고리별 피드 가져오기 성공!',
      data: {
        postDatas,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    colorConsole(error);

    const result = {
      status: 500,
      message: '서버 에러',
    };

    res.status(500).json(result);
  }
};

exports.updatePost = async (req, res) => {
  const { memberId } = req.decoded;
  const { body } = req;

  try {
    await validate.validateSodaPostUpdate(body);
  } catch (error) {
    colorConsole.warn(error);

    const result = {
      status: 400,
      message: '수정 양식을 지키세요',
    };

    res.status(400).json(result);

    return;
  }

  try {
    const postData = await models.SodaPost.getPostByIdx(body.idx);

    if (postData.memberId !== memberId) {
      const result = {
        status: 403,
        message: '수정 권한 없음!',
      };

      res.status(403).json(result);

      return;
    }

    await models.SodaPost.update({
      contents: body.contents,
    }, {
      where: {
        idx: body.idx,
      },
    });

    const result = {
      status: 200,
      message: '수정 성공!',
    };

    res.status(200).json(result);
  } catch (error) {
    colorConsole(error);

    const result = {
      status: 500,
      message: '서버 에러',
    };

    res.status(500).json(result);
  }
};

exports.deletePost = async (req, res) => {
  const { memberId, auth } = req.decoded;
  const { query } = req;
  const { idx } = query;

  try {
    if (auth === 0) {
      await models.SodaPost.destroy({
        where: {
          idx,
        },
      });

      const result = {
        status: 200,
        message: '어드민 권한으로 삭제 성공!',
      };

      res.status(200).json(result);

      return;
    }

    const postData = await models.SodaPost.getPostByIdx(idx);

    if (postData.memberId !== memberId) {
      const result = {
        status: 403,
        message: '권한 없음!',
      };

      res.status(403).json(result);

      return;
    }

    await models.SodaPost.destroy({
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
    colorConsole(error);

    const result = {
      status: 500,
      message: '서버 에러',
    };

    res.status(500).json(result);
  }
};

exports.getPosts = async (req, res) => {
  const requestAddress = req.get('host');

  try {
    const postData = await models.SodaPost.getPosts();

    await asyncForeach(postData, async (post) => {
      const { idx } = post;
      post.comment = [];

      const fileData = await models.SodaFile.getFiles(idx);
      const comment = await models.PostComment.getCommentsByPostIdx(idx);

      await file.creatImageUrl(fileData, requestAddress);

      if (fileData.length > 0) {
        post.picture = fileData;
      } else {
        post.picture = null;
      }

      // 게시물 댓글 정보 추가
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < comment.length; i++) {
        if (comment[i].sodaIdx === idx) {
          post.comment.push(comment[i]);

          // if (post.comment.length > 2) {
          // return;
          // }
        }
      }
    });

    const result = {
      status: 200,
      message: '불러오기 성공!',
      data: {
        postData,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    colorConsole.error(error);

    const result = {
      status: 500,
      message: '서버 에러',
    };

    res.status(500).json(result);
  }
};
