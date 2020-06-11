const BaseJoi = require('@hapi/joi');
const Joi = BaseJoi.extend(require('@hapi/joi-date'));

exports.validateWriteBamboo = async (body) => {
  const schema = Joi.object().keys({
    name: Joi.string().allow(null),
    profileImage: Joi.string().allow(null),
    contents: Joi.string().required(),
    picture: Joi.any().allow(null),
  });
  // eslint-disable-next-line no-useless-catch
  try {
    return await Joi.validate(body, schema);
  } catch (error) {
    throw error;
  }
};

exports.validateBambooFile = async (body) => {
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
