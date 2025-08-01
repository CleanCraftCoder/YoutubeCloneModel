class ApiResponse{
    constructor(statusCode,data,message="Success", success=true){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
        // if(stack) {
        //     this.stack = stack;
        // } else {
        //     Error.captureStackTrace(this, this.constructor);
        // }

    }
}
export {ApiResponse}