import { Avatar, Tooltip } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../Logics/ChatLogics';

const ScrollableChat = ({messages}) => {
    const [loggedUser, setLoggedUser] = useState();
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('auth-token')))
    }, [])
    console.log(messages)
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m?._id} >
            {(isSameSender(messages, m, i, loggedUser?._id) ||
              isLastMessage(messages, i, loggedUser?._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            {
              m?.content.slice(0,5) == 'http:' ?
              <img src={m?.content}  alt='pic' style={{
                width: '150px',
                marginLeft: isSameSenderMargin(messages, m, i, loggedUser?._id),
                marginTop: isSameUser(messages, m, i, loggedUser?._id) ? 3 : 10,
              }}/>           
              :
            <span
              style={{
                backgroundColor: `${
                  m?.sender._id === loggedUser?._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, loggedUser?._id),
                marginTop: isSameUser(messages, m, i, loggedUser?._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m?.content}
            </span>
            }
            
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat