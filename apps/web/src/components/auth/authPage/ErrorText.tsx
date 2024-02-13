import { Typography, TypographyProps } from "@mui/material";
import { AuthSx } from "./Sx";

export function ErrorText({
  error,
  ...props
}: { error: string } & TypographyProps) {
  return (
    <Typography sx={AuthSx.Form.ErrorText} {...props}>
      {error}
    </Typography>
  );
}
