import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Base from './sections/Base'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  }
});

const Wrappers = ({ children }) => {
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <Base />
      </MuiThemeProvider>
    </BrowserRouter>
  )
}

export default hot(Wrappers)
