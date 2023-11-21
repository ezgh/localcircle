import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import moment from "moment";

import styled from "styled-components";
import {
  getAuthenticatedUser,
  getMessages,
  markMessageAsRead,
} from "../api/api";
import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";

type Message = {
  id: string;
  sender: string;
  date: Date;
  receiver: string;
  is_read: boolean;
  sender_profile: {
    profile_picture: string;
    get_full_name: string;
  };
  receiver_profile: {
    profile_picture: string;
    get_full_name: string;
  };
  message: string;
  listing: {
    image: File | string;
    title: string;
    description: string;
    id: number;
  };
};

export default function Messages() {
  const [authUser, setAuthUser] = useState();
  const [authUserId, setAuthUserId] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([]);

  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    async function fetchData() {
      try {
        const authUserData = await getAuthenticatedUser(accessToken);
        setAuthUser(authUserData);
        const userId = authUserData.id;
        console.log("Auth User ID:", userId);
        setAuthUserId(userId);
        const messagesData = await getMessages(accessToken, userId);
        setMessages(messagesData.results);
        console.log(messagesData.results);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, [accessToken]);

  //mark as read
  const handleMarkAsRead = async (message) => {
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
          <ConversationList>
            {messages.map((message) => (
              <Link
                to={
                  "/messages/" +
                  (message.sender === authUserId
                    ? message.receiver
                    : message.sender) +
                  "/" +
                  message.listing.id +
                  "/"
                }
                onClick={() => handleMarkAsRead(message)}
              >
                <Message
                  key={message.id}
                  className={
                    message.receiver === authUserId && !message.is_read
                      ? "newMessage"
                      : "read"
                  }
                >
                  {message && (
                    <img
                      className="msg-profile"
                      src={message.listing.image}
                      alt=""
                    />
                  )}

                  <div className="msg-detail">
                    <div className="msg-username">
                      {message.sender == authUserId
                        ? message.receiver_profile.get_full_name
                        : message.sender_profile.get_full_name}
                    </div>

                    <div className="msg-content">
                      <div className="listingtitle">
                        {message.listing.title}
                      </div>
                      <span className="msg-date">
                        {moment(message.date).fromNow()}
                      </span>
                    </div>
                  </div>
                  <div className="new">
                    <GoDotFill size={"1.2em"} />
                  </div>
                </Message>
              </Link>
            ))}
          </ConversationList>
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

const ConversationList = styled.div`
  width: 340px;
  flex-shrink: 0;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  a {
    text-decoration: none;
    color: inherit;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding-right: 50px;
  }
`;

const Message = styled.div`
  &.newMessage {
    background-color: #f9f9f9;
    .new {
      display: block;
      margin-left: 15%;
      svg {
        color: #ba2207;
      }
    }

    @media (max-width: 560px) {
      .new {
        margin-left: 5%;
      }
    }
  }

  .new {
    display: none;
  }
  display: flex;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: 0.2s;
  position: relative;
  &:hover {
    background-color: #f1f1f1;
  }
  &.active {
    background: blue;
    border-left: 4px solid blue;
  }

  .msg-profile {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
    &.group {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--border-color);

      svg {
        width: 60%;
      }
    }
  }

  .msg-username {
    margin-bottom: 4px;
    font-weight: 600;
    font-size: 15px;
  }

  .msg-detail {
    overflow: hidden;
  }

  .msg-content {
    font-weight: 500;
    font-size: 13px;
    display: flex;
  }

  .msg-message {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--msg-message);
  }

  .msg-date {
    font-size: 14px;
    color: var(--msg-date);
    margin-left: 3px;
    &:before {
      content: "•";
      margin-right: 2px;
    }
  }
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
