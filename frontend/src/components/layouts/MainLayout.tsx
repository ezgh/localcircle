import { useEffect, useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";

import styled from "styled-components";
import Cookies from "js-cookie";

import MainNavbar from "../MainNavbar";

import { getAuthenticatedUser } from "../../api/api";

export default function MainLayout() {
  const [authUserId, setAuthUserId] = useState(0);

  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthUserInfo = async () => {
      try {
        const authUserData = await getAuthenticatedUser(accessToken);
        setAuthUserId(authUserData.id);
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
  };

  return (
    <>
      <MainNavbar authUserId={authUserId} logout={logout} />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2% 20%;

  @media (max-width: 425px) {
    padding: 0;
  }
`;