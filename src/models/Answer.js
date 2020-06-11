module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
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
    /** 문의 idx */
    questionIdx: {
      field: 'question_idx',
      type: DataTypes.INTEGER(50),
      allowNull: false,
      unique: true,
    },
    /** 업로드 날짜 */
    joinDate: {
      field: 'join_date',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tablename: 'Answer',
    timestamps: false,
  });

  Answer.associate = (models) => {
    Answer.belongsTo(models.Member, {
      foreignKey: 'memberId',
      onDelete: 'CASCADE',
    });

    Answer.belongsTo(models.Question, {
      foreignKey: 'questionIdx',
      onDelete: 'CASCADE',
    });
  };

  Answer.getByIdx = (idx) => Answer.findOne({
    where: {
      idx,
    },

    raw: true,
  });

  Answer.getByQuestionIdx = (questionIdx) => Answer.findOne({
    where: {
      questionIdx,
    },

    raw: true,
  });

  return Answer;
};
