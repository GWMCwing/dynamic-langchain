"use client";

import {
  Dispatch,
  RefObject,
  SetStateAction,
  useRef,
  KeyboardEvent,
  useState,
} from "react";
import {
  AuthHeader,
  PasswordInput,
  TextInput,
  AuthCard,
  SubmitButton,
  AuthSx,
} from "@components/auth/authPage";
import { Button, CircularProgress } from "@mui/material";
import { ErrorText } from "@components/auth/authPage/ErrorText";
import { AxiosFetch } from "@utility/axios";
import { Register } from "@repo/api-types/route/auth";

async function handleOnSubmit(
  ref: {
    username: RefObject<HTMLInputElement>;
    password: RefObject<HTMLInputElement>;
    confirmPassword: RefObject<HTMLInputElement>;
  },
  setError: Dispatch<SetStateAction<string | null>>,
  setLoginActive: () => any,
) {
  if (
    !ref.username.current ||
    !ref.password.current ||
    !ref.confirmPassword.current
  )
    return console.error("No ref");
  const userName = ref.username.current.value;
  const password = ref.password.current.value;
  const confirmPassword = ref.confirmPassword.current.value;
  if (!userName || !password || !confirmPassword) {
    setError("Please enter a username and password");
    return;
  }
  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }
  //
  try {
    const { data } = await AxiosFetch<Register, "POST">(
      "POST",
      "/auth/register",
      {},
      {},
      {
        username: userName,
        password: password,
      },
      {
        validateStatus: (status) => status < 500, // Resolve only if the status code is less than 500
      },
    )();
    //
    if (data.success) {
      setLoginActive();
      return;
    }
    return setError(data.error);
  } catch (error) {
    setError("An error occurred");
    return;
  }
  //
}

export default function LoginForm({
  setLoginActive,
}: {
  setLoginActive: () => unknown;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  //
  const ref = {
    username: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirmPassword: useRef<HTMLInputElement>(null),
  } as const;
  //
  const handleClickShowPassword = () => {
    setShowConfirmPassword(false);
    setShowPassword(!showPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowPassword(false);
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const submit = async () => {
    setLoading(true);
    await handleOnSubmit(ref, setError, setLoginActive).catch((err) =>
      console.error(err),
    );
    setLoading(false);
  };
  const onEnter = (ev: KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === "Enter") {
      submit();
    }
  };
  //
  return (
    <AuthCard>
      <AuthHeader text="Register" />
      <TextInput label="User Name" inputRef={ref.username} disabled={loading} />
      <PasswordInput
        label="Password"
        showPassword={showPassword}
        handleClickShowPassword={handleClickShowPassword}
        handleMouseDownPassword={handleMouseDownPassword}
        inputRef={ref.password}
        disabled={loading}
        onKeyDown={onEnter}
      />
      <PasswordInput
        label="Confirm Password"
        showPassword={showConfirmPassword}
        handleClickShowPassword={handleClickShowConfirmPassword}
        handleMouseDownPassword={handleMouseDownPassword}
        inputRef={ref.confirmPassword}
        disabled={loading}
        onKeyDown={onEnter}
      />
      <SubmitButton text="Register" onClick={submit} disabled={loading} />
      {error && <ErrorText error={error} />}
      <Button
        onClick={setLoginActive}
        sx={AuthSx.Form.toggleLoginButton}
        disabled={loading}
      >
        Already have an account? Login!
      </Button>

      <CircularProgress
        color="info"
        sx={{
          marginInline: "auto",
          visibility: loading ? "visible" : "hidden",
        }}
      />
    </AuthCard>
  );
}
