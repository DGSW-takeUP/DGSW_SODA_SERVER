const bamboo = require('express').Router();
const bambooCtrl = require('./bamboo.ctrl');
const bambooComment = require('./comment');

bamboo.post('/', bambooCtrl.writeBamboo);// 게시물 작성
bamboo.get('/', bambooCtrl.getAllowBamboo);// 승인된 게시물 목록 조회

bamboo.use('/comment', bambooComment);

module.exports = bamboo;
