import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user-model.js"


const verifyJWT = asyncHandler(async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        // console.log(token)

    if(!token){
        throw new ApiError(401,"Unauthorized request")
    }

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    // console.log(decodedToken)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    // console.log(user)

    if(!user){
        //nexttime : discuss about frontend
        throw new ApiError(401,"Invalid access token")
    }

    //creating new object for req to access the user data
    req.user = user
    // console.log(req.user)
    next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
    }
})

export {verifyJWT}