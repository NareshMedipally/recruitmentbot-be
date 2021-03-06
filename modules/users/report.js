const express = require('express');
const reports = express.Router();
var dbConnection = require('../../db/dbconfig');
var auth = require('../../middleware/auth');



reports.post('/reportlog',(req,res)=>{
    var primary_email_id=req.body.primary_email_id;
    var receiver_email_id=req.body.receiver_email_id;
    var subject=req.body.subject;
    var count;

    console.log(primary_email_id);
    dbConnection.query("SELECT * FROM user_profile WHERE email_id=?",[primary_email_id],
    function(err,results){
        console.log(results)
        if(results.length>0){

            var cname=results[0].company_name;
            console.log(cname);
           dbConnection.query("SELECT * FROM reports WHERE primary_email_id=? AND receiver_email_id=? AND subject=?",[primary_email_id,receiver_email_id,subject],
           function(err,cresults){
               console.log(cresults);
               if(cresults.length>0)
               {
                   count=cresults[0].count;
                   var sql=`UPDATE reports SET count="${count+1}" WHERE primary_email_id="${primary_email_id}" AND receiver_email_id="${receiver_email_id}" AND subject="${subject}"`;
                   dbConnection.query(sql,function(result){
                       if(err){
                           throw err;
                       }
                       else{
                        res.status(200).json({
                            result_code:200,
                            status:'Success',
                            desc: 'Report Inserted Successfully!'
                            
                        })
                       }
                   })
               }else
               {
                count=1;
                var sql="INSERT INTO reports(primary_email_id,receiver_email_id,subject,company_name,count) VALUES ?";
                var VALUES=[[primary_email_id,receiver_email_id,subject,cname,count]];
                dbConnection.query(sql,[VALUES],function(reporesult){
                    if(err)
                    {
                        throw err;
                    }
                    else
                    {
                        res.status(200).json({
                            result_code:200,
                            status:'Success',
                            desc: 'Report Inserted Successfully!'
                            
                        })
                    }
                })
               }
           })
        }
        else{
            res.status(200).json({
                result_code:200,
                status:'failed!',
                desc: 'No user'
                
            })
        }
    })

})



/*get all report logs*/

reports.get('/getreportlogs', function (req, res) {
    var sql = "SELECT * FROM reports";
    dbConnection.query(sql, function (err, result) {
        if (err) {

            throw err;
        }
        res.status(200).json({
            result_code:200,
            status:'Success',
            fields: result,
        });
    });


});




/*get report logs - company wise */

reports.get('/getreportlogs/:company_name',function(req,res){
    var company_name = req.params.company_name;
    var sql = `SELECT * FROM reports WHERE company_name="${company_name}"`;
    dbConnection.query(sql, function (err,uresult) {
        if(uresult.length<1){

            res.status(200).json(
                {
                    result_code:300,
                    status: 'failed',
                    desc: 'Company does not have Report'

                }
            )

        }else{
            res.status(200).json(
                {
                result_code:200,
                status:'Success',
                fields:uresult
            }
            );
        }

    });
});





/*get report logs - recuiter wise */

reports.get('/getreportlog/:primary_email_id',auth,function(req,res){
    var primary_email_id = req.params.primary_email_id;
    var sql = `SELECT * FROM reports WHERE primary_email_id="${primary_email_id}"`;
    dbConnection.query(sql, function (err,uresult) {
        if(uresult.length<1){

            res.status(200).json(
                {
                    result_code:300,
                    status: 'failed',
                    desc: 'Recruiter does not have Report'

                }
            )

        }else{
            res.status(200).json(
                {
                result_code:200,
                status:'Success',
                fields:uresult
            }
            );
        }

    });
});





module.exports=reports;
