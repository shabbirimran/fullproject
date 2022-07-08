
const jwt=require('jsonwebtoken');
const config=require('config');
module.exports=function (req,res,next){

    //get token from header
    const token=req.header('x-auth-token');
//check if token
if(!token){
    res.status(400).json({msg:"no token authorization denied"});
}
// verify token
try{
jwt.verify(token,config.get('secret'),(error,decode)=>{
if(error) {
    return res.status(401).json({ msg: 'Token is not valid' });
  } else {
      req.user=decode.user;
      next();
  }

});



}catch(err){
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });


}
};

