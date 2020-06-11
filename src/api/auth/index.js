const auth = require('express').Router();
const authCtrl = require('./auth.ctrl');

auth.post('/login', authCtrl.login);
auth.post('/register/member', authCtrl.registerAccount);
auth.post('/check/member_id', authCtrl.checkMemberId);
auth.post('/find/id', authCtrl.findId);
auth.post('/send/pw_code', authCtrl.findPwSendEmail);
auth.post('/reset/pw', authCtrl.resetPw);
auth.post('/email', authCtrl.sendEmail);
auth.post('/email/verify', authCtrl.verifyEmailCode);

module.exports = auth;
