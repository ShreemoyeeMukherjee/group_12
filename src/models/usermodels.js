import {mongoose} from "mongoose"
import bcrypt from "bcrypt"
import saltRounds from "../../constants.js"
const userSchema = new mongoose.Schema({
    "username":{
        type:String,
    },
    "email":{
        type:String,

    },
    "teams":{
         type:mongoose.Schema.Types.ObjectId,
        ref:"team"
    },
    "password":{
         type: String,
       
    },
    
    

},
{
    timestamp:true,
})
userSchema.pre("save", async function(next) {
    console.log(this.password);
    if(!this.isModified("password"))// no need to encrypt if password is not modified
       return next();
    this.password =  await bcrypt.hash(this.password,saltRounds)
    console.log(this.password);
   
    next();
})
userSchema.methods.isPasswordCorrect = async function(password){
    const result  = await bcrypt.compare(password, this.password);
    if(result == true)
       return true;
    else
       return false;

       

}
userSchema.methods.generateAccessToken =  function(){
   const payload = {
    "_id":this._id,
    "username":this.username,
    "email":this.email,
    
    
   }
   const token = jwt.sign(payload , process.env.ACCESSTOKEN_SECRET,{expiresIn:process.env.ACCESSTOKEN_EXPIRY});
    return (token);
}
userSchema.methods.generateRefreshToken = function(){
    const payload = {
        "_id":this._id,
        "username":this.username,
        "email":this.email,
        "fullName":this.fullName
    }
    const token  = jwt.sign(payload,process.env.REFRESHTOKEN_SECRET,{expiresIn:process.env.REFRESHTOKEN_EXPIRY});
    return (token);
}
const User = mongoose.model("User", userSchema);
export{User};