import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({
            _id: { $ne: loggedInUserId},
        }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error){
        res.status(500).json({Message: "Internal Server Error While getting users info"})
    }
};

export const sendMessage = async (req, res) => {
    try {
      const { id: receiverId } = req.params;
      if (!receiverId) {
        return res.status(400).json({ message: "Receiver Id is required" });
      }
      const senderId = req.user._id;
  
      const { text, image } = req.body;
      let imageURL = "";
      if (image) {
        const uploadedResponse = await cloudinary.uploader.upload(image);
        imageURL = uploadedResponse.secure_url;
      }
  
      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageURL,
      });
  
      await newMessage.save();
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
      res.status(200).json(newMessage);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error While sending message" });
    }
  };
  
  export const getMessage = async (req, res) => {
    try {
      const { id: userToChatId } = req.params;
      const myId = req.user._id;
  
      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChatId }, //ผู้ส่ง
          { senderId: userToChatId, receiverId: myId }, //ผู้รับ
        ],
      });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error while getting messages" });
    }
  };