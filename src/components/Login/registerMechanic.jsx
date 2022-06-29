import React, { useState, useEffect } from 'react';
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
import { postRequest, putRequest } from '../../utils/requests';
// import { getMechanic } from '../../utils/apiRequests';
import './login.scss';

function RegisterClient(props) {
  const { children, value, index, profile, ...other } = props;
  const user = JSON.parse(localStorage.getItem('user')) || {};
  // useEffect(() => {
  //   async function fetchMechanic() {
  //     const user = JSON.parse(localStorage.getItem('user')) || {};
  //     if (user.mechanic && user.mechanic._id) {
  //       const mechanic = await getMechanic(user.mechanic._id);
  //       console.log('mechanic', mechanic);
  //     }
  //   };
  //   fetchMechanic();
  // }, [])
  const { mechanic = {} } = user;
  let { preferedCars = [{
    maker: '',
    year: '',
    model: '',
  }] } = mechanic;
  if (preferedCars.length === 0) {
    preferedCars = [{
      maker: '',
      year: '',
      model: '',
    }]
  }
  let formFields = {
    name: user.name || '',
    email: user.email || '',
    number: user.number || '',
    age: user.age || '',
  };
  if (!profile) {
    formFields = {
      ...formFields,
      password: '',
      confirmPassword: '',
    };
  }

  const [form, setForm] = useState(formFields);
  const [messages, setMessages] = useState([]);
  const [cars, setCars] = useState(preferedCars);

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


  const addNewCar = () => setCars([
    ...cars,
    {
      maker: '',
      year: '',
      model: '',
    }]);

  const removeCar = (index) => () => {
    if (cars.length > 1) {
      cars.splice(index, 1);
      setCars([...cars])
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

  const onSuccessLogin = (responseData) => {
    const { accessToken = '', user } = responseData;
    localStorage.setItem('token', accessToken)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('isMechanic', user.isMechanic)
    props.onClose();
  }

  const handleProfileSubmit = (form) => {
    const profileForm = {
      ...form,
      isMechanic: true,
      cars
    };
    putRequest('http://localhost:4000/users/profile', profileForm)
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

  const handleSubmit = async () => {
    if (profile) {
      return handleProfileSubmit(form);
    }
    form['isMechanic'] = true;
    form.cars = cars;
    postRequest(`http://localhost:4000/users/register`, form)
      .then((response) => {
        setMessages([{ message: 'Success', type: 'success' }]);
        onSuccessLogin(response.data);
      })
      .catch(e => {
        const { response: data = {} } = e;
        const { error = '' } = data;
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
            form={form}
            onHandleChange={onHandleChange}
          />
          <Grid item xs={11}>
            <InputLabel htmlFor="input-with-icon-adornment">
              On which cars would you like to work on?<br />
              Enter below, in the order of preferences:
            </InputLabel>
          </Grid>
          <div className='cars-container'>
            {cars.map((car, index) =>
              <Grid key={index} item xs={12} container>
                <Grid item xs={10}>
                  <AddCarForm
                    car={car}
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
