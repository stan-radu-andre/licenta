import React, { useState } from 'react';
import {
  Grid,
  InputLabel,
  Button,
} from '@mui/material';
import { postRequest } from '../../utils/requests';
import Form from './form';
import Alerts from '../Alerts';

function LoginRegisterClientForm(props) {
  const { children,
    value,
    index,
    form: propsForm,
    isProfile,
    onSuccessRequest,
    handleProfileSubmit,
    ...other } = props;
  const [form, setForm] = useState({
    ...propsForm
  });
  const [messages, setMessages] = useState([]);
  const onHandleChange = (labelName, value) => {
    setForm({
      ...form,
      [labelName]: value
    });
  }

  const handleSubmit = async () => {
    if (isProfile) {
      return handleProfileSubmit(form);
    }
    const { ismechanic, formtype } = props;
    const formData = { ...form }
    if (formtype === 'register') {
      formData['isMechanic'] = ismechanic;
    }
    postRequest(`http://localhost:4000/users/${formtype}`, formData)
      .then((response) => {
        setMessages([{ message: 'Success', type: 'success' }]);
        onSuccessRequest(response.data);
      })
      .catch(e => {
        const { response = {} } = e;
        const { data = {} } = response;
        setMessages([{ message: data.error ? data.error : 'Something went wrong', type: 'error' }]);
      })
  }

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Grid container spacing={2} className=' mt-3'>
          <Grid item xs={11}>
            <InputLabel htmlFor="input-with-icon-adornment">
              Enter registration informations
            </InputLabel>
          </Grid>
          <Form
            form={form}
            onHandleChange={onHandleChange}
          />
          <Grid item xs={12}>
            <Button onClick={handleSubmit}>Submit</Button>
          </Grid>
        </Grid>
      )}
      <Alerts messages={messages} />
    </div>
  );
}

export default LoginRegisterClientForm;
