const express = require('express');
var uniqid = require('uniqid');
const createuser = express.Router();
var dbConnection = require('../../db/dbconfig');
var generator = require('generate-password');
var auth = require('../../middleware/auth');
var nodemailer = require('nodemailer');
const multer = require('multer');
var templatePath = './../../assets/welcome_email.html';
var handlebars = require('handlebars');
var fs = require('fs');
const path = require('path');

var storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        if(file.fieldname == "resume")
            {
            cb(null, path.join(__dirname, '../../uploads/profiles'))
            }
           else if(file.fieldname == "certificate")
           {
               cb(null,  path.join(__dirname, '../../uploads/certificates'));
           }
           else if(file.fieldname == "driving_license")
           {
               cb(null,  path.join(__dirname, '../../uploads/driving_docs'))
           }else if(file.fieldname == "visa")
           {
               cb(null, path.join(__dirname, '../../uploads/visa_docs'))
           }
    },
    filename:(req,file,cb) =>{
      cb(null,Date.now()+"-"+file.originalname)
    }
  })
let upload = multer({storage})
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
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'mounika.impaxive@gmail.com',
        pass: 'Impaxive@2019'
    }
});

/*create user - superadmin, admin, recruiter */

createuser.post('/createuser',auth, function (req, res) {
    var user_data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email_id: req.body.email_id,
        created_user:req.body.created_user,
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
        visa_status:req.body.visa_status,
        visa_copy_loc:req.body.visa_copy_loc,
        visa_valid_from:req.body.visa_valid_from,
        visa_valid_to:req.body.visa_valid_to,
        DL_copy:req.body.DL_copy,
        DL_valid_from:req.body.DL_valid_from,
        DL_valid_to:req.body.DL_valid_to,
        role_id: req.body.role_type,
        expiry_date: req.body.expiry_date,
        email_template:req.body.email_template,
        comments: req.body.comments
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

                        readHTMLFile( path.join(__dirname, '../../assets/welcome_email.html'), function (err, html) {
                            var template = handlebars.compile(html);
                            var replacements =
                            {
                                name: user_data.first_name,
                                username: user_data.email_id,
                                password: password
                            };
                            var htmlToSend = template(replacements);
                            var mailOptions =
                            {
                                from: 'mounika.impaxive@gmail.com',
                                to: user_data.email_id,
                                subject: 'Sending Email using Node.js',
                                html: htmlToSend
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent to : ' + user_data.email_id + info.response);
                                    res.status(200).json(
                                        {
                                            status: 'success',
                                            desc: 'User Created Successfully'

                                        }
                                    )
                                }
                            });
                        });
                        
                        res.status(200).json(
                            {
                                result_code:200,
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
                        result_code:300,
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

                        readHTMLFile( path.join(__dirname, '../../assets/welcome_email.html'), function (err, html) {
                            var template = handlebars.compile(html);
                            var replacements =
                            {
                                name: user_data.first_name,
                                username: user_data.email_id,
                                password: password
                            };
                            var htmlToSend = template(replacements);
                            var mailOptions =
                            {
                                from: 'mounika.impaxive@gmail.com',
                                to: user_data.email_id,
                                subject: 'Sending Email using Node.js',
                                html: htmlToSend
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent to : ' + user_data.email_id + info.response);
                                    resp_body.status = 'success';
                                    resp_body.msg = 'Admin Created Successfully';
                                    res.status(200).send([resp_body.status, resp_body.msg]);
                                }
                            });
                        });
                        res.status(200).json(
                            {
                                result_code:200,
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
                        result_code:300,
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

                        readHTMLFile( path.join(__dirname, '../../assets/welcome_email.html'), function (err, html) {
                            var template = handlebars.compile(html);
                            var replacements =
                            {
                                name: user_data.first_name,
                                username: user_data.email_id,
                                password: password
                            };
                            var htmlToSend = template(replacements);
                            var mailOptions =
                            {
                                from: 'mounika.impaxive@gmail.com',
                                to: user_data.email_id,
                                subject: 'Sending Email using Node.js',
                                html: htmlToSend
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent to : ' + user_data.email_id + info.response);
                                    resp_body.status = 'success';
                                    resp_body.msg = 'Recruiter Created Successfully';
                                    res.status(200).send([resp_body.status, resp_body.msg]);
                                }
                            });
                        });
                        res.status(200).json(
                            {
                                result_code:200,
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
                        result_code:300,
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
                result_code:400,
                status: 'Failed',
                desc: 'Unknown Role Type'

            }
        )
    }

})



/* Create User - Consultant */

var cpUpload = upload.fields([{ name: 'resume', maxCount: 10 }, { name: 'certificate', maxCount: 8 },{ name: 'driving_license', maxCount: 1 },{name: 'visa', maxCount: 1}])
createuser.post('/createconsultant',cpUpload,auth,function(req,res){
    console.log("req.body",req.body)
console.log("res.file",req.files)
if(req.files){
    var generalInfo = JSON.parse(req.body.generalInfo)
    var contactInfo = JSON.parse(req.body.contactInfo)
    var technologyInfo = JSON.parse(req.body.technology)
    var otherInfo = JSON.parse(req.body.otherInfo)
    var changedResume = JSON.parse(req.body.changedResume)
    var changedCert = JSON.parse(req.body.changedCertificate)
    var resumeFile ="";
    var certificateFile ="";
    var drivingLicenseFile="";
    var visaFile = "";
    if(req.files.resume){
         resumeFile = req.files.resume? req.files.resume:'';
    }
    if(req.files.certificate){
         certificateFile = req.files.certificate?req.files.certificate:'';
    }
    if(req.files.driving_license){
         drivingLicenseFile =req.files.driving_license[0]?req.files.driving_license[0]:''
    }
    if(req.files.visa){
         visaFile =req.files.visa[0]?req.files.visa[0]:""
    }
    

    var user_data = {
        first_name: generalInfo[0].first_name,
        last_name: generalInfo[0].last_name,
         email_id: contactInfo[0].email_id,
         created_user:generalInfo[0].created_user,
        company_name: req.body.company_name,
        phone: contactInfo[0].phone,
        dob:generalInfo[0].dob,
        education:generalInfo[0].education,
        rate:generalInfo[0].rate,
        relocation:contactInfo[0].relocation,
        visa_status:otherInfo[0].visa_status,
        visa_copy_loc:visaFile?'visa_docs/'+visaFile.filename:'',
        visa_valid_from:otherInfo[0].visa_valid_from,
        visa_valid_to:otherInfo[0].visa_valid_to,
        DL_copy:drivingLicenseFile? 'driving_docs/'+drivingLicenseFile.filename:'',
        DL_valid_from:otherInfo[0].DL_valid_from,
        DL_valid_to:otherInfo[0].DL_valid_to,
        role_id: req.body.role_type,
        expiry_date:generalInfo[0].expiry_date,
        email_template:req.body.email_template,
        comments: req.body.comments
    }
    var address = 
    {
        address_line_1:contactInfo[0].address_line_1,
        address_line_2:contactInfo[0].address_line_2,
        zipcode:contactInfo[0].zipcode,
        city:contactInfo[0].city
    }
    var technology =
    {
        total_experience:technologyInfo[0].total_experience,
        usa_experience:technologyInfo[0].usa_experience,
        marketing_phone:technologyInfo[0].marketing_phone,
        marketing_email_id:technologyInfo[0].marketing_email_id,
        linkedIn_url:technologyInfo[0].linkedIn_url,
        tags:technologyInfo[0].tags,
        looking_for_job:technologyInfo[0].looking_for_job,
        subject_tag:technologyInfo[0].subject_tag,
        non_subject_tag:technologyInfo[0].non_subject_tag,
        resume_loc:resumeFile?'profiles/'+resumeFile[0].filename:'',
        certificate_loc: certificateFile?'certificates/'+certificateFile[0].filename:'',
        
    }
       
        var tags=[technology.tags];
        if (user_data.role_id == 4) {
            role_type = "Consultant";
        }
        else {
            role_type = "unknown role";
        }
        console.log(role_type);
        var correl_id = uniqid();
        if(role_type == "Consultant")
        {
            
            var password = generator.generate({
                length: 10,
                numbers: true
            });

            var first_time_login = 'Y';
            dbConnection.query("SELECT * from user_profile WHERE email_id=?", [user_data.email_id], function (err, cresult, fields) {
                if (cresult.length < 1) {
                    // if(req.file)
                    // {
                        var sql = "INSERT INTO user_profile(correl_id,role_id,first_name,last_name,email_id,created_user,company_name,phone,dob,education,rate,relocation,visa_status,visa_copy_loc,visa_valid_from,visa_valid_to,DL_copy,DL_valid_from,DL_valid_to,comments,email_template,role_type,expiry_date,password,first_time_login,primary_email_id) VALUES ?";
                        var VALUES = [[correl_id, user_data.role_id, user_data.first_name, user_data.last_name, user_data.email_id, user_data.created_user,user_data.company_name, user_data.phone,user_data.dob,user_data.education,user_data.rate,user_data.relocation,user_data.visa_status,user_data.visa_copy_loc,user_data.visa_valid_from,user_data.visa_valid_to,user_data.DL_copy,user_data.DL_valid_from,user_data.DL_valid_to, user_data.comments,user_data.email_template, role_type, user_data.expiry_date, password, first_time_login,null]]
                        dbConnection.query(sql, [VALUES], function (err, insresult) {
                            if(err){
                                throw err;
                            }
                            else{
                                var sqladd = "INSERT INTO address(correl_id,name,type,email_id,address_line_1,address_line_2,zipcode,city) VALUES ?";
                                var VALUES = [[correl_id,user_data.first_name,'consultant',user_data.email_id,address.address_line_1,address.address_line_2,address.zipcode,address.city]];
                                dbConnection.query(sqladd,[VALUES],function(err,aresult){
                                    if(err){
                                        throw err;
                                    }
                                    else{
                                        if(technologyInfo.length > 1){
                                            for (var i =0 ;i< technologyInfo.length ; i++){
                                                var tech = technologyInfo[i]
                                                let resume 
                                                let certificate
                                                if(changedResume[i]){
                                                    console.log("changedResume[i]",changedResume[i])
                                                  let actualfile =   resumeFile.filter(x=>x.originalname == changedResume[i])
                                                     resume =  'resume/'+ actualfile[0].filename;
                                                     console.log("resume",resume)
                                                }else{
                                                     resume = ""
                                                }
            
                                                  if(changedCert[i]){
                                                    let actualfile =   certificateFile.filter(x=>x.originalname == changedCert[i])
                                                    certificate =  'certificates/'+ actualfile[0].filename;
                                                  }else{
                                                    certificate = ""
                                                  }
                                                var sqltech = "INSERT INTO technology(correl_id,total_experience,usa_experience,marketing_email_id,marketing_phone,linkedIn_url,resume_loc,certificate_loc,tags,looking_for_job,subject_tag,non_subject_tag,primary_email_id,technology_name) VALUES ?";
                                                var VALUES = [[correl_id,tech.total_experience,tech.usa_experience,tech.marketing_email_id,tech.marketing_phone,tech.linkedIn_url,resume,certificate,tech.tags,tech.looking_for_job,tech.subject_tag,tech.non_subject_tag,user_data.email_id,'Technology']];
                                                dbConnection.query(sqltech,[VALUES],function(err,tresult){
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    else {
                                                       console.log("success")
                                                    }
                                                })   
                                            }
                                            res.status(200).json(
                                                {
                                                    result_code:200,
                                                    status: 'success',
                                                    desc: 'User Created Successfully'
                    
                                                }
                                            )

                                        }else{
                                            var resume = resumeFile ? 'profiles/'+resumeFile[0].filename :'';
                                            var certificate = certificateFile ?'certificates/'+ certificateFile[0].filename:'';
                                        var sqltech = "INSERT INTO technology(correl_id,total_experience,usa_experience,marketing_email_id,marketing_phone,linkedIn_url,resume_loc,certificate_loc,tags,looking_for_job,subject_tag,non_subject_tag,primary_email_id,technology_name) VALUES ?";
                                        var VALUES = [[correl_id,technology.total_experience,technology.usa_experience,technology.marketing_email_id,technology.marketing_phone,technology.linkedIn_url,resume,certificate,technology.tags,technology.looking_for_job,technology.subject_tag,technology.non_subject_tag,user_data.email_id,'Technology']];
                                        dbConnection.query(sqltech,[VALUES],function(err,tresult){
                                            if (err) {
                                                throw err;
                                            }
                                            else {
                                                res.status(200).json(
                                                    {
                                                        result_code:200,
                                                        status: 'success',
                                                        desc: 'User Created Successfully'
                        
                                                    }
                                                )
                                            }
                                        })
                                    }
                                }
                                })
                            }
                        });
                    // }else
                    // {
                    //     res.status(409).json(
                    //         {
                    //             status:'failed',
                    //             desc:'No file Upload'
                    //         }
                    //     )
                    // }
                }
                else {
                    res.status(200).json(
                        {
                            result_code:300,
                            status: 'Failed',
                            desc: 'User Already Exists'

                        }
                    )
                }
            }
            );
        }    else {
            console.log("Role type invalid");
            res.status(200).json(
                {
                    result_code:400,
                    status: 'Failed',
                    desc: 'Unknown Role Type'

                }
            )
        }
    }else{
        console.log("no file found");
        res.status(409).json(
            {
                result_code:409,
                status:'failed',
                desc:'No file Upload'
                        
            }
        )
    }
    })

module.exports=createuser;