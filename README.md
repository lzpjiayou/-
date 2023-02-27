资金后台管理系统
1.创建后端接口文档：node + express + jwt +mongodb

2.构建前端页面：vue +  element-ui

3.数据请求拦截：Axios


1.创建一个服务器端口
利用express创建一个Web的服务器，在server.js
安装express:  npm i express -s

const express = require('express')
const app = express()

const port = process.env.PORT || 5000;

绑定并监听指定主机和端口上的连接
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

用get方法来指定路径
app.get("/", (req, res) => {
  res.send("hello world");
});

使用nodemon来监听文件的改动
npm install -g nodemon
好处是：代码被修改之后，会被 nodemon 监听到，从而实现自动重启项目的效果。


2.连接本地数据库MongoDB
npm安装mongoose来操作数据库，并引入到server.js文件中
npm i mongoose
const mongoose = require("mongoose");

在server.js同目录下创建config文件夹来存放数据库的地址信息
key.js下
module.exports = {
  mongoURI: "mongodb://127.0.0.1:27017/test",
  secretOrKey: "secret",
};

在server.js中引入数据库的地址信息
const db = require("./config/keys").mongoURI;
使用mongoose连接数据库
mongoose
  .connect(db)
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.log(err);
  });

在server.js同目录下创建model文件夹来存放对应的数据库变量user和profiles
