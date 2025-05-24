export interface LoginFormData {
    username: string;
    password: string;
  }
  
  export interface SocialAuthProps {
    imageUrl: string;
    provider: string;
    onClick: () => void;
  }
  
  export interface LoginFormProps {
    onSubmit: (data: LoginFormData) => void;
    onForgotPassword: () => void;
    // onRegister: () => void;
  }