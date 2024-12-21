const { CreateStory, getstorybyfollow, updateStory, deletestory } = require('../controller/Stories');
const { LikeandUnlike } = require('../controller/likeunlike');
const { Varifaction } = require('../middleware/varifaction');
const upload = require('../middleware/upload'); // Import Multer upload
const { userComment } = require('../controller/usercomment');

const Router = require('express').Router();

Router.post('/Story', Varifaction, upload.single('image'), CreateStory); // Added Multer for single image upload
Router.post('/Story/like', Varifaction, LikeandUnlike);
Router.get('/Story', Varifaction, getstorybyfollow);
Router.put('/story', Varifaction, updateStory);
Router.delete('/story', Varifaction, deletestory);
Router.post('/comment', Varifaction,userComment);
module.exports = Router;
