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

  // 질문 삭제
  Question.deleteQuestion = (idx) => Question.destroy({
    where: {
      idx,
    },
  });

  // 전체 질문 조회
  // Question.getAllQuestion = (requestPage, limit) => Question.findAll({
  //   offset: requestPage,
  //   limit,
  //   order: [
  //     ['joinDate', 'DESC'],
  //   ],

  //   raw: true,
  // });

  // 페이지 계산용 전체 질문조회
  Question.getAllQuestionForData = () => Question.findAll({
    order: [
      ['joinDate', 'DESC'],
    ],

    raw: true,
  });

  Question.getAllComplateQuestionForData = () => Question.findAll({
    where: {
      isComplate: 1,
    },
    order: [
      ['joinDate', 'DESC'],
    ],

    raw: true,
  });

  Question.getAllQuestionAdmin = () => Question.findAll({
    where: {
      isComplate: 0,
    },
    order: [
      ['joinDate', 'DESC'],
    ],

    raw: true,
  });

  // 내가 작성한 질문 조회
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

  // 페이지 계산용 내가 작성한 질문 전체 조회
  Question.getAllMyQuestion = (memberId) => Question.findAll({
    where: {
      memberId,
    },

    order: [
      ['joinDate', 'DESC'],
    ],

    raw: true,
  });

  // 답변 달린 카테고리별 질문 조회
  Question.getByCategory = (category, requestPage, limit) => Question.findAll({
    offset: requestPage,
    limit,
    where: {
      category,
      isComplate: 1,
    },
    order: [
      ['joinDate', 'DESC'],
    ],
    raw: true,
  });

  // 페이지 계산을 위한 카테고리 전체 질문 조회
  Question.getByCategoryAllQuestion = (category) => Question.findAll({
    where: {
      category,
      isComplate: 1,
    },
    order: [
      ['joinDate', 'DESC'],
    ],
    raw: true,
  });

  // 어드민 페이지 계산을 위한 카테고리 전체 질문 조회
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

  // 어드민용 답변 안달린 질문 조회
  Question.getNotComplateQuestion = (requestPage, limit) => Question.findAll({
    offset: requestPage,
    limit,
    where: {
      isComplate: 0,
    },
    order: [
      ['joinDate', 'DESC'],
    ],
    raw: true,
  });

  // 답변 달린 질문 조회
  Question.getComplateQuestion = (requestPage, limit) => Question.findAll({
    offset: requestPage,
    limit,
    where: {
      isComplate: 1,
    },
    order: [
      ['joinDate', 'DESC'],
    ],
    raw: true,
  });

  // Question.getIsComplateQuestion = (requestPage, limit) => Question.findAll({
  //   offset: requestPage,
  //   limit,
  //   order: [
  //     ['joinDate', 'DESC'],
  //   ],
  //   raw: true,
  // });

  return Question;
};
