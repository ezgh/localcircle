import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";

import { activateUser } from "../api/api";
import banner from "../assets/banner.png";

export default function Activate() {
  const { uid, token } = useParams();
  const [isActivated, setIsActivated] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await activateUser(uid, token);
      setIsActivated(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Container>
        <Box>
          {isActivated ? (
            <Activation>
              <h3>Thanks!</h3>
              <p>
                Your account has been successfully activated. You can{" "}
                <Link to="/">Login</Link> now.
              </p>
            </Activation>
          ) : (
            <Activation>
              <h1>Welcome to Local Circle.</h1>
              <h1>Please activate your account to continue.</h1>
              <form onSubmit={handleSubmit}>
                <Button type="submit">Activate</Button>
              </form>
            </Activation>
          )}
        </Box>
        <Box>
          {" "}
          <img src={banner} alt="" />
        </Box>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;

  img {
    max-width: 80%;
    height: 25rem;
  }
`;

const Box = styled.div`
  width: auto;
  border: none;
  text-align: center;
`;

const Activation = styled.div`
  border-radius: 1.25rem;
  background: #FAFAFA;
 margin: 1%;
  padding: 2%;

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
  background: #9dbeb7;
  color: white;
  cursor: pointer;

  &:hover {
    background: #81a79f;
  }

  @media (max-width: 425px) {
    padding: 5%;
  }
  @media (min-width: 426px) and (max-width: 768px) {
    padding: 2%;
  }
`;
