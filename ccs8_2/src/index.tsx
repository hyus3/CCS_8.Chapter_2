import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const theme = createTheme({
    palette: {
        primary: {
            main: "#FFE8D6",

        },
        secondary: {
            main: "#616a6b",
        }
    },
    typography: {
        h1: {
            fontSize: "3rem",
            fontWeight: 500,
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 400,
        },
        h3: {
            fontSize: "1rem",
            fontWeight: 300,
        },
    },
});
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <ThemeProvider theme={theme }>
          <App />
      </ThemeProvider>
  </React.StrictMode>
);

