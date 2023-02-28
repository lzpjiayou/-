
在server.js同目录下创建router文件夹来存放路由模块user和profiles
1.在user和profiles分别引入路由模块

const express = require('express');
const router = express.Router();

//加密密码和验证密码
const bcrypt = require('bcrypt');

//引入暴露的User模块用来验证登录注册时的信息
const User = require('../../models/User');

//生成token
const jwt = require('jsonwebtoken');
//token指定的secret密匙
const keys = require('../../config/keys');
//验证token
const passport = require('passport');

1.注册接口
//用户在注册时，接口会对表单提交上来的信息email进行查询，通过User.findOne(),来判断邮箱是否宝注册过，
没有则实例化一个新的User对像,并使用bcrypt对密码进行加密，最终存储在数据库中
router.post('/register', (req, res) => {
    // 查询数据库中是否拥有邮箱
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json('邮箱已被注册!');
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password,
                identity: req.body.identity
            });

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;

                    newUser.password = hash;

                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

2,登录接口
//用户在注册时，接口会对表单提交的信息进行查询，使用User.findOne()来判断email是否拥有，有则使用bcrypt.compare()
进行密码匹配，成功则用rule接受对应的信息,并存储在token中，生成对应的token，有对应的信息过期时间。
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // 查询数据库
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json('用户不存在!');
        }

        // 密码匹配
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const rule = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    identity: user.identity
                };
                jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                    if (err) throw err;
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    });
                });
                // res.json({msg:"success"});
            } else {
                return res.status(400).json('密码错误!');
            }
        });
    });
});

3.验证token
当用户登录时生成对应的token，接口会使用passport.anthenticate()来验证jwt
router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            identity: req.user.identity
        });
    }
);

//在passport.js文件中
passport会获取jwt中的payload属性，数据库中的User使用findById()来判断数据库中对应的属性是否存在。
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("./keys");

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        // console.log(jwt_payload);
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }

                return done(null, false);
            })
            .catch(err => console.log(err));
    }));
}

4.向外暴露routers

module.exports = router;