import {generateToken} from "../lib/utils";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary";

// SignUp
export const signup = async(req, res) =>{
    const { fullName, email, password } = req.body;
    if( !fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required"})
    }
    try{
        const user = await User.findOne({email})
        if(user) {
            return res.status(400).json({ message: "Email already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
        if(newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(400).json({message: "Invalid user data"})
        }
    }catch(error) {
        res.status(500).json({ message: "Internal Server Error While regitering a new User"})
    }
}
//******************************* */
// Login


/*********************** */
// Logout
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "",{ maxAge: 0})
        res.status(200).json({ message: "Logged out successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error while logging out" });
    }
};


/************* */
// UpdateProfile
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        if (!uploadResponse) {
            res.status(500).json({ message: "Error While updateing profile picture" });
        }
        
        const updatedUser = await User.findByIdupdate(userId,
            {profilePic: uploadResponse.secure_url},
            { new: true}
        )

        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(500).json({ message: "Error While updateing profile picture" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error while updating" });
    }
};


