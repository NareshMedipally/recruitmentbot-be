const express = require('express');
const deleteuser = express.Router();
var dbConnection = require('../../db/dbconfig');
var auth = require('../../middleware/auth');



/*delete single user based on corel_id parameter*/

deleteuser.delete('/deleteuser/:correl_id',auth, function(req, res) 
  {
    var correl_id =req.params.correl_id;
      var sql = ` DELETE FROM user_profile WHERE correl_id="${correl_id}"`;
      dbConnection.query(sql, function(err,cresult, fields) 
      {
        console.log(cresult)
        if(err) 
        {
            throw err;
        }
        res.status(200).json(
            {
                status: 'Success',
                desc: 'User Deleted Successfully!'

            }
        )
      });
  });







module.exports=deleteuser;