var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var formidable = require('formidable');
var fs = require('fs');

/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/


router.get('/', function(req, res, next) {
  res.render('activity', { title: '联谊' });
});

router.get('/new', function(req, res, next) {
  res.render('createActivity', { title: '联谊搞起' });
});

module.exports = router;
