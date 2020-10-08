const express = require('express');
const createcompany = express.Router();
const multer = require('multer')
var storage = multer.diskStorage({
    destination:(req,file,cb) =>{
     // const dir = './public/images/uploads';
     // mkdrip(dir,err => cb(err,dir))
     cb(null, 'uploads')
    },
    filename:(req,file,cb) =>{
      cb(null,Date.now() +'-'+file.originalname)
    }
  })
  const upload = multer({storage})
  //let upload = multer({dest:'uploads/'})


  createcompany.post('/createnewenterprise',upload.single('file'),(req,res) =>{
    // var company={
    //     company_name : req.body.company_name,
    //     email_id: req.body.email_id,
    //     linkedIn_url:req.body.linkedIn_url,
    //     phone : req.body.phone,
    //     tax_id:req.body.tax_id,
    //     website_url:req.body.website_url,
    //     valid_from:req.body.valid_from,
    //     valid_to:req.body.valid_to,
    //     comments : req.body.comments,
    //     // company_logo:req.file.fieldname
      
    // }
    // console.log(company)
    // console.log(req.file)
    if(req.file){
    console.log("file exists")
    console.log("requestBody",req.body)
    res.send(req.file);
    
    }else{
    res.status("409").json("No Files to upload")
    }
    })

module.exports=createcompany;