const BaseJoi = require('@hapi/joi');
const Joi = BaseJoi.extend(require('@hapi/joi-date'));

exports.validateWriteAnswer = async (body) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    contents: Joi.string().required(),
    questionIdx: Joi.number().required(),
  });
  // eslint-disable-next-line no-useless-catch
  try {
    return await Joi.validate(body, schema);
  } catch (error) {
    throw error;
  }
};

exports.validateAnswerUpdate = async (body) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    contents: Joi.string().required(),
    idx: Joi.number().required(),
  });
  // eslint-disable-next-line no-useless-catch
  try {
    return await Joi.validate(body, schema);
  } catch (error) {
    throw error;
  }
};
