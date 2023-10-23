import { useState } from 'react';
import { Link} from 'react-router-dom';
import Navbar from './Navbar';

export default function Login() {    
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
     }




     

    return (
        <>
        <Navbar />
        <div className="container">
        <div className="box">Bir</div>
        <div className="box">
        <div className='containertwo'>
            <h1>Sign In</h1>
            <p>Sign into your Account</p>
            <form onSubmit={handleSubmit} >
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='email'
                        placeholder='Email'
                        name='email'
                        value={email}
                        onChange={(event) => setEmail(event?.target.value)}
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
                        onChange={(event) =>setPassword(event?.target.value)}
                        required
                    />
                </div>
                <button className='btn btn-primary' type='submit'>Login</button>
            </form>
            <p className='mt-3'>
                Don't have an account? <Link to='/register'>Sign Up</Link>
            </p>
            <p className='mt-3'>
                Forgot your Password? <Link to='/reset-password'>Reset Password</Link>
            </p>
        </div>
        </div>
    </div>
        
        </>
    );
}
