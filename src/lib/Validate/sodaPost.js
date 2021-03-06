const BaseJoi = require('@hapi/joi');
const Joi = BaseJoi.extend(require('@hapi/joi-date'));

exports.validateWriteSodaPost = async (body) => {
  const schema = Joi.object().keys({
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

exports.validateSodaPostFile = async (body) => {
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

exports.validateSodaPostUpdate = async (body) => {
  const schema = Joi.object().keys({
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
