import { Outlet } from "react-router-dom";

import LoginNavbar from "../LoginNavbar";

export default function LoginLayout() {
  return (
    <>
      <LoginNavbar />
      <Outlet />
    </>
  );
}
