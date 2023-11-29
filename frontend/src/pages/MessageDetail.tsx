import { useState, useEffect } from "react";

import Cookies from "js-cookie";

import styled from "styled-components";
import {
  getAuthenticatedUser,
  getListingById,
  getMessages,
  getMessagesWithSelectedUser,
  getUserInfo,
  sendMessage,
  markMessageAsRead,
  updateListing,
} from "../api/api";
import { useParams, Link } from "react-router-dom";
import { userType, ListingType, MessageType } from "../types/types";
import { MdKeyboardBackspace } from "react-icons/md";
import { BackButton } from "../components/BackButton";
import DealModal from "../components/DealModal";
import ConversationList from "../components/ConversationList";
import Chat from "../components/Chat";
import logo from "../assets/logo.png";

export default function MessageDetail() {
  const [otherUser, setOtherUser] = useState<userType>();
  const [isOpen, setIsOpen] = useState(false);

  const [authUserId, setAuthUserId] = useState<string>("");
  const [relatedListing, setRelatedListing] = useState<ListingType>();

  const [newMessage, setNewMessage] = useState("");
  const [myMessages, setMyMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState<MessageType[]>([]);

  const accessToken = Cookies.get("accessToken");
  const listingId: string = useParams().listingId!;
  const id: string = useParams().id!;

  useEffect(() => {
    async function fetchData() {
      try {
        const authUserData = await getAuthenticatedUser(accessToken);
        const userId = authUserData?.id;
        setAuthUserId(userId);
        const otherUserData = await getUserInfo(accessToken, id);
        setOtherUser(otherUserData);
        const relatedListingData = await getListingById(accessToken, listingId);
        setRelatedListing(relatedListingData);
        const messagesData = await getMessages(accessToken, userId);
        setMyMessages(messagesSetByListingId(messagesData.results));
        const conversationData = await getMessagesWithSelectedUser(
          accessToken,
          userId,
          id,
          listingId
        );
        setMessage(conversationData.results);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [accessToken, id, listingId]);

  //send message

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const SendMessage = async (authUserId: string, id: string) => {
      try {
        const formData = new FormData();
        formData.append("user", authUserId);
        formData.append("sender", authUserId);
        formData.append("receiver", id);
        formData.append("message", newMessage);
        formData.append("listing_id", listingId);

        formData.append("is_read", false.toString());
        const newMessageData = await sendMessage(accessToken, formData);
        setMessage((prevMessages) => [...prevMessages, newMessageData]);
        setNewMessage("");
        const myNewMessagesData = await getMessages(accessToken, authUserId);
        setMyMessages(messagesSetByListingId(myNewMessagesData.results));
        console.log("success");
      } catch (error) {
        console.log("error ===", error);
      }
    };
    SendMessage(authUserId, id);
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

  //mark as read
  const handleMarkAsRead = async (message: MessageType) => {
    try {
      if (!message.is_read && message.receiver === authUserId) {
        await markMessageAsRead(accessToken, message.id);

        const updatedMessages = myMessages.map((msg) =>
          msg.id === message.id ? { ...msg, is_read: true } : msg
        );
        setMyMessages(updatedMessages);
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleChatClick = () => {
    const unreadMessages = message.filter(
      (message) => !message.is_read && message.receiver === authUserId
    );

    if (unreadMessages.length > 0) {
      handleMarkAsRead(unreadMessages[unreadMessages.length - 1]);
    }
  };

  const handleDeal = async () => {
    try {
      const formData = new FormData();
      formData.append("is_live", String(false));
      await updateListing(accessToken, formData, String(relatedListing?.id));
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <MessagesDiv>
        <Link to="/messages/">
          <BackButton>
            <MdKeyboardBackspace size={20} />
          </BackButton>
        </Link>
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
            messages={myMessages}
            authUserId={authUserId}
            handleMarkAsRead={handleMarkAsRead}
          />
          <ChatArea onClick={handleChatClick}>
            <UserInfo>
              <div className="chat-area-header">
                <div className="chat-area-group">
                  <img
                    className="chat-area-profile"
                    src={otherUser && otherUser.profile_picture}
                    alt=""
                  />
                </div>
                <div className="chat-area-title">
                  {otherUser && otherUser.get_full_name}
                </div>
              </div>
              {relatedListing &&
                Number(authUserId) === relatedListing?.user &&
                relatedListing.is_live && (
                  <div className="deal">
                    <button
                      className="dealButton"
                      onClick={() => setIsOpen(true)}
                    >
                      Deal
                    </button>
                    {isOpen && (
                      <DealModal
                        setIsOpen={setIsOpen}
                        listingId={relatedListing.id}
                        onDeal={handleDeal}
                      />
                    )}
                  </div>
                )}
            </UserInfo>
            {/* fix later */}
            {relatedListing && (
              <ListingInfo>
                {relatedListing.images[0] ? (
                  <img src={relatedListing.images[0]?.image} alt="" />
                ) : (
                  <img src={logo} alt="" />
                )}
                <div className="text">
                  <h3>{relatedListing.title}</h3>
                  <p>
                    {relatedListing.description.length > 100
                      ? `${relatedListing.description.slice(0, 100)}...`
                      : relatedListing.description}
                  </p>
                </div>
              </ListingInfo>
            )}

            <Chat messages={message} authUserId={authUserId} />

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
              <form action="" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Type something here..."
                  value={newMessage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewMessage(e?.target.value)
                  }
                />
              </form>
            </ChatFooter>
          </ChatArea>
        </Body>
      </MessagesDiv>
    </>
  );
}

const ListingInfo = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #f5f5f5;
  align-items: center;
  margin-bottom: 10px;

  .text {
    flex-direction: column;
    margin-left: 10px;

    h3 {
      margin: 0;
    }
    p {
      margin: 0;
    }
  }

  img {
    width: 55px;
    height: 55px;
    padding: 5px;
  }
`;

const MessagesDiv = styled.div`
  * {
    outline: none;
    box-sizing: border-box;
  }

  img {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: auto;
    display: initial;
  }

  .chat-area {
    display: flex;
    flex-direction: column;
    overflow: auto;
    &-header {
      display: flex;
      gap: 5px;

      position: sticky;
      top: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      align-items: center;
      padding: 10px;
      background: var(--chat-header-bg);
    }
    &-profile {
      width: 50px;
      height: 50px;
      border-radius: 50%;
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
    display: none;
  }
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-grow: 1;
`;

const ChatArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-grow: 0;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  .dealButton {
    border: none;
    background-color: #ba2207;
    color: white;
    border-radius: 30px;
    padding: 10px 15px;
    cursor: pointer;
    &:hover {
      background-color: #901703;
    }
  }
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
    width: 43rem;
    &::placeholder {
      color: gray;
    }
  }
`;
