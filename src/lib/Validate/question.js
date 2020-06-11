const BaseJoi = require('@hapi/joi');
const Joi = BaseJoi.extend(require('@hapi/joi-date'));

exports.validateWriteQuestion = async (body) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    contents: Joi.string().required(),
    category: Joi.string().required(),
    picture: Joi.any().allow(null),
  });
  // eslint-disable-next-line no-useless-catch
  try {
    return await Joi.validate(body, schema);
  } catch (error) {
    throw error;
  }
};

exports.validateQuestionFile = async (body) => {
  const schema = Joi.object().keys({
    uploadName: Joi.string().required(),
    type: Joi.string().required(),
  });
  // eslint-disable-next-line no-useless-catch
  try {
    return await Joi.validate(body, schema);
  } catch (error) {
    throw error;
  }
};

exports.validateQuestionUpdate = async (body) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    contents: Joi.string().required(),
    picture: Joi.any().allow(null),
    idx: Joi.number().required(),
  });
  // eslint-disable-next-line no-useless-catch
  try {
    return await Joi.validate(body, schema);
  } catch (error) {
    throw error;
  }
};
