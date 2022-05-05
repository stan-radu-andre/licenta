import React from 'react';
import LoginRegisterForm from './loginRegisterForm';

function Login(props) {
  const { value, index } = props;
  const form = [
    'email',
    'password',
  ];
  const onSuccessLogin = (responseData) => {
    console.log(responseData)
    const { accessToken = '' } = responseData;
    localStorage.setItem('token', accessToken)
  }
  return (
    <LoginRegisterForm
      form={form}
      ismechanic={'false'}
      formtype='login'
      value={value}
      index={index}
      onSuccessRequest={onSuccessLogin}
    />
  );
}

export default Login;