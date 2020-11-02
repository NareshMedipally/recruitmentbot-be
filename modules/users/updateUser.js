
const express = require('express');
const updateuser = express.Router();
var dbConnection = require('../../db/dbconfig');
var auth=require('./../../middleware/auth');
const multer = require('multer');
const path = require('path');

var resp_body={
    status:'',
    msg:''
}



var storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        if(file.fieldname == "upresume")
            {
            cb(null, path.join(__dirname, '../../uploads/profiles'))
            }
           else if(file.fieldname == "upcertificate")
           {
               cb(null,  path.join(__dirname, '../../uploads/certificates'));
           }
           else if(file.fieldname == "updriving_license")
           {
               cb(null,  path.join(__dirname, '../../uploads/driving_docs'))
           }else if(file.fieldname == "upvisa")
           {
               cb(null, path.join(__dirname, '../../uploads/visa_docs'))
           }
    },
    filename:(req,file,cb) =>{
      cb(null,Date.now() + '-'+ file.originalname)
    }
  })
let upload = multer({storage})


/*update user - admin,recruiter,superadmin*/

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
                    result_code:200,
                    status: 'success',
                    desc: 'Record Updated Successfully'

                }
            )
          }
      });
        
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
      });
        
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
                    result_code:200,
                    status: 'success',
                    desc: 'Record Updated Successfully'

                }
            )
          }
      });
        
  }
  else
  {
    res.status(500).send({err:'Invalid Role Type or Id'})
  }

});




/*update botstatus*/

updateuser.put('/botstatus',auth,function(req,res){
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
                result_code:200,
                status: 'success',
                desc: 'Bot Status Updated Successfully'

            }
        )
       }
   });
});




/* update Consultant */


var cpUpload = upload.fields([{ name: 'upresume', maxCount: 10 }, { name: 'upcertificate', maxCount: 8 },{ name: 'updriving_license', maxCount: 1 },{name: 'upvisa', maxCount: 1}])
  updateuser.put('/updateconsultant/:correl_id',cpUpload,auth,    function (req,res){
    console.log("req.body",req.body)
    console.log("res.file",req.files)
    console.log("res.params",req.params)
//     let existingUserData=[];
//     let existingAddressData=[];
//     let existingtechnologyData=[];
   
//     let p1 = 
//     new Promise((resolve, reject) => {dbConnection.query("SELECT * FROM user_profile WHERE correl_id=?",[req.params.correl_id],
//     function(err,tresult){
//         console.log("tresult",tresult);
//         existingUserData =   JSON.parse(JSON.stringify(tresult));
//         console.log("existingUserData",existingUserData);
//                         if (err) {
//                             reject(err)
//                             throw err
                          
//                         } else {
//                             resolve( JSON.parse(JSON.stringify(tresult)))
//                         }

//     })
// })
//     let p2= 
//     new Promise((resolve, reject) => {
//         dbConnection.query("SELECT * FROM technology WHERE correl_id=?",[req.params.correl_id],
//     function(err,tresult){
//         if (err) {
//             throw err
//         } else {
//             resolve( JSON.parse(JSON.stringify(tresult)))
//         }
        
//     })
// })
//     let p3 =    
//     new Promise((resolve, reject) => { dbConnection.query("SELECT * FROM address WHERE correl_id=?",[req.params.correl_id],
//     function(err,tresult){
//         if (err) {
//             throw err
//         } else {
//             resolve( JSON.parse(JSON.stringify(tresult)))
//         }
        
//     })
// })
// Promise.all([p1, p2, p3])
//     .then(results => {
//         console.log("promise",results)
//     });
//     console.log("existingUserData",existingUserData);
//     console.log("existingAddressData",existingAddressData);
//     console.log("existingtechnologyData",existingtechnologyData);
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
    console.log("changedResume",changedResume);
    console.log("technologyInfo",technologyInfo.length);
    if(req.files.upresume){
         resumeFile = req.files.upresume? req.files.upresume:'';
    }
    if(req.files.upcertificate){
         certificateFile = req.files.upcertificate?req.files.upcertificate:'';
    }
    if(req.files.updriving_license){
         drivingLicenseFile =req.files.updriving_license[0]?req.files.updriving_license[0]:''
    }
    if(req.files.upvisa){
         visaFile =req.files.upvisa[0]?req.files.upvisa[0]:""
    }
    

    var user_data = {
        first_name: generalInfo[0].first_name,
        last_name: generalInfo[0].last_name,
        created_user:generalInfo[0].created_user,
        company_name: req.body.company_name,
        phone: contactInfo[0].phone,
        dob:generalInfo[0].dob,
        education:generalInfo[0].education,
        rate:generalInfo[0].rate,
        relocation:contactInfo[0].relocation,
        visa_status:otherInfo[0].visa_status,
        visa_copy_loc:visaFile?'visa_docs/'+visaFile.filename:otherInfo[0].visa_copy_loc,
        visa_valid_from:null,
        visa_valid_to:null,
        DL_copy:drivingLicenseFile?'driving_docs/'+ drivingLicenseFile.filename:otherInfo[0].DL_copy,
        DL_valid_from:null,
        DL_valid_to:null,
        role_id: 4 ,
        expiry_date:generalInfo[0].expiry_date,
        email_template:req.body.email_template,
        comments: req.body.comments
    }
    if(otherInfo[0].visa_valid_from == null){
        user_data.visa_valid_from = null
    }else{
        user_data.visa_valid_from =otherInfo[0].visa_valid_from
    }
    
    if(otherInfo[0].visa_valid_to == null){
        user_data.visa_valid_to = null

    }else{
        user_data.visa_valid_to =otherInfo[0].visa_valid_to
    }
    
    if(otherInfo[0]. DL_valid_from == null){
        user_data.DL_valid_from = null

    }
    else{
        user_data.DL_valid_from =otherInfo[0].DL_valid_from
    }
    if(otherInfo[0].DL_valid_to == null){
        user_data.DL_valid_to = null

    }else{
        user_data.DL_valid_to =otherInfo[0].DL_valid_to
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
        resume_loc:resumeFile? resumeFile[0].filename:technologyInfo[0].resume_loc,
        certificate_loc: certificateFile?certificateFile[0].filename:technologyInfo[0].certificate_loc,
        
    }
    var correl_id = req.params.correl_id;
        if (user_data.role_id == 4) {
            role_type = "Consultant";
        }
        else {
            role_type = "unknown role";
        }
        console.log(role_type);
       
        if(role_type == "Consultant")
        {
 
            var sql = `UPDATE user_profile SET first_name="${user_data.first_name}",last_name="${user_data.last_name}",phone="${user_data.phone}",dob="${user_data.dob}",education="${user_data.education}",rate="${user_data.rate}",relocation="${user_data.relocation}",visa_status="${user_data.visa_status}",visa_copy_loc="${user_data.visa_copy_loc}",visa_valid_from="${user_data.visa_valid_from}",visa_valid_to="${user_data.visa_valid_to}",DL_copy="${user_data.DL_copy}",DL_valid_from="${user_data.DL_valid_from}",DL_valid_to="${user_data.DL_valid_to}",comments="${user_data.comments}",email_template="${user_data.email_template}" WHERE correl_id="${correl_id}"`;
            
            dbConnection.query(sql, function (err, insresult) {
                if(err){
                    throw err;
                }
                else{
                    var sqladd = `UPDATE address SET name="${user_data.first_name}", address_line_1="${address.address_line_1}",address_line_2="${address.address_line_2}",zipcode="${address.zipcode}",city="${address.city}" WHERE correl_id="${correl_id}"`;
                    
                    dbConnection.query(sqladd,function(err,aresult){
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
                                      console.log("changedResume[i] actualfile",actualfile)
                                         resume =  'profiles/'+ actualfile[0].filename;
                                         console.log("resume",resume)
                                    }else{
                                         resume = technologyInfo[i].resume_loc;
                                    }

                                      if(changedCert[i]){
                                        let actualfile =   certificateFile.filter(x=>x.originalname == changedCert[i])
                                        certificate =  'certificates/'+ actualfile[0].filename;
                                      }else{
                                        certificate = technologyInfo[i].certificate_loc
                                      }
                                  
                                  //  var certificate = certificateFile ? 'certificates/'+certificateFile[i].filename:technologyInfo[i].certificate_loc;
                                    var sqltech = `UPDATE technology SET total_experience="${tech.total_experience}",usa_experience="${tech.usa_experience}",marketing_email_id="${tech.marketing_email_id}",marketing_phone="${tech.marketing_phone}",linkedIn_url="${tech.linkedIn_url}",resume_loc="${resume}",certificate_loc="${certificate}",tags="${tech.tags}",looking_for_job="${tech.looking_for_job}",subject_tag="${tech.subject_tag}",non_subject_tag="${tech.non_subject_tag}" WHERE technology_id="${tech.technology_id}"`;
                                    dbConnection.query(sqltech,function(err,tresult){
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

                            }
                        else
                        {
                                var resume = resumeFile ? 'profiles/'+resumeFile[0].filename :technology.resume_loc;
                                var certificate = certificateFile ? 'certificates/'+certificateFile[0].filename:technology.certificate_loc;
                                var sqltech = `UPDATE technology SET total_experience="${technology.total_experience}",usa_experience="${technology.usa_experience}",marketing_email_id="${technology.marketing_email_id}",marketing_phone="${technology.marketing_phone}",linkedIn_url="${technology.linkedIn_url}",resume_loc="${resume}",certificate_loc="${certificate}",tags="${technology.tags}",looking_for_job="${technology.looking_for_job}",subject_tag="${technology.subject_tag}",non_subject_tag="${technology.non_subject_tag}" WHERE correl_id="${correl_id}"`;
                                dbConnection.query(sqltech,function(err,tresult)
                            {
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
                            });
                        }
                    }
                    });
                }
            });
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
    });


module.exports = updateuser;