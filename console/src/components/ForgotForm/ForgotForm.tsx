import { type FC } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Root } from "./styled";

export const ForgotForm: FC = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      identity: "",
    },
  });

  return (
    <Root onSubmit={handleSubmit(() => {})}>
      <h1>Восстановить пароль</h1>
      <div>
        <div>
          <label htmlFor="identity">Телефон или емейл</label>
        </div>
        <div>
          <input type="text" {...register("identity")} />
        </div>
      </div>
      <div>
        <button type="submit">Восстановить пароль</button>
        <Link to="/signin">Войти</Link>
        <Link to="/signup">Зарегистрироваться</Link>
      </div>
    </Root>
  );
};
