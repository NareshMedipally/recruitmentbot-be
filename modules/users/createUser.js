const express = require('express');
var uniqid = require('uniqid');
const createuser = express.Router();
var dbConnection = require('../../db/dbconfig');
var generator = require('generate-password');
var auth = require('../../middleware/auth');
var nodemailer = require('nodemailer');
var templatePath = './../../assets/welcome_email.html';
var handlebars = require('handlebars');
var fs = require('fs');
var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mounika.impaxive@gmail.com',
        pass: 'Impaxive@2019'
    }
});

/*post single user product*/

createuser.post('/createuser',auth, function (req, res) {
    var user_data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email_id: req.body.email_id,
        company_name: req.body.company_name,
        phone: req.body.phone,
        primary_email_id: req.body.primary_email_id,
        generic_email_id: req.body.generic_email_id,
        personal_email_id: req.body.personal_email_id,
        cc_email_id: req.body.cc_email_id,
        bcc_email_id: req.body.bcc_email_id,
        dob:req.body.dob,
        education:req.body.education,
        rate:req.body.rate,
        relocation:req.body.relocation,
        visa_copy_loc:req.body.visa_copy_loc,
        visa_valid_from:req.body.visa_valid_from,
        visa_valid_to:req.body.visa_valid_to,
        DL_copy:req.body.DL_copy,
        DL_valid_from:req.body.DL_valid_from,
        DL_valid_to:req.body.DL_valid_to,
        role_id: req.body.role_type,
        expiry_date: req.body.expiry_date,
        comments: req.body.comments
    }
    var address = 
  {
      address_line_1:req.body.address_line_1,
      address_line_2:req.body.address_line_2,
      zipcode:req.body.zipcode,
      city:req.body.city
  }
  var technology =
  {
      total_experience:req.body.total_experience,
      usa_experience:req.body.usa_experience,
      marketing_phone:req.body.marketing_phone,
      marketing_email_id:req.body.marketing_email_id,
      linkedIn_url:req.body.linkedIn_url,
      tags:req.body.tags,
      resume_loc:req.body.resume_loc,
      certificate_loc:req.body.certificate_loc,
      email_template:req.body.email_template
  }
    console.log(user_data.role_id);
    if (user_data.role_id == 1) {
        role_type = "Super Admin";
    }
    else if (user_data.role_id == 2) {
        role_type = "Admin";
    }
    else if (user_data.role_id == 3) {
        role_type = "Recruiter";
    }
    else if (user_data.role_id == 4) {
        role_type = "Consultant";
    }
    else {
        role_type = "unknown role";
    }
    console.log(role_type);
    var correl_id = uniqid();
    if (role_type == "Super Admin") {
        var password = generator.generate({
            length: 10,
            numbers: true
        });

        var first_time_login = 'Y';
        user_data.expiry_date = '2100-12-31';
        dbConnection.query("SELECT * from user_profile WHERE email_id=?", [user_data.email_id], function (err, cresult, fields) {
            if (cresult.length < 1) {
                var sql = "INSERT INTO user_profile(correl_id,role_id,first_name,last_name,email_id,company_name,phone,comments,role_type,expiry_date,password,first_time_login) VALUES ?";
                var VALUES = [[correl_id, user_data.role_id, user_data.first_name, user_data.last_name, user_data.email_id, user_data.company_name, user_data.phone, user_data.comments, role_type, user_data.expiry_date, password, first_time_login]]
                dbConnection.query(sql, [VALUES], function (err, insresult) {
                    if (err) {
                        throw err;
                    }
                    else {

                        // readHTMLFile(__dirname + templatePath, function (err, html) {
                        //     var template = handlebars.compile(html);
                        //     var replacements =
                        //     {
                        //         name: user_data.first_name,
                        //         username: user_data.email_id,
                        //         password: password
                        //     };
                        //     var htmlToSend = template(replacements);
                        //     var mailOptions =
                        //     {
                        //         from: 'mounika.impaxive@gmail.com',
                        //         to: user_data.email_id,
                        //         subject: 'Sending Email using Node.js',
                        //         html: htmlToSend
                        //     };

                        //     transporter.sendMail(mailOptions, function (error, info) {
                        //         if (error) {
                        //             console.log(error);
                        //         } else {
                        //             console.log('Email sent to : ' + user_data.email_id + info.response);
                        //             res.status(200).json(
                        //                 {
                        //                     status: 'success',
                        //                     desc: 'User Created Successfully'

                        //                 }
                        //             )
                        //         }
                        //     });
                        // });
                        
                        res.status(200).json(
                            {
                                status: 'success',
                                desc: 'User Created Successfully'

                            }
                        )
                    }
                });
            }
            else {
                res.status(200).json(
                    {
                        status: 'Failed',
                        desc: 'User Already Exists'

                    }
                )
            }
        }
        );
    }
    else if (role_type == "Admin") {
        var password = generator.generate({
            length: 10,
            numbers: true
        });

        var first_time_login = 'Y';
        dbConnection.query("SELECT * from user_profile WHERE email_id=?", [user_data.email_id], function (err, cresult, fields) {
            if (cresult.length < 1) {
                var sql = "INSERT INTO user_profile(correl_id,role_id,first_name,last_name,email_id,company_name,phone,comments,role_type,expiry_date,password,first_time_login) VALUES ?";
                var VALUES = [[correl_id, user_data.role_id, user_data.first_name, user_data.last_name, user_data.email_id, user_data.company_name, user_data.phone, user_data.comments, role_type, user_data.expiry_date, password, first_time_login]]
                dbConnection.query(sql, [VALUES], function (err, insresult) {
                    if (err) {
                        throw err;
                    }
                    else {

                        // readHTMLFile(__dirname + templatePath, function (err, html) {
                        //     var template = handlebars.compile(html);
                        //     var replacements =
                        //     {
                        //         name: user_data.first_name,
                        //         username: user_data.email_id,
                        //         password: password
                        //     };
                        //     var htmlToSend = template(replacements);
                        //     var mailOptions =
                        //     {
                        //         from: 'mounika.impaxive@gmail.com',
                        //         to: user_data.email_id,
                        //         subject: 'Sending Email using Node.js',
                        //         html: htmlToSend
                        //     };

                        //     transporter.sendMail(mailOptions, function (error, info) {
                        //         if (error) {
                        //             console.log(error);
                        //         } else {
                        //             console.log('Email sent to : ' + user_data.email_id + info.response);
                        //             resp_body.status = 'success';
                        //             resp_body.msg = 'Admin Created Successfully';
                        //             res.status(200).send([resp_body.status, resp_body.msg]);
                        //         }
                        //     });
                        // });
                        res.status(200).json(
                            {
                                status: 'success',
                                desc: 'User Created Successfully'

                            }
                        )
                    }
                });
            }
            else {
                res.status(200).json(
                    {
                        status: 'failed',
                        desc: 'User Already Exists'

                    }
                )
            }
        }
        );
    }
    else if (role_type == "Recruiter") {

        var password = generator.generate({
            length: 10,
            numbers: true
        });

        var first_time_login = 'Y';
        dbConnection.query("SELECT * from user_profile WHERE email_id=?", [user_data.email_id], function (err, cresult, fields) {
            if (cresult.length < 1) {
                var sql = "INSERT INTO user_profile(correl_id,role_id,first_name,last_name,email_id,company_name,phone,primary_email_id,generic_email_id,personal_email_id,cc_email_id,bcc_email_id,comments,role_type,expiry_date,password,first_time_login) VALUES ?";
                var VALUES = [[correl_id, user_data.role_id, user_data.first_name, user_data.last_name, user_data.email_id, user_data.company_name, user_data.phone, user_data.primary_email_id, user_data.generic_email_id, user_data.personal_email_id, user_data.cc_email_id, user_data.bcc_email_id, user_data.comments, role_type, user_data.expiry_date, password, first_time_login]]
                dbConnection.query(sql, [VALUES], function (err, insresult) {
                    if (err) {
                        throw err;
                    }
                    else {

                        // readHTMLFile(__dirname + templatePath, function (err, html) {
                        //     var template = handlebars.compile(html);
                        //     var replacements =
                        //     {
                        //         name: user_data.first_name,
                        //         username: user_data.email_id,
                        //         password: password
                        //     };
                        //     var htmlToSend = template(replacements);
                        //     var mailOptions =
                        //     {
                        //         from: 'mounika.impaxive@gmail.com',
                        //         to: user_data.email_id,
                        //         subject: 'Sending Email using Node.js',
                        //         html: htmlToSend
                        //     };

                        //     transporter.sendMail(mailOptions, function (error, info) {
                        //         if (error) {
                        //             console.log(error);
                        //         } else {
                        //             console.log('Email sent to : ' + user_data.email_id + info.response);
                        //             resp_body.status = 'success';
                        //             resp_body.msg = 'Recruiter Created Successfully';
                        //             res.status(200).send([resp_body.status, resp_body.msg]);
                        //         }
                        //     });
                        // });
                        res.status(200).json(
                            {
                                status: 'success',
                                desc: 'User Created Successfully'

                            }
                        )
                    }
                });
            }
            else {
                res.status(200).json(
                    {
                        status: 'Failed',
                        desc: 'User Already Exists'

                    }
                )
            }
        }
        );
    }else if(role_type == "Consultant")
    {
        
        var password = generator.generate({
            length: 10,
            numbers: true
        });

        var first_time_login = 'Y';
        dbConnection.query("SELECT * from user_profile WHERE email_id=?", [user_data.email_id], function (err, cresult, fields) {
            if (cresult.length < 1) {
                var sql = "INSERT INTO user_profile(correl_id,role_id,first_name,last_name,email_id,company_name,phone,dob,education,rate,relocation,visa_copy_loc,visa_valid_from,visa_valid_to,DL_copy,DL_valid_from,DL_valid_to,comments,role_type,expiry_date,password,first_time_login) VALUES ?";
                var VALUES = [[correl_id, user_data.role_id, user_data.first_name, user_data.last_name, user_data.email_id, user_data.company_name, user_data.phone,user_data.dob,user_data.education,user_data.rate,user_data.relocation,user_data.visa_copy_loc,user_data.visa_valid_from,user_data.visa_valid_to,user_data.DL_copy,user_data.DL_valid_from,user_data.DL_valid_to, user_data.comments, role_type, user_data.expiry_date, password, first_time_login]]
                dbConnection.query(sql, [VALUES], function (err, insresult) {
                    if(err){
                        throw err;
                    }
                    else{
                        var sqladd = "INSERT INTO address(correl_id,name,email_id,address_line_1,address_line_2,zipcode,city) VALUES ?";
                        var VALUES = [[correl_id,user_data.company_name,user_data.email_id,address.address_line_1,address.address_line_2,address.zipcode,address.city]];
                        dbConnection.query(sqladd,[VALUES],function(err,aresult){
                            if(err){
                                throw err;
                            }
                            else{
                                var sqltech = "INSERT INTO technology(correl_id,total_experience,usa_experience,marketing_email_id,marketing_phone,linkedIn_url,resume_loc,certificate_loc,tags,email_template) VALUES ?";
                                var VALUES = [[correl_id,technology.total_experience,technology.usa_experience,technology.marketing_email_id,technology.marketing_phone,technology.linkedIn_url,technology.resume_loc,technology.certificate_loc,technology.tags,technology.email_template]];
                                dbConnection.query(sqltech,[VALUES],function(err,tresult){
                                    if (err) {
                                        throw err;
                                    }
                                    else {
                
                                        // readHTMLFile(__dirname + templatePath, function (err, html) {
                                        //     var template = handlebars.compile(html);
                                        //     var replacements =
                                        //     {
                                        //         name: user_data.first_name,
                                        //         username: user_data.email_id,
                                        //         password: password
                                        //     };
                                        //     var htmlToSend = template(replacements);
                                        //     var mailOptions =
                                        //     {
                                        //         from: 'mounika.impaxive@gmail.com',
                                        //         to: user_data.email_id,
                                        //         subject: 'Sending Email using Node.js',
                                        //         html: htmlToSend
                                        //     };
                
                                        //     transporter.sendMail(mailOptions, function (error, info) {
                                        //         if (error) {
                                        //             console.log(error);
                                        //         } else {
                                        //             console.log('Email sent to : ' + user_data.email_id + info.response);
                                        //             resp_body.status = 'success';
                                        //             resp_body.msg = 'Consultatnt Created Successfully';
                                        //             res.status(200).send([resp_body.status, resp_body.msg]);
                                        //         }
                                        //     });
                                        // });
                                        res.status(200).json(
                                            {
                                                status: 'success',
                                                desc: 'User Created Successfully'
                
                                            }
                                        )
                                    }
                                })
                            }
                        })
                    }
                });
            }
            else {
                res.status(200).json(
                    {
                        status: 'Failed',
                        desc: 'User Already Exists'

                    }
                )
            }
        }
        );
    }
    else {
        console.log("Role type invalid");
        res.status(200).json(
            {
                status: 'Failed',
                desc: 'Unknown Role Type'

            }
        )
    }

})



module.exports=createuser;