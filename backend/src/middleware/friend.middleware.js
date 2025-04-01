import User from "../models/user.model";

export const checkFriendShip = async (req, res, next) => {
    const {id:friendId} = req.params;
    const userId = req.user._Id;
    try {
        const user = await User.findById(userId);
        if(!user.friends.includes(friendId)) {
            return
        }
        next();
    } catch (error) {
    res
      .status(500)
      .json({ message: "internal Server Error While checking friendship" });
   }
};