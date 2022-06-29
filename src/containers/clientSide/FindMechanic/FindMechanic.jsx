import './FindMechanic.scss';
import React, { useState, useEffect } from 'react';
import Alerts from '../../../components/Alerts';
import { Card, FormControl, CardContent, Select, Typography, InputLabel, MenuItem, Grid, Button, Input } from '@mui/material';
import { getRequest } from '../../../utils/requests';
import RecommendedMechanics from '../../../components/ClientAppointments/RecommendedMechanics';
import MessageModal from '../../../components/MessageModal';

export const AppointmentContext = React.createContext({});
// sursa: https://datamoapi.com/2021/10/01/quick-start-guide/
const headers = {
  'x-rapidapi-host': 'car-data.p.rapidapi.com',
  'x-rapidapi-key': '9a7c3e4865msh12ffd49d83cebd9p1d2f4cjsnccdc24d2ba09'
};
export function FindMechanic() {
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  const [maker, setMaker] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescrition] = useState('');
  const [mechanics, setMechanics] = useState('');
  const [appointment, setAppointment] = useState({});
  const [messages, setMessages] = useState([]);
  const [messageModal, setMessagesModal] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  const handleChange = (field) => (e) => {
    const { target: { value } } = e;
    switch (field) {
      case 'Maker':
        setMaker(value);
        return;
      case 'Model':
        setModel(value);
        return;
      case 'Year':
        setYear(value);
        return;
      case 'Description':
        setDescrition(value);
        return;
      default:
        return;
    }
  }

  useEffect(() => {
    getManufacturers();
    setTimeout(() =>
      getSuppocrtedYears()
      , 2000
    )
  },
    []);

  useEffect(() => {
    if (maker && year)
      getModels(maker, year);
  }, [maker, year])

  const getModels = (maker, year) => {
    getRequest(`https://car-data.p.rapidapi.com/cars?make=${maker}&year=${year}`, headers)
      .then((response) => {
        const { data: models } = response;
        setModels([{ model: "Other" }, ...models]);
      });
  }

  const getManufacturers = () => {
    getRequest("https://car-data.p.rapidapi.com/cars/makes", headers)
      .then((response) => {
        const { data: manufacturers } = response;
        manufacturers.sort();
        setManufacturers(manufacturers);
      });
  }

  const getSuppocrtedYears = () => {
    getRequest("https://car-data.p.rapidapi.com/cars/years", headers)
      .then((response) => {
        const { data: years } = response;
        years.sort();
        setYears(years);
      });
  }

  const getRecommendedMechanics = () => {
    getRequest(`http://localhost:4000/mechanics/recommendations/${maker}/${model}`)
      .then((response) => {
        const { mechanics } = response.data;
        setMechanics(mechanics);
      })
      .catch(e => {
        const { response = {} } = e;
        const { data = {} } = response;
        setMessages([{ message: data && data.error ? data.error : 'Something went wrong', type: 'error' }]);
      })
  }

  const sumbitOrder = () => {
    if (!user) {
      setMessagesModal('Log in first');
      return;
    }
    const appointment = {
      maker,
      year,
      model,
      description,
      userId: user._id
    };
    setAppointment(appointment);
    getRecommendedMechanics();
  }

  return (
    <div className="m-3 find-mechanic">
      <MessageModal message={messageModal} />
      <Card>
        <CardContent>
          {/* sursa: https://mui.com/material-ui/react-typography/ */}
          <Typography className="mt-5 mb-5 ml-2" gutterBottom variant="h5" component="div" align="left">
            Let myMechanic give you a suggestion for a mechanic for your car
          </Typography>
          {/* sursa: https://mui.com/material-ui/react-grid/ */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} lg={2}>
              <FormControl fullWidth>
                {/* sursa: https://mui.com/material-ui/react-select/ */}
                <InputLabel id="demo-simple-select-label">Maker</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={maker}
                  label="Age"
                  onChange={handleChange('Maker')}
                >
                  {
                    manufacturers.map((manufacturer, index) => (
                      <MenuItem key={index} value={manufacturer}>{manufacturer}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} lg={2}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Year</InputLabel>
                <Select
                  fullWidth
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={year}
                  label="Age"
                  onChange={handleChange('Year')}
                >
                  {
                    years.map((year, index) => (
                      <MenuItem key={index} value={year}>{year}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} lg={2}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Model</InputLabel>
                <Select
                  fullWidth
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={model}
                  label="Age"
                  onChange={handleChange('Model')}
                >
                  {
                    models.map(({ model }, index) => (
                      <MenuItem key={index} value={model}>{model}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8} lg={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Description</InputLabel>
                <Input multiline onChange={handleChange('Description')} />
              </FormControl>
            </Grid>
            <Grid item xs={4} lg={2}>
              <FormControl fullWidth sx={{ height: '100%' }}>
                <Button variant="contained" sx={{ height: '100%' }} onClick={sumbitOrder}>Sumbit</Button>
              </FormControl>
            </Grid>
            <Alerts messages={messages} />
          </Grid>
          <RecommendedMechanics appointment={appointment} mechanics={mechanics} />
        </CardContent>
      </Card>
    </div >
  )
}
