import React, { useState } from 'react';
import {
  Grid,
  InputLabel,
  Button,
} from '@mui/material';
import { postRequest } from '../../utils/requests';
import Alerts from '../Alerts';
import Form from './form';

function LoginRegisterForm(props) {
  const { children,
    value,
    index,
    form: propsForm,
    onSuccessRequest,
    ...other } = props;
  const [form, setForm] = useState({
    ...propsForm
  });
  const [messages, setMessages] = useState([]);
  const onHandleChange = (labelName, value) => {
    console.log('assad', value, form);
    setForm({
      ...form,
      [labelName]: value
    });
  }
  const handleSubmit = async () => {
    console.log(form);
    const { ismechanic, formtype } = props;
    form['isMechanic'] = ismechanic;

    postRequest(`http://localhost:4000/users/${formtype}`, form)
      .then((response) => {
        setMessages([{ message: 'Success', type: 'success' }]);
        onSuccessRequest(response.data);
      })
      .catch(e => {
        console.log(e, e.response);
        const { response: { data } } = e;
        setMessages([{ message: data ? data.error : 'Something went wrong', type: 'error' }]);
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
            form={propsForm}
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

export default LoginRegisterForm;