1.在要创建的数据库变量中引入mongoose

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

2.在User.js和Profiles.js中分别创建创建UserSchema和ProfilesSchema模块

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  identity: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});


const ProfileSchema = new Schema({
  type: {
    type: String
  },
  describe: {
    type: String
  },
  income: {
    type: String,
    required: true
  },
  expend: {
    type: String,
    required: true
  },
  cash: {
    type: String,
    required: true
  },
  remark: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});


3.向外暴露创建的模块
module.exports = User = mongoose.model('users', UserSchema);

module.exports = Profile = mongoose.model('profile', ProfileSchema);
