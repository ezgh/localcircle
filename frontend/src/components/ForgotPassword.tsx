import { useState } from 'react';
import Navbar from './Navbar';
import styled from 'styled-components';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/auth/users/reset_password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);
    } else {
      const data = await res.json();
      console.error(data);
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        <Box>Bir</Box>
        <Box>
          <ForgotForm>
            <h2>Forgot your password?</h2>
            <p>We will send you an email to reset your password.</p>
            <p>Please enter your registered email.</p>
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
              <SubmitButton className='btn btn-primary' type='submit'>Send</SubmitButton>
            </form>
          </ForgotForm>
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

const ForgotForm = styled.div`
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

