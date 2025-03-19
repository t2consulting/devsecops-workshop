// src/app/styles/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#000' },
    primary: { main: '#90EE90' },
    secondary: { main: '#FF7F50' },
  },
});

export default theme;