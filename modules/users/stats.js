const express = require('express');
const stats = express.Router();
var dbConnection = require('../../db/dbconfig');
var auth = require('../../middleware/auth');


stats.get('/getallstats',auth,function(req,res){
    var sqlcom="SELECT count(*) as count FROM company";
    dbConnection.query(sqlcom,function(err,cresult){
        if (err) {

            throw err;
        }
        var sqladmin="SELECT count(*) as count FROM user_profile WHERE role_id='2'";
        dbConnection.query(sqladmin,function(err,aresult){
            if(err){
                throw err;
            }
           var sqlrec="SELECT count(*) as count FROM user_profile WHERE role_id='3'";
           dbConnection.query(sqlrec,function(err,recresult){
               if(err){
                   throw err;
               }
              var sqlcon="SELECT count(*) as count FROM user_profile WHERE role_id='4'";
              dbConnection.query(sqlcon,function(err,conresult){
                  if(err){
                      throw err;
                  }
                    res.status(200).json({
                        result_code:200,
                        status:'Success',
                        company: cresult,
                        admin:aresult,
                        recruiter:recresult,
                        consultant:conresult
                    });
                });
            });
        });
    });
});




stats.get('/getcompanystats/:company_name',auth,function(req,res){
    var company_name=req.params.company_name;

    var sqlrec=`SELECT count(*) as count FROM user_profile WHERE role_id='3' AND company_name="${company_name}"`;
    dbConnection.query(sqlrec,function(err,recresult){
        if(err){
           throw err;
        }
        var sqlcon=`SELECT count(*) as count FROM user_profile WHERE role_id='4' AND company_name="${company_name}"`;
        dbConnection.query(sqlcon,function(err,conresult){
            if(err){
                throw err;
            }
            res.status(200).json({ 
                result_code:200,
                status:'Success',
                recruiter:recresult,
                consultant:conresult
            });
        });
    });
});


module.exports=stats;