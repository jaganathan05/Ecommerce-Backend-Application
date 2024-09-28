const jwt = require('jsonwebtoken');
const Admin = require('../Models/Admin')
require('dotenv').config();

const admin_authentication = async (req,res,next)=>{
    try{
        const token = req.header("Authorization")
        //console.log(token);
        const SecretKey = process.env.Admin_Token_Key;
        const user = jwt.verify(token,SecretKey);
        const userId = user.userId
        Admin.findOne({'_id': userId}).then(user=>{
            //console.log(JSON.stringify(user));
            req.admin=user;
            next()
        }).catch(err=>{throw new Error(err)})
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false})
    }

}
module.exports={
    admin_authentication
}