import { Card, CardContent, CardProps } from "@mui/material";
import React from "react";
import { AuthSx } from "./Sx";

export function AuthCard({ children, ...props }: {} & CardProps) {
  return (
    <Card sx={AuthSx.Form.Card} variant="outlined" {...props}>
      <CardContent sx={AuthSx.Form.CardContent}>{children}</CardContent>
    </Card>
  );
}
