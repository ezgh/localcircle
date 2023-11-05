import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

import MainLayout from "./components/layouts/MainLayout";
import LoginLayout from "./components/layouts/LoginLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Activate from "./pages/Activate";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ListingDetail from "./pages/ListingDetail";
import Profile from "./pages/Profile";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = Cookies.get("accessToken");
      const data = {
        token: accessToken,
      };

      if (data) {
        try {
          const response = await fetch(
            "http://127.0.0.1:8000/auth/jwt/verify/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);
  return (
    <>
      {isAuthenticated ? (
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<LoginLayout />}>
            <Route index element={<Login />} />
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
      )}
    </>
  );
}
