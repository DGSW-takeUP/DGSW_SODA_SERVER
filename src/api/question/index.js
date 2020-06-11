const question = require('express').Router();
const questionCtrl = require('./question.ctrl');
const answer = require('./answer');
const authMiddleWare = require('../../middleware/auth');

question.post('/', authMiddleWare, questionCtrl.writeQuestion);
question.get('/', questionCtrl.getQuestions);
question.get('/admin', authMiddleWare, questionCtrl.getAdminQuestion);
question.get('/my', authMiddleWare, questionCtrl.getMyQuestion);
question.get('/category', questionCtrl.getByCategory);
question.get('/admin/category', authMiddleWare, questionCtrl.getByAdminCategory);
question.get('/detail', authMiddleWare, questionCtrl.getDetailQuestion);
question.put('/', authMiddleWare, questionCtrl.updateQuestion);
question.delete('/', authMiddleWare, questionCtrl.deleteQuestion);

question.use('/answer', authMiddleWare, answer);

module.exports = question;
