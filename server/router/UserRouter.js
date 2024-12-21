const { Peopletofollow } = require('../controller/PeopletoFollow');
const { GetMyStory, GetUser, DeleteUser, UpdateProfile } = require('../controller/usercontrol');
const upload = require('../middleware/upload');  // Use the upload from the middleware
const { Varifaction } = require('../middleware/varifaction');
const Router = require('express').Router();

Router.get("/MyStory", Varifaction, GetMyStory);
Router.get("/Myaccount", Varifaction, GetUser);
Router.delete("/Myaccount", Varifaction, DeleteUser);
Router.put("/Myaccount", Varifaction, upload.single('images'), UpdateProfile);  // Ensure 'images' is the field name

Router.get('/people', Varifaction, Peopletofollow);

module.exports = Router;
