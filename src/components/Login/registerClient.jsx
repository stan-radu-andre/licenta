import React from 'react';
import LoginRegisterForm from './loginRegisterForm';

function RegisterClient(props) {
  const { value, index } = props;
  const form = [
    'name',
    'email',
    'number',
    'password',
    'confirmPassword',
    'age'
  ];

  const onSuccessRequest = () => {
    console.log('login?')
  }

  return (
    <LoginRegisterForm
      form={form}
      ismechanic="false"
      formtype='register'
      value={value}
      index={index}
      onSuccessRequest={onSuccessRequest}
    />
  )
}

export default RegisterClient;