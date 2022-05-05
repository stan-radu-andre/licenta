import './FindMechanic.scss';
import React, { useState, useEffect } from 'react';
import { Card, FormControl, CardContent, Select, Typography, InputLabel, MenuItem, Grid, Button, Input } from '@mui/material';
import { getRequest, postRequest } from '../../../utils/requests';
const headers = {
  'x-rapidapi-host': 'car-data.p.rapidapi.com',
  'x-rapidapi-key': '9a7c3e4865msh12ffd49d83cebd9p1d2f4cjsnccdc24d2ba09'
};
function FindMechanic() {
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  const [maker, setMaker] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescrition] = useState('');
  // const [engine, setEngine] = useState('');
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
    console.log('maker', maker);
    getRequest(`https://car-data.p.rapidapi.com/cars?make=${maker}&year=${year}`, headers)
      .then((response) => {
        const { data: models } = response;
        setModels(models);
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

  const sumbitOrder = () => {
    const order = {
      maker,
      year,
      model,
      description
    }
    console.log('ss', order);
    postRequest(`http://localhost:4000/appointments/create`, order)
      .then((req) => {
        console.log(req);
      })
  }

  return (
    <div className="m-5">
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" align="left">
            Let myMechanic give you a suggestion for a mechanic for your car
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <FormControl fullWidth>
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
            <Grid item xs={2}>
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
            <Grid item xs={2}>
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
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Description</InputLabel>
                <Input multiline onChange={handleChange('Description')} />
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth sx={{ height: '100%' }}>
                <Button variant="contained" sx={{ height: '100%' }} onClick={sumbitOrder}>Sumbit</Button>
              </FormControl>
            </Grid>
          </Grid>

        </CardContent>
      </Card>
    </div >
  )
}
export default FindMechanic;
