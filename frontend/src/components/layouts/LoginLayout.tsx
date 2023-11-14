import { Outlet } from "react-router-dom";
import styled from "styled-components";

export default function LoginLayout() {
  return (
    <>
      <Main>
        <Outlet />
      </Main>
    </>
  );
}

const Main = styled.div`
  margin: 2%;
  @media (max-width: 768px) {
    margin: 0;
  }
`;
