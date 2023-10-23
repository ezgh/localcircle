import { useState } from 'react';
import { Link} from 'react-router-dom';
import Navbar from './Navbar';

export default function Login() {  

  const [first_name,setFirstName] = useState("")  
  const [last_name,setLastName] = useState("")  
  const [email,setEmail] = useState("")  
  const [password,setPassword] = useState("")  
  const [re_password,setRepassword] = useState("")  
  // const [passwordError, setPasswordError] = useState("");

  
  const handleSubmit =async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // // check if passwords match
    // if (password !== repassword) {
    //   setPasswordError("Passwords do not match");
    //   return;
    // }

    // // check if password meets requirements
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   setPasswordError(
    //     "Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long"
    //   );
    //   return;
    // }

    const res = await fetch("http://127.0.0.1:8000/auth/users/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        re_password,
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

          <div className="container">
        <div className="box">Bir</div>
        <div className="box">
        <div className='containertwo'>
            <h1>Create account</h1>
            
            <form onSubmit={handleSubmit} >
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='name'
                        placeholder='First Name'
                        name='firstname'
                        value={first_name}
                        onChange={(e) => setFirstName(e?.target.value)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='name'
                        placeholder='Last Name'
                        name='lastname'
                        value={last_name}
                        onChange={(e) => setLastName(e?.target.value)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='email'
                        placeholder='email'
                        name='email'
                        value={email}
                        onChange={(event) =>setEmail(event?.target.value)}
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
                        onChange={(event) => setPassword(event?.target.value)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='Confirm Password'
                        name='repassword'
                        value={re_password}
                        onChange={(event) =>setRepassword(event?.target.value)}
                        required
                    />
                </div>
                {/* { passwordError && <div>{passwordError}</div>} */}
                <button className='btn btn-primary' type='submit'>Sign up</button>
            </form>
            <p className='mt-3'>
                Already have an account? <Link to='/login'>Login</Link>
            </p>
          
        </div>
        </div>
        </div>
        </>
    );
}
