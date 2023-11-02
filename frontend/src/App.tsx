import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/layouts/MainLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Activate from "./pages/Activate";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ListingDetail from "./pages/ListingDetail";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activate/:uid/:token" element={<Activate />} />
          <Route path="/password/reset" element={<ForgotPassword />} />
          <Route
            path="/password/reset/confirm/:uid/:token"
            element={<ResetPassword />}
          />
          <Route path="/listing/:id" element={<ListingDetail />} />

        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
