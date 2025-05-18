import type { Theme } from '@mui/material';

export type StyledTheme = Theme & {
  palette: {
    primary: {
      main: string;
    };
    success: {
      main: string;
    };
    info: {
      main: string;
    };
    warning: {
      main: string;
    };
    error: {
      main: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
    background: {
      default: string;
      paper: string;
    };
    divider: string;
  };
}; 