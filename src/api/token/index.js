const token = require('express').Router();
const tokenCtrl = require('./token.ctrl');

token.use('/refresh', tokenCtrl.tokenRefresh);

module.exports = token;
