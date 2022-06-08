import React from 'react';
import LoginRegisterClientForm from './loginRegisterClientForm';

function Login(props) {
  const { value, index } = props;
  const form = {
    email: '',
    password: '',
  };
  const onSuccessLogin = (responseData) => {
    const { accessToken = '', user } = responseData;
    localStorage.setItem('token', accessToken)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('isMechanic', user.isMechanic)
    props.onClose();
  }
  return (
    <LoginRegisterClientForm
      form={form}
      formtype='login'
      value={value}
      index={index}
      onSuccessRequest={onSuccessLogin}
    />
  );
}

export default Login;