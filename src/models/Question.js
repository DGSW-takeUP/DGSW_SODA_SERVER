module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    /** 제목 */
    title: {
      field: 'title',
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    /** 내용 */
    contents: {
      field: 'contents',
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    /** 작성자 */
    memberId: {
      field: 'member_id',
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    /** 카테고리 */
    category: {
      field: 'category',
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    /** 해결 여부 알려주는 컬럼 */
    isComplate: {
      field: 'is_complate',
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: 0,
    },
    /** 업로드 날짜 */
    joinDate: {
      field: 'join_date',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tablename: 'Question',
    timestamps: false,
  });

  Question.associate = (models) => {
    Question.belongsTo(models.Member, {
      foreignKey: 'memberId',
      onDelete: 'CASCADE',
    });
  };

  Question.getQuestionForConfirm = (memberId, idx) => Question.findOne({
    where: {
      memberId,
      idx,
    },

    raw: true,
  });

  Question.getByIdx = (idx) => Question.findAll({
    where: {
      idx,
    },

    raw: true,
  });

  Question.deleteQuestion = (idx) => Question.destroy({
    where: {
      idx,
    },
  });

  Question.getAllQuestion = (requestPage, limit) => Question.findAll({
    offset: requestPage,
    limit,
    order: [
      ['joinDate', 'DESC'],
    ],

    raw: true,
  });

  Question.getAllQuestionForData = () => Question.findAll({
    order: [
      ['joinDate', 'DESC'],
    ],

    raw: true,
  });

  Question.getMyQuestion = (memberId, requestPage, limit) => Question.findAll({
    offset: requestPage,
    limit,
    where: {
      memberId,
    },

    order: [
      ['joinDate', 'DESC'],
    ],

    raw: true,
  });

  // eslint-disable-next-line consistent-return
  Question.getByCategory = (category, requestPage, limit) => Question.findAll({
    offset: requestPage,
    limit,
    where: {
      category,
    },
    order: [
      ['joinDate', 'DESC'],
    ],
    raw: true,
  });

  Question.getByCategoryAllQuestion = (category) => Question.findAll({
    where: {
      category,
    },
    order: [
      ['joinDate', 'DESC'],
    ],
    raw: true,
  });

  Question.getByCategoryAllQuestionAdmin = (category) => Question.findAll({
    where: {
      category,
      isComplate: 0,
    },
    order: [
      ['joinDate', 'DESC'],
    ],
    raw: true,
  });

  // eslint-disable-next-line consistent-return
  Question.getIsComplateQuestion = (requestPage, limit) => Question.findAll({
    offset: requestPage,
    limit,
    order: [
      ['joinDate', 'DESC'],
    ],
    raw: true,
  });


  return Question;
};
