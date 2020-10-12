const e = require('express');
const express = require('express');
const getusers = express.Router();
var dbConnection = require('../../db/dbconfig');
var auth = require('../../middleware/auth')

/*get all users*/

getusers.get('/getusers',auth, function (req, res) {
    var sql = "SELECT * FROM user_profile";
    dbConnection.query(sql, function (err, uresult) {
        if (err) {

            throw err;
        }
        res.status(200).json({
            status:'Success',
            fields: uresult,
        });
    })


})

/*get single user based on correl_id parameter*/

getusers.get('/getuser/:correl_id',auth, function (req, res) {

    var correl_id = req.params.correl_id;

    var sql = `SELECT * FROM user_profile WHERE correl_id="${correl_id}"`;
    dbConnection.query(sql, function (err, uresult) {
        console.log(uresult)
        if (err) 
        {
            throw err;
        }
        res.status(200).json({
            status:'Success',
            fields: uresult,
        });

    });
});


/*get  user based on company name parameter*/

getusers.get('/company/getuser/:company_name',auth,function(req,res){
    var company_name = req.params.company_name;
    var sql = `SELECT * FROM user_profile WHERE company_name="${company_name}"`;
    dbConnection.query(sql, function (err,uresult) {
        if(uresult.length<1){

            res.status(200).json(
                {
                    status: 'failed',
                    desc: 'Company does not have user'

                }
            )

        }else{
            res.status(200).json(
                {
                status:'Success',
                fields:uresult
            }
            );
        }

    });
})



/*get single Consultant based on correl_id parameter*/

getusers.get('/getconsultant/:correl_id',auth, function (req, res) {

    var correl_id = req.params.correl_id;

    var sql = `SELECT * FROM user_profile WHERE correl_id="${correl_id}"`;
    dbConnection.query(sql, function (err, uresult) {
        console.log(uresult)
        if (err) 
        {
            throw err;
        }
        else
        {
            var sqladd = `SELECT * FROM address WHERE correl_id="${correl_id}"`;
            dbConnection.query(sqladd,function(err,addresult){
                if(err)
                {
                    throw err;
                }
                else
                {
                    var sqltech = `SELECT * FROM technology WHERE correl_id="${correl_id}"`;
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




module.exports = getusers;