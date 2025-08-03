import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    username: {
        type : String,
        trim : true,
        required: true,
        lowercase: true,
        unique: true,
        index : true
    },
    email: {
        type : String,
        trim : true,
        required: true,
        unique: true,
    },
    fullName: {
        type : String,
        trim : true,
        required: true,
        index : true
    },
    avatar: {
        type : String,
        required: true,
    },
    coverImage: {
        type : String,
    },
    watchHistory:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String,   
    }
},{timestamps: true,});


userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

//In sign method of jwt, we pass the payload and then secret key and expiresIn in object
//The payload can be any data, here we are passing user id and email
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({_id: this._id, email : this.email}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
}

//we put less payload in refresh token, beause it is used to generate new access token
//and we want to keep it secure, so we only put user id in it
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({_id: this._id}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
}

const User =  mongoose.model("User", userSchema);

export {User}