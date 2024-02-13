import { TextField, TextFieldProps } from "@mui/material";
import { AuthSx } from ".";

export function TextInput({
  label,
  ...props
}: {
  label: string;
} & TextFieldProps) {
  return (
    <TextField
      sx={AuthSx.Form.InputField}
      type="text"
      label={label}
      required
      fullWidth
      {...props}
    />
  );
}
