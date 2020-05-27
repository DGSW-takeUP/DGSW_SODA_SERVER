module.exports = (sequelize, DataTypes) => {
  const Bamboo = sequelize.define('Bamboo', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    /** 제목 */
    // title: {
    //   field: 'title',
    //   type: DataTypes.STRING(50),
    //   allowNull: false,
    // },
    /** 내용 */
    contents: {
      field: 'contents',
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    /** 작성자 */
    // memberId: {
    //   field: 'member_id',
    //   type: DataTypes.STRING(50),
    //   allowNull: true,
    // },
    name: {
      field: 'name',
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    profileImage: {
      field: 'profile_image',
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: null,
    },
    /** 게시글 인증 */
    isAllow: {
      field: 'is_allow',
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: 0,
    },
    /** 카테고리 */
    // category: {
    // field: 'category',
    // type: DataTypes.STRING(50),
    // allowNull: false,
    // },
    /** 업로드 날짜 */
    joinDate: {
      field: 'join_date',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    /** 게시물 승인 날짜 */
    allowDate: {
      field: 'allow_date',
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tablename: 'Bamboo',
    timestamps: false,
  });

  Bamboo.getByIdx = (idx) => Bamboo.findOne({
    where: {
      idx,
    },
    raw: true,
  });

  // eslint-disable-next-line consistent-return
  Bamboo.getIsAllowBamboo = (isAllow, requestPage, limit) => {
    if (isAllow === 0) {
      return Bamboo.findAll({
        offset: requestPage,
        limit,
        where: {
          isAllow,
        },
        order: [
          ['joinDate', 'DESC'],
        ],

        raw: true,
      });
    }
    if (isAllow === 1) {
      return Bamboo.findAll({
        offset: requestPage,
        limit,
        where: {
          isAllow,
        },
        order: [
          ['allowDate', 'DESC'],
        ],

        raw: true,
      });
    }
  };

  Bamboo.getAllowedBamboo = () => Bamboo.findAll({
    where: {
      isAllow: 1,
    },
    raw: true,
  });


  return Bamboo;
};
