const express = require('express');
const consultant_tag = express.Router();
var dbConnection = require('../../db/dbconfig');
var auth = require('../../middleware/auth');




/*post Single tag product*/

consultant_tag.post('/createtags',auth,function(req,res){
    var tags={
        tag_name:req.body.tag_name,
        tag_desc:req.body.tag_desc,
        tag_type:req.body.tag_type,
        company_name:req.body.company_name,
        created_user:req.body.created_user
    }
    dbConnection.query("SELECT * FROM tags WHERE tag_name=? AND company_name=?",[tags.tag_name,tags.company_name],
    function(err,tresult){
        if(tresult.length<1)
        {
            var sql = "INSERT INTO tags(tag_name,tag_desc,tag_type,company_name,created_user) VALUES ?";
            var VALUES = [[tags.tag_name,tags.tag_desc,tags.tag_type,tags.company_name,tags.created_user]];
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
                            desc: 'Tag Created Successfully'

                        }
                    )
                }
            });
        }else
        {
            res.status(200).json(
                {
                    result_code:300,
                    status: 'failed',
                    desc: 'Tag Already Exists'

                }
            )   
        }
    })

});



/*get tag products  based on company name*/

consultant_tag.get('/gettags/:company_name',auth,function(req,res){
    var company_name = req.params.company_name;
    var sql = `SELECT * FROM tags WHERE company_name="${company_name}"`;
    dbConnection.query(sql, function (err,tresult) {
        if(tresult.length<1){

            res.status(200).json(
                {
                    result_code:300,
                    status: 'failed',
                    desc: 'No tags available for this company'

                }
            )

        }else{
            res.status(200).json(
                {
                result_code:200,
                status:'Success',
                fields:tresult
            }
            );
        }

    });
});



/*get Single tag based on tag_id parameter*/

consultant_tag.get('/gettag/:tag_id',auth, function (req, res) {
    var tag_id = req.params.tag_id;

    var sql = `SELECT * FROM tags WHERE tag_id=${tag_id}`;
    dbConnection.query(sql, function (err, tresult) {
        console.log(tresult)
        if (err) {
            throw err;
        }
        res.status(200).json({
            result_code:200,
            status:'Success',
            fields: tresult,
        });

    });
});



/*delete Single tag based on tag_id parameter*/

consultant_tag.delete('/deletetags/:tag_id',auth,function(req,res){
    var tag_id = req.params.tag_id;
    var sql = `DELETE FROM tags WHERE tag_id="${tag_id}"`;
    dbConnection.query(sql, function (err,tresult) {
        if(tresult.length<1){

            res.status(200).json(
                {
                    result_code:300,
                    status: 'failed',
                    desc: 'Something Went Wrong! Please try again'

                }
            )

        }else{
            res.status(200).json(
                {
                result_code:200,
                status:'Success',
                desc: 'Tag Deleted'
            }
            );
        }

    });
});



/*update Single tag based on tag_id parameter*/

consultant_tag.put('/updatetags/:tag_id',auth,function(req,res){
    var tag_id=req.params.tag_id;
    var company_name=req.body.company_name;
    var tag_name=req.body.tag_name;
    var tag_desc=req.body.tag_desc;
    var tag_type=req.body.tag_type;
    dbConnection.query("SELECT * FROM tags WHERE company_name=? AND tag_name=? AND tag_id=?",[company_name,tag_name,tag_id],
    function(err,tresult){
        console.log(tresult);
        if(tresult.length>1)
        {
            res.status(200).json(
                {
                result_code:300,
                status:'failed!',
                desc: 'Tag Already Exists'
            }
            );
        }else
        {

            var sqltag = `UPDATE tags SET tag_name="${tag_name}", tag_desc="${tag_desc}",tag_type="${tag_type}" WHERE tag_id=${tag_id}`;
            dbConnection.query(sqltag,function(err,results){
                if(err)
                {
                    throw err;
                }
                else
                {
                    res.status(200).json(
                        {
                        result_code:200,
                        status:'Success',
                        desc: 'Tag Updated'
                    }
                    ); 
                }
            })
        }
    })
})

module.exports=consultant_tag;