module.exports = (sequelize, DataTypes) => {
  const BambooEmpathy = sequelize.define('BambooEmpathy', {
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
    /** 멤버 id */
    memberId: {
      field: 'member_id',
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    /** 파일 업로드 이름 */
    empathyType: {
      field: 'empathy_type',
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  }, {
    tablename: 'bamboo_empathy',
    timestamps: false,
  });

  BambooEmpathy.associate = (models) => {
    BambooEmpathy.belongsTo(models.Bamboo, {
      foreignKey: 'bambooIdx',
      onDelete: 'CASCADE',
    });

    BambooEmpathy.belongsTo(models.Member, {
      foreignKey: 'memberId',
      onDelete: 'CASCADE',
    });
  };

  BambooEmpathy.sympathizeBamboo = (bambooIdx, memberId, empathyType) => BambooEmpathy.create({
    bambooIdx,
    memberId,
    empathyType,

    raw: true,
  });

  BambooEmpathy.cancleEmpathy = (bambooIdx, memberId) => BambooEmpathy.destroy({
    where: {
      bambooIdx,
      memberId,
    },

    raw: true,
  });

  BambooEmpathy.findEmpathyUser = (memberId, bambooIdx) => BambooEmpathy.findOne({
    where: {
      memberId,
      bambooIdx,
    },

    raw: true,
  });

  BambooEmpathy.getEmpathyByBambooIdx = (bambooIdx) => BambooEmpathy.findAll({
    where: {
      bambooIdx,
    },

    raw: true,
  });

  return BambooEmpathy;
};
