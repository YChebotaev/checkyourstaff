import { type FC } from "react";
import { AuthLayout } from "../layouts/AuthLayout";
import { SignInForm } from "../components/SignInForm";

export const SignInPage: FC = () => (
  <AuthLayout>
    <SignInForm />
  </AuthLayout>
);
