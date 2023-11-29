import { useState, useEffect } from "react";

import Cookies from "js-cookie";

import styled from "styled-components";
import {
  getAuthenticatedUser,
  getMessages,
  markMessageAsRead,
} from "../api/api";

import { MessageType } from "../types/types";
import ConversationList from "../components/ConversationList";

export default function Messages() {
  const [authUserId, setAuthUserId] = useState<string>("");

  const [messages, setMessages] = useState<MessageType[]>([]);

  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    async function fetchData() {
      try {
        const authUserData = await getAuthenticatedUser(accessToken);
        const userId = authUserData.id;
        console.log("Auth User ID:", userId);
        setAuthUserId(userId);
        const messagesData = await getMessages(accessToken, userId);
        setMessages(messagesSetByListingId(messagesData.results));
        console.log(messagesData.results);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [accessToken]);

  //mark as read
  const handleMarkAsRead = async (message: MessageType) => {
    try {
      if (!message.is_read && message.receiver === authUserId) {
        await markMessageAsRead(accessToken, message.id);

        const updatedMessages = messages.map((msg) =>
          msg.id === message.id ? { ...msg, is_read: true } : msg
        );
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const messagesSetByListingId = (messages: MessageType[]): MessageType[] => {
    const listings: number[] = [];
    const data: MessageType[] = [];

    for (const message of messages) {
      if (!listings.includes(message.listing.id)) {
        listings.push(message.listing.id);
        data.push(message);
        console.log(data);
      }
    }

    return data;
  };

  return (
    <>
      <MessagesDiv>
        <Header>
          <div className="logo">
            <svg
              viewBox="0 0 513 513"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256.025.05C117.67-2.678 3.184 107.038.025 245.383a240.703 240.703 0 0085.333 182.613v73.387c0 5.891 4.776 10.667 10.667 10.667a10.67 10.67 0 005.653-1.621l59.456-37.141a264.142 264.142 0 0094.891 17.429c138.355 2.728 252.841-106.988 256-245.333C508.866 107.038 394.38-2.678 256.025.05z" />
              <path
                d="M330.518 131.099l-213.825 130.08c-7.387 4.494-5.74 15.711 2.656 17.97l72.009 19.374a9.88 9.88 0 007.703-1.094l32.882-20.003-10.113 37.136a9.88 9.88 0 001.083 7.704l38.561 63.826c4.488 7.427 15.726 5.936 18.003-2.425l65.764-241.49c2.337-8.582-7.092-15.72-14.723-11.078zM266.44 356.177l-24.415-40.411 15.544-57.074c2.336-8.581-7.093-15.719-14.723-11.078l-50.536 30.744-45.592-12.266L319.616 160.91 266.44 356.177z"
                fill="#fff"
              />
            </svg>
          </div>
          <h3>Messages</h3>
        </Header>
        <Body>
          <ConversationList
            messages={messages}
            authUserId={authUserId}
            handleMarkAsRead={handleMarkAsRead}
          />
          <ChatArea>
            <h1>No message selected</h1>
          </ChatArea>
        </Body>
      </MessagesDiv>
    </>
  );
}

const MessagesDiv = styled.div`
  * {
    outline: none;
    box-sizing: border-box;
  }

  img {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 20px;

  .logo {
    color: var(--theme-color);
    width: 38px;
    flex-shrink: 0;
    margin-right: 10px;

    svg {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    width: 95%;
  }
`;

const Body = styled.div`
  width: 100%;
  display: flex;
`;

const ChatArea = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  overflow: auto;
  color: gray;
  border: 1px solid #f3f3f3;
  height: 70vh;

  @media (max-width: 768px) {
    display: none;
  }
`;
