const comment = require('express').Router();
const commentCtrl = require('./comment.ctrl');
const authMiddleWare = require('../../../middleware/auth');

comment.post('/', authMiddleWare, commentCtrl.writeComment);// 댓글 작성
comment.put('/', authMiddleWare, commentCtrl.updateComment);// 댓글 수정
comment.get('/', commentCtrl.getComments);// 댓글 조회
comment.delete('/', authMiddleWare, commentCtrl.deleteComment);// 댓글 삭제

module.exports = comment;
