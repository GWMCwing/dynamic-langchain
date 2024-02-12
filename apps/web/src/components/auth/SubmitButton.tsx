import { Button, ButtonProps } from "@mui/material";
import { AuthSx } from "./Sx";

export function SubmitButton({
  text,
  ...props
}: { text: string } & ButtonProps) {
  return (
    <Button
      type="submit"
      sx={AuthSx.Form.SubmitButton}
      variant="contained"
      fullWidth
      {...props}
    >
      {text}
    </Button>
  );
}
