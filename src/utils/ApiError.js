class ApiError extends Error{
    constructor(statusCode,message = "Error occured",errors, stack){
      super(message);
        this.statusCode = statusCode;
        
        this.message = message;
        this.errors = errors;
        this.success  = false;
        if(stack)
          {
            this.stack = stack;
          }

    }
}
export{ApiError};