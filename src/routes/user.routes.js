import { Router } from "express";
import { registerUser, loginUser, logOutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields(
    [
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]
),registerUser)

router.route("/login").post(loginUser)


//secured routes
router.route("/logout").get(verifyJWT,logOutUser)
router.route("/refreshAccessToken").get(refreshAccessToken)


router.route("/changeCurrentPassword").post(verifyJWT, changeCurrentPassword)
router.route("/getCurrentUser").get(verifyJWT, getCurrentUser)
router.route("/updateAccountDetails").post(verifyJWT, updateAccountDetails)
router.route("/updateUserAvatar").post(upload.single("avatar"),verifyJWT, updateUserAvatar)
router.route("/updateUserCoverImage").post(upload.single("coverImage"),verifyJWT, updateUserCoverImage)

export default router