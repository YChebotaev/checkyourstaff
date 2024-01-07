import { type FC } from "react";
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom'
import { Root } from "./styled";

export const SignInForm: FC = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      identity: "",
      password: "",
    },
  });

  return (
    <Root onSubmit={handleSubmit(() => {})}>
      <h1>Войти</h1>
      <div>
        <div>
          <label htmlFor="identity">Телефон или емейл</label>
        </div>
        <div>
          <input type="text" {...register("identity")} />
        </div>
      </div>
      <div>
        <div>
          <label htmlFor="password">Пароль</label>
        </div>
        <div>
          <input type="password" {...register("password")} />
        </div>
      </div>
      <div>
        <button type="submit">Войти</button>
        <Link to="/signup">Зарегистрироваться</Link>
        <Link to="/forgot">Восстановить пароль</Link>
      </div>
    </Root>
  );
};
