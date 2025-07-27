/*    METHOD 2 TO HANDLE ASYNC CODE  less and easy code*/
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error));
    };
};

export default {asyncHandler};
















                                                    /*    WAY TO HANDLE THE ASYNC CODE */
// const asyncHandler = () => {}
// const asyncHandler = (fn) => {()=>{}}
// //just we remove the curly braces from upper code
// const asyncHandler = (fn) => ()=>{}

// //To make inside function async
// const asyncHandler = (fn) => async () => {}


                                             /*    METHOD 1 */
// const asyncHandler = (fn) => async(req,res,next) => {
//     try {
//         // Call the function passed to asyncHandler
//         // and wait for it to resolve
//         //THis wraps the function in a try-catch block
//         // so that any errors thrown by the function
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message || 'Internal Server Error'
//         });
//     }
// }