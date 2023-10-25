import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import Activate from "./components/Activate"
import ForgotPassword from "./components/ForgotPassword"
import ResetPassword from "./components/ResetPassword"


export default function App() {
  return (
    <>
    <Routes>
      <Route index element={<Home /> }/>
      <Route  path='/login' element={<Login />} />
      <Route  path='/register' element={<Register />} />
      <Route  path='/activate/:uid/:token' element={<Activate />} />
      <Route  path='/password/reset' element={<ForgotPassword />} />
      <Route  path='/password/reset/confirm/:uid/:token' element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    
    </>
  )
}
