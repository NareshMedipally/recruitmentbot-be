const express = require('express');
const login = express.Router();
var dbConnection = require('../../db/dbconfig');
var jwt = require('jsonwebtoken');
var generator = require('generate-password');
var auth=require('./../../middleware/auth');
var nodemailer = require('nodemailer');
var templatePath = './../../assets/welcome_email.html';
var handlebars = require('handlebars');
var fs = require('fs');
var resp_body={
    status:'',
    msg:''
}
process.env.SECRET_KEY="thisismysecretkey";
login.post('/user',function(req,res){
    var email_id=req.body.email_id;
    var password=req.body.password;
    
    if(email_id&&password){
        console.log(email_id);
        console.log(password);
        dbConnection.query("SELECT * FROM users_login where email_id=? and password=? and expiry_date>=CURDATE()",[email_id, password], function (err, eresult, fields) 
        {
            
            if(eresult.length>0)
            {
                var cname=eresult[0].company_name;
                dbConnection.query("select * from company WHERE company_name = ? AND valid_to >= CURDATE()",[cname], function (err, cresult, fields)
                    {
                        if(cresult.length==1){
                            var token=jwt.sign({
                                id:fields[0].toString()
                            },
                            process.env.SECRET_KEY,{

                            }

                            );
                            res.status(200).json(
                                {
                                    status:200,
                                    token:token,
                                    company_Name:eresult[0].company_name,
                                    user_id:eresult[0].user_id,
                                    correl_id:eresult[0].correl_id,
                                    email_id:eresult[0].email_id,
                                    first_time_login:eresult[0].first_time_login,
                                    role_id:eresult[0].role_id
                                    
                                    
                                }
                            )
                        }
                        else{
                            res.status(200).json(
                                {
                                    result_code:300,
                                    desc:'Company Account is Expired'
                                })
                            
                        }
                        console.log(cresult)
                });
                
            }
            
            else{
                res.status(200).json(
                    {
                        result_code:400,
                        desc:'Invalid Username or Password'
                    })
            }
            
        }
        )
    }
});


login.put('/user/forgot-password/:correl_id',function(req,res){
    var email_id = req.body.email_id;
    var correl_id = req.params.correl_id;
    var first_time_login ='Y';
    var password = generator.generate({
        length: 10,
        numbers: true
    });

    // var readHTMLFile = function(path, callback) 
    //     {
    //       fs.readFile(path, {encoding: 'utf-8'}, function (err, html) 
    //       {
    //           if (err) 
    //           {
    //               throw err;
    //               callback(err);
    //           }
    //           else 
    //           {
    //               callback(null, html);
    //           }
    //       });
    //     };
        // var transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //       user: 'mounika.impaxive@gmail.com',
        //       pass: 'Impaxive@2019'
        //     }
        //   });
          dbConnection.query("SELECT * FROM user_profile WHERE email_id=? AND correl_id=?",[email_id,correl_id],
          function(err,fresult){
              if(fresult.length==1){
                var sqlforgot = `UPDATE user_profile SET password="${password}",first_time_login="${first_time_login}" WHERE email_id="${email_id}" AND correl_id="${correl_id}"`;
                dbConnection.query(sqlforgot,function(err,result){
                    if(err)
                    {
                        throw err;
                    }else
                    {
                    // readHTMLFile(__dirname + templatePath, function(err, html) 
                    //     {
                    //     var template = handlebars.compile(html);
                    //     var replacements = 
                    //     {
                    //         // name:first_name,
                    //         username: email_id,
                    //         password:password
            
                    //     };
                    //     var htmlToSend = template(replacements);
                    //     var mailOptions = 
                    //     {
                    //             from: 'mounika.impaxive@gmail.com',
                    //             to: email_id,
                    //             subject: 'Sending Email using Node.js',
                    //             html : htmlToSend
                    //     };
                        
                    //     transporter.sendMail(mailOptions, function(error, info)
                    //     {
                    //         if (error) 
                    //         {
                    //         console.log(error);
                    //         } else 
                    //         {
                    //         console.log('Email sent to : ' +email_id + info.response);
                    //         resp_body.status='success';
                    //         resp_body.msg='Password Changed Successfully';
                    //         res.status(200).send([resp_body.status,resp_body.msg]);
                    //         }
                    //     });
                    //     });
                            
                            res.status(200).json({
                                status:'success',
                                desc: 'Password Changed Successfully'
                                
                            })
                    }
                })
              }
              else{
                res.status(200).json({
                    status:'failed!',
                    desc: 'Invalid Email Address'
                    
                })
              }
          })
    
})



login.put('/user/changePassword/:correl_id',auth,function(req,res){
    var confirmPassword = req.body.confirmPassword;
    var newPassword = req.body.newPassword;
    var correl_id = req.params.correl_id;
    var first_time_login = 'N'
    if(newPassword !== confirmPassword)
    {
        res.status(500).json({
            status:'failed!',
            desc: 'New Password & Confirm Password Should be same!'
            
        })
    }
    else
    {
        dbConnection.query("SELECT * FROM user_profile WHERE correl_id=?",[correl_id],function(err,upresult){
            if(upresult.length==1)
            {
                var sqluser = `UPDATE user_profile SET password = "${newPassword}" , first_time_login="${first_time_login}" WHERE correl_id="${correl_id}"`;
                dbConnection.query(sqluser,function(err,uresult){
                    if(err)
                    {
                        throw err;
                    }
                    res.status(200).json({
                        status:'Success',
                        desc: 'Password Updated Successfully!'
                        
                    })
                })
            }else
            {
                res.status(200).json({
                    status:'failed!',
                    desc: 'New Password and Username does not match!'
                    
                })
            
            }
        })
    }

})

module.exports=login;