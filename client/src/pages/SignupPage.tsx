import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import SignupFormContainer from '../containers/auth/SignupFormContainer';

function SignupPage() {
  return (
    <AuthLayout>
      <SignupFormContainer />
    </AuthLayout>
  );
}

export default SignupPage;
