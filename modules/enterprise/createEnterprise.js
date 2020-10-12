const express = require('express');
const create_enterprise = express.Router();
const multer = require('multer');
var uniqid = require('uniqid');
var dbConnection = require('../../db/dbconfig');
var auth = require('../../middleware/auth');





var storage = multer.diskStorage({
    destination:(req,file,cb) =>{
      
     cb(null, 'uploads')
    },
    filename:(req,file,cb) =>{
      cb(null,file.originalname)
    }
  })
  const upload = multer({storage})


  var correl_id = uniqid();


  create_enterprise.post('/createEnterprise',upload.single('company_logo'),function(req,res){
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
      company_logo:req.file.originalname
    
  }
    var address ={
        address_line_1:req.body.address_line_1,
        address_line_2:req.body.address_line_2,
        zipcode:req.body.zipcode,
        city:req.body.city
    }
        var direc_loc="uploads/"
        var company_logo=company.company_logo;
        
        var filename = direc_loc.concat(company_logo)
        console.log(filename);
        
    console.log(filename);
    dbConnection.query("SELECT * FROM  company WHERE company_name=?",[company.company_name],
    function(err,cresult){
        if(cresult.length<1)
        {
        dbConnection.query("SELECT * FROM company WHERE email_id=?",[company.email_id],
        function(err,result){
            if(result.length<1)
            {
            if(req.file)
            {
            var sqlcom="INSERT INTO company(correl_id,company_name,company_logo,email_id,linkedIn_url,website_url,phone,tax_id,valid_from,valid_to,comments) VALUES ?";
            var VALUES=[[correl_id,company.company_name,filename,company.email_id,company.linkedIn_url,company.website_url,company.phone,company.tax_id,company.valid_from,company.valid_to,company.comments]];
            dbConnection.query(sqlcom,[VALUES],function(err){
                if(err)
                {
                throw err;
                }else
                {
                var slqadd="INSERT INTO address(correl_id,name,email_id,address_line_1,address_line_2,zipcode,city) VALUES ?";
                var VALUES=[[correl_id,company.company_name,company.email_id,address.address_line_1,address.address_line_2,address.zipcode,address.city]];
                dbConnection.query(slqadd,[VALUES],function(err){
                    if(err)
                    {
                    throw err;
                    }else
                    {
                    res.status(200).json
                    (
                        {
                        status:'success',
                        desc:'Record Inserted Successfully'
                        }
                        )
                    }
                })
                }
            })
            }else{
            res.status(409).json({
                status:'failed',
                desc:'No file Upload'
            })
            }
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

module.exports=create_enterprise;