const {Signup, Login, getnewaccesstoken, logout} = require('../controller/AuthController');
const {user} = require('../controller/usercontrol');
const { Varifaction } = require('../middleware/varifaction');

const Router=require('express').Router();
Router.post('/signup',Signup);
Router.post('/login',Login);
Router.post('/logout',logout);


Router.get('/token',getnewaccesstoken);




module.exports=Router;
