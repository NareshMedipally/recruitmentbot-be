const express = require('express');
const botapi = express.Router();
var dbConnection = require('../../db/dbconfig');
botapi.post('/getconsultantinfo', function (req, res) {
    var request = {
        req_id: req.body.requestid,
        email_id:req.body.emaiid

    };
    console.log(request.req_id);
    console.log(request.email_id);
    dbConnection.query("SELECT * from bot_active_recruiters WHERE email_id=?", [request.email_id], function (err, cresult, fields) {
    if(cresult.length>0){
        dbConnection.query("SELECT * from aiengine_source WHERE recruiter_mail_id=?", [request.email_id], function (err, uresult, fields) {
            if (err) {

                throw err;
            }
            res.status(200).json({
                result_code: '300',
                status: 'Active',
                mail_template:uresult.email_template,
                profile_location:uresult.profile_location,
                    tech_tags:uresult.tech_tags,
                    subject_tags:uresult.subject_tags,
                    non_subject_tags:uresult.non_subject_tags
                // consultantinfo({
                //     profile_location:uresult.profile_location,
                //     tech_tags:uresult.tech_tags,
                //     subject_tags:uresult.subject_tags,
                //     non_subject_tags:uresult.non_subject_tags

                // })
            });
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