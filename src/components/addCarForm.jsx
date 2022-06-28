import React, { useState, useEffect } from 'react';
import { Card, FormControl, CardContent, Select, InputLabel, MenuItem, Grid } from '@mui/material';
import { getRequest } from '../utils/requests';
import { makersConst, yearsConst } from '../constants/carsConstants';
const headers = {
  'x-rapidapi-host': 'car-data.p.rapidapi.com',
  'x-rapidapi-key': '9a7c3e4865msh12ffd49d83cebd9p1d2f4cjsnccdc24d2ba09'
};
function AddCarForm(props) {
  const { onHandleChange, car } = props;
  const [models, setModels] = useState([]);
  const [maker, setMaker] = useState(car.maker || 'Any maker');
  const [model, setModel] = useState(car.model || 'Any model');
  const [year, setYear] = useState(car.year || 'Any year');

  const handleChange = (field) => (e) => {
    const { target: { value } } = e;
    switch (field) {
      case 'Maker':
        setMaker(value);
        break;
      case 'Model':
        setModel(value);
        break;
      case 'Year':
        setYear(value);
        break;
      default:
        break;
    }
  }

  // useEffect(() => {
  //   getManufacturers();
  //   setTimeout(() =>
  //     getSuppocrtedYears()
  //     , 3500
  //   )
  // }, []);

  useEffect(() => {
    onHandleChange(maker, model, year)
  }, [onHandleChange, maker, model, year]);

  useEffect(() => {
    if (maker && maker !== "Any maker" && year && year !== "Any year")
      setTimeout(() =>
        getModels(maker, year)
        , 1000
      )
  }, [maker, year])

  const getModels = (maker, year) => {
    getRequest(`https://car-data.p.rapidapi.com/cars?make=${maker}&year=${year}`, headers)
      .then((response) => {
        const { data: models } = response;
        setModels([{ model: 'Any model' }, ...models]);
      });
  }

  // const getManufacturers = () => {
  //   getRequest("https://car-data.p.rapidapi.com/cars/makes", headers)
  //     .then((response) => {
  //       const { data: manufacturers } = response;
  //       manufacturers.sort();
  //       setManufacturers(manufacturers);
  //     });
  // }

  // const getSuppocrtedYears = () => {
  //   getRequest("https://car-data.p.rapidapi.com/cars/years", headers)
  //     .then((response) => {
  //       const { data: years } = response;
  //       years.sort();
  //       setYears(years);
  //     });
  // }

  return (
    <div className="">
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
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
                    makersConst.map((manufacturer, index) => (
                      <MenuItem key={index} value={manufacturer}>{manufacturer}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Year (&plusmn; 3)</InputLabel>
                <Select
                  fullWidth
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={year}
                  label="Year (&plusmn; 3)"
                  onChange={handleChange('Year')}
                >
                  {
                    yearsConst.map((year, index) => (
                      <MenuItem key={index} value={year}>{year}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Model</InputLabel>
                <Select
                  fullWidth
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={model}
                  placeholder={model}
                  label="Model"
                  onChange={handleChange('Model')}
                  disabled={year === 'Any year' || maker === 'Any maker'}
                >
                  <MenuItem value={car.model}>
                    <em>{car.model}</em>
                  </MenuItem>
                  {
                    models.map(({ model }, index) => (
                      <MenuItem key={index} value={model}>{model}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div >
  )
}
export default AddCarForm;
