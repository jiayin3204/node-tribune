### 流程

1.初始化项目  npm init 

2.创建 .gitignore 文件阻止上传 node_modules 文件和 webstorm 创建的 .deal 文件

3.安装 express

4.根据路由使页面跳转

5.路由设置标识进行跳转，在get和post 不同的方式中可以进行两次操作，将路由单独放在 router.js  文件中

- 在post的方式中进行表单数据的获取

- 将获取到的表单数据进行校验   验证post提交方式的包    validator

- 在不同的校验中返回不同的code返回值，以确定在前台页面中进行相应的提示

- 将注册表单数据添加到数据表中

- 在登录成功之前在SESSION中存储用户登录的信息  

  #### 注意：

  - 在router文件的最后一定要记得将文件导出

    `module.exports = router`

```javascript 
// 根据express中的方法得到一个路由容器
const router = express.Router();

router.get('/', (req, res) => {
// 首页的模板引擎,参数1：渲染的路径  参数2：解析替换的数据
	res.render('index.html', {
		isLogin: req.session.isLogin
	})
})

router.get('/login', (req, res) => {
// 响应的数据
	res.render('login.html')
})

router.get('/register', (req, res) => {
	res.render('register.html')
})
```

6.将 mysql 文件抽出来，放在单独文件中，文件中调用 exports.query 方法，在函数中创建连接信息，否则会报错

```javascript
// 当前的数据库连接操作方案：卸磨杀驴
exports.query = function () {
  const connection = mysql.createConnection(Object.assign(config.db, {}))  
  connection.connect()
  // 你调用 query 方法传递什么参数就会原样的传递给 connection.query 方法
  // 好处就是，当有一天 connection.query 方法参数形式改变了，我们这里的代码不用动
  // 只需要修改我们最终的调用的位置即可

  // ...变量 叫做展开操作符
  // 我们自己的 query 方法的参数会原封不动的继续传递给 connection.query 方法
  // 这里这样做的原因主要是 connection.query 方法的参数不固定
  connection.query(...arguments)
  // 关闭连接
  connection.end()
}
```

7.在 app.js 中开放静态资源

```javascript
// path.join方法是将两个参数拼接到一起   __dirname  是获取当前文件的绝对路径   express.static 是开放资源的方法
app.use('/public/', express.static(path.join(__dirname, './public/')));
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')));
```

8.配置各个资源包（在官网上赋值粘贴即可）

9.在跳转到首页的时候在首页判断是否已经登录，如果登录显示用户名等信息，如果没有登录就显示登录与注册







