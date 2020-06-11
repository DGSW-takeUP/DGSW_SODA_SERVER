module.exports = (sequelize, DataTypes) => {
  const QuestionFile = sequelize.define('QuestionFile', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    /** 게시물 idx */
    questionIdx: {
      field: 'question_idx',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    /** 파일 TYPE */
    type: {
      field: 'type',
      type: DataTypes.TEXT,
      allowNull: false,
    },
    /** 파일 업로드 이름 */
    uploadName: {
      field: 'upload_name',
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tablename: 'QuestionFile',
    timestamps: false,
  });

  QuestionFile.associate = (models) => {
    QuestionFile.belongsTo(models.Question, {
      foreignKey: 'questionIdx',
      onDelete: 'CASCADE',
    });
  };

  QuestionFile.removeFileByIdx = (questionIdx) => QuestionFile.destroy({
    where: {
      questionIdx,
    },
  });

  QuestionFile.getByQuestionIdx = (questionIdx) => QuestionFile.findAll({
    where: {
      questionIdx,
    },

    raw: true,
  });

  return QuestionFile;
};
