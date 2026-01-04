import React from 'react';
import Header from '../components/Header';
import AuthForm from '../components/AuthForm';

const RegisterPage = () => {
  return (
    <>
      <Header />
      <AuthForm isRegister={true} />
    </>
  );
};

export default RegisterPage;