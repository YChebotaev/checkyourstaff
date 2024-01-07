import { type FC } from "react";
import { AuthLayout } from "../layouts/AuthLayout";
import { ForgotForm } from "../components/ForgotForm";

export const ForgotPage: FC = () => (
  <AuthLayout>
    <ForgotForm />
  </AuthLayout>
);
