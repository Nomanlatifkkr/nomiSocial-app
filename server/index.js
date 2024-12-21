const express = require('express');
const AuthRouter = require('./Router/AuthRouter');
const cookieParser = require('cookie-parser')
const StoryRoute = require('./Router/StoryRoute')
const userFollow=require('./Router/userfollowRoute');
const userroute=require('./Router/UserRouter');

const cors=require('cors')
const app = express()
app.use(cors({credentials:true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser())
const mongoose = require('mongoose');

main().then(res=>console.log("connection")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/social');

 
}

require('dotenv').config({ path: './.env' });
app.use("/",AuthRouter )
app.use("/",StoryRoute)
app.use("/user",userFollow);
app.use("/user",userroute);






app.get('/', function (req, res) {

  res.send("this is our start api");
})
app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))
