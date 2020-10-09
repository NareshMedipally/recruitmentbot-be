const jwt = require('jsonwebtoken')

 const auth = function(req, res, next) {
    const authorizationHeader = req.header('Authorization')
    if(authorizationHeader){
        // const token = req.header('Authorization').replace('Bearer ', '')
            var token= req.body.token || req.header('Authorization').split(' ')[1] || req.query.token
            
            if(token){
                jwt.verify(token,'thisismysecretkey', function(err,res){
                   
                    if(err){
                        res.status(500).send('Token Invalid');
                    }else{
                       
                        next()                       
                    }
                })
            }else{
                res.status(401).send('Please Authenticate')
            }
        }else{
            res.status(401).send('Please Authenticate')
        }
    }
    
module.exports = auth