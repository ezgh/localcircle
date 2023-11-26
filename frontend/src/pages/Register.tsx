import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { MdOutlineMarkEmailRead } from "react-icons/md";

import Alert from "../components/Alert";

import { registerUser } from "../api/api";
import homepic from "../assets/homepage.png";

export default function Login() {
  const [failMessage, setFailMessage] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [re_password, setRepassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // check if passwords match
    if (password !== re_password) {
      setPasswordError("Passwords do not match.");
      return;
    }

    // check if password meets requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long."
      );
      return;
    }

    try {
      const data = await registerUser(
        first_name,
        last_name,
        email,
        password,
        re_password
      );

      console.log(data);
      setIsRegistered(true);
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
          {" "}
          <img src={homepic} alt="" />
        </Box>
        <Box>
          {isRegistered ? (
            <RegisterForm>
              <MdOutlineMarkEmailRead size={100} />
              <h3>Thanks for joining us!</h3>
              <p>
                We've sent an email to validate your account. Please check your
                mailbox.
              </p>
            </RegisterForm>
          ) : (
            <RegisterForm>
              <h1>Create account</h1>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="name"
                    placeholder="First Name"
                    name="firstname"
                    value={first_name}
                    onChange={(e) => setFirstName(e?.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="name"
                    placeholder="Last Name"
                    name="lastname"
                    value={last_name}
                    onChange={(e) => setLastName(e?.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event?.target.value)}
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
                    onChange={(event) => setPassword(event?.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Confirm Password"
                    name="repassword"
                    value={re_password}
                    onChange={(event) => setRepassword(event?.target.value)}
                    required
                  />
                </div>

                {passwordError && (
                  <div className="passwordError">{passwordError}</div>
                )}
                <SubmitButton type="submit">Sign up</SubmitButton>
              </form>
              <p className="mt-3">
                Already have an account? <Link to="/">Login</Link>
              </p>
            </RegisterForm>
          )}
        </Box>
        <div className="alert">
          {failMessage && <Alert message={failMessage} type="fail" />}
        </div>
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

const RegisterForm = styled.div`
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
  }

  select {
    padding: 5px 20px;
    font-size: 18px;
    margin: 10px;
    width: 78%;
    height: 3rem;
    border-radius: 1.25rem;
    background: #fff;
    border: none;
  }

  .passwordError {
    color: #ba2207;
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
