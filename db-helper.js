const mysql = require('mysql');
const config = require('./config');

// 连接mysql
exports.query = function () {
    // 创建连接信息
    // Object.assign(config.db,{});参数1是参数，第二个参数是可以拼接的参数，防止以后有需要添加的数据
    // 这个方法就是拼接两个参数的值的
    const connection = mysql.createConnection(Object.assign(config.db,{}))
    connection.connect();

    // ...变量  叫做展开操作符
    // arguments会展开传入的参数  传给connection.query方法
    // 因为connection.query的参数不固定
    connection.query(...arguments);
    // 关闭连接
    connection.end();
}