import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getSocketByUserId,io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loginInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loginInUserId } }).select(
      "name email profilePic fullName"
    );
    res.status(200).json(users);
  } catch (error) {
    console.log("error in getUsers for sidebar", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myID = req.user._id;

    const message = await Message.find({
      $or: [
        { senderId: myID, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myID },
      ],
    });
    res.status(200).json(message);
  } catch (error) {
    console.log("error in getUserById", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const message = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await message.save();
    const receiverSocket = getSocketByUserId(receiverId);
    if(receiverSocket){
      io.to(receiverSocket).emit("newMessage",message);
    }
    res.status(200).json(message);
  } catch (error) {
    console.log("error in sendMessage", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
