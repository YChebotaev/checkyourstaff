import { type FC } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Link } from "react-router-dom";
import { Root } from "./styled";
import { useMutation } from "@tanstack/react-query";
import type {
  AuthSignupResult,
  AuthSignupBody,
} from "@checkyourstaff/console-backend/types";
import { useApiClient } from "../../hooks/useApiClient";
import { reload } from "../../index";

export const SignUpForm: FC = () => {
  const apiClient = useApiClient();
  const {
    formState: { errors },
    register,
    handleSubmit,
    clearErrors,
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });
  const { mutate } = useMutation({
    async mutationFn(vars: AuthSignupBody) {
      const { data } = await apiClient.post<AuthSignupResult>(
        "/auth/signup",
        vars,
      );

      return data;
    },
    onMutate() {
      clearErrors();
    },
    onSettled(data) {
      if (data == null) {
        return;
      }

      if ("ok" in data && data.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        void reload();
      } else if ("error" in data) {
        switch (data.error) {
          case "auth-signup-name-empty":
            setError("name", { message: "Имя надо заполнить" });
            break;
          case "auth-signup-phone-empty":
            setError("phone", { message: "Телефон надо заполнить" });
            break;
          case "auth-signup-phone-invalid":
            setError("phone", { message: "Телефон не правильный" });
            break;
          case "auth-signup-email-empty":
            setError("email", { message: "Емейл надо заполнить" });
            break;
          case "auth-signup-email-invalid":
            setError("email", { message: "Емейл не правильный" });
            break;
          case "auth-signup-password-mismatch":
            setError("passwordConfirm", { message: "Пароли должны совпадать" });
            break;
          case "auth-signup-password-empty":
            setError("password", { message: "Пароль надо заполнить" });
            break;
        }
      }
    },
  });

  return (
    <Root onSubmit={handleSubmit((values) => mutate(values))}>
      <h1>Зарегистрироваться</h1>
      <div>
        <div>
          <label htmlFor="name">Ваше имя</label>
        </div>
        <div>
          <input type="text" {...register("name")} />
        </div>
        <ErrorMessage errors={errors} name="name" />
      </div>
      <div>
        <div>
          <label htmlFor="phone">Номер телефона</label>
        </div>
        <div>
          <input type="tel" {...register("phone")} />
        </div>
        <ErrorMessage errors={errors} name="phone" />
      </div>
      <div>
        <div>
          <label htmlFor="email">Емейл</label>
        </div>
        <div>
          <input type="email" {...register("email")} />
        </div>
        <ErrorMessage errors={errors} name="email" />
      </div>
      <div>
        <div>
          <label htmlFor="password">Пароль</label>
        </div>
        <div>
          <input type="password" {...register("password")} />
        </div>
        <ErrorMessage errors={errors} name="password" />
      </div>
      <div>
        <div>
          <label htmlFor="passwordConfirm">Подтверждение пароля</label>
        </div>
        <div>
          <input type="password" {...register("passwordConfirm")} />
        </div>
        <ErrorMessage errors={errors} name="passwordConfirm" />
      </div>
      <div>
        <button type="submit">Зарегистрироваться</button>
        <Link to="/signin">Войти</Link>
        <Link to="/forgot">Восстановить пароль</Link>
      </div>
    </Root>
  );
};
