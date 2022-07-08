const mongoose= require('mongoose');
const config=require('config');
const db=config.get('mongoURI');
const connectdb=async()=>{
    try{
await mongoose.connect(db);
console.log("mongo db connected")
    }catch(err){
        console.error(err);

    }

}
module.exports=connectdb;