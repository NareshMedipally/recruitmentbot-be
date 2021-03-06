const express=require('express');
dbConnection  = require('./db/dbconfig');
var bodyParser=require('body-parser');
var createuser = require('./modules/users/createUser');
var deleteuser = require('./modules/users/deleteUser');
var updateuser = require('./modules/users/updateUser');
var getusers=require('./modules/users/getUsers');
var create_enterprise = require('./modules/enterprise/createEnterprise');
var get_enterprise = require('./modules/enterprise/getEnterprise');
var delete_enterprise = require('./modules/enterprise/deleteEnterprise');
var update_enterprise=require('./modules/enterprise/updateEnterprise');
var login=require('./modules/common/login');
var consultant_tag=require('./modules/users/tags');
var reports=require('./modules/users/report');
var path = require('path')
var consultantInfo = require('./modules/ai-engine/getConsultantInfo')
var stats = require('./modules/users/stats');
var email_auth=require('./modules/common/email_auth');
var fs = require('fs');
// var http = require('http');
// var https = require('https');
// var options = {
//   key: fs.readFileSync('/etc/nginx/ssl/hireswing.key'),
//   cert: fs.readFileSync('/etc/nginx/ssl/hireswing_chained.crt'),
// }

//var createcompany=require('./modules/enterprise/createCompany');

const app = express();
const port = process.env.PORT || 5000;


// const mkdrip = require('mkdirp')
const multer = require('multer')
var cors = require('cors');
app.use(cors());
app.use(express.json());
app.use('/api',createuser);
app.use('/api',deleteuser);
app.use('/api',updateuser);
app.use('/api',getusers);
app.use('/api',login);
app.use('/api',consultant_tag);
app.use('/api',reports);
app.use('/api',stats)
// app.use(createcompany);
app.use('/api',consultantInfo)
app.use('/api',create_enterprise);
app.use('/api',get_enterprise);
app.use('/api',delete_enterprise);
app.use('/api',update_enterprise);
app.use('/api',email_auth);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use('/api/files', express.static(path.join(__dirname, '/uploads')));


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
// var server = https.createServer(options, app).listen(port, function(){
//   console.log("Express server listening on port " + port);
// });


