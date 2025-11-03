// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: 'light',             // keep light mode
    primary: { main: '#0B3D91' },   // navy blue
    secondary: { main: '#2563EB' }, // bright blue accent
    error: { main: '#EF4444' },     // fake job alerts
    info: {main:'#1E40AF'}  ,
    background: {
      default: '#E5E7EB',      // light gray
      paper: '#FFFFFF',         // cards
    },
    text: {
      primary: '#111827',      // dark text
      secondary: '#374151',    // secondary text
    },
  },
  typography: {
    fontFamily: ['Inter', 'Roboto'].join(','),
  },
});


export default theme;
