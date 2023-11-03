import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/layouts/MainLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Activate from "./pages/Activate";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ListingDetail from "./pages/ListingDetail";
import Profile from "./pages/Profile";
import LoginLayout from "./components/layouts/LoginLayout";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Route>
        <Route path="/" element={<LoginLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activate/:uid/:token" element={<Activate />} />
          <Route path="/password/reset" element={<ForgotPassword />} />
          <Route
            path="/password/reset/confirm/:uid/:token"
            element={<ResetPassword />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
