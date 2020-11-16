const express = require('express');
const email_auth = express.Router();
var dbConnection = require('../../db/dbconfig');
var auth = require('../../middleware/auth');



/*Create email auth */

email_auth.post('/emailAuth',function(req,res){
    var email_id=req.body.email_id;
    var refresh_token=req.body.refresh_token;

    var sql = "INSERT INTO email_authorization(email_id,refresh_token) VALUES ?";
    var VALUES = [[email_id,refresh_token]];
    dbConnection.query(sql,[VALUES],function(err,results){
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
                    desc: 'Email Auth Created Successfully'

                }
            )
        }
    });

});



/*get email auth info */

email_auth.post('/emailauthinfo', function (req, res) {
    var email_id = req.body.email_id;

    var sql = `SELECT * FROM email_authorization WHERE email_id="${email_id}"`;
    dbConnection.query(sql, function (err, eresult) {
        console.log(eresult)
        if (err) {
            throw err;
        }
        res.status(200).json({
            result_code:200,
            status:'Success',
            fields: eresult,
        });

    });
});


module.exports=email_auth;