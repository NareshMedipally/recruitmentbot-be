const express = require('express');
const botapi = express.Router();
var dbConnection = require('../../db/dbconfig');
botapi.post('/getconsultantinfo', function (req, res) {
    var request = {
        req_id: req.body.requestid,
        email_id:req.body.emailid

    };
    console.log(request.req_id);
    console.log(request.email_id);
    dbConnection.query("SELECT * from bot_active_recruiters WHERE recruiter_primary_email_id=?", [request.email_id], function (err, cresult, fields) {
console.log("cresult",cresult)
 if(cresult && cresult.length > 0){
    dbConnection.query('SELECT * FROM user_profile WHERE email_id =?', [request.email_id], function (err, result) {
       let userResult = JSON.parse(JSON.stringify(result))
       console.log("userResult",userResult)
        if (err) 
        {
            throw err;
        }
        else
        {
            dbConnection.query("SELECT * from aiengine_source WHERE recruiter_mail_id=?", [request.email_id], function (err, uresult, fields) {
                console.log("uresult",uresult)
                if (err) {

                    throw err;            }
    if(uresult && uresult.length > 0){
                    uresult.forEach(element => {
                        delete element.correl_id
                        delete element. email_template
                        delete element. consultant_first_name
                        delete element. consultant_primary_email_id
                        delete element. recruiter_mail_id
    
                    });
                }
     res.status(200).json({
                    result_code: '300',
    
                    status: 'Active',
                 ' consultant_Info' :uresult,
                'cc_email_id':userResult[0].cc_email_id,
                'bcc_email_id':userResult[0].bcc_email_id,
                "mail_template":"Hi,Please find the attached resumes"

                    // consultantinfo({
                    //     profile_location:uresult.profile_location,
                    //     tech_tags:uresult.tech_tags,
                    //     subject_tags:uresult.subject_tags,
                     //     non_subject_tags:uresult.non_subject_tags

                // })
            });
        });
        }
    });
    }
    else{
        res.status(200).json(
            {
                result_code: '300',
                status: 'Inactive'

            }
        )
    }
    }
    );

});
module.exports=botapi;
                               
                                    