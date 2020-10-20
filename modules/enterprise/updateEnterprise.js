const express = require('express');
const update_enterprise = express.Router();
const multer = require('multer');
var dbConnection = require('../../db/dbconfig');
var auth = require('../../middleware/auth');

var maxSize = 500 * 1024;
var storage = multer.diskStorage({
    destination:(req,file,cb) =>{
      
     cb(null, 'uploads')
    },
    filename:(req,file,cb) =>{
      cb(null,file.originalname)
    }
  })
  const upload = multer({storage,limits: { fileSize: maxSize }})

  var logoupload=upload.fields([{name:'company_logo',maxCount: 1}])




    /* update enterprise */

  update_enterprise.put('/updateEnterprise/:correl_id',logoupload,auth,function(req,res){
    var correl_id=req.params.correl_id;  
    var logoFile ="";
    if(req.files.company_logo){
        logoFile = req.files.company_logo? req.files.company_logo:'';
    }  
    var company={
      company_name:req.body.company_name, 
      email_id:req.body.email_id, 
      linkedIn_url:req.body.linkedIn_url,
      phone : req.body.phone,
      tax_id:req.body.tax_id,
      website_url:req.body.website_url,
      valid_from:req.body.valid_from,
      valid_to:req.body.valid_to,
      comments : req.body.comments,
      company_logo:logoFile?logoFile[0].originalname:'',
    
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
    
    dbConnection.query("SELECT * FROM company WHERE company_name=?",[company.company_name],
    function(err,cresult){
        console.log(cresult)
        if(cresult.length>0)
        {
            
            res.status(200).json(
                {
                result_code:400,
                status:'failed',
                desc:'Company Name Already Exists'
                }
            )
       
        }else
        {
                  
            var sqlcom=`UPDATE company SET company_name="${company.company_name}",email_id="${company.email_id}",company_logo="${filename}", linkedIn_url="${company.linkedIn_url}",website_url="${company.website_url}",phone="${company.phone}",tax_id="${company.tax_id}",valid_from="${company.valid_from}",valid_to="${company.valid_to}",comments="${company.comments}" WHERE correl_id="${correl_id}"`;
            dbConnection.query(sqlcom,function(err)
            {
                if(err)
                {
                throw err;
                }else
                {
                var slqadd=`UPDATE address SET  name="${company.company_name}",address_line_1="${address.address_line_1}",address_line_2="${address.address_line_2}",zipcode="${address.zipcode}",city="${address.city}" WHERE correl_id="${correl_id}"`;
                dbConnection.query(slqadd,function(err){
                    if(err)
                    {
                    throw err;
                    }else
                    {
                    res.status(200).json
                    (
                        {
                        result_code:200,
                        status:'success',
                        desc:'Record Updated Successfully'
                        }
                        )
                    }
                })
                }
            })
        }
    });

    
});





module.exports=update_enterprise;
