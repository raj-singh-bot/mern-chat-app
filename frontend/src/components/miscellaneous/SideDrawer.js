import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {useNavigate } from 'react-router-dom'
import { useDisclosure } from "@chakra-ui/hooks";
import ProfileModal from './ProfileModal';
import ChatLoading from './ChatLoading';
import UserListItem from '../userAvatar/UserListItem';
import axios from 'axios';
import { useChat } from '../../store/chats/reducer';
import { useDispatch } from 'react-redux';
import { REQUEST_CHAT } from '../../store/chats/chatActionTypes';

const SideDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [profileLogged, setProfileLogged] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    // const { Chat, busy: ChatBusy } = useChat();
    // const dispatch = useDispatch()

    const navigate = useNavigate()
    const toast = useToast();
    useEffect(() => {
        setProfileLogged(JSON.parse(localStorage.getItem('auth-token')))

    },[])

    
    const handleSearch = async() => {
      if (!search) {
        toast({
          title: "Please Enter something in search",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
        return;
      }
  
      try {
        setLoading(true);
  
        const config = {
          headers: {
            Authorization: `Bearer ${profileLogged.token}`,
          },
        };
  
        const { data } = await axios.get(`http://localhost:4000/user?search=${search}`, config);
  
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }

    const accessChat = async (userId) => {
      console.log(userId);

      try {
        setLoadingChat(true);
        const config = {
          headers: {
            // "Content-type": "application/json",
            Authorization: `Bearer ${profileLogged.token}`,
          },
        };
        const { data } = await axios.post(`http://localhost:4000/chat`, {userId} , config);
        console.log(data)
        // if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        // setSelectedChat(data);
        setLoadingChat(false);
        onClose();
      } catch (error) {
        toast({
          title: "Error fetching the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }

    const logoutHandler = () => {
        localStorage.removeItem("auth-token");
        navigate("/");
      };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Chat App
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              {/* <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              /> */}
              {/* <BellIcon fontSize="2xl" m={1} /> */}
            </MenuButton>
            {/* <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={profileLogged?.name}
                src={profileLogged?.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={profileLogged}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer