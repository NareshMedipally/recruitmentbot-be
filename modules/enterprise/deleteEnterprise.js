const express = require('express');
const delete_enterprise = express.Router();
var dbConnection = require('../../db/dbconfig');
var auth = require('../../middleware/auth');


/*delete enterprise/company */

delete_enterprise.delete('/deleteEnterprise/:correl_id',auth,function(req,res){

    var correl_id=req.params.correl_id;
    
    var sql=`DELETE FROM company WHERE correl_id="${correl_id}"`;
    dbConnection.query(sql,function(err,cresult){
      if(err)
      {
        throw err;
      }
      else
      {
        var sqladd = `DELETE FROM address WHERE correl_id="${correl_id}"`;
        dbConnection.query(sqladd,function(err){
          if(err)
          {
            throw err;
          }else
          {
            res.status(200).json({
              result_code:200,
              status:'success',
              desc:'Record Deleted Successfully'
            })
          }
        })
      }
    });
  });


module.exports=delete_enterprise;