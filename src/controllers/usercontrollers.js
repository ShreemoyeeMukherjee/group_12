
import {AsyncHandler} from  "../utils/AsyncHandler.js"
import {ApiError} from  "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import{User} from "../models/users.models.js"
import mongoose from "mongoose"
const registerUser = AsyncHandler(async(req,res)=>{
    const {username , email} = req.body;
    if(!email || !password || !username)
    {
        throw new ApiError(400, " email , username , password all are required");

    }
    const existedUser = await User.findOne(
        {
            $or:[
                {email:email},
                {username:username}
            ]
        }
    );
    
    if(existedUser)
    {
        throw new ApiError(400,"User with this email or username already exists")
    }
    
    
    const newUser = await User.create({
        fullname:fullName,
        username:username,
        password:password,
        email:email,
        
        
    })
    return(res.status(200).send(new ApiResponse(200  ,"User registered successfully")));
    


})
const generateAccessandRefreshToken = async(userId)=>{
    
    const user = await User.findById(userId);
    if(!user)
    {
        throw new ApiError(400, "User not found")
    }
    const  accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    
    user.refreshToken = refreshToken;
    const updatedUser = await user.save();
    
    return({accessToken ,refreshToken});
}
const loginUser = AsyncHandler(async(req,res,next)=>{
    const {email , password} = req.body;
    
    if(!email || !password)// if email or password missing
    {
        throw new ApiError(400 , "Provide complete credentials");
    }
    console.log(req.body);
    const user = await User.findOne({email:email});
    
    if(!user)
    {
        throw new ApiError(400 , "User email not found");
    }
    const result = await user.isPasswordCorrect(password);// verify password
    
    if(result == "false")
    {
          throw new ApiError(400,"Invalid password");
    }
    
    
    const{accessToken , refreshToken} = await generateAccessandRefreshToken(user._id);
     
    const loggedinUser = await User.findById(user._id);
    
    loggedinUser.password = undefined;
    
    loggedinUser.refreshToken = undefined;//here refreshToken is undefined but I am still sending the refreshtoken in response
    // we are declaring it as undefined here so that the user cannot directly see what is being stored in the database
    const options = {httpOnly:true}
    
    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken,options)
    .send(new ApiResponse(200,{loggedinUser,accessToken , refreshToken},"User logged in successfully"));

})
const logoutUser =   AsyncHandler(async(req,res,next)=>{
    const userId = req.user._id;
    const user = await User.findById(userId);
    if(!user)
    {
        throw new ApiError(500, "User not found in database");
    }
     //await delete user.refreshToken;
    //console.log("DeletedIfo" ,deletedInfo);
    user.refreshToken  = undefined;
    const updatedUser = await user.save();
   // console.log("Updated User",updatedUser);
   const options = [{httpOnly:true}];
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User successfully logged out"));
    

    

})
export{registerUser,loginUser,logoutUser};