//Not found error
class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.status = 404;
      this.errorType = "NotFoundError";
    }
  }
  
  //Bad user request error
  class BadUserRequestError extends Error {
    constructor(message) {
      super(message);
      this.status = 400;
      this.errorType = "BadUserRequestError";
    }
  }

  //Unauthorized error
  class UnAuthorizedError extends Error {
    constructor(message) {
      super(message);
      this.status = 401;
      this.errorType = "UnAuthorizedError";
    }
  }
  
  //Failed request error
  class FailedRequestError extends Error {
    constructor(message){
      super(message)
      this.status = 500;
      this.errorType = "FailedRequestError";
    }
  }  
  
  module.exports = { NotFoundError, BadUserRequestError, UnAuthorizedError, FailedRequestError };