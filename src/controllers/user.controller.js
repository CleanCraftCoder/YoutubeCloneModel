import {asyncHandler} from "../utils/asyncHandler.js";
import apiError from "../utils/ApiError.js"
import {User} from "../models/user-model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";


const generateAccessAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById({_id : userId})
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false})

        return {refreshToken, accessToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while accessing and generating tokens")
    }
}

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

    const existedUser = await User.findOne({$or : [{username},{email}]})

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

   const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username : username.toLowerCase()
   })

   //by calling select method, the passing argument will not be access by the reference variable like '-password' cannot access.
   const createdUser = await User.findById(user._id).select("-password -refreshToken")

   if(!createdUser){
        throw new apiError(401,"Something went wrong while registering the user")
   }

   return res.status(201).json(
        new ApiResponse(200,createdUser,"User created successfully")
   )

})

//userLogin
const loginUser = asyncHandler(async (req,res)=>{
    //taking input from user to login(req.body data)
    //check empty field
    //check valid email or not
    //check email is present or not
    //if data is not present then throw error
    //if data present then below
    //compare password using isPasswordCorrect
    //access and refresh tken generate
    //send secure cookie

    const {email,username, password} = req.body;

    if(!(email || username)){
        throw new apiError(400,"username or email is required")
    }

    const logUser = await User.findOne({
        $or : [{username},{email}]
    })

    if(!logUser){
        throw new apiError(404,"Something went wrong")
    }

    const isPasswordValid = logUser.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(401,"Invalid user credential")
    }

    const {refreshToken, accessToken} = await generateAccessAndRefreshToken(logUser._id)

    const loggedInUser = await User.findById(logUser._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            user: loggedInUser, accessToken, refreshToken
        },"user loggedIn successfully")
    )

})

//Logout
const logOutUser = asyncHandler(async (req,res)=>{
    // console.log(req.user)
    await User.findByIdAndUpdate(req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(400,{}, "Logged Out")
    )
})

export {registerUser, loginUser, logOutUser}
