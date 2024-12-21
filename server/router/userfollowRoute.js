
const { followOrUnfollow } = require('../controller/followorunfollow');
const { Varifaction } = require('../middleware/varifaction');
const Router=require('express').Router();
Router.post('/follow',Varifaction,followOrUnfollow);

module.exports=Router;
