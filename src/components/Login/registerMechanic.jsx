import React, { useState } from 'react';
import {
  Grid,
  InputLabel,
  Button,
} from '@mui/material';
import Form from './form';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import AddCarForm from '../addCarForm';
import Alerts from '../Alerts';
import { postRequest } from '../../utils/requests';
import './login.scss';

function RegisterClient(props) {
  const { children, value, index, ...other } = props;
  const formFields = [
    'name',
    'email',
    'number',
    'password',
    'confirmPassword',
    'age'
  ];
  const [form, setForm] = useState(formFields.reduce((form, field) => ({ ...form, [field]: '' }), {}));
  const [messages, setMessages] = useState([]);
  const onHandleChange = (labelName, value) => {
    setForm({
      ...form,
      [labelName]: value
    });
  }
  const handleChangeCars = (carIndex) => (maker, model, year) => {
    cars[carIndex] = {
      maker,
      model,
      year
    }
    setCars(cars)
  }
  const [cars, setCars] = useState([{
    maker: '',
    year: '',
    model: '',
  }]);


  const addNewCar = () => setCars([
    ...cars,
    {
      maker: '',
      year: '',
      model: '',
    }]);

  const removeCar = (index) => () => {
    console.log(cars);
    if (cars.length > 1) {
      cars.splice(index, 1);
      setCars(cars)
    }
    else {
      setCars([
        {
          maker: '',
          year: '',
          model: '',
        }]);
    }
  }

  const handleSubmit = async () => {
    console.log(form);
    const { ismechanic, formtype } = props;
    form['isMechanic'] = ismechanic;
    form.cars = cars;
    console.log(form);
    return;

    postRequest(`http://localhost:4000/users/${formtype}`, form)
      .then((response) => {
        console.log('reee', response)
        setMessages([{ message: 'Success', type: 'success' }]);
      })
      .catch(e => {
        const { response: { data: { error = '' } } } = e;
        console.log(e.response, error);
        setMessages([{ message: error, type: 'error' }]);
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
          <Form
            form={formFields}
            onHandleChange={onHandleChange}
          />
          <Grid item xs={11}>
            <InputLabel htmlFor="input-with-icon-adornment">
              On which cars would you like to work on?
            </InputLabel>
          </Grid>
          <div className='cars-container'>
            {cars.map((car, index) =>
              <Grid item xs={12} container>
                <Grid item xs={10}>
                  <AddCarForm
                    onHandleChange={handleChangeCars(index)}
                  />
                </Grid>
                <Grid item xs={1} className='d-flex justify-content-center align-items-center cursor-pointer'>
                  <Button onClick={removeCar(index)}><ClearRoundedIcon /></Button>
                </Grid>
                {index === cars.length - 1 && <Grid item xs={1} className='d-flex justify-content-center align-items-center cursor-pointer'>
                  <Button onClick={addNewCar}><AddCircleOutlineRoundedIcon /></Button>
                </Grid>
                }
              </Grid>
            )}
          </div>
          <Grid item xs={12}>
            <Button onClick={handleSubmit}>Submit</Button>
          </Grid>
        </Grid>
      )}
      <Alerts messages={messages} />
    </div>
  );
}

export default RegisterClient;