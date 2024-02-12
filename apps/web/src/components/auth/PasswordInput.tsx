import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { AuthSx } from "./Sx";

export function PasswordInput({
  label,
  showPassword,
  handleClickShowPassword,
  handleMouseDownPassword,
  ...props
}: {
  label: string;
  showPassword: boolean;
  handleClickShowPassword: () => void;
  handleMouseDownPassword: (event: React.MouseEvent<HTMLButtonElement>) => void;
} & TextFieldProps) {
  return (
    <TextField
      sx={AuthSx.Form.InputField}
      type={showPassword ? "text" : "password"}
      label={label}
      required
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}
