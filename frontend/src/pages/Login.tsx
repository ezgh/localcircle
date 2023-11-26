import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styled from "styled-components";

import { loginUser } from "../api/auth";
import homepic from "../assets/homepage.png";
import Alert from "../components/Alert";

export default function Login({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failMessage, setFailMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      Cookies.set("accessToken", data.access);
      Cookies.set("refreshToken", data.refresh);
      console.log(data);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setFailMessage(error.message);
        setTimeout(() => {
          setFailMessage("");
        }, 4000);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <>
      <Container>
        <Box>
          <img src={homepic} alt="" />
        </Box>
        <Box>
          <LoginForm>
            <h1>Sign In</h1>
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
              <div className="form-group">
                <input
                  className="form-control"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <SubmitButton className="btn btn-primary" type="submit">
                Login
              </SubmitButton>
            </form>
            <p className="mt-3">
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
            <p className="mt-3">
              Forgot your Password?{" "}
              <Link to="/password/reset">Reset Password</Link>
            </p>
          </LoginForm>
        </Box>
      </Container>
      {failMessage && <Alert message={failMessage} type="fail" />}
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Box = styled.div`
  width: 50%;
  border: none;
  text-align: center;

  @media (max-width: 768px) {
    width: 100%;
  }

  img {
    max-width: 80%;
    height: auto;
  }
`;

const LoginForm = styled.div`
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
