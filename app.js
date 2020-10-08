const express=require('express');
dbConnection  = require('./db/dbconfig');
var bodyParser=require('body-parser');
var createuser = require('./modules/users/createUser');
var deleteuser = require('./modules/users/deleteUser');
var updateuser = require('./modules/users/updateUser');
var getusers=require('./modules/users/getUsers');
var login=require('./modules/common/login');
var consultant_tag=require('./modules/users/tags');
var path = require('path')

var createcompany=require('./modules/enterprise/createcompany');

const app = express();
const port = process.env.PORT || 8080;


// const mkdrip = require('mkdirp')
const multer = require('multer')
var cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(createuser);
app.use(deleteuser);
app.use(updateuser);
app.use(getusers);
app.use(login);
app.use(consultant_tag);
app.use(createcompany);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.setHeader("Content-Type", "application/json");
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
      return res.status(200).json({})
  }
  next()
});

// Start node server
app.listen(port, () => {
  console.log('Express server listening on port', port)
});