import { Link } from "react-router-dom"
import styled from "styled-components"
import { HiOutlineEnvelope } from "react-icons/hi2";
import { BsBookmarks } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";



export default function Navbar() {
  return (
 
<Nav> 
    <Logo>
    <img src="https://picsum.photos/id/122/40/40" alt="" />
    </Logo>
    <NavLinks>
        <Link to="/"><SlLocationPin size={20} className="icons"/></Link>
        <Link to="/"><BsBookmarks size={20} className="icons"/></Link>
        <Link to="/"><HiOutlineEnvelope size={20} className="icons"/></Link>
        <Link to="/"><img src="https://picsum.photos/id/232/40/40" alt="" /></Link>
    </NavLinks>
</Nav> 
);
}

const Nav = styled.div`
overflow: hidden;
background-color: white;
border-bottom: 1px solid rgba(0, 0, 0, 0.10);
height:4rem ;
display: flex;
flex-shrink: 0;
justify-content: space-between;
align-items: center;
padding: 10px 20px;

img {
  border-radius:100%;
}
`;

const Logo = styled.div`
img {
  max-height: 40px; /* Adjust the height as needed */
}
`
const NavLinks = styled.div`
a {
  color: black;
  text-decoration: none;
  margin:8px;
}

.span {
  margin:10px;
}

.icons {
  margin:10px;
}

@media screen and (max-width: 600px) {
    flex-direction: column;
    align-items: center;
}
`

