class ApiError extends Error {
  constructor(statusCode, message= "something went wrong", error= [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.errors= error;
    this.stack = stack;
    this.data = null;

    if(stack) {
      this.stack = stack;
    }
    else{
        Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError