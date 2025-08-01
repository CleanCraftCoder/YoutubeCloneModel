import {asyncHandler} from "../utils/asyncHandler.js";
import apiError from "../utils/ApiError.js"
import userModel from "../models/user-model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req,res)=>{
    //get user deatail from frontend
    //validation - not empty
    //check if user already exist - username,email
    //check for images and avatar
    // upload them to cloudanary
    //create user object - creat entry in db
    //remove passsword and refresh token field from response
    //check for user cretion
    //return res
    const {username,email,fullName,password} = req.body;
    if([username,email,fullName,password].some((field)=>
        field?.trim() === "")
    ){
        throw apiError(400,"All field is required")
    }

    const existedUser = await userModel.findOne({$or : [{username},{email}]})

    if(existedUser){
        throw new apiError(409,"User already exist")
    }

    // console.log(req.files) 
    // console.log(req.files.avatar[0])
    // console.log(req.files?.avatar[0].path)

    const avatarLocalPath = req.files?.avatar[0].path;
    // const coverImageLocalPath = req.files?.coverImage[0].path; //this throw error due to accessing the array 'coverImage[0]' while coverImage field is empty
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    //in the avatarLocalPath, we don't do like coverImageLocalPath because avatar field is mendatory to enter in field of register
    if(!avatarLocalPath){
        throw new apiError(400,"Please upload your avatar");
    }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

//    console.log(coverImage)
   if(!avatar){
        throw new apiError(400,"Avatar is required")
   }

   const user = await userModel.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username : username.toLowerCase()
   })

   //by calling select method, the passing argument will not be access by the reference variable like '-password' cannot access.
   const createdUser = await userModel.findById(user._id).select("-password -refreshToken")

   if(!createdUser){
        throw new apiError(401,"Something went wrong while registering the user")
   }

   return res.status(201).json(
        new ApiResponse(200,createdUser,"User created successfully")
   )

})

export {registerUser}
