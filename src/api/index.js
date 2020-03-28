const router = require('express').Router();

const auth = require('./auth');
const upload = require('./upload');
const bamboo = require('./bamboo');
const community = require('./community');
const question = require('./question');
const admin = require('./admin');

router.use('/auth', auth);
router.use('/upload', upload);
router.use('/bamboo', bamboo);
router.use('/community', community);
router.use('/question', question);
router.use('/admin', admin);

module.exports = router;
