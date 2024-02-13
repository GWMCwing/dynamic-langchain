import type { SxProps } from "@mui/material";

type SxPropsOrFunctionalSxProps = SxProps | ((..._: any[]) => SxProps);

export const AuthSx = {
  Container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: "10vh",
  },
  Form: {
    Card: {
      width: "50vw",
      height: "50vh",
      borderRadius: "1rem",
    },
    CardContent: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100%",
      padding: "2rem",
    },
    Header: {
      textAlign: "center",
      margin: "1rem 0",
      fontWeight: "bold",
    },
    InputField: {
      margin: "1rem 0",
    },
    SubmitButton: {
      // marginTop: "auto",
      marginBottom: "1rem",
    },
    toggleLoginButton: {
      width: "fit-content",
      alignSelf: "center",
    },
    ErrorText: {
      color: "red",
      textAlign: "center",
      fontWeight: "bold",
    },
    loadingProgress: (loading: boolean) => ({
      marginInline: "auto",
      visibility: loading ? "visible" : "hidden",
    }),
  },
  // eslint-disable-next-line no-unused-vars
} as const satisfies Record<
  string,
  SxPropsOrFunctionalSxProps | Record<string, SxPropsOrFunctionalSxProps>
>;
