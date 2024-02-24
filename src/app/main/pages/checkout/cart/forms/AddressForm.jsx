import React from 'react'
import {
  InputField,
  InputDocument,
  InputPhone,
  InputZipCode
} from '../formFields'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
const cities = [
  {
    value: undefined,
    label: 'None'
  },
  {
    value: '1',
    label: 'New York'
  },
  {
    value: '2',
    label: 'Chicago'
  },
  {
    value: '3',
    label: 'Saigon'
  }
]

const states = [
  {
    value: undefined,
    label: 'None'
  },
  {
    value: '11',
    label: 'Florida'
  },
  {
    value: '22',
    label: 'Michigan'
  },
  {
    value: '33',
    label: 'Texas'
  }
]

const countries = [
  {
    value: null,
    label: 'None'
  },
  {
    value: '111',
    label: 'United States'
  },
  {
    value: '222',
    label: 'Italy'
  },
  {
    value: '333',
    label: 'Vietnam'
  }
]

export default function AddressForm(props) {
  const {
    formField: {
      fullName,
      email,
      cpfCnpj,
      phone,
      state,
      zipcode,
      country,
      useAddressForPaymentDetails
    }
  } = props
  return (
    <>
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} sm={6}>
          <InputField name={fullName.name} label={fullName.label} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField name={email.name} label={email.label} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputPhone name={phone.name} label={phone.label} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputDocument name={cpfCnpj.name} label={cpfCnpj.label} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <InputZipCode
            fullWidth
            name={zipcode.name}
            label={zipcode.label}
            {...props}
          />
        </Grid>
      </Grid>
    </>
  )
}
