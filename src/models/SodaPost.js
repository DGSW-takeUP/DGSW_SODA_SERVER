module.exports = (sequelize, DataTypes) => {
  const SodaPost = sequelize.define('SodaPost', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
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
      allowNull: false,
    },
    /** 프로필 사진 */
    profileImage: {
      field: 'profile_image',
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    /** 게시물 like */
    like: {
      field: 'like',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    /** 카테고리 */
    category: {
      field: 'category',
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    /** 업로드 날짜 */
    joinDate: {
      field: 'join_date',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tablename: 'SodaPost',
    timestamps: false,
  });

  SodaPost.getPostByCategory = (category, requestPage, limit) => SodaPost.findAll({
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

  SodaPost.getPostByIdx = (idx) => SodaPost.findOne({
    where: {
      idx,
    },

    raw: true,
  });

  SodaPost.getPosts = (requestPage, limit) => SodaPost.findAll({
    offset: requestPage,
    limit,
    order: [
      ['joinDate', 'DESC'],
    ],

    raw: true,
  });

  return SodaPost;
};
