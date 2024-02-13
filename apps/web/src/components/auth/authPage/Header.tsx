import { Typography, TypographyProps } from "@mui/material";
import { AuthSx } from "./Sx";

export function AuthHeader({
  text,
  ...props
}: { text: string } & TypographyProps) {
  return (
    <Typography variant="h5" sx={AuthSx.Form.Header} {...props}>
      {text}
    </Typography>
  );
}
