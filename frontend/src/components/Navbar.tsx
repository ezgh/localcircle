import { Link } from "react-router-dom"
import styled from "styled-components"

export default function Navbar() {
    const Navbar = styled.div`
    overflow: hidden;
    background-color: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.10);
    height:4rem ;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
  `

  const Logo = styled.div`
  img {
    max-height: 40px; 
  }
  `

  const NavLinks = styled.div`
   a {
     color: black;
    text-decoration: none;
    margin: 0 10px;
    }
  `



  return (
    <Navbar>
    <Logo>
      <img src="your-logo.png" alt="Logo" />
    </Logo>
    <NavLinks>
        <Link to="/">Location</Link>
        <Link to="/">Likes</Link>
        <Link to="/">Messages</Link>
        <Link to="/">Profile</Link>
    </NavLinks>
  </Navbar>
  )
}

