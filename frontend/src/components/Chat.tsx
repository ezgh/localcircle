import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { MessageType } from "../types/types";

type ChatMainProps = {
  messages: MessageType[];
  authUserId: string;
};

export default function Chat({ messages, authUserId }: ChatMainProps) {
  const chatMainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMainRef.current) {
      chatMainRef.current.scrollTop = chatMainRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ChatMain ref={chatMainRef}>
      {messages.map((message, index) => (
        <React.Fragment key={index}>
          {message.sender === authUserId ? (
            <ChatMessageOwner>
              <ChatMessageProfile>
                <img
                  className="chat-msg-img"
                  src={message.sender_profile.profile_picture}
                  alt=""
                />
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
              </ChatMessageProfile>
              <ChatMessageContent>
                <div className="chat-msg-text">{message.message}</div>
              </ChatMessageContent>
            </ChatMessage>
          )}
        </React.Fragment>
      ))}
    </ChatMain>
  );
}

const ChatMain = styled.div`
  overflow-y: auto;
  height: 45vh;
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
