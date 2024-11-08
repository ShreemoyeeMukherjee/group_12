const AsyncHandler = (requestHandler)=>async(req,res,next)=>{
    
    try{
        await requestHandler(req,res,next);
    }
    catch(err){
         return res.status(err.statusCode).json({
            "message":err.message,
            //"error":err.error,
            "success":false
        })
    }


}