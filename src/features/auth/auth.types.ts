export interface LoginFormState {
  errors: {
    email?: string;
    password?: string;
    _form?: string;
  };
}

export interface ChangePasswordState {
  errors: {
    newPassword?: string[];
    confirmPassword?: string[];
    _form?: string;
  };
  success?: boolean;
  message?: string;
}
