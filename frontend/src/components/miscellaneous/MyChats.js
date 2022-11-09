import React, { useEffect, useState } from 'react'
import './style.css'
import { AddIcon } from "@chakra-ui/icons";
import {CloseIcon } from "@chakra-ui/icons"
import { REQUEST_CHAT } from '../../store/chats/chatActionTypes'
import { useChat } from '../../store/chats/reducer';
import { useDispatch } from 'react-redux';
import {Box, Button,  Stack,  Text} from '@chakra-ui/react';
import ChatLoading from './ChatLoading';
import GroupChatModal from './GroupChatModal';
import { getSender } from '../../Logics/ChatLogics';
import { ADD_SINGLECHAT } from '../../store/singleChat/singleChatActionTypes';
import { useSingleChat } from '../../store/singleChat/reducer';

// const MyChats = () => {
//     const [file, setFile] = useState([]);
//     const [fileUpload, setFileUpload] = useState([]);
  
//   function uploadSingleFile(e) {
//     setFileUpload([...fileUpload,e.target.files[0]]) 
//     setFile([...file, URL.createObjectURL(e.target.files[0])]);
//     // console.log("file", file);
//     // setFileUpload(...fileUpload, newFile)
//   }
//   console.log(file)
//   console.log(fileUpload)
//   // function upload(e) {
//   //   e.preventDefault();
//   //   console.log(file);
//   // }

//   function deleteFile(e) {
//     const s = file.filter((item, index) => index !== e);
//     setFile(s);
//     // console.log(s);
//   }

//   return (
//     <form>
//       <div className="form-group preview">
//         {file.length > 0 &&
//           file.map((item, index) => {
//             return (
//               <div key={item} className='singleImage'>
//                 <img src={item} alt="" className='img-preview'/>
//                 <button type="button" onClick={() => deleteFile(index)} className='delete-btn'>
//                   <CloseIcon/>
//                 </button>
//               </div>
//             );
//           })}
//           <div className="form-group">
//             <input
//               type="file"
//               disabled={file.length === 5}
//               className="form-control customImageInput"
//               onChange={uploadSingleFile}
//             />
//           </div>
//       </div>

//       {/* <div className="form-group">
//         <input
//           type="file"
//           disabled={file.length === 5}
//           className="form-control"
//           onChange={uploadSingleFile}
//         />
//       </div> */}
//       {/* <button
//         type="button"
//         className="btn btn-primary btn-block"
//         onClick={upload}
//       >
//         +
//       </button> */}
//     </form>
//   );
// }

const MyChats = ({fetchAgain}) => {
const { Chat, busy: ChatBusy } = useChat();
const [loggedUser, setLoggedUser] = useState()
// const [data , setData] = useState(false)
// const [selectedChat, setSelectedChat] = useState()
// const [userData, setUserData] = useState([])
const { singleChat } = useSingleChat();
const dispatch = useDispatch();

useEffect(() => {
    const token = JSON.parse(localStorage.getItem('auth-token'))
    setLoggedUser(token)
    // if (!ChatBusy && !(Chat || []).length) {
      dispatch({ type: REQUEST_CHAT, payload:token.token });
  // }
}, [fetchAgain])

useEffect(() => {
  console.log(Chat)
},[Chat, fetchAgain])

// useEffect(() => {

// },[data, singleChat])
  return (
    <>
      <Box
      display={{ base: singleChat[0] ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {Chat.length>0 ? (
          <Stack overflowY="scroll">
            {Chat.map((chat) => (
              <Box
                onClick={() => dispatch({ type: ADD_SINGLECHAT, payload:chat })}
                cursor="pointer"
                bg={singleChat[0] === chat ? "#38B2AC" : "#E8E8E8"}
                color={singleChat[0] === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.slice(0,5) == 'http:' ? 'Image' :
                    chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
          ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
    </>
  )
}

export default MyChats