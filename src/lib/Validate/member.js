const BaseJoi = require('@hapi/joi');
const Joi = BaseJoi.extend(require('@hapi/joi-date'));

exports.validateRegisterUser = async (body) => {
  const schema = Joi.object().keys({
    memberId: Joi.string().required(),
    pw: Joi.string().required(),
    name: Joi.string().required(),
    profileImage: Joi.any().allow(null),
    certification: Joi.boolean().required(),
    consent: Joi.boolean().required(),
    email: Joi.string().email().required(),
    nickName: Joi.string().required(),
  });
  // eslint-disable-next-line no-useless-catch
  try {
    return await Joi.validate(body, schema);
  } catch (error) {
    throw error;
  }
};

exports.validateUserEmail = async (body) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
  });
  // eslint-disable-next-line no-useless-catch
  try {
    return await Joi.validate(body, schema);
  } catch (error) {
    throw error;
  }
};

exports.validateModifyUser = async (body) => {
  const schema = Joi.object().keys({
    profileImage: Joi.any(),
    nickName: Joi.string(),
    pw: Joi.string(),
  });
  // eslint-disable-next-line no-useless-catch
  try {
    return await Joi.validate(body, schema);
  } catch (error) {
    throw error;
  }
};