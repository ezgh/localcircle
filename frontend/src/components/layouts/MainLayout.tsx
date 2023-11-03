import { Outlet } from "react-router-dom";

import styled from "styled-components";

import Navbar from "../Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
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
