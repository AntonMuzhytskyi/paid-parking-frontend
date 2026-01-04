import React from 'react';
import Header from '../components/Header';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  return (
    <>
      <Header />
      <AuthForm isRegister={false} />
    </>
  );
};

export default LoginPage;

