import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import moment from "moment";

import styled from "styled-components";
import {
  getAuthenticatedUser,
  getMessages,
  getMessagesWithSelectedUser,
} from "../api/api";
import { useParams, Link } from "react-router-dom";

type Message = {
  id: string;
  sender: string;
  date: Date;
  receiver: string;
  sender_profile: {
    profile_picture: string;
    get_full_name: string;
  };
  receiver_profile: {
    profile_picture: string;
    get_full_name: string;
  };
  message: string;
};

export default function MessageDetail() {
  const [authUser, setAuthUser] = useState();
  const [authUserId, setAuthUserId] = useState();

  const [myMessages, setMyMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message[]>([]);

  const accessToken = Cookies.get("accessToken");
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const authUserData = await getAuthenticatedUser(accessToken);
        setAuthUser(authUserData);
        const userId = authUserData.id;
        console.log("Auth User ID:", userId);
        setAuthUserId(userId);
        const messagesData = await getMessages(accessToken, userId);
        setMyMessages(messagesData.results);
        const conversationData = await getMessagesWithSelectedUser(
          accessToken,
          userId,
          id
        );
        console.log(conversationData.results);
        setMessage(conversationData.results);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, [accessToken, id]);

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
            {myMessages.map((message) => (
              <Link
                to={
                  "/messages/" +
                  (message.sender === authUserId
                    ? message.receiver
                    : message.sender)
                }
              >
                <Message key={message.id}>
                  {message.sender == authUserId ? (
                    <img
                      className="msg-profile"
                      src={message.receiver_profile.profile_picture}
                      alt=""
                    />
                  ) : (
                    <img
                      className="msg-profile"
                      src={message.sender_profile.profile_picture}
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
                      <span className="msg-message">{message.message}</span>
                      <span className="msg-date">
                        {moment(message.date).fromNow()}
                      </span>
                    </div>
                  </div>
                </Message>
              </Link>
            ))}
          </ConversationList>
          <ChatArea>
            {message[0].sender == authUserId ? (
              <div className="chat-area-header">
                <div className="chat-area-title">
                  {message[0].receiver_profile.get_full_name}
                </div>
                <div className="chat-area-group">
                  <img
                    className="chat-area-profile"
                    src={message[0].receiver_profile.profile_picture}
                    alt=""
                  />
                </div>
              </div>
            ) : (
              <div className="chat-area-header">
                <div className="chat-area-title">
                  {message[0].sender_profile.get_full_name}
                </div>
                <div className="chat-area-group">
                  <img
                    className="chat-area-profile"
                    src={message[0].sender_profile.profile_picture}
                    alt=""
                  />
                </div>
              </div>
            )}

            <ChatMain>
              {message.map((message, index) => (
                <>
                  {message.sender == authUserId ? (
                    <ChatMessageOwner>
                      <ChatMessageProfile>
                        <img
                          className="chat-msg-img"
                          src={message.sender_profile.profile_picture}
                          alt=""
                        />
                        <div className="chat-msg-date">Message seen 1.22pm</div>
                      </ChatMessageProfile>
                      <ChatMessageContent>
                        <div className="chat-msg-text">{message.message}</div>
                      </ChatMessageContent>
                    </ChatMessageOwner>
                  ) : (
                    <ChatMessage>
                      <ChatMessageProfile>
                        <img
                          className="chat-msg-img"
                          src={message.sender_profile.profile_picture}
                          alt=""
                        />
                        <div className="chat-msg-date">Message seen 1.22pm</div>
                      </ChatMessageProfile>
                      <ChatMessageContent>
                        <div className="chat-msg-text">{message.message}</div>
                      </ChatMessageContent>
                    </ChatMessage>
                  )}
                </>
              ))}
            </ChatMain>
            <ChatFooter>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-paperclip"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
              <input type="text" placeholder="Type something here..." />
            </ChatFooter>
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

  width: 70rem;

  img {
    max-width: 100%;
  }

  .chat-area {
    display: flex;
    flex-direction: column;
    overflow: auto;
    &-header {
      display: flex;
      position: sticky;
      top: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      background: var(--chat-header-bg);
    }
    &-profile {
      width: 32px;
      border-radius: 50%;
      object-fit: cover;
    }
    &-title {
      font-size: 18px;
      font-weight: 600;
    }
    &-main {
      flex-grow: 1;
    }
  }

  .chat-msg-img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .chat-msg-date {
    position: absolute;
    left: calc(100% + 12px);
    bottom: 0;
    font-size: 12px;
    font-weight: 600;
    color: black;
    white-space: nowrap;
  }

  .chat-msg {
    &-text {
      background-color: #21242f;
      padding: 15px;
      border-radius: 20px 20px 20px 0;
      line-height: 1.5;
      font-size: 14px;
      font-weight: 500;
      & + & {
        margin-top: 10px;
      }
    }
  }

  .chat-msg-text {
    color: white;
  }

  .chat-msg-text img {
    max-width: 300px;
    width: 100%;
  }

  @media (max-width: 1120px) {
  }

  @media (max-width: 780px) {
    .conversation-area {
      display: none;
    }
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
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-grow: 1;
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
`;

const Message = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: 0.2s;
  position: relative;
  &:hover {
    background-color: green;
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
  flex-direction: column;
  overflow: auto;
`;

const ChatMessageProfile = styled.div`
  flex-shrink: 0;
  margin-top: auto;
  margin-bottom: -20px;
  position: relative;
`;

const ChatMessageContent = styled.div`
  margin-left: 12px;
  max-width: 70%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ChatMessage = styled.div`
  display: flex;
  padding: 0 20px 45px;
`;

const ChatMessageOwner = styled.div`
  display: flex;
  padding: 0 20px 45px;
  flex-direction: row-reverse;

  .chat-msg-content {
    margin-left: 0;
    margin-right: 12px;
    align-items: flex-end;
  }
  .chat-msg-text {
    background-color: #e6e8ef;
    color: black;
    border-radius: 20px 20px 0 20px;
  }
  .chat-msg-date {
    left: auto;
    right: calc(100% + 12px);
  }
`;

const ChatMain = styled.div`
  overflow-y: scroll;
  height: 55vh;
`;

const ChatFooter = styled.div`
  display: flex;
  border-top: 1px solid var(--border-color);
  width: 100%;
  padding: 10px 20px;
  align-items: center;
  background-color: var(--theme-bg-color);
  position: sticky;
  bottom: 0;
  left: 0;

  svg {
    color: var(--settings-icon-color);
    width: 20px;
    flex-shrink: 0;
    cursor: pointer;
    &:hover {
      color: var(--settings-icon-hover);
    }

    & + svg {
      margin-left: 12px;
    }
  }

  input {
    border: none;
    color: black;
    background-color: #f9f9f9;
    padding: 12px;
    border-radius: 6px;
    font-size: 15px;
    margin: 0 12px;
    width: 100%;
    &::placeholder {
      color: gray;
    }
  }
`;