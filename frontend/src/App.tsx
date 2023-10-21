import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"

export default function App() {
  return (
    <>
    <Routes>
      <Route  index element={<Home />} />
       <Route  path='/login' element={<Login />} />
       <Route  path='/register' element={<Register />} />
      <Route path="*" element={<Navigate to="/" />} />
     </Routes>
    
    </>
  )
}
