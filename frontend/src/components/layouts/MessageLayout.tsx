import { useEffect, useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";

import styled from "styled-components";
import Cookies from "js-cookie";

import MainNavbar from "../MainNavbar";

import { getAuthenticatedUser } from "../../api/api";

export default function MessageLayout() {
  const [authUserId, setAuthUserId] = useState(0);
  const [avatar, setAvatar] = useState("");

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

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <MainNavbar authUserId={authUserId} logout={logout} avatar={avatar} />
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
