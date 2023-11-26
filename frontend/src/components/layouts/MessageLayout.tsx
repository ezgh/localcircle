import { useEffect, useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";

import styled from "styled-components";
import Cookies from "js-cookie";

import MainNavbar from "../MainNavbar";

import { getAuthenticatedUser, getMessages } from "../../api/api";
import { MessageType } from "../../types/types";

export default function MessageLayout() {
  const [authUserId, setAuthUserId] = useState(0);
  const [avatar, setAvatar] = useState("");
  const [myMessages, setMyMessages] = useState<MessageType[]>([]);

  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthUserInfo = async () => {
      try {
        const authUserData = await getAuthenticatedUser(accessToken);
        setAuthUserId(authUserData.id);
        setAvatar(authUserData.profile_picture);
      } catch (error) {
        console.error("Error fetching auth user:", error);
      }
    };
    fetchAuthUserInfo();
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const myNewMessagesData = await getMessages(
          accessToken,
          authUserId.toString()
        );
        setMyMessages(myNewMessagesData.results);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000);

    return () => clearInterval(intervalId);
  }, [authUserId, accessToken]);

  const hasUnreadMessages = myMessages.some(
    (message) => !message.is_read && Number(message.receiver) === authUserId
  );
  console.log(hasUnreadMessages);

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <MainNavbar
        authUserId={authUserId}
        logout={logout}
        avatar={avatar}
        hasUnreadMessages={hasUnreadMessages}
      />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}

const Main = styled.div`
  padding: 2% 5%;

  @media (max-width: 425px) {
    padding: 0;
  }
`;
