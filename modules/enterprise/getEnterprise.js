const express = require('express');
const get_enterprise = express.Router();
var dbConnection = require('../../db/dbconfig');
var auth = require('../../middleware/auth');



/*get single company based on correl_id parameter*/

get_enterprise.get('/getEnterprise/:correl_id',auth,function(req,res){

    var correl_id=req.params.correl_id;

    var sql=`SELECT * FROM company WHERE correl_id="${correl_id}"`;
    dbConnection.query(sql,function(err,cresult){
      if(err)
      {
        throw err;
      }
      else
      {
        res.status(200).json({
          status:'success',
          fields:cresult
        });
      }
    });
  });



/*get all company's*/


get_enterprise.get('/getEnterprise',auth,function(req,res){

    var sql=`SELECT * FROM company`;
    dbConnection.query(sql,function(err,cresult){
      if(err)
      {
        throw err;
      }
      else
      {
        res.status(200).json({
          status:'success',
          fields:cresult
        })
      }
    })
  })



  module.exports=get_enterprise;
