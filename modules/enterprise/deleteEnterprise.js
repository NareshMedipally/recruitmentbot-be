const express = require('express');
const delete_enterprise = express.Router();
var dbConnection = require('../../db/dbconfig');
var auth = require('../../middleware/auth');


/*delete single coompany based on corel_id parameter*/

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
        res.status(200).json({
          status:'success',
          desc:'Record Deleted Successfully'
        });
      }
    });
  });


module.exports=delete_enterprise;