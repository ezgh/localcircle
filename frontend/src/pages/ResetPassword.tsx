import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";

import { resetPassword } from "../api/auth";
import homepic from "../assets/homepage.png";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const [new_password, setNewPassword] = useState("");
  const [re_new_password, setReNewPassword] = useState("");

  const [isResetted, setIsResetted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await resetPassword(uid, token, new_password, re_new_password);
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
            <ResetForm>
              <p>
                Your password has been successfully changed. You can
                <Link to="/">Login</Link> with your new password now.
              </p>
            </ResetForm>
          ) : (
            <ResetForm>
              <h1>Enter your new password.</h1>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={new_password}
                    onChange={(event) => setNewPassword(event.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Confirm Password"
                    name="repassword"
                    value={re_new_password}
                    onChange={(event) => setReNewPassword(event.target.value)}
                    required
                  />
                </div>
                <SubmitButton className="btn btn-primary" type="submit">
                  Submit
                </SubmitButton>
              </form>
            </ResetForm>
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
  border: 1px solid #000;
  text-align: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ResetForm = styled.div`
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
  background: #9dbeb7;
  color: white;
  cursor: pointer;

  &:hover {
    background: #81a79f;
  }

  @media (max-width: 425px) {
    padding: 2%;
    width: 40%;
  }
`;
