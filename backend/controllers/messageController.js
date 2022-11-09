const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const createMessage = asyncHandler(async( req, res) => {
    const { content, chatId } = req.body

    if(!content || !chatId){
        console.log("Invalid data passed")
        return res.sendStatus(400)
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }
    console.log
    try {
        let message = await Message.create(newMessage)
        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        console.log(message)
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email',
        })
        

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const allMessage = asyncHandler(async(req, res) => {
    try {
        const messages = await Message.find({chat: req.params.chatId})
        .populate("sender", "name pic email")
        .populate("chat");

        res.json(messages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

module.exports = {createMessage, allMessage}