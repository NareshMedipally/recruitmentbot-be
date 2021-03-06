const express = require('express');
const consultant_tag = express.Router();
var dbConnection = require('../../db/dbconfig');
var auth = require('../../middleware/auth');




/*Create tag */

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



/*get tags - company wise*/

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



/*get tag info */

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



/*delete tag*/

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



/*update tag*/

consultant_tag.put('/updatetags/:tag_id', auth, function (req, res) {
    console.log("req", req)
    var tag_id = req.params.tag_id;
    var company_name = req.body.company_name;
    var tag_name = req.body.tag_name;
    var tag_desc = req.body.tag_desc;
    var tag_type = 'technical';
    dbConnection.query("SELECT * FROM tags WHERE company_name=? AND tag_id=?", [company_name, tag_id],
        function (err, tresult) {
            console.log('tresult', tresult.length);
            let tagResponse = JSON.parse(JSON.stringify(tresult));
            if (tresult.length == 1) {
                dbConnection.query("SELECT * FROM tags WHERE company_name=? AND tag_name=?", [company_name, tag_name],
                    function (err, response) {

                        let result = JSON.parse(JSON.stringify(response));
                        console.log("testss", result)

                        if (err) {
                            throw err
                        } else {
                            if (result.length > 0) {
                                // if(result[0].tag_name.toLowerCase() == tag_name.toLowerCase()){
                                if (tagResponse[0].tag_desc.toLowerCase() == tag_desc.toLowerCase() || tagResponse[0].tag_id != result[0].tag_id) {
                                    res.status(200).json(
                                        {
                                            result_code: 300,
                                            status: 'failed!',
                                            desc: 'Tag Already Exists'
                                        }
                                    );
                                } else {
                                    var sqltag = `UPDATE tags SET tag_name="${tag_name}", tag_desc="${tag_desc}",tag_type="${tag_type}" WHERE tag_id=${tag_id}`;
                                    dbConnection.query(sqltag, function (err, results) {
                                        if (err) {
                                            throw err;
                                        }
                                        else {
                                            res.status(200).json(
                                                {
                                                    result_code: 200,
                                                    status: 'Success',
                                                    desc: 'Tag Updated'
                                                }
                                            );
                                        }
                                    })
                                }


                                // }else{

                                // }
                            } else {
                                var sqltag = `UPDATE tags SET tag_name="${tag_name}", tag_desc="${tag_desc}",tag_type="${tag_type}" WHERE tag_id=${tag_id}`;
                                dbConnection.query(sqltag, function (err, results) {
                                    if (err) {
                                        throw err;
                                    }
                                    else {
                                        res.status(200).json(
                                            {
                                                result_code: 200,
                                                status: 'Success',
                                                desc: 'Tag Updated'
                                            }
                                        );
                                    }
                                })
                            }

                        }
                    })

            } else {

            }
        })
})

module.exports=consultant_tag;