import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import styled from 'styled-components';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  return (
    <>
      <Navbar />
      <Container>
        <Box>Bir</Box>
        <Box>
          <LoginForm>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <input
                  className='form-control'
                  type='email'
                  placeholder='Email'
                  name='email'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className='form-group'>
                <input
                  className='form-control'
                  type='password'
                  placeholder='Password'
                  name='password'
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <SubmitButton className='btn btn-primary' type='submit'>Login</SubmitButton>
            </form>
            <p className='mt-3'>
              Don't have an account? <Link to='/register'>Sign Up</Link>
            </p>
            <p className='mt-3'>
              Forgot your Password? <Link to='/reset-password'>Reset Password</Link>
            </p>
          </LoginForm>
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
`;

const Box = styled.div`
  width: 50%;
  border: 1px solid #000;
  text-align: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const LoginForm = styled.div`
  border-radius: 1.25rem;
  background: #FAFAFA;
  margin: 10%;
  padding: 2%;

  input {
    padding: 5px 20px;
    font-size: 18px;
    margin: 10px;
    width: 70%;
    height: 3rem;
    border-radius: 1.25rem;
    background: #FFF;
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

@media (max-width: 425px) {
padding: 2%;
width: 40%;
}
`;
