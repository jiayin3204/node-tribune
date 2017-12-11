const express = require('express');
const validator = require('validator');
const db = require('./db-helper');

// 调用express的router方法，得到一个路由容器
const router = express.Router();

router.get('/', (req, res) => {
	res.render('index.html', {
		isLogin: req.session.isLogin
	})
})

router.get('/login', (req, res) => {
	res.render('login.html')
})

router.get('/register', (req, res) => {
	res.render('register.html')
})

// 处理注册表单的路由
router.post('/register', (req, res) => {
	// 1.接收表单数据
	const body = req.body;
	console.log(body);
	// 2.校验表单数据
	if (!body.email || validator.isEmpty(body.email) || !validator.isEmail(body.email)) {
		return res.json({
			code: 400, //客户端错误
			message: 'email invalid'
		})
	}
	if (!body.nickname || validator.isEmpty(body.nickname)) {
		return res.json({
			code: 400,
			message: 'nikename invalid'
		})
	}

	if (!body.password || validator.isEmpty(body.password)) {
		return res.json({
			code: 400,
			message: 'password invalid'
		})
	}
	// 验证邮箱是否已占用
	// query 方法可以让第二个参数自动替换?
	db.query('SELECT * FROM users WHERE email=?', [body.email], function (err, data) {
		if (err) {
			return console.log('操作失败');
		}
		// 如果返回数据说明有这个邮箱
		if (data[0]) {
			return res.json({
				code: 1,
				message: 'email already exists'
			})
		}
		// 验证昵称是否被占用
		db.query('SELECT * FROM users WHERE nickname=?', [body.nikename], function (err, data) {
			if (err) {
				return console.log('操作失败');
			}
			if (data[0]) {
				return res.json({
					code: 2,
					message: 'nickname already exists'
				})
			}

			// 业务数据校验通过，创建用户
			db.query('INSERT INTO users SET ?', {
				email: body.email,
				password: body.password, // md5 加密处理
				nickname: body.nickname,
				avatar: 'avatar-max-img.png',
				createdAt: new Date,
				updatedAt: new Date
			}, function (err, data) {
				if (err) {
					return res.json({
						code: 500,
						message: `Server Error: ${err.message}`
					})
				}

				// 登录成功之前，在SESSION中储存用户的登录状态
				req.session.isLogin = true;
				res.json({
					code: 0,
					message: 'ok'
				})
			})
		})
	})
	// 3.保存表单数据
	// 4.如果保存成功跳转页面
})

// 将文件导出可以让app.js访问
module.exports = router;