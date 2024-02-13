"use client";

import {
  AuthCard,
  AuthHeader,
  AuthSx,
  PasswordInput,
  SubmitButton,
  TextInput,
} from "@components/auth/authPage";
import { ErrorText } from "@components/auth/authPage/ErrorText";
import { Button, CircularProgress } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  KeyboardEvent,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";

async function handleOnSubmit(
  ref: {
    username: RefObject<HTMLInputElement>;
    password: RefObject<HTMLInputElement>;
  },
  setError: Dispatch<SetStateAction<string | null>>,
  router: ReturnType<typeof useRouter>,
) {
  if (!ref.username.current || !ref.password.current)
    return console.error("No ref");
  const userName = ref.username.current.value;
  const password = ref.password.current.value;
  if (!userName || !password) {
    setError("Please enter a username and password");
    return;
  }
  //
  try {
    const res = await signIn("credentials", {
      username: userName,
      password: password,
      redirect: false,
    });
    //
    if (res?.ok) return router.replace("/chat/sessions");
    return setError(res?.error || "An error occurred");
  } catch (error) {
    if (typeof error === "string") {
      return setError(error);
    }
    if (error instanceof Error) {
      return setError(error.message);
    }
    setError("An error occurred");
    return;
  }
}

export default function LoginForm({
  setRegisterActive,
}: {
  setRegisterActive: () => unknown;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  //
  const ref = {
    username: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    submitButton: useRef<HTMLButtonElement>(null),
  } as const;
  //
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const submit = async () => {
    setLoading(true);
    await handleOnSubmit(ref, setError, router).catch((err) =>
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
      <AuthHeader text="Login" />
      <TextInput
        label="Username"
        inputRef={ref.username}
        disabled={loading}
        onKeyDown={onEnter}
        autoFocus
      />
      <PasswordInput
        inputRef={ref.password}
        label="Password"
        showPassword={showPassword}
        handleClickShowPassword={handleClickShowPassword}
        handleMouseDownPassword={handleMouseDownPassword}
        disabled={loading}
        onKeyDown={onEnter}
      />
      <SubmitButton text="Login" onClick={submit} disabled={loading} />
      {error && <ErrorText error={error} />}
      <Button
        onClick={setRegisterActive}
        sx={AuthSx.Form.toggleLoginButton}
        disabled={loading}
      >
        Don't have an account? Register!
      </Button>

      <CircularProgress
        color="info"
        sx={AuthSx.Form.loadingProgress(loading)}
      />
    </AuthCard>
  );
}
