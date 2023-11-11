import { Link } from "react-router-dom";
import styled from "styled-components";

export default function Navbar() {
  return (
    <Nav>
      <Logo>
        <Link to="/">
          <img src="https://picsum.photos/id/122/40/40" alt="" />
        </Link>
      </Logo>
    </Nav>
  );
}

const Nav = styled.div`
  overflow: hidden;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  height: 4rem;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;

  img {
    border-radius: 100%;
  }
`;

const Logo = styled.div`
  img {
    max-height: 40px; /* Adjust the height as needed */
  }
`;
