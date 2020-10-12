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






  /*get single user based on correl_id parameter*/

deleteuser.delete('/deleteconsultatnt/:correl_id',auth, function (req, res) {

  var correl_id = req.params.correl_id;

  var sql = `DELETE FROM user_profile WHERE correl_id="${correl_id}"`;
  dbConnection.query(sql, function (err, uresult) {
      console.log(uresult)
      if (err) 
      {
          throw err;
      }
      else
      {
          var sqladd = `DELETE FROM address WHERE correl_id="${correl_id}"`;
          dbConnection.query(sqladd,function(err,addresult){
              if(err)
              {
                  throw err;
              }
              else
              {
                  var sqltech = `DELETE FROM technology WHERE correl_id="${correl_id}"`;
                  dbConnection.query(sqltech,function(err,techresult){
                      if(err)
                      {
                          throw err;
                      }else
                      {
                          res.status(200).json({
                              status:'Success',
                              fields: uresult,techresult,addresult
                              
                          });
                      }
                  })
              }
          })
      }

  });
});



module.exports=deleteuser;