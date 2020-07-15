const empathy = require('express').Router();
const empathyCtrl = require('./empathy.ctrl');
const authMiddleWare = require('../../../middleware/auth');

empathy.post('/', authMiddleWare, empathyCtrl.sympathize);// 댓글 작성

module.exports = empathy;
