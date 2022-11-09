const express = require('express')
const app = express()
const port = 4000
const dotenv= require("dotenv")
// const {chats} = require('./data/data')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const path = require('path')

const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const cors = require('cors')
dotenv.config();
connectDB();
app.use(express.urlencoded())
app.use(express.json()) //to accept json data
app.use(cors())


app.use('/user', userRoutes)
app.use('/chat', chatRoutes)
app.use('/message', messageRoutes)

const __dirname1 = path.resolve(); 
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname1, "/frontend/build")))
  app.get('*', (req, res) =>{
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  })
}else{
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
}
//error handling
app.use(notFound);
app.use(errorHandler);

// app.get('/chats', (req, res) => {
//   res.send(chats)
// })

// app.get('/chats/:id', (req, res) => {
//   const singleChat = chats.find(item => item._id === req.params.id)
//   res.send(singleChat)
// })

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})

const io = require('socket.io')(server,{
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
})

io.on("connection", (socket) => {
  console.log('connected socket')

  socket.on('setup', (userData) =>{
    console.log(userData)
    socket.join(userData._id)
    socket.emit("connected")
  })

  socket.on('join chat', (room) => {
    socket.join(room)
    console.log("User Joined Room: " + room)
  })
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));


  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
})