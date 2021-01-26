import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import LoginFormContainer from '../containers/auth/LoginFormContainer';

function LoginPage() {
  return (
    <AuthLayout>
      <LoginFormContainer />
    </AuthLayout>
  );
}

export default LoginPage;
