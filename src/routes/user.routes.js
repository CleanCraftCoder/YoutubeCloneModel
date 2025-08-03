import { Router } from "express";
import { registerUser, loginUser, logOutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser} from "../controllers/user.controller.js";
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
router.route("/refresh-token").get(refreshAccessToken)


router.route("/changePassword").post(verifyJWT,changeCurrentPassword)
router.route("/currentUser").get(getCurrentUser)

export default router