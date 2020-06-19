module.exports = (sequelize, DataTypes) => {
  const BambooComment = sequelize.define('BambooComment', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    /** 게시물 idx */
    bambooIdx: {
      field: 'bamboo_idx',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    /** memberId */
    memberId: {
      field: 'member_id',
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    /** 댓글  */
    contents: {
      field: 'contents',
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    /** 댓글  */
    isUpdate: {
      field: 'is_update',
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: 0,
    },
    /** 작성 날짜 */
    writeDate: {
      field: 'write_date',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tablename: 'bamboo_comment',
    timestamps: false,
  });

  BambooComment.associate = (models) => {
    BambooComment.belongsTo(models.Bamboo, {
      foreignKey: 'bambooIdx',
      onDelete: 'CASCADE',
    });
  };

  BambooComment.findCommentByIdx = (idx, memberId) => BambooComment.findOne({
    where: {
      idx,
      memberId,
    },

    raw: true,
  });

  BambooComment.getComments = (bambooIdx, requestPage, limit) => BambooComment.findAll({
    offset: requestPage,
    limit,

    where: {
      bambooIdx,
    },

    raw: true,
  });

  return BambooComment;
};
