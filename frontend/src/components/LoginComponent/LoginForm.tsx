import * as React from 'react';
import type { LoginFormProps, LoginFormData } from '../../types/AuthType';

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPassword,
  // onRegister,
}) => {
  const [formData, setFormData] = React.useState<LoginFormData>({
    username: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col space-y-4">
        <div>
          <label htmlFor="username" className="block text-base text-black">
            Username:
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            className="mt-2 w-full border border-zinc-800 rounded-[50px] px-4 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Username"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-base text-black">
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-2 w-full border border-zinc-800 rounded-[50px] px-4 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Password"
          />
        </div>

        <button
          type="button"
          onClick={onForgotPassword}
          className="self-end text-xs font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Forgot password?
        </button>

        <button
          type="submit"
          className="w-full px-9 py-2 bg-red-200 rounded-[50px] text-base font-medium text-zinc-800 hover:bg-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Login
        </button>

        {/* <div className="text-center">
          <span className="text-base text-black">Don't have an account? </span>
          <button
            type="button"
            onClick={onRegister}
            className="font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </button>
        </div> */}
      </div>
    </form>
  );
};