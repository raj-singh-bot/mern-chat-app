import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSingleChat } from '../../store/singleChat/reducer';
import { ADD_SINGLECHAT } from '../../store/singleChat/singleChatActionTypes';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import UserListItem from '../userAvatar/UserListItem';

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const { singleChat } = useSingleChat();
    const [loggedUser, setLoggedUser] = useState();
    const toast = useToast()
    const dispatch = useDispatch();

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('auth-token')))
    },[])
    // console.log(singleChat)
    const handleSearch = debounce(async(query) => {
        setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };
      const { data } = await axios.get(`http://localhost:4000/user?search=${query}`, config);
      console.log(data);
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
      setLoading(false);
    }
    },500)

    const handleRename = async() => {
        if(!groupChatName) return;
        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${loggedUser.token}`,
                  },
            }
            const {data} = await axios.put('http://localhost:4000/chat/renameGroup',{
                chatId: singleChat[0]._id,
                chatName: groupChatName,
            }, config)
            console.log(data)
            dispatch({ type: ADD_SINGLECHAT, payload:data })
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        
            setRenameLoading(false);
        }
    }
    
    const handleAddUser = async(user1) => {
        if (singleChat[0].users.find((u) => u._id === user1._id)) {
            toast({
              title: "User Already in group!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }
      
          if (singleChat[0].groupAdmin._id !== loggedUser._id) {
            toast({
              title: "Only admins can add someone!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }
          
          try {
            setLoading(true);
            const config = {
              headers: {
                Authorization: `Bearer ${loggedUser.token}`,
              },
            };
            const { data } = await axios.put(
              'http://localhost:4000/chat/addUser',
              {
                chatId: singleChat[0]._id,
                userId: user1._id,
              },
              config
            );
            console.log(data)
            dispatch({ type: ADD_SINGLECHAT, payload:data })
            setSearch('')
            // setSelectedChat(data);
            // setFetchAgain(!fetchAgain);
            setLoading(false);
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: error,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
          }
          setGroupChatName("");
    }

    const handleRemove = async(user1) => {
        if (singleChat[0].groupAdmin._id !== loggedUser._id && user1._id !== loggedUser._id) {
            toast({
              title: "Only admins can remove someone!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }
      
          try {
            setLoading(true);
            const config = {
              headers: {
                Authorization: `Bearer ${loggedUser.token}`,
              },
            };
            const { data } = await axios.put(
              'http://localhost:4000/chat/removeUser',
              {
                chatId: singleChat[0]._id,
                userId: user1._id,
              },
              config
            );
              
            user1._id === loggedUser._id ? dispatch({ type: ADD_SINGLECHAT, payload:null }) : dispatch({ type: ADD_SINGLECHAT, payload:data })
            
            // setFetchAgain(!fetchAgain);
            // fetchMessages();
            setLoading(false);
            // onClose();
          } catch (error) {
            console.log(error)
            toast({
              title: "Error Occured!",
              description: error,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
          }
          setGroupChatName("");
    }
  return (
    <>
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

        <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
            >
            {singleChat[0].chatName}
            </ModalHeader>

            <ModalCloseButton />
            <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                {singleChat[0].users.map((u) => (
                <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={singleChat[0].groupAdmin}
                    handleFunction={() => handleRemove(u)}
                />
                ))}
            </Box>
            <FormControl display="flex">
                <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
                >
                Update
                </Button>
            </FormControl>
            <FormControl>
                <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
                />
            </FormControl>

            {loading ? (
                <Spinner size="lg" />
            ) : (
                searchResult?.map((user) => (
                <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                />
                ))
            )}
            </ModalBody>
            <ModalFooter>
            <Button onClick={() => handleRemove(loggedUser)} colorScheme="red">
                Leave Group
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    </>
  )
}

export default UpdateGroupChatModal