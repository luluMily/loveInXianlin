var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var formidable = require('formidable');
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '首页' });
});

router.get('/reg', function(req, res, next) {
  res.render('reg', { title: '注册' });
});

router.post("/reg",function(req,res){
	console.log(req.body);
	//检验用户两次输入口令是否一致
	if(req.body['password-repeat']!=req.body['password']){
		req.flash('error','Passwords do not match');
		return res.redirect('/reg');
	}

	//生成口令的散列值
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	var newUser = new User({
		name:req.body.username,
		password:password,
		wechat:req.body.wechat,
		qq:req.body.qq,
		picuri:req.body.picuri
	});

	//检查用户名是否已经存在
	User.get(newUser.name,function(err,user){
		if(user){
			err = 'Username already exists.';
		}
		if(err){
			req.flash('error',err);
			console.log("err");
			return res.redirect('/reg');
		}
		console.log("save");
		//如果不存在则新增用户
		newUser.save(function(err){
			if(err){
				req.flash('error',err);
				console.log("save err");
				console.log(err);
				return res.redirect('/reg');
			}
			req.session.user = newUser;
			req.flash('success','Successful Registration');
			return res.redirect('/');
		});
		
	});
});


router.get('/login', function(req, res, next) {
  res.render('login', { title: '登录' });
});

router.get('/upload', function(req, res, next) {
  res.render('upload', { title: '上传' });
});

router.post('/upload', function(req, res) {

  var form = new formidable.IncomingForm();   //创建上传表单
      form.encoding = 'utf-8';        //设置编辑
      form.uploadDir = 'public/uploads/';     //设置上传目录
      form.keepExtensions = false;     //保留后缀
      form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {

        if (err) {
          res.locals.error = err;
          res.render(index, { title: TITLE });
          return;        
        }  

/*       
        var extName;  //后缀名
        switch (files.fulAvatar.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
//            case 'image/jpeg':
//                extName = jpg;
//                break;         
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;       
        }

//        if(extName.length == 0){
//              res.locals.error = 只支持png和jpg格式图片;
//              return res.redirect('/upload');                   
//        }

*/

//        var avatarName = Math.random() + "." + extName;
				var avatarName = Math.random();
        var newPath = form.uploadDir + avatarName;

        console.log(newPath);
        fs.renameSync(files.fulAvatar.path, newPath);  //重命名
    });

//    req.flash('success','上传成功');
//		res.render('upload', { title: '上传' });
		return res.redirect('/upload');
		       
});


module.exports = router;
