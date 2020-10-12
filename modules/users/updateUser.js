
const express = require('express');
var uniqid = require('uniqid');
const updateuser = express.Router();
var dbConnection = require('../../db/dbconfig');
var auth=require('./../../middleware/auth')


var resp_body={
    status:'',
    msg:''
}



/*update single user based on correl_id parameter*/

updateuser.put('/updateuser/:correl_id',auth, (req,res) =>
{
  var user_data={
    first_name:req.body.first_name,
    last_name:req.body.last_name,
    primary_email_id:req.body.primary_email_id,
    generic_email_id:req.body.generic_email_id,
    personal_email_id:req.body.personal_email_id,
    cc_email_id:req.body.cc_email_id,
    bcc_email_id:req.body.bcc_email_id,
    phone:req.body.phone,
    role_id:req.body.role_type,
    expiry_date:req.body.expiry_date,
    comments:req.body.comments
}

  var correl_id= req.params.correl_id;

  if (user_data.role_id == 1){
      role_type="Super Admin";
  }
  else if(user_data.role_id == 2){
      role_type="Admin";
  }
  else if(user_data.role_id == 3){
      role_type="Recruiter";
  }
  else{
      role_type="unknown role";
  }
  
  if(role_type == "Super Admin")
  {

      var sqluser_profile = `UPDATE user_profile SET first_name="${user_data.first_name}",last_name="${user_data.last_name}",phone="${user_data.phone}",comments="${user_data.comments}" WHERE correl_id="${correl_id}"`;
      dbConnection.query(sqluser_profile,function(err,userresult){
          console.log(user_data);
          if(err)
          {
             throw err;
          }
          else{
            res.status(200).json(
                {
                    status: 'success',
                    desc: 'Record Updated Successfully'

                }
            )
            // resp_body.status = 'success';
            // resp_body.msg = 'Record Updated Successfully';
            // res.status(200).send([resp_body.status, resp_body.msg]);
          }
      })
        
  }
  else if(role_type == 'Admin')
  {

      var sql2 = `UPDATE user_profile SET first_name="${user_data.first_name}",last_name="${user_data.last_name}",phone="${user_data.phone}",expiry_date="${user_data.expiry_date}",comments="${user_data.comments}" WHERE correl_id="${correl_id}"`;
      dbConnection.query(sql2,function(err,userresult){
          console.log(user_data);
          if(err)
          {
              throw err;
          }
          else{
            res.status(200).json(
                {
                    status: 'success',
                    desc: 'Record Updated Successfully'

                }
            )

            // resp_body.status = 'success';
            // resp_body.msg = 'Record Updated Successfully';
            // res.status(200).send([resp_body.status, resp_body.msg]);
          }
      })
        
  }
  else if(role_type == 'Recruiter')
  {

      var sql3 = `UPDATE user_profile SET first_name="${user_data.first_name}",last_name="${user_data.last_name}",phone="${user_data.phone}",expiry_date="${user_data.expiry_date}",primary_email_id="${user_data.primary_email_id}",generic_email_id="${user_data.generic_email_id}",personal_email_id="${user_data.personal_email_id}",cc_email_id="${user_data.cc_email_id}",bcc_email_id="${user_data.bcc_email_id}",comments="${user_data.comments}" WHERE correl_id="${correl_id}"`;
      dbConnection.query(sql3,function(err,userresult){
          console.log(user_data);
          if(err)
          {
              throw err;
          }
          else{
            res.status(200).json(
                {
                    status: 'success',
                    desc: 'Record Updated Successfully'

                }
            )
            // resp_body.status = 'success';
            // resp_body.msg = 'Record Updated Successfully';
            // res.status(200).send([resp_body.status, resp_body.msg]);
          }
      })
        
  }
  else
  {
    res.status(500).send({err:'Invalid Role Type or Id'})
  }

});




/*update botstatus  based on email_id parameter*/

updateuser.put('/botstatus',function(req,res){
    var bot_status=req.body.bot_status;
    var email_id = req.body.email_id;

   var sqlbot=`UPDATE user_profile SET bot_status="${bot_status}" WHERE email_id="${email_id}"`;
   dbConnection.query(sqlbot,function(err,bresult){
       if(err)
       {
           throw err;
       }
       else
       {
        res.status(200).json(
            {
                status: 'success',
                desc: 'Bot Status Updated Successfully'

            }
        )
       }
   })
})


module.exports = updateuser;