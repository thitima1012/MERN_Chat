import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;
const node_mode = process.env.NODE_ENV;
import dotenv from "dotenv";
dotenv.config();

export const generateToken =(userId, res ) => {
    const token = jwt.sign({ userId } , secret, {
        expiresIn:"1d",
    });

    res.cookie("jwt", token, {
        maxAge: 24*60*60*1000, //เวลา MS
        httpOnly: true, //XSS Attacks
        sameSite: "strict", // CSRF Attacks
        secure: node_mode !== "development"
    })

    console.log("Token generate anscookie set")

    return token;
}