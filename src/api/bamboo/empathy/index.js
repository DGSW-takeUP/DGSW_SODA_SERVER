const empathy = require('express').Router();
const empathyCtrl = require('./empathy.ctrl');
const authMiddleWare = require('../../../middleware/auth');

empathy.post('/', authMiddleWare, empathyCtrl.sympathize);
// empathy.get('/', authMiddleWare, empathyCtrl.getEmpathyMember);

module.exports = empathy;
