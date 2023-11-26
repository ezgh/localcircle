import { useState } from "react";
import styled from "styled-components";

import { MdOutlineMarkEmailRead } from "react-icons/md";

import { resetPasswordRequest } from "../api/auth";
import homepic from "../assets/homepage.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isResetted, setIsResetted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await resetPasswordRequest(email);
      setIsResetted(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Container>
        <Box>
          {" "}
          <img src={homepic} alt="" />
        </Box>
        <Box>
          {isResetted ? (
            <ForgotForm>
              <MdOutlineMarkEmailRead size={100} />
              <h3>Thanks!</h3>
              <p>
                We've sent an email to reset your password. Please check your
                mailbox.
              </p>
            </ForgotForm>
          ) : (
            <ForgotForm>
              <h2>Forgot your password?</h2>
              <p>We will send you an email to reset your password.</p>
              <p>Please enter your registered email.</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <SubmitButton className="btn btn-primary" type="submit">
                  Send
                </SubmitButton>
              </form>
            </ForgotForm>
          )}
        </Box>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
  img {
    max-width: 80%;
    height: auto;
  }
`;

const Box = styled.div`
  width: 50%;
  border: none;
  text-align: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ForgotForm = styled.div`
  border-radius: 1.25rem;
  background: #fafafa;
  margin: 10%;
  padding: 2%;

  input {
    padding: 5px 20px;
    font-size: 18px;
    margin: 10px;
    width: 70%;
    height: 3rem;
    border-radius: 1.25rem;
    background: #fff;
    border: none;
  }

  input:focus {
    outline-color: gray;
  }

  a {
    color: black;
    text-decoration: none;
    font-weight: bold;
  }

  @media (max-width: 425px) {
    h1 {
      font-size: 1em;
    }
    p {
      font-size: 0.75em;
    }
    input {
      width: 60%;
      height: 2.5rem;
      font-size: 1em;
    }
    button {
      padding: 2%;
      width: 40%;
    }
  }

  @media (max-width: 768px) {
    margin: 5%;
  }
`;

const SubmitButton = styled.button`
margin: 1rem 0 0.5rem 0;
padding: 2%;
width: 20%;
font-size: 1rem;
border: none;
border-radius: 1.375rem;
background: #9DBEB7;
color: white;
cursor:pointer;

&:hover {
  background: #81A79F;

@media (max-width: 425px) {
padding: 2%;
width: 40%;
}
`;
