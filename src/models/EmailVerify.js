module.exports = (sequelize, DataTypes) => {
  const EmailVerify = sequelize.define('EmailVerify', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    /** 파일 TYPE */
    email: {
      field: 'email',
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    /** 파일 업로드 이름 */
    code: {
      field: 'code',
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  }, {
    tablename: 'emailVerify',
    timestamps: false,
  });

  EmailVerify.verifyCode = (email, code) => EmailVerify.findOne({
    where: {
      email,
      code,
    },

    raw: true,
  });

  EmailVerify.findeEmailCode = (email) => EmailVerify.findOne({
    where: {
      email,
    },

    raw: true,
  });

  return EmailVerify;
};
