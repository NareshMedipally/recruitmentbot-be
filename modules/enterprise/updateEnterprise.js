const express = require('express');
const update_enterprise = express.Router();
const multer = require('multer');
var uniqid = require('uniqid');
var dbConnection = require('../../db/dbconfig');
var auth = require('../../middleware/auth');





var storage = multer.diskStorage({
    destination:(req,file,cb) =>{
      
     cb(null, 'profiles')
    },
    filename:(req,file,cb) =>{
      cb(null,Date.now() +'-'+file.originalname)
    }
  })
  const upload = multer({storage})


  update_enterprise.put('/updateEnterprise/:correl_id',upload.single('company_logo'),auth,function(req,res){
    var correl_id=req.params.correl_id;
    var company={
      company_name : req.body.company_name,
      email_id: req.body.email_id,
      linkedIn_url:req.body.linkedIn_url,
      phone : req.body.phone,
      tax_id:req.body.tax_id,
      website_url:req.body.website_url,
      valid_from:req.body.valid_from,
      valid_to:req.body.valid_to,
      comments : req.body.comments,
      company_logo:req.file.path
    
  }
    var address ={
        address_line_1:req.body.address_line_1,
        address_line_2:req.body.address_line_2,
        zipcode:req.body.zipcode,
        city:req.body.city
    }
    // console.log(company.company_logo);
    dbConnection.query("SELECT * FROM  company WHERE company_name=?",[company.company_name],
    function(err,cresult){
        if(cresult.length<1)
        {
        dbConnection.query("SELECT * FROM company WHERE email_id=?",[company.email_id],
        function(err,result){
            if(result.length<1)
            {
            // if(req.file)
            // {
            var sqlcom=`UPDATE company SET company_logo="${company.company_logo}", linkedIn_url="${company.linkedIn_url}",website_url="${company.website_url}",phone="${company.phone}",tax_id="${company.tax_id}",valid_from="${company.valid_from}",comments="${company.comments}" WHERE correl_id="${correl_id}"`;
            dbConnection.query(sqlcom,function(err){
                if(err)
                {
                throw err;
                }else
                {
                var slqadd=`UPDATE address SET address_line_1="${address.address_line_1}",address_line_2="${address.address_line_2}",zipcode="${address.zipcode}",city="${address.city}" WHERE correl_id="${correl_id}"`;
                dbConnection.query(slqadd,function(err){
                    if(err)
                    {
                    throw err;
                    }else
                    {
                    res.status(200).json
                    (
                        {
                        status:'success',
                        desc:'Record Updated Successfully'
                        }
                        )
                    }
                })
                }
            })
            // }else{
            // res.status(409).json({
            //     status:'failed',
            //     desc:'No file Upload'
            // })
            // }
            }else
            {
            res.status(200).json
            (
                {
                status:'failed!',
                desc:'Email Address Already Exists'
                }
            )
            }
        })
        }else
        {
        res.status(200).json(
            {
            status:'failed',
            desc:'Company Name Already Exists'
            }
            )
        }
    });
});

module.exports=update_enterprise;
