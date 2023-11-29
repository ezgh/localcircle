import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { MessageType } from "../types/types";
import logo from "../assets/logo.png";
import moment from "moment";
import styled from "styled-components";

type ConversationListProps = {
  messages: MessageType[];
  authUserId: string;
  handleMarkAsRead: (message: MessageType) => void;
};

export default function ConversationList({
  messages,
  authUserId,
  handleMarkAsRead,
}: ConversationListProps) {
  return (
    <ConversationListDiv>
      {messages.map((message) => (
        <Link
          to={`/messages/${
            message.sender === authUserId ? message.receiver : message.sender
          }/${message.listing.id}/`}
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
            {message && message.listing.images[0] ? (
              <img
                className="msg-profile"
                src={message.listing.images[0]?.image}
                alt=""
              />
            ) : (
              <img className="msg-profile" src={logo} alt="" />
            )}

            <div className="msg-detail">
              <div className="msg-username">
                {message.sender == authUserId
                  ? message.receiver_profile.get_full_name
                  : message.sender_profile.get_full_name}
              </div>

              <div className="msg-content">
                <div className="listingtitle">
                  {message.listing.title.substring(0, 10)}
                </div>
                <span className="msg-date">
                  {moment(message.date).fromNow().substring(0, 15) + "..."}
                </span>
              </div>
            </div>
            <div className="new">
              <GoDotFill size={"1.2em"} />
            </div>
          </Message>{" "}
        </Link>
      ))}
    </ConversationListDiv>
  );
}

const ConversationListDiv = styled.div`
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
