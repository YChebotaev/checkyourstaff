import { type FC } from "react";
import { AuthLayout } from "../layouts/AuthLayout";
import { SignUpForm } from "../components/SignUpForm";

export const SignUpPage: FC = () => (
  <AuthLayout>
    <SignUpForm />
  </AuthLayout>
);
