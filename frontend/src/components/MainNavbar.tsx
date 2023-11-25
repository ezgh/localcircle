import { Link } from "react-router-dom";
import styled from "styled-components";

import { HiOutlineEnvelope } from "react-icons/hi2";
import { BsBookmarks } from "react-icons/bs";
import {
  RiUserSettingsLine,
  RiUserLine,
  RiLogoutBoxLine,
} from "react-icons/ri";
import { GoDotFill } from "react-icons/go";

type NavbarProps = {
  avatar: string;
  authUserId: number;
  logout: () => void;
  hasUnreadMessages: boolean;
};

export default function MainNavbar({
  authUserId,
  logout,
  avatar,
  hasUnreadMessages,
}: NavbarProps) {
  return (
    <Nav>
      <Link to="/">
        <Logo>
          <img src="https://picsum.photos/id/122/40/40" alt="" />
        </Logo>
      </Link>
      <NavLinks>
        <Link to="/bookmarks">
          <BsBookmarks size={20} className="icons" />
        </Link>
        <Link to="/messages">
          <HiOutlineEnvelope size={20} className="icons" />
          {hasUnreadMessages && (
            <div className="new">
              <GoDotFill size={"1.2em"} />
            </div>
          )}
        </Link>
        <div className="dropdown">
          <button className="dropbtn">
            <img src={avatar} alt="" width={50} height={50} />
            <i className="fa fa-caret-down"></i>
          </button>
          <div className="dropdown-content">
            <Link to={`/profile/${authUserId}`}>
              <RiUserLine /> Profile
            </Link>
            <Link to="/settings">
              <RiUserSettingsLine /> Settings
            </Link>
            <button className="logoutBtn" onClick={logout}>
              {" "}
              <RiLogoutBoxLine /> Logout
            </button>
          </div>
        </div>
      </NavLinks>
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
  overflow: hidden;

  img {
    border-radius: 100%;
    width: 50x;
    height: 50px;
  }

  a {
    float: left;
    font-size: 16px;
    color: white;
    text-align: center;
    text-decoration: none;
  }

  .dropdown {
    float: left;
    overflow: hidden;
    padding-right: 30px;
  }

  .dropbtn {
    position: relative;
    right: -20px;
  }

  .dropdown .dropbtn {
    border: none;
    outline: none;
    color: white;
    background-color: inherit;
    font-family: inherit;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    right: 10px;
  }

  .dropdown-content a {
    float: none;
    color: black;
    padding: 12px 8px;
    text-decoration: none;
    display: block;
    text-align: left;
  }

  .dropdown-content a:hover {
    background-color: #f2f2f2;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

  .logoutBtn {
    float: left;
    font-size: 16px;
    color: white;
    text-align: center;
    border: none;
    background-color: #f9f9f9;
    color: black;
    float: none;
    padding: 12px;
    text-decoration: none;
    display: block;
    margin: 8px;
    cursor: pointer;
  }
  .logoutBtn:hover {
    background-color: #f2f2f2;
  }

  .new {
    left: 9px;
    top: -29px;
    position: relative;

    svg {
      color: #ba2207;
    }
  }
`;

const Logo = styled.div`
  img {
    max-height: 40px;
  }
`;
const NavLinks = styled.div`
  a {
    color: black;
    text-decoration: none;
    margin: 8px 8px 0 8px;
  }

  .span {
    margin: 10px;
  }

  .icons {
    margin: 10px;
  }

  @media screen and (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;
