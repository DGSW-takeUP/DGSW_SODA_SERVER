const answer = require('express').Router();
const answerCtrl = require('./answer.ctrl');

answer.post('/', answerCtrl.writeAnswer);
answer.put('/', answerCtrl.updateAnswer);
answer.delete('/', answerCtrl.deleteAnswer);

module.exports = answer;
