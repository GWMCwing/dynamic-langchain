"use client";

import { Container } from "@mui/material";
import LoginForm from "./login";
import RegisterForm from "./register";
import { useState } from "react";
import { AuthSx } from "@components/auth/authPage";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const setRegisterActive = () => setIsLogin(false);
  const setLoginActive = () => setIsLogin(true);
  return (
    <Container sx={AuthSx.Container}>
      {isLogin && <LoginForm setRegisterActive={setRegisterActive} />}
      {!isLogin && <RegisterForm setLoginActive={setLoginActive} />}
    </Container>
  );
}
