const member = require('express').Router();
const memberCtrl = require('./member.ctrl');
const authMiddleWare = require('../../middleware/auth');

member.get('/my', authMiddleWare, memberCtrl.getMyInfo);
member.put('/', authMiddleWare, memberCtrl.modifyInfo);

module.exports = member;
