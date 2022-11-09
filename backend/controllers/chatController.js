const asyncHandler = require("express-async-handler");
const Chat = require('../models/chatModel');
const User = require("../models/userModel");

const accessChat = asyncHandler(async(req, res) => {
    const { userId } = req.body
    console.log(req.body)
    if(!userId){
        console.log("UserId param not sent with request")
        return res.sendStatus(400)
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and : [
            { users: {$elemMatch:{$eq:req.user._id}} },
            { users: {$elemMatch:{$eq: userId}}}
        ]
    }).populate("users", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    })

    if(isChat.length>0){
        res.send(isChat[0])
    }else{
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }

        try {
            const createdChat = await Chat.create(chatData)
            const FullChat = await Chat.findOne({ _id: createdChat._id}).populate("users", "-password")
            res.status(200).send(FullChat)
        } catch (error) {
            res.status(400)
            throw new Error (error.message)
        }
    }
})

const fetchChat = asyncHandler(async(req, res) => {
    console.log(req.user)
    try {
        Chat.find({ users: {$elemMatch: {$eq: req.user._id}} }).populate("users", "-password").populate("groupAdmin","-password").populate("latestMessage").sort({updatedAt: -1})
        .then(async(result) => {
            result= await User.populate(result,{
                path: "latestMessage.sender",
                select: "name pic email "
            })

        res.status(200).send(result)
        })

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const createGroupChat = asyncHandler(async(req, res) => {
    if(!req.body.name || !req.body.users){
        return res.status(400).send({message: "Please fill all the fields"})
    }

    let users = JSON.parse(req.body.users);

    if(users.length < 2){
        return res.status(400).send("More than 2 users are required to form a group chat")
    }
    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

        res.status(200).send(fullGroupChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const renameGroupChat = asyncHandler(async(req, res) => {
    const {chatId, chatName} = req.body

    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
        chatName
    },{
        upsert: true,
        new: true
    })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!updatedChat){
        res.status(404);
        throw new Error("Chat Not Found")
    }else{
        res.json(updatedChat)
    }
})

const addGroupUser = asyncHandler( async(req, res) => {
    const { chatId, userId }  = req.body

    // if(userId){
    //     const userExist = await Chat.find({_id: {$eq: userId}})
    //     if(userExist){
    //         res.status(404)
    //         throw new Error("User already exist")
    //     }
    //     console.log(userExist)
    // }
    const added = await Chat.findByIdAndUpdate(chatId, {
        $push : {users: userId}

    },{
        upsert: true,
        new: true
    })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!added){
        res.status(404)
        throw new Error("chat not found")
    }else{
        res.json(added)
    }
})

const removeGroupUser = asyncHandler(async(req, res) => {
    const { chatId, userId }  = req.body

    const removed = await Chat.findByIdAndUpdate(chatId, {
        $pull : {users: userId},

    },{
        upsert: true,
        new: true
    })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!removed){
        res.status(404)
        throw new Error("chat not found")
    }else{
        res.json(removed)
    }
})

module.exports = {accessChat, fetchChat, createGroupChat, renameGroupChat, addGroupUser, removeGroupUser}