import { useState } from "react";
import styled from "styled-components"
import Navbar from "./Navbar"
import Listing from "./Listing";
import Modal from "./Modal";
import { MdOutlineKeyboardArrowDown } from "react-icons/md"
 

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Navbar />
      <Main>
        <Share>
          <ShareButton onClick={() => setIsOpen(true)}>What do you want to share?</ShareButton>
          {isOpen && <Modal setIsOpen={setIsOpen} />}
          
        </Share>
        <Listings>
          <Filter>Filter<MdOutlineKeyboardArrowDown /> </Filter>
          <Listing />
        </Listings>
      </Main>
    </>
  )
}

const Main = styled.div`
display:flex; 
justify-content:center;
align-items:center;
flex-direction:column;
`;
const Share = styled.div`
width:100%;
display:flex;
justify-content:center;
`;

const ShareButton = styled.button`
margin: 1rem 0 0.5rem 0;
padding: 1.5% 5%;
width:auto;
font-size: 1.2rem;
font-family: Montserrat;
font-weight:400;
text-align:start;
border: none;
border-radius: 3.125rem;
background: #F5F5F5;
color: black;
cursor:pointer;

@media (max-width: 768px) {
    padding: 4%;
    font-size:1.2rem;
  }
`;

const Listings = styled.div`
margin-top:2rem;
max-width:50rem;

@media (max-width: 425px) {
  margin-top:2rem;
}
`
const Filter = styled.button`
margin: 1rem 1rem 1rem 0;
padding: 1% 2%;
max-width: 10rem;
font-size: 1rem;
font-weight:200;
border: none;
border-radius: 1.375rem;
background: #1A1C25;
color: white;
cursor:pointer;

&:hover {
    background: #303342;
  }
`;

