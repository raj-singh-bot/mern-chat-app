import { ArrowBackIcon,AttachmentIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getSender, getSenderFull } from '../../Logics/ChatLogics';
import { useSingleChat } from '../../store/singleChat/reducer';
import { ADD_SINGLECHAT } from '../../store/singleChat/singleChatActionTypes';
import ProfileModal from './ProfileModal';
import ScrollableChat from './ScrollableChat';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import {io} from 'socket.io-client'
import Lottie from 'react-lottie'
import { SET_USER } from '../../store/auth/authActionTypes';
import animationData from "../animation/typing.json";

let socket, selectedChatCompare

const SingleChat = ({fetchAgain, setFetchAgain}) => {
const { singleChat } = useSingleChat();
const [loading, setLoading] = useState(false)
const [messages, setMessages] = useState([])
const [loggedUser, setLoggedUser] = useState();
const [socketConnected, setSocketConnected] = useState(false);
const [typing, setTyping] = useState(false)
const [isTyping, setIsTyping] = useState(false)
const [file, setFile ] = useState()
const [finalFile, setFinalFile] = useState()
const [newMessage, setNewMessage] = useState()
const dispatch = useDispatch()
const toast = useToast()

// console.log(singleChat)

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
useEffect(() => {
  setLoggedUser(JSON.parse(localStorage.getItem('auth-token')))
}, [singleChat])

useEffect(() => {
  console.log(singleChat.length)
  // if(!singleChat?.length ==  0){
    fetchMessages()
    selectedChatCompare = singleChat[0];
  // }
},[ singleChat[0]])

useEffect(() => {
   socket= io('https://chatt-webb-appp.herokuapp.com/')
   socket.emit('setup', JSON.parse(localStorage.getItem('auth-token')))
   socket.on('connected', () => setSocketConnected(true))
   socket.on('typing', () => setIsTyping(true));
   socket.on('stop typing', () => setIsTyping(false))
},[])

useEffect(() => {
  socket.on("message recieved", (newMessageRecieved) => {
    if (
      !selectedChatCompare || // if chat is not selected or doesn't match current chat
      selectedChatCompare._id !== newMessageRecieved.chat._id
    ) {
      setFetchAgain(!fetchAgain);
      // if (!notification.includes(newMessageRecieved)) {
      //   setNotification([newMessageRecieved, ...notification]);
      // }
    } else {
      setMessages([...messages, newMessageRecieved]);
    }
  });
});

const fetchMessages = async() => {
  if(!singleChat) return
  console.log(loggedUser?.token)
  console.log(singleChat[0])
  try {
    const config = {
      headers: {
        // "Content-type": "application/json",
        Authorization: `Bearer ${loggedUser.token}`,
      },
    };

    setLoading(true);
    const { data } = await axios.get(`http://localhost:4000/message/${singleChat[0]._id}`, config)
    console.log(data)
    setMessages(data);
    setLoading(false);
    socket.emit("join chat", singleChat[0]._id);
    
  } catch (error){
    toast({
      title: "Error Occured!",
      description: "Failed to Load the Messages",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }
}
let aaa = null
const sendMessage = async(event) => {
  if(file){
    socket.emit('stop typing', singleChat[0]._id)
    const formdata = new FormData();
    formdata.append("file", file)
    formdata.append("upload_preset", "chat-app");
    formdata.append("cloud_name", "dien8bnav")
    await axios.post('https://api.cloudinary.com/v1_1/dien8bnav/image/upload', formdata)
    .then((res) => {
      
      aaa = res.data.url.toString()
      console.log(res.data.url.toString())
    })
    
    try {
      const config = {
        headers: {
          // "Content-type": "application/json",
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };
      console.log(aaa)
        setNewMessage("");
          const { data } = await axios.post(
            "http://localhost:4000/message",
            {
              content: aaa,
              chatId: singleChat[0]._id,
            },
            config
          );
          console.log(data)
          socket.emit("new message", data);
          setMessages([...messages,data])
          setFetchAgain(!fetchAgain)
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      
  }
  else{
    if(event.key === 'Enter' && newMessage){
      socket.emit('stop typing', singleChat[0]._id)
      try {
        const config = {
          headers: {
            // "Content-type": "application/json",
            Authorization: `Bearer ${loggedUser.token}`,
          },
        };
        setNewMessage("");
          const { data } = await axios.post(
            "http://localhost:4000/message",
            {
              content: newMessage,
              chatId: singleChat[0]._id,
            },
            config
          );
          console.log(data)
          socket.emit("new message", data);
          setMessages([...messages,data])
          setFetchAgain(!fetchAgain)
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }
}

const typingHandler = (e) => {
  setNewMessage(e.target.value)

  if(!socketConnected) return

  if(!typing){
    setTyping(true)
    socket.emit('typing', singleChat[0]._id)
  }
  let lastTypingTime = new Date().getTime();
  let timerLength = 2000
  setTimeout(() => {
    let timeNow=new Date().getTime();
    let timeDiff = timeNow - lastTypingTime
    if(timeDiff >= timerLength && typing){
      socket.emit('stop typing', singleChat[0]._id)
      setTyping(false)
    }
  }, timerLength)
}

const handleFileChange = (e) => {
  setFile(e.target.files[0])
}

  return (
    <>
      {singleChat.length>0 ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => dispatch({ type: ADD_SINGLECHAT, payload:null })}
            />
            {
              (!singleChat[0]?.isGroupChat ? (
                <>
                  {getSender(loggedUser, singleChat[0].users)}
                  <ProfileModal
                    user={getSenderFull(loggedUser, singleChat[0].users)}
                  />
                </>
              ) : (
                <>
                  {singleChat[0].chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages" style={{
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'scroll',
                scrollbarWidth: 'none'
              }}>
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
              
            </FormControl>
            <div style={{display: 'flex'}}>
            <Input type='file' onChange={handleFileChange} style={{cursor: 'pointer '}}/>
            <Button onClick={sendMessage} >send</Button>
            </div>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat