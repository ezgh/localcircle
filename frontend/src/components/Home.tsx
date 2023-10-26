import styled from "styled-components"
import Navbar from "./Navbar"

export default function Home() {
  return (
    <>
      <Navbar />
      <Main>
<Button>What do you want to share?</Button>
<dialog id="modal" className="modal" open>
  <button id="closeModal" className="modal-close-btn">Close</button>
  <p>...</p>
</dialog>
</Main>
    </>
  )
}

const Main = styled.div`
display:flex; 
justify-content:center;
`

const Button = styled.button`
margin: 1rem 0 0.5rem 0;
padding: 1.5%;
width: 30%;
font-size: 1.2rem;
font-family: Montserrat;
font-weight:400;
text-align:start;
border: none;
border-radius: 3.125rem;
background: #F5F5F5;
color: black;
cursor:pointer;

`
