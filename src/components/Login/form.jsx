import React from 'react';
import {
  Grid,
  TextField,
  InputAdornment,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

function Form({ form, onHandleChange }) {
  return (
    <>
      {Object.keys(form).map((field, index) => (
        <Grid item xs={6} key={index}>
          <TextField
            id={`input-with-icon-textfield-${index}`}
            label={`${field[0].toUpperCase()}${field.slice(1)}`}
            onChange={(e) => onHandleChange(field, e.target?.value)}
            type={field === 'confirmPassword' ? 'password' : field}
            value={form[field]}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        </Grid>
      ))}
    </>
  )
}

export default Form;