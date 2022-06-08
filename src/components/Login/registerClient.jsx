import React, { useState } from 'react';
import { putRequest } from '../../utils/requests';
import LoginRegisterClientForm from './loginRegisterClientForm';
import Alerts from '../Alerts';

function RegisterClient(props) {
  const { value, index, profile } = props;
  const [messages, setMessages] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  let form = {
    name: user.name || '',
    email: user.email || '',
    number: user.number || '',
    age: user.age || '',
  };

  if (!profile) {
    form = {
      ...form,
      password: '',
      confirmPassword: '',
    };
  }


  const handleProfileSubmit = (form) => {
    putRequest('http://localhost:4000/users/profile', form)
      .then((response) => {
        const { data = {} } = response;
        const { user = {} } = data;
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(user))
        setMessages([{ message: 'Success', type: 'success' }]);
      })
      .catch(e => {
        const { response = {} } = e;
        const { data = {} } = response;
        setMessages([{ message: data && data.error ? data.error : 'Something went wrong', type: 'error' }]);
      })
  }

  const onSuccessLogin = (responseData) => {
    const { accessToken = '', user } = responseData;
    localStorage.setItem('token', accessToken)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('isMechanic', user.isMechanic)
    props.onClose();
  }

  return (
    <>
      <LoginRegisterClientForm
        form={form}
        ismechanic={false}
        formtype='register'
        value={value}
        index={index}
        isProfile={user.name !== undefined}
        handleProfileSubmit={handleProfileSubmit}
        onSuccessRequest={onSuccessLogin}
      />
      <Alerts messages={messages} />
    </>
  )
}

export default RegisterClient;