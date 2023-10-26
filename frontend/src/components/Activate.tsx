import { useState } from "react";
import Navbar from "./Navbar";
import { useParams,Link } from "react-router-dom";
import styled from "styled-components";

export default function Activate() {
  const { uid, token } = useParams();
 const [isActivated, setIsActivated] = useState(false)


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/auth/users/activation/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid,
        token
      }),
    });
    if (res.ok) {
setIsActivated(true)  
  } else {
      const errorData = await res.json().catch((error) => {
        console.error("Failed to parse JSON in error response:", error);
      });
      console.error(errorData);
    }
  }

  return (
    <>
    <Navbar />
    <Container>
        <Box>
        {isActivated ? 
        <Activation>
          <h3>Thanks!</h3>
          <p>Your account has been successfully activated. You can <Link to="/login">Login</Link> now.
          </p></Activation> : 
         <Activation>
         <h1>Welcome to Local Circle.</h1>
         <h1>Please activate your account to continue.</h1>
         <form onSubmit={handleSubmit}>
            <Button type="submit">Activate</Button>
         </form>

         </Activation>
         }
        </Box>
        <Box>two</Box>
    </Container>
    </>
  );
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Box = styled.div`
  width: auto;
  border: 1px solid #000;
  text-align: center;
  
`;

const Activation = styled.div`
  border-radius: 1.25rem;
  background: #FAFAFA;
 margin: 5%;
  padding: 5%;

  a {
    color: black;
    text-decoration: none;
    font-weight: bold;
  }


  @media (max-width: 425px) {
    h1 {
      font-size: em;
      margin: 1rem;
    };
  @media (max-width: 768px) {
  h1 {
    margin: 1rem;
  };
 `; 

const Button = styled.button`
margin: 1rem 0 0.5rem 0;
padding: 1%;
min-width: 10%;
font-size: 1rem;
border: none;
border-radius: 1.375rem;
background: #9DBEB7;
color: white;
cursor:pointer;

&:hover {
  background: #81A79F;
}

@media (max-width: 425px) {
    padding: 5%;
}
@media (min-width: 426px) and (max-width: 768px) {
    padding: 2%;
}

`;